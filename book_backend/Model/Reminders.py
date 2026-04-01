from flask import Blueprint, jsonify, request
from datetime import datetime
from db import borrow_request_col
from apscheduler.schedulers.background import BackgroundScheduler

reminder_request_api = Blueprint("reminder_request_api", __name__)

def send_reminders():
    today = datetime.utcnow().date()
    print(today)
    records = borrow_request_col.find({
        "status": "ACCEPT",
        "due_date": {"$ne": None}
    })

    for record in records:
        due_date = record["due_date"].date()

        if due_date == today: 
            print(f"Reminder: Book {record['book_id']} is due today for user {record['user_id']}")

        if(due_date - today).days == 3:
            print(f"Reminder: Book due in 3 days for user {record['user_id']}")

scheduler = BackgroundScheduler()
scheduler.add_job(send_reminders, 'interval', days=1)
scheduler.start()