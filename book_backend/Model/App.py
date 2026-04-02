from flask import Flask
from flask_cors import CORS
from Auth import auth_api
from Books import books_api

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_api)
app.register_blueprint(books_api)

if __name__ == "__main__":
    app.run(debug=True)


