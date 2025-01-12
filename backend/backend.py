import json
import os
from urllib.parse import quote_plus, urlencode

from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from flask import Flask, redirect, session, url_for, request, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from twilio.twiml.messaging_response import MessagingResponse

from emergency_assistant import EmergencyAssistant

load_dotenv()

uri = os.getenv('MONGODB_URI')

app = Flask(__name__, static_folder='../frontend')
app.secret_key = os.getenv("APP_SECRET_KEY")

oauth = OAuth(app)

CORS(app, resources={r"/*": {"origins": "*"}})
client = MongoClient(uri, server_api=ServerApi('1'))

# Initialize the emergency assistant
emergency_assistant = EmergencyAssistant()

oauth.register(
    "auth0",
    client_id=os.getenv("AUTH0_CLIENT_ID"),
    client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{os.getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)


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


@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token

    user_phone_number = session["user"].get("name", None)

    if user_phone_number:
        print("A")
        database = client["pickle_data"]
        collection = database.users

        existing_user = collection.find_one({"phonenumber": user_phone_number})

        if not existing_user:
            new_user = {
                "phonenumber": user_phone_number,
                "name": user_phone_number,
                "friends": [],
                "location": {"coordinates": []},
                "status": 0
            }

            collection.insert_one(new_user)
            print("B")

    return redirect("/")


@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )


@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://"
        + os.environ.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("dashboard", _external=True),
                "client_id": os.environ.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )


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


@app.route('/api/friends/add', methods=['POST'])
def add_friend():
    try:
        data = request.get_json()
        user_phone = data.get('userPhone')
        friend_phone = data.get('friendPhone')

        database = client["pickle_data"]
        collection = database.users

        # Add friend to user's friends list
        result = collection.update_one(
            {"phonenumber": user_phone},
            {"$addToSet": {"friends": friend_phone}}
        )

        if result.modified_count > 0:
            return jsonify({"message": "Friend added successfully"}), 200
        else:
            return jsonify({"error": "User not found or friend already added"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/sms", methods=['GET', 'POST'])
def sms_system():
    # Get the message the user sent our Twilio number
    body = request.values.get('Body', None)
    # Get the sender's phone number
    from_number = request.values.get('From', None)
    resp = MessagingResponse()

    # Check if this is a location update message
    if body and body.startswith("p/ck/3-"):
        try:
            # Extract coordinates from the message
            coords_str = body[7:]  # Remove "p/ck/3-" prefix
            coords = json.loads(coords_str)  # Convert string to list
            
            # Update user's location in database
            database = client["pickle_data"]
            collection = database.users
            result = collection.update_one(
                {"phonenumber": from_number},
                {"$set": {"location.coordinates": coords}}
            )
            
            if result.modified_count > 0:
                resp.message("📍 Location updated successfully!")
            else:
                resp.message("❌ Could not update location. User not found.")
            
            return str(resp)
            
        except Exception as e:
            resp.message(f"❌ Error updating location: {str(e)}")
            return str(resp)

    # If not a location update, proceed with normal chatbot response
    resp.message("🥒 Pickling it up...")

    # Get response from emergency assistant
    try:
        assistant_response = emergency_assistant.get_response(body)
        message_text = assistant_response.get('response', 'Sorry, I could not process your request.')
    except Exception as e:
        message_text = f"An error occurred: {str(e)}"

    # Send response back via SMS
    resp.message(message_text)

    return str(resp)


@app.route("/mongodb")
def return_database():
    try:
        database = client["pickle_data"]
        users = database.users.find({})
        results = []

        for user in users:
            results.append(user["name"])

        return str(results)
    except Exception as e:
        return str(e)


@app.route('/api/user/<phone_number>', methods=['GET'])
def get_user(phone_number):
    try:
        database = client["pickle_data"]
        collection = database.users
        user = collection.find_one({"phonenumber": phone_number})

        if user:
            # Convert ObjectId to string for JSON serialization
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add new endpoint for emergency chat
@app.route('/api/emergency-chat', methods=['POST'])
def emergency_chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
            
        response = emergency_assistant.get_response(user_message)
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def dashboard():
    user = session.get("user")
    if not user:
        return redirect(url_for("login"))
    return jsonify(user)


if __name__ == "__main__":
    port = int(os.getenv('PORT'))
    app.run(host='0.0.0.0', port=port, debug=True)
