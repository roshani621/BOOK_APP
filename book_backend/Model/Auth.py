from flask import Blueprint, jsonify, request
import bcrypt
import os
from werkzeug.utils import secure_filename
from DB import user_col, role_col

auth_api = Blueprint('auth_api', __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    
#user registeration
@auth_api.route('/register', methods=['POST'])
def register():
    file =  request.files.get('photo')
    data = request.get_json()

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    last_id = user_col.find_one({"id": {"$regex": "^U"}}, sort=[("_id", -1)])
    print(last_id)

    if not last_id:
        new_id = 'U'+ '0000000001'
        return jsonify({"message": "ID not found"})
    else:
        number = int(last_id[1:])
        new_id = "U"+str(number+1).zfill(10)

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    phone = data.get('phone')

    user = user_col.insert_one({
        "id": new_id,
        "username": username,
        "password": hash_password(password),
        "email": email,
        "phone": phone,
        "photo": file_path
    })

    user['_id'] = str(user['_id'])
    if not user:
        return jsonify({"message":"User not found"})
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Login Successful", "user": user}), 200
    else:
        return jsonify({"message": "Invalid Credential"}), 401


@auth_api.route('/menu/<user_id>', methods = ['GET'])
def Menu(user_id):
    user = user_col.find_one({"id": user_id})

    if not user:
        return jsonify({"message": "User not found"}), 404

    role_id = user.get("role_id")

    role = role_col.find_one({"role_id": role_id}, {"menus": 1, "_id": 1})

    if not role: 
        return jsonify({"message": "Role not found"}), 404

    return jsonify({
        "role_id": role_id,
        "menus": role.get("menus", [])
    }), 200