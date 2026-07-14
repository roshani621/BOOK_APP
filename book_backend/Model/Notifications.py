from DB import notification_col
from flask import Blueprint, jsonify, request
from datetime import datetime

notification_api = Blueprint('notification_api', __name__)


@notification_api.route('/notification', methods=['POST'])
def Create_Notification(data):

    last = notification_col.find_one(
        {},
        sort = [("notification_id", -1)]
    )

    if last: 
        last_id = int(last["notification_id"][3:])
        new_id = last_id + 1
    else:
        new_id = 1

    notification = {
        "notification_id": f"NTF{new_id:03}",
        "category": data["category"],
        "type": data["type"],
        "title": data.get("title"),
        "book_id": data.get("book_id"),
        "book_name": data.get("book_name"),
        "author": data.get("author"),
        "member_name": data.get("member_name"),
        "updated_by": data.get("updated_by"),
        "request_id": data.get("request_id"),
        "status": data["status"],
        "message": data["message"],
        "actions": data.get("actions", []),
        "is_read": False,
        "created_at": datetime.utcnow()
    }

    result = notification_col.insert_one(notification)

    notification["_id"] = str(result.inserted_id)

    return notification


@notification_api.route('/notification', methods=['GET'])
def Notification():
    notification = notification_col.find({},{
        "notification_id": 1,
        "category": 1,
        "type": 1,
        "title": 1,
        "message": 1,
        "request_id": 1,
        "user_id": 1,
        "book_id": 1,
        "books": 1,
        "book_name": 1, 
        "rating": 1,
        "publisher": 1,
        "total_copies": 1,
        "available_copies": 1,
        "borrow_count": 1,
        "author": 1,
        "due_date": 1,
        "status": 1,
        "fine": 1,
        "created_at": 1,
        "is_read": 1,
        "actions": 1,
        "member_name":1,
        "days_overdue": 1,
        "borrow_id": 1,
        "updated_by": 1,
        "updated_fields": 1,
    })

    notification_list = []

    for n in notification:
        n["_id"] = str(n["_id"])
        notification_list.append(n)  

    return jsonify({
        "message": 'Notification',
        "notification": notification_list
    }), 200
