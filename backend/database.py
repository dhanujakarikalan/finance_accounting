import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "finance_ai")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")

def get_engine():
    # Try connecting to MySQL
    mysql_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    try:
        # Create database if missing
        server_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}"
        temp_engine = create_engine(server_url, isolation_level="AUTOCOMMIT", connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}"))
        temp_engine.dispose()
        
        eng = create_engine(mysql_url, pool_pre_ping=True, pool_recycle=3600)
        with eng.connect() as test_conn:
            test_conn.execute(text("SELECT 1"))
        print(f"Connected successfully to MySQL database '{MYSQL_DATABASE}' on {MYSQL_HOST}:{MYSQL_PORT}.")
        return eng
    except Exception as e:
        print(f"MySQL connection unavailable ({e}). Falling back to SQLite database './finance_ai.db'...")
        sqlite_url = "sqlite:///./finance_ai.db"
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
