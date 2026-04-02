from flask import Blueprint, jsonify, request
import bcrypt
from DB import user_col  

auth_api = Blueprint('auth_api', __name__)

#hash password
def hash_password(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash_pass = bcrypt.hashpw(password_bytes, salt)
    return hash_pass

# user login page
@auth_api.route('/login', methods=["POST"])
def login():
    data = request.json

    email = data.get('email')
    password = data.get('password')
    hashed_password = hash_password(password)

    result = user_col.insert_one({
        "email": email,
        "password": hashed_password
    })

    return jsonify({
        "message": "User login has been successfully",
        "result": result
    }), 200
