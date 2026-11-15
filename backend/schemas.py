from datetime import date, datetime, time, timedelta
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from typing import Optional


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

    @field_validator("reservation_date")
    @classmethod
    def validate_reservation_date(cls, value):
        if value < date.today():
            raise ValueError("Reservation date cannot be in the past.")
        return value

    @field_validator("reservation_time")
    @classmethod
    def validate_reservation_time(cls, value, info):
        reservation_date = info.data.get("reservation_date")

        if reservation_date == date.today():
            if value <= datetime.now().time():
                raise ValueError("Reservation time must be in the future.")

        return value


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

# ----------------- RESERVATION AMENDMENTS ----------------

class ReservationUpdate(BaseModel):
    reservation_date: Optional[date] = None
    reservation_time: Optional[time] = None
    guests: Optional[int] = Field(default=None, ge=1, le=20)
    table_number: Optional[str] = Field(default=None, max_length=50)

    @field_validator("reservation_date")
    @classmethod
    def validate_reservation_date(cls, value):
        if value is not None and value < date.today():
            raise ValueError("Reservation date cannot be in the past.")
        return value

    @field_validator("reservation_time")
    @classmethod
    def validate_reservation_time(cls, value, info):
        if value is None:
            return value

        reservation_date = info.data.get("reservation_date")

        if reservation_date is None:
            reservation_date = date.today()

        if reservation_date == date.today():
            if value <= datetime.now().time():
                raise ValueError("Reservation time must be in the future.")

        return value