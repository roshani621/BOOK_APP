from flask import Flask
from flask_cors import CORS
from Auth import auth_api
from Books import books_api
from BorrowRequest import borrow_request_api
from Notifications import notification_api
from flask_jwt_extended import JWTManager
from datetime import timedelta
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config["JWT_SECRET_KEY"] = "my-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

app.register_blueprint(auth_api)
app.register_blueprint(books_api)
app.register_blueprint(borrow_request_api)
app.register_blueprint(notification_api)



if __name__ == "__main__":
    app.run(debug=True)


