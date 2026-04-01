from flask import Blueprint, request, jsonify
from db import users_col, roles_col
from datetime import datetime
import bcrypt

auth_user_api = Blueprint("auth_user_api",__name__)



def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

@auth_user_api.route('/users', methods=["POST"])
def add_user():
    data = request.json

    if not data:
        return jsonify({"message": "No data provided"}), 400

    user = {
        "id": f"U000000000{users_col.count_documents({}) + 1}",
        "username": data.get("username"),
        "password": hash_password(data.get("password")),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "role_id": data.get("role", "R2"),
        "status": "ACTIVE",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    record = users_col.insert_one(user)
    print(record)

    return jsonify({"message": "User inserted successfully"}), 201

#user login 

@auth_user_api.route('/login', methods=["POST"])

def login():
    data = request.json

    if not data:
        return jsonify({"message": "No data provided"}), 400
    
    
    email = data.get("email")
    password = data.get("password")
    print(email, password)
    user = users_col.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404    

    if not bcrypt.checkpw(password.encode("utf-8"),user["password"].encode("utf-8")):
        return jsonify({"message": "Invalid password"}), 401
    
    role = roles_col.find_one({"role_id": user["role_id"]})
    
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role_id": user["role_id"],
            "role_name": role["role_name"] if role else None,
            "menus": role["menus"]if role else []
        }
    }), 200


@auth_user_api.route('/menu', methods=['POST'])
def Menu():
    data = request.json

    role_id = data.get("role_id")

    
    if not role_id:
        return jsonify({"message": "role_id is required"}), 400
    
    menu = roles_col.find_one({"role_id": role_id})

    if not menu:
        return jsonify({"message": "Role not found"}), 404

    print(menu)
    return jsonify({
        "message": "Menus List",
        "menu": {
            "menus": menu["menus"]
        }
    }), 200

@auth_user_api.route("/profile/<user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = users_col.find_one({"id": user_id}, {"_id": 0, "id": 0})
    
    if not user:
        return {"message": "user not found"}

    if "_id" in user:
        user["_id"] = str(user["_id"])

    return {"user": user}, 200