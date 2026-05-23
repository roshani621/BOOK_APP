from DB import notification_col
from flask import Blueprint, jsonify, request


notification_api = Blueprint('notification_api', __name__)

@notification_api.route('/notification', methods=['GET'])
def Notification():
    notification = notification_col.find({},{
        "notification_id": 1,
        "type": 1,
        "title": 1,
        "message": 1,
        "request_id": 1,
        "user_id": 1,
        "book_id": 1,
        "due_date": 1,
        "status": 1,
        "fine_amount": 1,
        "created_at": 1,
        "is_read": 1
    })

    notification_list = []

    for n in notification:
        n["_id"] = str(n["_id"])
        notification_list.append(n)
        

    return jsonify({
        "message": 'Notification',
        "notification": notification_list
    }), 200
