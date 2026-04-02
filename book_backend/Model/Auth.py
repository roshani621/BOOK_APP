from flask import Blueprint, jsonify, request
import bcrypt
from DB import user_col  

auth_api = Blueprint('auth_api', __name__)

#hash password
def hash_password(password):
    hash_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hash_pass

# user login page
@auth_api.route('/login', methods=["POST"])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    user = user_col.find_one({"email": email})

    user['_id'] = str(user['_id'])
    if not user:
        return jsonify({"message":"User not found"})
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Login Successful", "user": user}), 200
    else:
        return jsonify({"message": "Invalid Credential"}), 401

    
