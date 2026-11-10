from flask_socketio import join_room
from Model.App import socketio
from flask_jwt_extended import decode_token

@socketio.on("join_notification_room")
def join_notification_room(token):
    try:
        decoded = decode_token(token)

        user_id = decoded.get("b_user_id")
        role_id = decoded.get("b_role_id")

        if not user_id:
            print("Invalid user")
            return
        room = f"user_{user_id}" 

        join_room(room)

        print(
            f"User {user_id} with role {role_id}",
            f"Joined notification room: {room}" 
        )

    except Exception as e:
        print("Socket authentication error: ",e)