from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Store the database inside the backend folder
BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "restaurant.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for database models
Base = declarative_base()

# Database dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()