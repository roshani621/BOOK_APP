from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client['mydatabase']

book_col = db["Books"]
user_col = db["Users"]
borrow_request_col = db["BorrowRequest"]
role_col = db["Roles"]