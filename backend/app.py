from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from db import init_db
from routes import register_routes
from flask_mail import Mail

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

# Detect dev environment
is_dev = os.environ.get("FLASK_ENV") == "development"
app.config["DEV_MODE"] = is_dev  # <--- add this

if is_dev:
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# --- Brevo Mail config BEFORE initializing Mail ---
app.config['MAIL_SERVER'] = 'smtp-relay.brevo.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("BREVO_EMAIL")
app.config['MAIL_PASSWORD'] = os.getenv("BREVO_SMTP_KEY")
app.config['MAIL_DEFAULT_SENDER'] = ('PlanAhead', "saramululo@gmail.com")

if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
    raise Exception("Brevo mail credentials are not set!")

# --- Initialize Mail extension ---
mail = Mail(app)

# Register routes (routes can now import/use `mail`)
register_routes(app, mail)


if __name__ == "__main__":
    init_db()
    app.run(debug=(os.environ.get("FLASK_ENV") == "development"))
