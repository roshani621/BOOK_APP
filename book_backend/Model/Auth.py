from flask import Blueprint, jsonify, request
import bcrypt
import os, uuid
from werkzeug.utils import secure_filename
from datetime import datetime
from DB import user_col, role_col

auth_api = Blueprint('auth_api', __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


#hash password
def hash_password(password):
    hash_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hash_pass.decode('utf-8')

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
    print(file)

    if file: 
        filename = str(uuid.uuid4())+"-"+ secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        print("Saving to:", file_path)
        file.save(file_path)
    else: 
        file_path = None

    last_user = user_col.find_one({"id": {"$regex": "^U"}}, sort=[("id", -1)])
    print(last_user)

    if not last_user:
        new_id = 'U'+ '0000000001'
    else:
        last_id = last_user["id"]
        number = int(last_id[1:])
        new_id = "U"+str(number+1).zfill(10)

    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    phone = request.form.get('phone')
    
    print(username, email, phone)
    
    user_col.insert_one({
        "id": new_id,
        "username": username,
        "password": hash_password(password),
        "email": email,
        "phone": phone,
        "role_id": "R2",
        "status":"ACTIVE",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "photo": file_path,
    })

    return jsonify({
        "message": "Registration Successful",
        "user_id": new_id,
        "id": new_id,
        "username": username,
        "email": email,
        "phone": phone,
        "photo": file_path
    }), 200


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