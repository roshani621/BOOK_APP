from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, user_col, db, notification_col
from datetime import datetime, timedelta
# from gridfs import GridFS
import random


# fs=GridFS(db)

books_api = Blueprint('books', __name__)

@books_api.route('/books', methods=['GET'])
def get_books():
    books = book_col.find({},{
        "id": 1,
        "book_name": 1,
        "description": 1,
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


@books_api.route('/books-count', methods = ['GET'])
def BooksCount():
    books = list(book_col.find({},{
        "total_copies": 1,
        "available_copies": 1,
    }))

    borrows = list(
        borrow_request_col.find({},
                {
                    "status": 1
                })
    )
    
    users = list(
        user_col.find({},
                  {
                      "_id": 1,
                  })
    )
    
    total_books = sum(book.get("total_copies", 0) for book in books)

    available_books = sum(book.get("available_copies", 0) for book in books)

    pending_request = sum(1 for b in borrows if b.get("status") == "Pending")
    approved_request = sum(1 for b in borrows if b.get("status") == "Approved")
    # pending_request = sum(1 for b in borrows if b.get("status") == "Pending")

    total_user = len(users)

    return jsonify({
        "total_books": total_books,
        "available_books": available_books,
        "pending_requests": pending_request,
        "approved_requests": approved_request,
        "total_users": total_user
    }), 200


#Add books

@books_api.route('/add-book', methods=['POST'])
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