
from pymongo import MongoClient
import os


client = MongoClient('mongodb://localhost:27017/')
db = client.get_database("susracker")  # Change to your database name
criminals_collection = db["criminals"]  # Collection name

print("Connected to MongoDB Atlas successfully!")
