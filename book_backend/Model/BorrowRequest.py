from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, notification_col, user_col
from Socket import socketio
from datetime import datetime, timedelta
from Notifications import Generate_Notification_Id
import random
from flask_jwt_extended import jwt_required, get_jwt

borrow_request_api = Blueprint("borrow_request_api", __name__)

#check overdue books
def Check_Overdue_Books():

    try: 
        now = datetime.utcnow()

        request = borrow_request_col.find({
            "status": "Approved",
            "return_date": None,
            "due_date": {"$lt": now}
        })

        for borrow in request: 
            due_date = borrow.get("due_date")
            
            if now.date() > due_date.date():
                overdue_days = (now.date() - due_date.date()).days

                fine_per_day = 50
                fine = overdue_days * fine_per_day
                borrow_request_col.update_one(
                    {
                        "request_id": borrow["request_id"]
                    },
                    {"$set":{
                        "status": "Overdue",
                        "overdue_days": overdue_days,
                        "fine_per_day" : fine_per_day,
                        "fine": fine,
                        "updated_at": now
                    }}
                )
    except Exception as e:
        print("Error checking overdue books:", str(e))


# borrow request raised by user
@borrow_request_api.route('/book-request', methods = ['POST'])
@jwt_required()
def BookRequest():
    data = request.get_json()

    user_id = data.get("user_id")
    book_id = data.get("book_id")
    request_date = datetime.utcnow()
    borrow_days = data.get("borrow_days")
    print(user_id, book_id, borrow_days)

    if not book_id or not user_id or not borrow_days:
        return jsonify({"message": "Missing required fields"}), 400
    
    borrow_days = int(borrow_days)
    last_request = borrow_request_col.find_one(
        {}, sort=[("request_id", -1)]
    )

    if last_request:
        last_id = int(last_request["request_id"][2:])
        new_id = last_id + 1
    else:
        new_id = 1

    request_id = f"BR{str(new_id).zfill(3)}"

    due_date = request_date + timedelta(days=borrow_days)

    user = user_col.find_one(
        {"id": user_id},
        {
            "_id": 0,
            "id": 1,
            "username": 1
        }
    )
    if not user: return jsonify({ "message": "User not found" }), 404

    book = book_col.find_one(
        {"id": book_id},
        {
            "_id": 0,
            "id": 1,
            "book_name": 1,
            "author": 1,
            "image": 1
        }
    )
    if not book: return jsonify({ "message": "Book not found" }), 404

    username = user.get("username")
    book_name = book.get("book_name")
    author = book.get("author")
    image = book.get("image")

    borrow_request = {
        "request_id": request_id,
        "user_id": user_id,
        "username": username,
        "book_id": book_id,
        "book_name": book_name,
        "author": author,
        "image": image,
        "request_date": request_date,
        "borrow_days": borrow_days,
        "status": "Pending",
        "approved_by": None,
        "approved_date": None,
        "due_date": due_date,
        "return_date": None,
        "remarks": None,
        "created_at": datetime.utcnow(),
        "updated_at": None
    }

    borrow_request_col.insert_one(borrow_request)

    user_notification = {
        "notification_id": Generate_Notification_Id(),
            
        "recipient_id": user_id,
        "recipient_role_id": "R2",

        "type": "BORROW_REQUEST",

        "title": "New Borrow Request",
        "message": f"You raised request for {book_name}",

        "request_id": request_id,
        "book_id": book_id,
        "book_name": book_name,
        "author": author,
        "image": image,

        "member_id": user_id,
        "member_name": username,
        "borrow_days": borrow_days,

        "status": "Pending",
        "actions": ["View Details"],
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    
    notification_col.insert_one(user_notification)
    
    admin_notification = {
        "notification_id": Generate_Notification_Id(),

        "recipient_role_id": "R1",

        "type": "BORROW_REQUEST",

        "title": "New Borrow Request",
        "message": f"{username} raised request for {book_name}",

        "request_id": request_id,
        "book_id": book_id,
        "book_name": book_name,
        "author": author,
        "image": image,

        "member_id": user_id,
        "member_name": username,
        "borrow_days": borrow_days,

        "status": "Pending",
        "actions": ["Approved", "Reject"],
        "is_read": False,
        "created_at": datetime.utcnow()
        }

    notification_col.insert_one(admin_notification)

    return jsonify({
        "message": f"Request raised - {request_id}",
        "due_date": due_date.strftime("%Y-%m-%d")
    }), 200



#book borrow request at admin
@borrow_request_api.route('/borrow-request', methods = ['GET'])
@jwt_required()
def BookBorrow():
    pipeline = [
        {
            "$lookup":{
                "from": "Users",
                "localField": "user_id",
                "foreignField": "id",
                "as": "user_data"
            }
        },
        {
            "$lookup":{
                "from": "Books",
                "localField": "book_id",
                "foreignField": "id",
                "as": "book_data"
            }
        },
        {
            "$unwind": "$user_data",
        },
        {
            "$unwind": "$book_data"
        },
        {
            "$project": {
                "_id":1,
                "request_id": 1,
                "book_id":1,
                "user_id": 1,
                "book_name": "$book_data.book_name",
                "author": "$book_data.author",
                "category": "$book_data.category",
                "available_copies": "$book_data.available_copies",
                "total_pages": "$book_data.total_pages",
                "isbn": "$book_data.isbn",
                "image": "$book_data.image",
                "username": "$user_data.username",
                "email": "$user_data.email",
                "request_date": 1,
                "overdue_days": 1,
                "fine": 1,
                "borrow_days":1,
                "status": 1,
                "created_at": 1,
                "due_date": 1
            }
        }
    ]
    book_request = list(borrow_request_col.aggregate(pipeline))
    for item in book_request:
        item["_id"] = str(item["_id"])

    print(book_request)

    return jsonify({
        "message": "Borrow Request",
        "request": book_request
    }), 200
    

@borrow_request_api.route('/request', methods=['POST'])
@jwt_required()
def RequestStatus():
    data = request.get_json()

    request_status = data.get("request_status")
    request_id = data.get("request_id")
    admin_id = data.get("user_id")
    book_id = data.get("book_id")   
    remark = data.get("remark")
    approved_date = datetime.utcnow()

    request_data = borrow_request_col.find_one({"request_id": request_id})

    if not request_data:
        return jsonify({"message": 'Request not found'}), 404

    #book details
    book = book_col.find_one(
        {"id": book_id}, 
        {
            "_id": 0, 
            "book_name": 1, 
            "author": 1,
            "available_copies": 1
        }
            )
    book_name = book.get("book_name")
    author = book.get("author")
    #admin details
    admin = user_col.find_one({"id": admin_id}, {"_id": 0, "username": 1})
    
    requester_id = request_data["user_id"]

    #requester data
    requester_data = user_col.find_one({"id": requester_id}, {"_id":0, "role_id": 1, "username": 1})

    requester_role_id = requester_data.get("role_id")
    requester_username = requester_data.get("username")

    if not book:
        return jsonify({"message": "Book not found"}), 404

    #if request is approved
    if request_status == 'Approved':

        if book["available_copies"] <= 0:
            return jsonify({"message": "No copies available"}), 400

        borrow_days = request_data.get("borrow_days", 40)
        borrow_days = int(borrow_days)

        due_date = approved_date + timedelta(days=borrow_days)

        borrow_request_col.update_one(
            {"request_id": request_id},
            {"$set": {
                "status": request_status,
                "approved_by": admin_id,
                "approver_username": admin.get("username"),
                "approved_date": approved_date,
                "updated_at": datetime.utcnow(),
                "due_date": due_date
            }}
        )

        book_col.update_one(
            {"id": book_id},
            {"$inc": {"available_copies": -1}}
        )

        

        #if user is normal user create notification
        notification_col.insert_one(
            {
                "notification_id": Generate_Notification_Id(),
                "recipient_id": requester_id,
                "recipient_role_id": requester_role_id,
        
                "type": "APPROVED_REQUEST",
                "title": "Borrow Request Approved",
                "message": f"Your request for {book_name} has been Approved.",
        
                "book_id": book_id,
                "book_name": book_name,
                "author": author,
        
                "user_id": requester_id,
                "member_name": requester_username,
        
                "request_id": request_id,
                "approved_date": approved_date,
                "approved_by": admin_id,
                "approver_name": admin.get("username"),
        
                "actions": ["View Details"],
                "status": "Approved",
                "is_read": False,
                "created_at": datetime.utcnow()
            }
        )    


        return jsonify({"message": "Request Approved"}), 200
    #request is rejected
    elif request_status == 'Rejected':

        borrow_request_col.update_one(
            {"request_id": request_id},
            {"$set": {
                "status": request_status,
                "rejected_by": admin_id,
                "rejecter_username": admin.get("usernam"),
                "rejected_date": approved_date,
                "remark": remark,
                "updated_at": datetime.utcnow()
            }}
        )

        
        notification_col.insert_one(
            {
                "notification_id": Generate_Notification_Id(),
                "recipient_id": requester_id,
                "recipient_role_id": requester_role_id,
                 
                "type": "REJECTED_REQUEST",
                "title": "Borrow Request Rejected",
                "message": f"Your request for {book_name} has been Rejected.",
                 
                "book_id": book_id,
                "book_name": book_name,
                "author": author,
                 
                "user_id": requester_id,
                "member_name": requester_username,
                 
                "request_id": request_id,
                "rejected_date": approved_date,
                "rejected_by": admin_id,
                "rejecter_name": admin.get("username"),
                 
                "actions": ["View Details"],
                "status": "Rejected",
                "is_read": False,
                "created_at": datetime.utcnow()
            }
        )   

        
        return jsonify({"message": "Request Rejected"}), 200

    else:
        return jsonify({"message": "Invalid status"}), 400
    
    
#borrow records
@borrow_request_api.route('/borrow-records', methods = ['GET'])
@jwt_required()
def BookRecords():
    Check_Overdue_Books()

    claim = get_jwt()

    user_id = claim.get("b_user_id")
    role_id = claim.get("b_role_id")
    print(role_id)

    if role_id == 'R1': 
        borrow_data = list(borrow_request_col.find({}, {"_id": 0}))
    elif role_id == 'R2':
        borrow_data = list(borrow_request_col.find(
            {"user_id": user_id},
            {"_id": 0}
        ))
    else:
        return jsonify({ "message": "Invalid role" }), 403

    
        
    return jsonify({
        "message": "Borrow Request",
        "request": borrow_data
    }), 200
    

@borrow_request_api.route('/return-book', methods=["POST"])
@jwt_required()
def Return_Book():
    claim = get_jwt()

    user_id = claim.get("b_user_id")
    role_id = claim.get("b_role_id")

    data = request.get_json()
    
    book_id = data.get("book_id")
    request_id = data.get("request_id")

    user = user_col.find_one(
            {"id": user_id},
            {
                "_id": 0,
                "id": 1,
                "username": 1
            }
        )
    if not user: return jsonify({ "message": "User not found" }), 404
    

    book_details = borrow_request_col.find_one({"book_id": book_id})

    if not book_details:
        return jsonify({
            "message": "Borrow record not found"
        }), 404 

    if book_details.get("status") == 'Overdue' and book_details.get("due_date") < datetime.utcnow():
        Check_Overdue_Books()

        borrow = borrow_request_col.update_one(
                    {
                        "request_id": request_id,
                        "book_id": book_id,
                        "status": {
                            "$in": ['Approved', "Overdue"]
                        }
                    },
                    {
                        "$set":{
                            "status": "Returned",
                            "return_date": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
    else:
        borrow = borrow_request_col.update_one(
                    {
                        "request_id": request_id,
                        "book_id": book_id,
                        "status": {
                            "$in": ['Approved', "Overdue"]
                        }
                    },
                    {
                        "$set":{
                            "status": "returned",
                            "return_date": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
    if borrow.modified_count == 0:
        return jsonify({
            "message": "Borrow record not found or book already returned."
        }), 404

    book_col.update_one(
                {"id": book_id}, 
                {
                    "$inc": {
                        "available_copies": 1
                    }
                }
            )    

    if role_id == 'R2':
        notification_col.insert_one(
            {
                "notification_id": Generate_Notification_Id(),
                "recipient_id": user_id,
                "recipient_role_id": role_id,
                
                "type": "RETURNED_BOOK",
                "title": "Book Returned",
                "message": f"You have successfully returned '{book_details.get("book_name")}'.",
                
                "book_id": book_id,
                "book_name": book_details.get("book_name"),
                "author": book_details.get("author"),
                "image": book_details.get("image"),
                
                "user_id": user_id,
                "member_name": user.get("username"),
                
                "request_id": request_id,
                "returned_date": datetime.utcnow(),
                
                "actions": ["View Details"],
                "status": "Returned",
                "is_read": False,
                "created_at": datetime.utcnow()
            }
        )    

    admins = user_col.find(
        {
            "role_id": "R1"
        },
        {
            "_id": 0,
            "id": 1,
            "username": 1
        }
    )

    for admin in admins:

        notification = {
            "notification_id": Generate_Notification_Id(),

            "recipient_id": admin["id"],
            "recipient_role_id": "R1",

            "type": "RETURNED_BOOK",

            "title": "Book Returned",

            "message": (
                f"{user.get("username")} returned "
                f"'{book_details.get("book_name")}'."
            ),

            "book_id": book_id,
            "book_name": book_details.get("book_name"),
            "author": book_details.get("author"),
            "image": book_details.get("image"),

            "user_id": user_id,
            "member_name": user.get("username"),

            "request_id": request_id,
            "returned_date": datetime.utcnow(),

            "actions": ["View Details"],

            "status": "Returned",

            "is_read": False,

            "created_at": datetime.utcnow()
        }

        notification_col.insert_one(notification)

            # Real-time admin notification
        socketio.emit(
            "notification",
            notification,
            room=f"user_{admin['id']}"
        )

    # --------------------------------------------------
    # 11. Response
    # --------------------------------------------------

    return jsonify({
        "message": "Book returned successfully.",
        "return_book": {
            "request_id": request_id,
            "book_id": book_id,
            "status": "Returned",
        }
    }), 200

@borrow_request_api.route("/popular-books", methods=["GET"])
def popular_books():

    pipeline = [

        # 1. Group requests by book ID
        {
            "$group": {
                "_id": "$book_id",
                "total_requests": {"$sum": 1}
            }
        },

        # 2. Join with Books collection
        {
            "$lookup": {
                "from": "Books",
                "localField": "_id",
                "foreignField": "id",
                "as": "book_details"
            }
        },

        # 3. Convert array into object
        {
            "$unwind": "$book_details"
        },

        # 4. Select required fields
        {
            "$project": {
                "_id": 0,
                "book_id": "$_id",
                "book_name": "$book_details.book_name",
                "author": "$book_details.author",
                "total_requests": 1
            }
        },

        # 5. Highest requests first
        {
            "$sort": {
                "total_requests": -1
            }
        },

        # 6. Only top 5
        {
            "$limit": 3
        }
    ]

    result = list(borrow_request_col.aggregate(pipeline))

    return jsonify(result), 200