from flask import Blueprint, jsonify, request
from DB import book_col

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
