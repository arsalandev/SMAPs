from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "data.json"


# Function to read JSON file
def read_data():
    if not os.path.exists(DATA_FILE):
        return {"Users": [], "Role": {}}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

# Function to write JSON file
def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


# GET all data
@app.route("/allInfo", methods=["GET"])
def get_data():
    data = read_data()
    return jsonify(data)

# GET all users
@app.route("/users", methods=["GET"])
def get_users():
    data = read_data()
    return jsonify(data["Users"])

# GET roles
@app.route("/roles", methods=["GET"])
def get_roles():
    data = read_data()
    return jsonify(data["Role"])

# UPDATE password
@app.route("/roles/password", methods=["PUT"])
def update_password():
    data = read_data()
    req = request.json
    username = req.get("Username")
    new_password = req.get("password")

    if not username or not new_password:
        return jsonify({"error": "Username and password are required"}), 400

    updated = False

    # Check Admin
    if data["Role"].get("Admin", {}).get("Username") == username:
        data["Role"]["Admin"]["password"] = new_password
        updated = True

    # Check Agents
    for agent in data["Role"].get("Agent", []):
        if agent["Username"] == username:
            agent["password"] = new_password
            updated = True
            break

    # Check Managers
    for country, managers in data["Role"].get("Manager", {}).items():
        for manager in managers:
            if manager["Username"] == username:
                manager["password"] = new_password
                updated = True
                break

    if not updated:
        return jsonify({"error": "Username not found"}), 404

    write_data(data)
    return jsonify({"message": f"Password updated successfully for {username}"})


# ADD JSON
@app.route("/users", methods=["POST"])
def add_user():
    data = read_data()
    new_user = request.json
    write_data(new_user)
    return jsonify({"message": "User added successfully"}), 201



# Root endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Simple JSON API"})


if __name__ == "__main__":
    app.run(debug=True)
