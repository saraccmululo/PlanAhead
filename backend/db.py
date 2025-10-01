import sqlite3

DB_NAME = "calendar.db"

# --- Database Initialization ---
def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()

        # Create users table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL
            )
        """)

        # Create tasks table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title VARCHAR(50) NOT NULL,
                description VARCHAR(200),
                date TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        """)

    print("Database initialized.")

# --- Get DB Connection ---
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # rows can be accessed like dicts
    return conn
