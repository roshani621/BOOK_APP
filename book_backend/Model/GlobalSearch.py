from flask import Blueprint, jsonify, request
from DB import book_col, borrow_request_col, user_col
from flask_jwt_extended import jwt_required

global_search_api = Blueprint("global_search_api", __name__)

@global_search_api.route('/global-search', methods=['GET'])
@jwt_required()
def GlobalSearch():
    search = request.args.get('search', '').strip()
    print(search)

    if not search:
        return jsonify({
            "status": True,
            "books": [],
            "users": [],
        }), 200

    regex = {
        "$regex": search,
        "$options": "i"
    }


    books = list(book_col.find({
        "$or":[
            {"id": regex},
            {"book_name": regex},
            {"author": regex},
            {"category": regex},
            {"isbn": regex},
        ]
    }).limit(5))


    users = list(user_col.find({
        "$or": [
            {"id": regex},
            {"username": regex},
            {"email": regex}
        ]
    }).limit(5))


    for book in books:
        book_id = book["id"]

        borrow_requests = list(borrow_request_col.find({
                "book_id": book_id
            }))

    for book in books:
        book["_id"] = str(book["_id"])

    for user in users:
        user["_id"] = str(user["_id"])

    for borrow in borrow_requests:
        

        user = list(user_col.find(
            {"id": borrow.get("user_id")},
            {
                "_id": 0,
                "id": 1,
                "username": 1,
                "email": 1
            }   
        ))

        borrow["user"] = user

        book["borrow_requests"] = borrow_requests
        book["_id"] = str(book["_id"])

        borrow["_id"] = str(borrow["_id"])

    return jsonify({
        "status": True,
        "books": books,
        "users": users,
    }), 200