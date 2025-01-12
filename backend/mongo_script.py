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
    user = collection.find_one({"phonenumber": user_phonenumber})
    friend = collection.find_one({"phonenumber": friend_phonenumber})
    
    if user and friend:
        # Add the friend's number to the user's friends list
        if friend_phonenumber not in user["friends"]:
            collection.update_one(
                {"phonenumber": user_phonenumber},
                {"$push": {"friends": friend_phonenumber}}
            )
            print(f"{friend_phonenumber} added to {user_phonenumber}'s friend list.")
        else:
            print(f"{friend_phonenumber} is already a friend of {user_phonenumber}.")
        
        # Add the user's number to the friend's friends list
        if user_phonenumber not in friend["friends"]:
            collection.update_one(
                {"phonenumber": friend_phonenumber},
                {"$push": {"friends": user_phonenumber}}
            )
            print(f"{user_phonenumber} added to {friend_phonenumber}'s friend list.")
        else:
            print(f"{user_phonenumber} is already a friend of {friend_phonenumber}.")
    else:
        print(f"Either {user_phonenumber} or {friend_phonenumber} does not exist in the database.")



def get_friends_info(user_phonenumber):
    user = collection.find_one({"phonenumber": user_phonenumber})
    
    if user:
        friends_phone_numbers = user.get("friends", [])
        
        friends_info = []
        for friend_phonenumber in friends_phone_numbers:
            friend = collection.find_one({"phonenumber": friend_phonenumber})
            if friend:
                # Transform the data to match the frontend format
                friend_data = {
                    "name": friend["name"],
                    "phoneNumber": friend["phonenumber"],
                    "geocode": friend["location"]["coordinates"],
                    "status": friend["status"]
                }
                friends_info.append(friend_data)
        
        return friends_info
    return []

#All user data
def get_all_users():
    users = collection.find({})
    users_list = []
    
    for user in users:
        pickle_data = {
            "name": user["name"],
            "phoneNumber": user["phonenumber"],
            "geocode": user["location"]["coordinates"],
            "status": user["status"]
        }
        users_list.append(user_data)
    
    return users_list


#Update your own status
def update_user_status(phonenumber, new_status):
    result = collection.update_one(
        {"phonenumber": phonenumber},
        {"$set": {"status": new_status}}
    )
    
    if result.modified_count > 0:
        print(f"Status updated successfully for user {phonenumber}")
        return True
    else:
        print(f"User {phonenumber} not found or status unchanged")
        return False