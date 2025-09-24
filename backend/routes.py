
from flask import request, jsonify, make_response, current_app, render_template_string
from utils import token_required, hash_password, check_password, generate_access_token, generate_reset_token,verify_reset_token, is_valid_email, is_valid_date
from db import get_db_connection
from flask_mail import Message
import jwt
import os

# Detect development environment
is_dev = os.environ.get("FLASK_ENV") == "development"

# Set cookies for dev (localhost) or prod (HTTPS) env
def set_auth_cookies(resp, access_token, refresh_token):
  if is_dev:
    cookie_secure = False    # allow HTTP on localhost
    cookie_samesite = "Lax" # cross-site (port differences)
  else:
    cookie_secure = True     # must be HTTPS in production
    cookie_samesite = "Strict"  # prevent CSRF in production

  resp.set_cookie(
    "access_token",
    access_token,
    httponly=True,
    secure=cookie_secure,
    samesite=cookie_samesite,
    max_age=15*60, #15min
    path="/"
  )
  resp.set_cookie(
    "refresh_token",
    refresh_token,
    httponly=True,
    secure=cookie_secure,
    samesite=cookie_samesite,
    max_age=7*24*60*60, #7days
    path="/"
  )

def register_routes(app, mail):
  
  @app.route("/api/debug-cookies")
  def debug_cookies():
    return jsonify(dict(request.cookies))


 # --- Register Route with auto-login ---
  @app.route("/api/register", methods=["POST"])
  def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    hashed_password = hash_password(password)

    try:
        with get_db_connection() as conn:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                (username, email, hashed_password)
            )
            conn.commit()
            new_user_id = cur.lastrowid  # get the ID of the newly created user

            # Generate tokens for localStorage
            access_token = generate_access_token(new_user_id)
            refresh_token = generate_refresh_token(new_user_id)

            return jsonify({
                "message": "User registered successfully!",
                "user_id": new_user_id,
                "username": username,
                "access_token": access_token,
                "refresh_token": refresh_token
            }), 201

    except Exception as e:
        error_str = str(e).lower()
        if "username" in error_str:
            return jsonify({"error": "Username already exists"}), 400
        elif "email" in error_str:
            return jsonify({"error": "Email already exists"}), 400
        else:
            return jsonify({"error": f"Database error: {e}"}), 500


  # --- Login Route ---
  @app.route("/api/login", methods=["POST"])
  def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
      return jsonify({"error": "Email and password required"}), 400

    try:
      with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, username, password FROM users WHERE email=?", (email,))
        user = cur.fetchone()
    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500

    if user and check_password(password, user["password"]):
      access_token = generate_access_token(user["id"])
      
      #Creating a response
      resp=make_response(jsonify({
        "message": "Login successful", 
        "user_id":user["id"],  
        "username": user["username"],
        "access_token": access_token }))
      
      return resp, 200
    
    return jsonify({"error": "Invalid email or password"}), 401
  
  @app.route("/api/logout", methods=["POST"])
  def logout():
    return jsonify({"message": "Logged out successfully"}), 200

  
  # --- Reset Password Route ---sends the reset email (via Brevo)
  @app.route("/api/reset-password", methods=["POST"])
  def reset_password():
      data = request.get_json()
      email = data.get("email")

      if not email:
        return jsonify({"error": "Email is required"}), 400

      if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

      try:
        with get_db_connection() as conn:
          cur = conn.cursor()
          cur.execute("SELECT id, username FROM users WHERE email=?", (email,))
          user = cur.fetchone()

          if not user:
            # Return a success message anyway to avoid revealing emails
            return jsonify({"message": "If this email exists, a reset link has been sent"}), 200

          user_id = user["id"]
          username = user["username"]
          token = generate_reset_token(user_id)

          # Build reset link (frontend should handle /reset-password/:token)
          reset_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:5173')}/reset-password/{token}"
          
          # HTML email content
          html_body = render_template_string("""
          <html>
            <body>
              <p>Hi {{ username }},</p>
              <p>Click the button below to reset your PlanAhead password:</p>
              <p style="text-align:center;">
                <a href="{{ reset_url }}" style="
                  background-color: #1E3A8A;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  display: inline-block;
                ">Reset Password</a>
              </p>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              <p>Thanks,<br/>PlanAhead Team</p>
            </body>
          </html>
          """, username=username, reset_url=reset_url)
          
          # Send email using Brevo 
          msg = Message(
            subject="Reset Your PlanAhead Password",
            recipients=[email],
            html=html_body  # use HTML instead of plain text
          )
          mail.send(msg)  # mail was initialized in your app
          
          return jsonify({"message": "If this email exists, a reset link has been sent"}), 200  
        
      except Exception as e:
        return jsonify({"error": f"Database error: {e}"}), 500

  # --- Set new password using token ---updates the new password in the database.
  @app.route("/api/reset-password/<token>", methods=["POST"])
  def new_password(token):
    data = request.get_json()
    new_password = data.get("password")

    if not new_password:
      return jsonify({"error": "Password is required"}), 400

    user_id = verify_reset_token(token)
    if not user_id:
      return jsonify({"error": "Invalid or expired token"}), 400

    hashed = hash_password(new_password)

    try:
      with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE users SET password=? WHERE id=?", (hashed, user_id))
        conn.commit()
        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500

  # --- Get Tasks ---
  @app.route("/api/tasks", methods=["GET"])
  @token_required
  def get_tasks(user_id):
    try:
      with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute(
          "SELECT id, title, description, date, completed FROM tasks WHERE user_id=?",
          (user_id,)
      )
      tasks = cur.fetchall()
    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500

    tasks_list = [
      {"id": t["id"], "title": t["title"], "description": t["description"], "date": t["date"], "completed": bool(t["completed"])}
      for t in tasks
  ]
    return jsonify(tasks_list), 200

  # --- Add Task ---
  @app.route("/api/tasks", methods=["POST"])
  @token_required
  def add_task(user_id):
    data = request.get_json()
    title = data.get("title")
    description = data.get("description", "")
    date = data.get("date")


    if not title or not date:
      return jsonify({"error": "Title and date are required"}), 400
    if not is_valid_date(date):
      return jsonify({"error": "Invalid date format"}), 400

    try:
      with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute(
          "INSERT INTO tasks (user_id, title, description, date, completed) VALUES (?, ?, ?, ?, ?)",
          (user_id, title, description, date, 0)
      )
        conn.commit()
    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500

    return jsonify({"message": "Task added successfully"}), 201
  
  # --- Toggle Task Completed ---
  @app.route("/api/tasks/<int:task_id>/complete", methods=["PATCH"])
  @token_required
  def toggle_task_completed(user_id, task_id):#user_id from the token, task_id from the URL
    data = request.get_json()
    isCompleted = data.get("isCompleted")

    if isCompleted is None:
      return jsonify({"error": "Completed status is required"}), 400

    try:
      with get_db_connection() as conn:
        cur = conn.cursor()

        # Verify task exists and belongs to user
        cur.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        task = cur.fetchone()
        if not task:
          return jsonify({"error": "Task not found"}), 404
        if task["user_id"] != user_id:
          return jsonify({"error": "User not authorized"}), 403

        # Update completed field
        cur.execute(
          "UPDATE tasks SET completed=? WHERE id=?",
          (1 if isCompleted else 0, task_id),
        )
        conn.commit()

        return jsonify({"success": True, "task_id": task_id, "completed": isCompleted}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

  # --- Delete Task ---
  @app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
  @token_required
  def delete_task(user_id, task_id):
    try:
        with get_db_connection() as conn:
          cur = conn.cursor()
          # Make sure the task belongs to the user
          cur.execute("SELECT id FROM tasks WHERE id=? AND user_id=?", (task_id, user_id))
          task = cur.fetchone()
          if not task:
              return jsonify({"error": "Task not found"}), 404

          cur.execute("DELETE FROM tasks WHERE id=? AND user_id=?", (task_id, user_id))
          conn.commit()
    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500

    return jsonify({"message": "Task deleted successfully"}), 200

  # --- Update Task ---
  @app.route("/api/tasks/<int:task_id>", methods=["PUT"])
  @token_required
  def update_task(user_id, task_id):#takes the user_id (from the token) and task_id (from the URL).
    data = request.get_json()
    title = data.get("title")
    description = data.get("description", "")
    date = data.get("date")

    if not title or not date:
      return jsonify({"error": "Title and date are required"}), 400
    if not is_valid_date(date):
        return jsonify({"error": "Invalid date format"}), 400

    try:
      with get_db_connection() as conn:
        cur = conn.cursor()

        # Verify task exists and belongs to user
        cur.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        task = cur.fetchone()
        if not task:
          return jsonify({"error": "Task not found"}), 404
        if task["user_id"] != user_id:
          return jsonify({"error": "User not authorized"}), 403

        # Update task
        cur.execute(
          "UPDATE tasks SET title=?, description=?, date=? WHERE id=?",
          (title, description, date, task_id)
      )
        conn.commit()

        # Fetch updated task
        cur.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        updated_task = cur.fetchone()

    except Exception as e:
      return jsonify({"error": f"Database error: {e}"}), 500
    
    return jsonify({
      "id": updated_task["id"],
      "title": updated_task["title"],
      "description": updated_task["description"],
      "date": updated_task["date"],
      "completed": bool(updated_task["completed"]),  # ensure boolean
      "message": "Task updated successfully"
  }), 200
