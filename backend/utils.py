import re
import bcrypt
import jwt
from flask import request, jsonify, current_app, make_response
from functools import wraps
from datetime import datetime, timedelta, timezone
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

# --- Email validation ---
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


# --- Task date validation ---
def is_valid_date(date_str):
    try:
        datetime.fromisoformat(date_str)
        return True
    except ValueError:
        return False

# --- Password hashing ---
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

# --- JWT Access token generation ---
def generate_access_token(user_id):
	return jwt.encode(
		{
			"user_id": user_id,
			"exp": datetime.now(timezone.utc) + timedelta(hours=24) 
		},
		current_app.config['SECRET_KEY'],
		algorithm="HS256"
	)
 
 # --- Helper to generate reset token ---
def generate_reset_token(user_id):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(user_id, salt="password-reset-salt")

 # --- Helper to verify reset token ---
def verify_reset_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        user_id = serializer.loads(token, salt="password-reset-salt", max_age=expiration)
        return user_id
    except SignatureExpired:
        return None  # token expired
    except BadSignature:
        return None  # invalid token
      
      
# --- JWT Decorator ---

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Access token missing"}), 401

        access_token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(access_token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Access token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid access token"}), 401

        return f(user_id, *args, **kwargs)

    return decorated
