from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, user_col, db, notification_col
from datetime import datetime, timedelta, timezone
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


#iniate book borrow request 
@books_api.route('/book-request', methods = ['POST'])
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


@books_api.route('/books-count', methods = ['GET'])
@jwt_required()
def BooksCount():

    claims = get_jwt()

    user_id = claims.get("b_user_id")
    role_id = claims.get("b_role_id")
    print(user_id, role_id)

    if role_id == "R1":
        borrow_filter = {}
    else: 
        borrow_filter = {
            "user_id": user_id
        }

    #books count
    books = list(
        book_col.find(
            {},
            {
                "_id": 0,
                "total_copies": 1,
                "available_copies": 1,
            }
        )
    )

    
    users = list(
        user_col.find({},
                  {
                      "_id": 0,
                  })
    )

    #return count
    returned_count = borrow_request_col.count_documents({
        "status": "Returned"
    })

    today = datetime.now(timezone.utc)

    #overdue count
    overdue_count = borrow_request_col.count_documents({
        "status": "Approved",
        "due_date": {"$lt": today}
    })

    #borrow count
    borrow_count = borrow_request_col.count_documents({})

    #total books
    total_books = sum(book.get("total_copies", 0) for book in books)

    #available books
    available_books = sum(book.get("available_copies", 0) for book in books)

    #pending request
    pending_request = borrow_request_col.count_documents({
        **borrow_filter,
        "status": "Pending"
    })

    #approved request
    approved_request = borrow_request_col.count_documents({
        **borrow_filter,
        "status": "Approved"
    })

    #reject request
    reject_request = borrow_request_col.count_documents({
        **borrow_filter,
        "status": "Rejected"
    })

    total_request = borrow_request_col.count_documents({
        **borrow_filter
    })

    total_user = len(users)

    return jsonify({
        "total_books": total_books,
        "available_books": available_books,

        "pending_requests": pending_request,
        "approved_requests": approved_request,
        "reject_requests": reject_request,
        "total_request": total_request,

        "total_users": total_user,

        "borrow_count": borrow_count,
        "overdue_count": overdue_count,
        "returned_count":  returned_count,
        "user_id": users
    }), 200


#Add books

@books_api.route('/add-book', methods=['POST'])
@jwt_required()
def Add_Book():
    try:
        data = request.get_json()
        count = book_col.count_documents({})
        book_id = f"B{count + 1}"

        # isbn = str(random.randint(10**12, 10**13 - 1))

        # image = request.files['image']

        # image_id = fs.put(
        #     image,
        #     filename = image.filename,
        #     content_type = image.content_type
        # )

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
        
        notification_col.insert_one({
            "notification_id": f"NTF{random.randint(1000,9999)}",
            "category": "Book Updates",
            "type": "book_added",
            "title": "New Book Added",
            "message": f"{book['book_name']} has been added to the library.",
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
        })
        
        return jsonify({
            "success": True,
            "message": "Book added successfully",
            "book_id": book_id
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
        
        created_time = datetime.utcnow()

        notification = {
            "notification_id": f"NTF{random.randint(1000,9999)}",
            "category": "Book Updates",
            "type": "book_updated",
            "title": "Book Updated",
            "message": f'{book["book_name"]} book details has been updated successfully.',
            "book_id": book_id,
            "book_name": book["book_name"],
            "author": book["author"],
            "publisher": book["published_by"],
            "rating": book["rating"],
            "total_copies": book["total_copies"],
            "available_copies": book["available_copies"],
            "status": "Updated",
            "actions": ["View Book"],
            "is_read": False,
            "created_at": created_time
        }
        notification_col.insert_one(notification)


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