from flask import Flask, send_from_directory, request, redirect, jsonify
from flask_cors import CORS
#from twilio.twiml.messaging_response import MessagingResponse
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')

app = Flask(__name__, static_folder='../frontend')
CORS(app)
client = MongoClient(uri, server_api=ServerApi('1'))

# Add the get_friends_info function here
def get_friends_info(user_phonenumber):
    database = client["pickle_data"]
    collection = database.users
    user = collection.find_one({"phonenumber": user_phonenumber})
    
    if user:
        friends_phone_numbers = user.get("friends", [])
        
        friends_info = []
        for friend_phonenumber in friends_phone_numbers:
            friend = collection.find_one({"phonenumber": friend_phonenumber})
            if friend:
                friend_data = {
                    "name": friend["name"],
                    "phoneNumber": friend["phonenumber"],
                    "geocode": friend["location"]["coordinates"],
                    "status": friend["status"]
                }
                friends_info.append(friend_data)
        
        return friends_info
    return []

# Add the new friends endpoint
@app.route('/api/friends/<phone_number>')
def get_friends(phone_number):
    try:
        friends = get_friends_info(phone_number)
        response = jsonify(friends)
        response.headers.add('Content-Type', 'application/json')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/sms", methods=['GET', 'POST'])
def sms_system():
    # Get the message the user sent our Twilio number
    body = request.values.get('Body', None)
    resp = MessagingResponse()

    resp.message(body.upper())

    return str(resp)


@app.route("/mongodb")
def return_database():
    try:
        database = client["pickle_data"]
        users = database.users.find({"cuisine": "Spanish"})
        results = []

        for user in users:
            results.append(user["name"])

        return str(results)
    except Exception as e:
        return str(e)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    port = int(os.getenv('PORT'))
    app.run(host='0.0.0.0', port=port, debug=True)
