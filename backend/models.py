from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Date, Time, DateTime,
    Float, Boolean, Text, JSON
)
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

class Restaurant(Base):
    __tablename__ = "restaurants"

    # Internal ID used by Restora, reservations and favorites
    id = Column(Integer, primary_key=True, index=True)

    # Original Google Maps ID, used to identify duplicates
    place_id = Column(String(255), unique=True, nullable=False, index=True)

    # Basic information
    name = Column(String(255), nullable=False, index=True)
    subtitle = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(String(100), nullable=True)
    category_name = Column(String(150), nullable=True)

    # Location
    address = Column(Text, nullable=True)
    neighborhood = Column(String(150), nullable=True)
    street = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False, index=True)
    raw_city = Column(String(150), nullable=True)
    postal_code = Column(String(30), nullable=True)
    state = Column(String(100), nullable=True)
    country_code = Column(String(10), nullable=True)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Contact information
    phone = Column(String(50), nullable=True)
    website = Column(Text, nullable=True)

    # Ratings and images
    rating = Column(Float, nullable=True)
    reviews_count = Column(Integer, nullable=True)
    reviews_distribution = Column(JSON, nullable=True)
    image_url = Column(Text, nullable=True)
    images_count = Column(Integer, nullable=True)

    # Opening hours and categories
    categories = Column(JSON, nullable=True)
    opening_hours = Column(JSON, nullable=True)
    additional_opening_hours = Column(JSON, nullable=True)

    # Status
    permanently_closed = Column(Boolean, default=False, nullable=False)
    temporarily_closed = Column(Boolean, default=False, nullable=False)

    # Original Google Maps information
    source_url = Column(Text, nullable=True)
    scraped_at = Column(DateTime, nullable=True)

    # Preserve the complete original Apify record
    raw_data = Column(JSON, nullable=False)