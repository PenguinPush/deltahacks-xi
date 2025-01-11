from pymongo import MongoClient
from bson import ObjectId

# Replace with your actual connection string
connection_string = "mongodb+srv://andrewdaidev:pickle@pickle.t9u1m.mongodb.net/?retryWrites=true&w=majority&appName=Pickle"

# Connect to MongoDB
client = MongoClient(connection_string)

# Access your database and collection
db = client["pickle_data"]
collection = db["users"]

# Function to insert a new user
def insert_user(phonenumber, name, friends, location, status):
    # Create the document
    user = {
        "phonenumber": phonenumber,
        "name": name,
        "friends": friends,
        "location": {
            "coordinates": location
        },
        "status": status
    }
    
    # Insert the document into the collection
    result = collection.insert_one(user)
    print(f"User inserted with ID: {result.inserted_id}")

# Function to retrieve a user by phonenumber
def get_user_by_phonenumber(phonenumber):
    user = collection.find_one({"phonenumber": phonenumber})
    if user:
        print("User found:", user)
    else:
        print("User not found.")

# Example: Insert a user
insert_user("1234567890", "John Doe", ["9876543210", "1230984567"], [-73.935242, 40.730610], "0")

# Example: Retrieve a user by phonenumber
get_user_by_phonenumber("1234567890")
