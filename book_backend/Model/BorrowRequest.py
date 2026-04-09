from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col
from datetime import datetime, timedelta

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
                "foreignField": "_id",
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
                "author": "$book_data.author",
                "category": "$book_data.category",
                "image": "$book_data.image",
                "username": "$user_data.username",
                "email": "$user_data.email",
                "request_date": 1,
                "borrow_days":1,
                "status": 1,
                "created_at": 1
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
    

@borrow_request_api.route('/request', methods=['POST'])
def RequestStatus():
    data = request.get_json()

    request_status = data.get("request_status")
    request_id = data.get("request_id")
    user_id = data.get("user_id")
    approved_date = datetime.utcnow()
    book_id = data.get("book_id")
    remark = data.get("remark")

    request_data = borrow_request_col.find_one({"request_id": request_id})

    if not request_data:
        return jsonify({"message": 'Request not found'}), 404
    
    if request_status == 'Approved':

        book = book_col.find_one({"_id": book_id})

        if book["available_copies"] <= 0:
            return jsonify({"message": "No copies available"}), 400
        
        borrow_request_col.update_one(
        {"request_id": request_id},    
        {
            "$set":{
                "status": request_status,
                "approved_by": user_id,
                "approved_date": approved_date,
                "updated_at": datetime.utcnow()
            }
        })

        book_col.update_one(
        {"_id": book_id},    
        {
            "$inc": {"available_copies": -1}
        })
        return jsonify({"message": "Request Approved"}), 200

    elif request_status == 'Rejected':
        book = book_col.find_one({"_id": book_id})

        if book["available_copies"] <= 0:
            return jsonify({"message": "No copies available"}), 400
        
        borrow_request_col.update_one(
        {"request_id": request_id},    
        {
            "$set":{
                "status": request_status,
                "approved_by": user_id,
                "approved_date": approved_date,
                "remark": remark,
                "updated_at": datetime.utcnow()
            }
        })
        return jsonify({"message": "Request Rejected"}), 200
    else:
        return jsonify({"message": "Invalid status"}), 400
    

        
