from pymongo import MongoClient
from bson import ObjectId

connection_string = "mongodb+srv://andrewdaidev:pickle@pickle.t9u1m.mongodb.net/?retryWrites=true&w=majority&appName=Pickle"

client = MongoClient(connection_string)

db = client["pickle_data"]
collection = db["users"]

def insert_user(phonenumber, name, friends, location, status):
    user = {
        "phonenumber": phonenumber,
        "name": name,
        "friends": friends,
        "location": {
            "coordinates": location
        },
        "status": status
    }
    
    result = collection.insert_one(user)
    print(f"User inserted with ID: {result.inserted_id}")

def get_user_by_phonenumber(phonenumber):
    user = collection.find_one({"phonenumber": phonenumber})
    if user:
        print("User found:", user)
    else:
        print("User not found.")


def add_friend_request(user_phonenumber, friend_phonenumber):
    # Find the user who is sending the request
    user = collection.find_one({"phonenumber": user_phonenumber})
    
    # If the user exists, proceed to add the friend
    if user:
        if friend_phonenumber not in user["friends"]:
            collection.update_one(
                {"phonenumber": user_phonenumber},
                {"$push": {"friends": friend_phonenumber}}
            )
            print(f"Friend request sent! {friend_phonenumber} added to {user_phonenumber}'s friend list.")
        else:
            print(f"{friend_phonenumber} is already a friend of {user_phonenumber}.")
    else:
        print(f"User with phone number {user_phonenumber} not found.")

def get_friends_info(user_phonenumber):
    user = collection.find_one({"phonenumber": user_phonenumber})
    
    if user:
        friends_phone_numbers = user.get("friends", [])
        
        friends_info = []
        for friend_phonenumber in friends_phone_numbers:
            friend = collection.find_one({"phonenumber": friend_phonenumber})
            if friend:
                status_dict = {0: "safe", 1: "on-the-move", 2: "pickle"}
                friend['status'] = status_dict.get(friend['status'], "Unknown")  
                friends_info.append(friend)
            else:
                print(f"Friend with phone number {friend_phonenumber} not found.")
        
        if friends_info:
            print(f"Friends information for {user_phonenumber}:")
            for friend in friends_info:
                print(friend)
        else:
            print(f"{user_phonenumber} has no friends.")
    else:
        print(f"User with phone number {user_phonenumber} not found.")
        
        

