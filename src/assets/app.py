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

# GET all users
@app.route("/users", methods=["GET"])
def get_users():
    data = read_data()
    return jsonify(data["Users"])

# GET user by username
@app.route("/users/<username>", methods=["GET"])
def get_user(username):
    data = read_data()
    user = next((u for u in data["Users"] if u["Username"] == username), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

# ADD new user
@app.route("/users", methods=["POST"])
def add_user():
    data = read_data()
    new_user = request.json
    if any(u["Username"] == new_user["Username"] for u in data["Users"]):
        return jsonify({"error": "Username already exists"}), 400
    data["Users"].append(new_user)
    write_data(data)
    return jsonify({"message": "User added successfully"}), 201

# UPDATE user by username
@app.route("/users/<username>", methods=["PUT"])
def update_user(username):
    data = read_data()
    user = next((u for u in data["Users"] if u["Username"] == username), None)
    if not user:
        return jsonify({"error": "User not found"}), 404
    updated_info = request.json
    user.update(updated_info)
    write_data(data)
    return jsonify({"message": "User updated successfully"})

# DELETE user by username
@app.route("/users/<username>", methods=["DELETE"])
def delete_user(username):
    data = read_data()
    users = data["Users"]
    updated_users = [u for u in users if u["Username"] != username]
    if len(updated_users) == len(users):
        return jsonify({"error": "User not found"}), 404
    data["Users"] = updated_users
    write_data(data)
    return jsonify({"message": "User deleted successfully"})

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

# Root endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Simple JSON API"})


if __name__ == "__main__":
    app.run(debug=True)
