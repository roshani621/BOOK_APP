from flask import Blueprint, jsonify, request
from datetime import datetime
from db import borrow_request_col
from db import books_col


borrow_request_api = Blueprint("borrow_request_api", __name__)

@borrow_request_api.route('/book-request', methods=['POST'])
def AllBook():
    data = request.json
    book_id = data.get("book_id")

    avail_book = books_col.find_one({"_id": book_id})

    if not avail_book:
        return jsonify({"success": False, "message": "book is not found"}), 404
    
    if avail_book.get("available_copies", 0) <=0:
        return jsonify({
            "success": False,
            "message": "No copies available"
        }), 400

    borrow_book = {
        "id": f"BR0000000{borrow_request_col.count_documents({}) + 1}",
        "user_id": data.get("user_id"),
        "book_id": book_id,

        "request_date" : datetime.utcnow(),
        "status": "PENDING",

        # Admin action fields
        "approved_by": None,
        "approved_date": None,

        # Borrow lifecycle fields
        "due_date": None,
        "return_date": None
    }


    borrow_request_col.insert_one(borrow_book)

    books_col.update_one(
        {"_id": book_id},
        {"$inc": {"available_copies": -1}}
    )

    return jsonify({
        "message": "Borrow request initiated",
        "borrow_request": {
            "id": borrow_book["id"],
            "user_id": borrow_book["user_id"],
            "book_id": borrow_book["book_id"],
            "request_date": borrow_book["request_date"],
            "status": borrow_book["status"]
        }
    })


@borrow_request_api.route('/my-books', methods=['GET'])
def BorrowBook():
    pipeline = ([
        {
            "$lookup": {
            "from": "Users",
            "localField": "user_id",
            "foreignField": "id",
            "as" :"user_details"
            }
        },
        {
            "$lookup": {
            "from": "Books",
            "localField": "book_id",
            "foreignField": "_id",
            "as": "book_details"
            }
        },
        {
            "$unwind": "$user_details"
        },
        {
            "$unwind": "$book_details"
        },
        {
            "$project": {
            "_id": 0,
            "id":"$id",
            "username": "$user_details.username",
            "email": "$user_details.email",
            "phone": "$user_details.phone",
            "book_id": "$book_details._id",
            "title": "$book_details.title",
            "author": "$book_details.author",
            "category": "$book_details.category",
            "total_copies" : "$book_details.total_copies",
            "available_copies": "$book_details.available_copies",
            "status": 1,
            "request_date": 1,
            "remarks": "$remarks",
            "borrow_days": 1,
            "approved_date": "$approved_date"
            }
        }
        ]
    )

    result = list(borrow_request_col.aggregate(pipeline))
   
    return jsonify({
        "success": True,
        "data": result
    }), 200


@borrow_request_api.route('/borrow-request', methods=['POST'])
def BorrowRequest():
    data = request.json
    id = data.get("id")
    book_id = data.get("book_id")
    request_type = data.get("request_type")
    user_id = data.get("user_id")
    borrow_days = int(data.get("borrow_days"))
    remarks = data.get("remarks")

    result = borrow_request_col.update_one(
        {"id": id}, 
        {"$set": {
            "status": request_type, 
            "approved_by": user_id, 
            "approved_date": datetime.utcnow(),
            "borrow_days": borrow_days,
            "remarks": remarks
            }
        })
    print(id)
    if result.matched_count == 0:
        return jsonify({
            "success": False,
            "message": "Borrow request not found"
        }), 404
    
    if request_type == 'REJECT':
        books_col.update_one(
            {"_id": book_id},
            {"$inc": {"available_copies": 1}}
        )

    return jsonify({
        "success": True,
        "message": f'Borrow request {request_type.lower()} successfully'
    }), 200


