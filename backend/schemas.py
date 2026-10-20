from datetime import date, datetime, time
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------- USER SCHEMAS ----------------

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: EmailStr
    phone: str | None = None


# ---------------- RESERVATION SCHEMAS ----------------

class ReservationCreate(BaseModel):
    restaurant_id: int = Field(gt=0)
    restaurant_name: str = Field(min_length=1, max_length=150)

    reservation_date: date
    reservation_time: time

    guests: int = Field(ge=1, le=20)
    table_number: str | None = Field(default=None, max_length=50)


class ReservationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    reservation_id: int
    user_id: int

    restaurant_id: int
    restaurant_name: str

    reservation_date: date
    reservation_time: time

    guests: int
    table_number: str | None = None

    status: str
    created_at: datetime


# ---------------- FAVORITE SCHEMAS ----------------

class FavoriteCreate(BaseModel):
    restaurant_id: int = Field(gt=0)
    restaurant_name: str = Field(min_length=1, max_length=150)


class FavoriteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    favorite_id: int
    user_id: int
    restaurant_id: int
    restaurant_name: str