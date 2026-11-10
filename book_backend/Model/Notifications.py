from DB import notification_col, book_col, borrow_request_col, user_col
from flask import Blueprint, jsonify, request
from datetime import datetime
from Socket import socketio
from flask_jwt_extended import get_jwt, jwt_required

notification_api = Blueprint('notification_api', __name__)

def Get_Notification_User():
    claims = get_jwt()

    user_id = claims.get("b_user_id")
    role_id = claims.get("b_role_id")

    return user_id, role_id


def Generate_Notification_Id():
    last = notification_col.find_one(
        {},
        sort = [("_id", -1)]
    )
    
    if last: 
        last_id = last.get("notification_id", "N000")
        last_number = int(last_id[1:])
        new_id = last_number + 1
    else:
        new_id = 1

    return f"N{new_id:04d}"

def Create_Notification(
    recipient_id,
    recipient_role_id,
    notification_type,
    title,
    message,
    book_id=None,
    book_name=None,
    author=None,
    member_name=None,
    request_id=None,
    updated_by=None,
    status=None,
    actions=None
    ):

    notification_id = Generate_Notification_Id()

    notification = {
        "notification_id": notification_id,

        "recipient_id": recipient_id,
        "recipient_role_id": recipient_role_id,

        "type": notification_type,

        "title": title,
        "message": message,

        "book_id": book_id,
        "book_name": book_name,
        "author": author,

        "member_name": member_name,

        "status": status,

        "request_id": request_id,
        "updated_by": updated_by,

        "actions": actions or [],
        "is_read": False,

        "created_at": datetime.utcnow()
    }

    result = notification_col.insert_one(notification)

    notification["_id"] = str(result.inserted_id)

    socketio.emit(
        "new_notification",
        notification,
        room=f"user_{recipient_id}"
    )

    return notification    


@notification_api.route('/notification', methods=['GET'])
@jwt_required()
def Notification():
    user_id, role_id = Get_Notification_User()

    projection = {
            "_id": 1,
            "notification_id": 1,
            "recipient_id": 1,
            "recipient_role_id": 1,
            "type": 1,
            "title": 1,
            "message": 1,
            "book_id": 1,
            "request_id": 1,
            "updated_by": 1,
            "status": 1,
            "actions": 1,
            "is_read": 1,
            "created_at": 1
        }
    
                
        
    if role_id == "R2":
        notifications = notification_col.find(
            {
                "$or": [
                    {
                        "recipient_id": user_id
                    },
                    {
                        "recipient_role_id": "R2",
                        "type": "NEW_ARRIVAL"
                    }
                ]
            }
        ).sort("created_at")

    elif role_id == "R1":
        notifications = notification_col.find(
            {
                "recipient_role_id": role_id
            },
            projection
        ).sort("created_at")
    else:
        return jsonify({
            "message": "Invalid role",
            "notification": []
        }), 403

    notification_list = []

    for n in notifications:
        n["_id"] = str(n["_id"])

        if n.get("book_id"):
            book = book_col.find_one(
                {
                    "id": n["book_id"]
                },
                {
                    "_id": 0,
                    "id": 1,
                    "book_name": 1,
                    "author": 1
                }
            )         

            if book:
                n["book_name"] = book.get("book_name")
                n["author"] = book.get("author")

        if n.get("type") == "BOOK_OVERDUE":

            records = borrow_request_col.find_one(
                {
                    "request_id": n.get("request_id"),
                    # "user_id": user_id
                },
                {
                    "_id": 0,
                    "book_id": 1,
                    "overdue_days": 1,
                    "fine": 1,
                    "fine_per_day": 1,
                    "due_date": 1,
                    "user_id":1,
                }
            )

            borrower_id = records.get("user_id")

            user = user_col.find_one(
                {"id": borrower_id},
                {
                    "_id": 0,
                    "username": 1
                }
            )

            if user:
                n["username"] = user.get("username")
            

            if records:
                n["overdue_days"] = records.get("overdue_days")
                n["fine"] = records.get("fine")
                n["fine_per_day"] = records.get("fine_per_day")
                n["due_date"] = records.get("due_date")

        if n.get("type") == 'APPROVED_REQUEST':

            records = borrow_request_col.find_one(
                {"request_id": n.get("request_id")},
                {
                    "_id": 0,
                    "approved_by": 1,
                    "approved_date": 1
                }
            )     

            approved_id = records.get("approved_by")

            user = user_col.find_one(
                {"id": approved_id},
                {
                    "_id": 0,
                    "username": 1
                }
            )

            if user:
                n["username"] = user.get("username")
                        
            
            if records:
                n["approved_date"] = records.get("approved_date")

        if n.get("type") == "PENDING_REQUEST":

            records = borrow_request_col.find_one(
                {"request_id": n.get("request_id")},
                {
                    "_id": 0,
                    "request_date": 1,
                    "borrow_days": 1,
                    "user_id": 1
                }
            )

            if records:
                n["request_date"] = records.get("request_date")
                n["borrow_days"] = records.get("borrow_days")

            requester_id = records.get("user_id")

            user = user_col.find_one(
                {"id" : requester_id},
                {
                    "_id": 0,
                    "username": 1
                }
            )

            if user:
                n["username"] = user.get("username")


        notification_list.append(n)

    return jsonify({
        "message": "Notification",
        "notification": notification_list
    }), 200







#     role_id, user_id = Get_Notification_User()

#     notification = notification_col.find(
#         {},
#         {
#             "_id": 1,
#             "notification_id": 1,
#             "type": 1,
#             "title": 1,
#             "message": 1,
#             "book_id": 1,
#             "book_name": 1,
#             "member_name": 1,
#             "status": 1,
#             "actions": 1,
#             "is_read": 1,
#             "created_at": 1
#         }
#     ).sort("created_at", -1)

#     notification_list = []

#     for n in notification:
#         n["_id"] = str(n["_id"])

#         if n.get("book_id"):
#             book = book_col.find_one(
#                 {"id": n["book_id"]},
#                 {"_id": 0, "book_name": 1}
#             )

#             if book:
#                 n["book_name"] = book["book_name"]

#         notification_list.append(n)

#     #Member see only request

#     if role_id == "R2":
#         requests = borrow_request_col.find(
#             {"user_id": user_id},
#         ).sort("created_at", -1)
#     elif role_id == "R1":
#         requests = borrow_request_col.find(
#             {}
#         ).sort("created_at", -1)

#     for request in requests:
#         book = book_col.find_one(
#             {"id": request["book_id"]},
#             {
#                 "_id": 0,
#                 "book_name": 1
#             }
#         )

#         book_name = book["book_name"] if book else "Unknown Book"

#     #pending request

#         if request["status"] == "Pending":

#             notification_list.append({
#                 "request_id": str(request["request_id"]),
#                 "notification_id": 1,
#                 "type": "PENDING_REQUEST",
#                 "title": "Borrow Request Pending",
#                 "message": f'Your request for "{book_name}" is pending.',
#                 "book_id": request["book_id"],
#                 "book_name": book_name,
#                 "status": "Pending",
#                 "actions": ["VIEW"],
#                 "is_read": False,
#                 "created_at": request["created_at"]
#             })

#         elif(
#             request["status"] == "Approved"
#             and request.get("return_date") is None
#             and request.get("overdue_days", 0) > 0
#         ):
#             fine = request.get("fine", 0)
#             overdue_days = request.get("overdue_days", 0)

#             notification_list.append({
#                 "notification_id": request["request_id"],
#                 "type": "BOOK_OVERDUE",
#                 "title": "Book Overdue",
#                 "message": (
#                     f'"{book_name}" is overdue by '
#                     f'{overdue_days} days. '
#                 ),
#                 "book_id": request["book_id"],
#                 "book_name": book_name,
#                 "status": "Overdue",
#                 "fine": fine,
#                 "overdue_days": overdue_days,
#                 "actions": ["RETURN_BOOK", "PAY_FINE"],
#                 "is_read": False,
#                 "created_at": request["updated_at"]
#             })

#         elif request["status"] == "Approved":

#             notification_list.append({
#                 "notification_id": request["request_id"],
#                 "type": "APPROVED_REQUEST",
#                 "title": "Borrow Request Approved",
#                 "message": (
#                     f'Your request for "{book_name}" '
#                     f'has been approved.'
#                 ),
#                 "book_id": request["book_id"],
#                 "book_name": book_name,
#                 "status": "Approved",
#                 "actions": ["VIEW"],
#                 "is_read": False,
#                 "created_at": request.get(
#                     "approved_date",
#                     request["created_at"]
#                 )
#             })

        
    

#     return jsonify({
#         "message": 'Notification',
#         "notification": notification_list,
#     }), 200


