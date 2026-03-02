from pymongo import MongoClient


client = MongoClient("mongodb://localhost:27017")
db = client["mydatabase"]
users_col = db["Users"]
roles_col = db["Roles"]
books_col = db["Books"]
borrow_request_col = db["BorrowRequest"]