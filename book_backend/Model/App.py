from flask import Flask
from flask_cors import CORS
from Socket import socketio
from datetime import timedelta
from flask_jwt_extended import JWTManager


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config["JWT_SECRET_KEY"] = "my-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


from Auth import auth_api
from Books import books_api
from BorrowRequest import borrow_request_api, Check_Overdue_Books
from Notifications import notification_api
from GlobalSearch import global_search_api
from apscheduler.schedulers.background import BackgroundScheduler



app.register_blueprint(auth_api)
app.register_blueprint(books_api)
app.register_blueprint(borrow_request_api)
app.register_blueprint(notification_api)
app.register_blueprint(global_search_api)

socketio.init_app(
    app,
    cors_allowed_origins="http://localhost:5173"
)

scheduler = BackgroundScheduler()

scheduler.add_job(
    Check_Overdue_Books,
    trigger="interval",
    days=1
)

scheduler.start()

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True
    )


