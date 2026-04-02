from flask import Blueprint, jsonify, request

books_api = Blueprint('books', __name__)

@books_api.route('/books', methods=['GET'])
def get_books():
    return "books"