from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col
from datetime import datetime, timedelta

books_api = Blueprint('books', __name__)

@books_api.route('/books', methods=['GET'])
def get_books():
    books = book_col.find({},{
        "_id": 1,
        "title": 1,
        "author": 1,
        "category": 1,
        "isbn": 1,
        "total_copies": 1,
        "available_copies": 1,
        "image": 1    
    })

    book_list = []

    for book in books:
        book["_id"] = str(book["_id"])
        book_list.append(book)

    return jsonify({
        "message": 'Books data fetch',
        "books": book_list
    }), 200


#iniate book borrow request 
@books_api.route('/book-request', methods = ['POST'])
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

    borrow_request_col.insert_one({
        "request_id": request_id,
        "user_id": user_id,
        "book_id": book_id,
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
    })
    print(user_id, book_id, request_id)

    return jsonify({
        "message": f"Request raised - {request_id}",
        "due_date": due_date.strftime("%Y-%m-%d")
    }), 200


    
