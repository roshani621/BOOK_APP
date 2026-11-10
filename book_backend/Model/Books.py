from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, user_col, db, notification_col
from datetime import datetime, timedelta, timezone
from Notifications import Generate_Notification_Id
# from gridfs import GridFS
import random
from flask_jwt_extended import jwt_required, get_jwt

# fs=GridFS(db)

books_api = Blueprint('books', __name__)

@books_api.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    books = book_col.find({},{
        "id": 1,
        "book_name": 1,
        "description": 1,
        "short_description":1,
        "author": 1,
        "category": 1,
        "isbn": 1,
        "total_pages": 1,
        "total_copies": 1,
        "available_copies": 1,
        "image": 1,
        "rating": 1,
        "description": 1,
        "publish_date": 1,
        "published_by": 1
    })

    book_list = []

    for book in books:
        book["_id"] = str(book["_id"])
        book_list.append(book)

    return jsonify({
        "message": 'Books data fetch',
        "books": book_list
    }), 200


@books_api.route('/book/<id>', methods=['GET'])
@jwt_required()
def get_book_details(id):
    try:
        book = book_col.find_one({"id": id});

        if not book:
            return jsonify({
                "status": False,
                "message": "Book not found"
            }), 404

        book["_id"] = str(book["_id"])

        return jsonify({
            "status": True,
            "data": book
        })
    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 400



@books_api.route('/books-count', methods = ['GET'])
@jwt_required()
def BooksCount():

    claims = get_jwt()

    user_id = claims.get("b_user_id")
    role_id = claims.get("b_role_id")
    print(user_id, role_id)

    total_books = sum(
        book.get("total_copies", 0)
        for book in book_col.find({}, {"total_copies": 1})
    )
    
    available_books = sum(
        book.get("available_copies", 0)
        for book in book_col.find({}, {"available_copies": 1})
    )

    user_count = user_col.count_documents({})

    total_borrow = borrow_request_col.count_documents({})
    
    if role_id == 'R1':
        pending_count = borrow_request_col.count_documents({"status": "Pending"})

        approved_count = borrow_request_col.count_documents({"status": "Approved"})

        rejected_count = borrow_request_col.count_documents({"status": "Rejected"})

        borrow_count = borrow_request_col.count_documents({})
        
        overdue_count = borrow_request_col.count_documents({
            "status": "Approved",
            "overdue_date": {
                "$lt": datetime.utcnow()
            }
        })

        returned_count = borrow_request_col.count_documents({
            "status": "Returned",
            "return_date": {
                "$lt": datetime.utcnow()
            }
        })
    elif role_id == 'R2':

        filter_count = {
            "user_id": user_id
        }
        pending_count = borrow_request_col.count_documents(
                {
                    **filter_count,
                    "status": "Pending"
                }
            )
        
        approved_count = borrow_request_col.count_documents(
                {
                    **filter_count,
                    "status": "Approved"
                }
            )
        
        rejected_count = borrow_request_col.count_documents(
                {
                    **filter_count,
                    "status": "Rejected"
                }
            )

        overdue_count = borrow_request_col.count_documents({
                    "user_id": user_id,
                    "status": "Overdue",
                })

        returned_count = borrow_request_col.count_documents({
                    "status": "Returned",
                    "return_date": {
                        "$lt": datetime.utcnow()
                    }
                })
        borrow_count = borrow_request_col.count_documents({"user_id":user_id})
    else:
        pending_count = 0
        approved_count = 0
        rejected_count = 0


    print("overdue",  overdue_count)
    return jsonify({
        "total_books": total_books,
        "available_books": available_books,
        "total_borrow": total_borrow,

        "pending_requests": pending_count,
        "approved_requests": approved_count,
        "reject_requests": rejected_count,

        "borrow_count": borrow_count,
        "overdue_count": overdue_count,
        "returned_count":  returned_count,
        "user_count": user_count
    }), 200


#Add books

@books_api.route('/add-book', methods=['POST'])
@jwt_required()
def Add_Book():
    try:
        data = request.get_json()
        count = book_col.count_documents({})
        book_id = f"B{count + 1}"

        book = {
            "id": book_id,
            "book_name": data.get("book_name", ""),
            "author": data.get("author", ""),
            "category": data.get("category", ""),
            "image": data.get("image", ""),
            "isbn": data.get("isbn", ""),
            "total_pages": int(data.get("total_pages", 0)),
            "available_copies": int(data.get("available_copies", 0)),
            "total_copies": int(data.get("total_copies", 0)),
            "rating": float(data.get("rating", 0)),
            "description": data.get("description", ""),
            "short_description": data.get("short_description", ""),
            "publish_date": data.get("publish_date", ""),
            "published_by": data.get("published_by", "")
        }

        book_col.insert_one(book)
        
        users = user_col.find(
            {"role_id": "R2"},
            {
                "_id": 0,
                "id": 1,
                "role_id": 1
            }
        )

        notification_count = 0

        for user in users:

            notification = {
                "notification_id": Generate_Notification_Id(),

                "recipient_id": user["id"],
                "recipient_role_id": user["role_id"],

                "type": "NEW_ARRIVAL",

                "title": "New Book Added",
                "message": f"{book["book_name"]} has been added to the library.",

                "book_id": book_id,
                "book_name": book["book_name"],
                "author": book["author"],
                "publisher": book["published_by"],

                "rating": book["rating"],
                "total_copies": book["total_copies"],
                "available_copies": book["available_copies"],

                "status": "Added",

                "actions": ["View Book"],

                "is_read": False,

                "created_at": datetime.utcnow()
            }

            notification_col.insert_one(notification)

            notification_count += 1
        
        return jsonify({
            "success": True,
            "message": "Book added successfully",
            "book_id": book_id,
            "notifications_created": notification_count
        }), 201
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

#Update Book

@books_api.route('/update-book', methods=['PUT'])
@jwt_required()
def Update_Book():
    try:
        
        data = request.get_json()

        book_id = data.get("id")
    
        # image = request.files['image']

        # image_id = fs.put(
        #     image,
        #     filename = image.filename,
        #     content_type = image.content_type
        # )
        
        book = {
            "book_name": data.get("book_name"),
            "author": data.get("author"),
            "category": data.get("category"),
            "isbn": data.get("isbn"),
            "image": data.get("image"),
            "total_pages": int(data.get("total_pages",0)),
            "available_copies": int(data.get("available_copies",0)),
            "total_copies": int(data.get("total_copies",0)),
            "rating": float(data.get("rating",0)),
            "description": data.get("description"),
            "short_description": data.get("short_description"),
            "publish_date": data.get("publish_date"),
            "published_by": data.get("published_by"),
            "updated_date": datetime.utcnow()
        }

        result = book_col.update_one({"id": book_id}, {"$set": book})
        print(book)

        if result.matched_count == 0:
            return jsonify({
                "success": False,
                "message": "Book not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Book updated successfully",
            "book_id": book_id
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500