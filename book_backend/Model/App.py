from flask import Flask
from Auth import auth_api
from Books import books_api

app = Flask(__name__)

app.register_blueprint(auth_api)
app.register_blueprint(books_api)

if __name__ == "__main__":
    app.run(debug=True)


