from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, notification_col, user_col
from datetime import datetime, timedelta
import random

borrow_request_api = Blueprint("borrow_request_api", __name__)


#book borrow request at admin
@borrow_request_api.route('/borrow-request', methods = ['GET'])
def BookBorrow():
    pipeline = [
        {
            "$match": {
                "status": "Pending"
            }
        },
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
                "image": "$book_data.image",
                "username": "$user_data.username",
                "email": "$user_data.email",
                "request_date": 1,
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
def RequestStatus():
    data = request.get_json()

    request_status = data.get("request_status")
    request_id = data.get("request_id")
    user_id = data.get("user_id")
    book_id = data.get("book_id")   
    remark = data.get("remark")
    approved_date = datetime.utcnow()

    request_data = borrow_request_col.find_one({"request_id": request_id})

    if not request_data:
        return jsonify({"message": 'Request not found'}), 404

    book = book_col.find_one({"id": book_id})
    user = user_col.find_one({"id": request_data["user_id"]})


    if not book:
        return jsonify({"message": "Book not found"}), 404

    if request_status == 'Approved':

        if book["available_copies"] <= 0:
            return jsonify({"message": "No copies available"}), 400

        borrow_request_col.update_one(
            {"request_id": request_id},
            {"$set": {
                "status": request_status,
                "approved_by": user_id,
                "approved_date": approved_date,
                "updated_at": datetime.utcnow()
            }}
        )

        book_col.update_one(
            {"id": book_id},
            {"$inc": {"available_copies": -1}}
        )

        notification_col.insert_one({
            "notification_id": f"NTF{random.randint(1000,9999)}",
            "category": "Borrow Requests",
            "type": "borrow_request",
            "title": "New Borrow Request",
            "request_id": request_id,
            "borrow_id": request_id,
            "user_id": user_id,
            "book_id": book_id,
            "book_name": book["book_name"],
            "member_name": user["username"],
            "due_date": book["due_date"],
            "message": f"{user['username']} requested '{book['book_name']}'.",
            "status": "Approved",
            "actions": [
                "View Details"
            ],
            "is_read": False,
            "created_at": datetime.utcnow()
        })

        return jsonify({"message": "Request Approved"}), 200

    elif request_status == 'Rejected':

        borrow_request_col.update_one(
            {"request_id": request_id},
            {"$set": {
                "status": request_status,
                "approved_by": user_id,
                "approved_date": approved_date,
                "remark": remark,
                "updated_at": datetime.utcnow()
            }}
        )

        notification_col.insert_one({
            "notification_id": f"NTF{random.randint(1000,9999)}",
            "category": "Borrow Requests",
            "type": "borrow_request",
            "title": "New Borrow Request",
            "request_id": request_id,
            "borrow_id": request_id,
            "user_id": user_id,
            "book_id": book_id,
            "book_name": book["book_name"],
            "member_name": user["username"],
            "due_date": book["due_date"],
            "message": f"{user['username']} requested '{book['book_name']}'.",
            "status": "Rejected",
            "actions": [
                "View Details"
            ],
            "is_read": False,
            "created_at": datetime.utcnow()
        })

        return jsonify({"message": "Request Rejected"}), 200

    else:
        return jsonify({"message": "Invalid status"}), 400
    
    
#borrow records
@borrow_request_api.route('/borrow-records', methods = ['GET'])
def BookRecords():
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
                "remark": 1,
                "book_id":1,
                "user_id": 1, 
                "book_name": "$book_data.book_name",
                "description": "$book_data.description",
                "author": "$book_data.author",
                "category": "$book_data.category",
                "total_pages": "$book_data.total_pages",
                "available_copies": "$book_data.available_copies",
                "rating": "$book_data.rating",
                "image": "$book_data.image",
                "username": "$user_data.username",
                "email": "$user_data.email",
                "request_date": 1,
                "approved_date": 1,
                "due_date": 1,
                "borrow_days":1,
                "status": 1,
                "created_at": 1,
                "updated_at": 1
            }
        }
    ]
    book_request = list(borrow_request_col.aggregate(pipeline))
    for item in book_request:
        item["_id"] = str(item["_id"])


    return jsonify({
        "message": "Borrow Request",
        "request": book_request
    }), 200
    