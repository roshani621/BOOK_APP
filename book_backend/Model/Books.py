from db import books_col
from flask import Blueprint, jsonify, request
from datetime import datetime
from db import users_col
from db import borrow_request_col

books_api = Blueprint("books_api", __name__)

def generate_book_id():
    last_book = books_col.find_one(
        {},
        sort=[("_id", -1)]
    )

    if not last_book:
        return "B2001"
    
    last_id = last_book["_id"]
    number = int(last_id[1:])
    new_number = number + 1
    return f"B{new_number+1}"

#add book by admin

@books_api.route('/add-book', methods=['POST'])
def Add_Book():
    data = request.json


    if not data: 
        return jsonify({"message": "No data provided"}), 400
    
    required_fields = ["title", "author", "category", "isbn", "total_copies"]

    for fields in required_fields:
        if fields not in data:
            return jsonify({"message": f"{fields} is required"}), 400

    total = int(data["total_copies"])
    available = int(data.get("available_copies", total))

    if available > total:
        return jsonify({"message": "Available copies cannot exceed total copies"}), 400
    
    print("RAW DATA:", request.data)
    print("JSON DATA:", request.json)
    book = {
        "_id": generate_book_id(),
        "title": data["title"],
        "author": data["author"],
        "category": data["category"],
        "isbn": data["isbn"],
        "total_copies": total,
        "available_copies": available,
        "status": "ACTIVE",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    books_col.insert_one(book)

    print(book)
    return jsonify({
        "message": 'Book added successfully',
        "book_id": book["_id"]
    }), 201

@books_api.route('/books', methods=['GET'])
def view_all_books():
    books = list(books_col.find({},{
        "id": 1,
        "title": 1,
        "author": 1,
        "category": 1,
        "isbn": 1,
        "total_copies": 1,
        "available_copies": 1,
        "status": 1,
        "created_at": 1,
        "updated_at":1,
        "image": 1
    }))

    for book in books:
        book["_id"] = str(book["_id"])

    users = users_col.count_documents({"role_id": "R2"})

    borrow_count = list(borrow_request_col.find({},{
                            "id": 1,
                            "user_id": 1,
                            "book_id": 1,
                            "approved_date": 1,
                            "due_date": 1,
                            "return_date": 1,
                            "status": 1
                        }))
    for b in borrow_count:
        b["_id"] = str(b["_id"])

    # status_counts = list(borrow_request_col.aggregate([
    #     {
    #         "$match": {
    #             "status": {"$in": ["ACCEPT", "REJECT"]}
    #         }
    #     },
    #     {
    #         "$group":{
    #             "_id": "$status",
    #             "count": {"$sum":1}
    #         }
    #     }
    # ]))

    # result = {
    #     "ACCEPT": 0, 
    #     "REJECT": 0
    # }

    # for item in status_counts:
    #     if item["_id"] == "ACCEPT":
    #         result["ACCEPT"] = item["count"]
    #     elif item["_id"] == "REJECT":
    #         result["REJECT"] = item["count"]

    reject_count = borrow_request_col.count_documents({"status": "REJECT"})
    approve_count = borrow_request_col.count_documents({"status": "ACCEPT"})
    return jsonify({
        "message": "Books fetched",
        "count": {
            "book_count": len(books),
            "user_count": users,
            "books": books,
            "borrow_book": len(borrow_count),
            "borrow": borrow_count,
            "approve_count": approve_count,
            "reject_count": reject_count
        }
    }), 200



@books_api.route("/book/<book_id>", methods=["GET"])
def get_book_by_id(book_id):
    book = books_col.find_one({"_id": book_id}, {"_id": 0})
    print(book)
    print(book_id)
    if not book:
        return {"message": "Book not found"}, 404
    return {"book": book}, 200

@books_api.route("/update-book/<book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.json

    update_data = {
        "title": data["title"],
        "author": data["author"],
        "category": data["category"],
        "isbn": data["isbn"],
        "total_copies": int(data["total_copies"]),
        "available_copies": int(data["available_copies"]),
        "updated_at": datetime.now()
    }

    result = books_col.update_one(
        {"_id": book_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return {"message": "book not found"}, 404
    
    return {"message": "Book updated successfully"}, 200