from flask import Flask, request, jsonify, session
from flask_cors import CORS
from db import get_connection
import bcrypt

app = Flask(__name__)

app.secret_key = "your-secret-key-here"

CORS(app, supports_credentials=True)

# ---------------- HOME ----------------

@app.route("/")
def home():
    return "Restaurant Reservation API is running!"


# ---------------- SIGN UP ----------------

@app.route("/api/auth/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    # Check required fields
    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    # Hash password
    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # Check whether email already exists
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "error": "Email already registered"
            }), 409

        # Insert new user
        sql = """
            INSERT INTO users (name, email, phone, password)
            VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (
                name,
                email,
                phone,
                password_hash.decode("utf-8")
            )
        )

        connection.commit()

        return jsonify({
            "message": "User registered successfully"
        }), 201

    except Exception as e:
        connection.rollback()

        return jsonify({
            "error": "Something went wrong"
        }), 500

    finally:
        cursor.close()
        connection.close()


# ---------------- LOGIN ----------------

@app.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Check required fields
    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # Find user by email
        cursor.execute(
            """
            SELECT user_id, name, email, phone, password
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        # User does not exist
        if not user:
            return jsonify({
                "error": "Invalid email or password"
            }), 401

        stored_password = user["password"]

        # Check password
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            stored_password.encode("utf-8")
        ):
            return jsonify({
                "error": "Invalid email or password"
            }), 401

        # Login successful
        return jsonify({
            "message": "Login successful",
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Something went wrong"
        }), 500

    finally:
        cursor.close()
        connection.close()


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":
    app.run(debug=True)