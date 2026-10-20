from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Time, DateTime
from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False)


class Reservation(Base):
    __tablename__ = "reservations"

    reservation_id = Column("id", Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    restaurant_id = Column(Integer, nullable=False)
    restaurant_name = Column(String(150), nullable=False)
    reservation_date = Column(Date, nullable=False)
    reservation_time = Column(Time, nullable=False)
    guests = Column(Integer, nullable=False)
    table_number = Column(String(50), nullable=True)
    status = Column(String(30), nullable=False, default="confirmed")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Favorite(Base):
    __tablename__ = "favorites"

    favorite_id = Column("id", Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    restaurant_id = Column(Integer, nullable=False)
    restaurant_name = Column(String(150), nullable=False)