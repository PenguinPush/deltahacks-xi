from flask import Flask, send_from_directory, request, redirect
from twilio.twiml.messaging_response import MessagingResponse
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')

app = Flask(__name__, static_folder='../frontend')
client = MongoClient(uri, server_api=ServerApi('1'))


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
