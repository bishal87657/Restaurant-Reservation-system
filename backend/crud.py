from datetime import datetime
from sqlalchemy.orm import Session
from models import User, Reservation, Favorite
from schemas import UserCreate, ReservationCreate, FavoriteCreate

try:
    from pwdlib import PasswordHash
    password_hash = PasswordHash.recommended()
except ImportError:
    from argon2 import PasswordHasher
    from argon2.exceptions import VerifyMismatchError, VerificationError

    class _Argon2PasswordHash:
        def __init__(self):
            self.hasher = PasswordHasher()

        def hash(self, password: str) -> str:
            return self.hasher.hash(password)

        def verify(self, password: str, hashed: str) -> bool:
            try:
                return self.hasher.verify(hashed, password)
            except (VerifyMismatchError, VerificationError, ValueError):
                return False

    password_hash = _Argon2PasswordHash()


# ---------------- USER CRUD ----------------

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=password_hash.hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user is None or not password_hash.verify(password, user.password):
        return None
    return user


# ---------------- RESERVATION CRUD ----------------

def create_reservation(db: Session, user_id: int, reservation: ReservationCreate):
    db_reservation = Reservation(
        user_id=user_id,
        restaurant_id=reservation.restaurant_id,
        restaurant_name=reservation.restaurant_name,
        reservation_date=reservation.reservation_date,
        reservation_time=reservation.reservation_time,
        guests=reservation.guests,
        table_number=reservation.table_number,
        status="confirmed",
        created_at=datetime.utcnow(),
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def get_user_reservations(db: Session, user_id: int):
    return (
        db.query(Reservation)
        .filter(Reservation.user_id == user_id)
        .order_by(Reservation.reservation_date.desc(), Reservation.reservation_time.desc())
        .all()
    )


def get_reservation_by_id(db: Session, reservation_id: int, user_id: int):
    return (
        db.query(Reservation)
        .filter(
            Reservation.reservation_id == reservation_id,
            Reservation.user_id == user_id
        )
        .first()
    )


def cancel_reservation(db: Session, reservation_id: int, user_id: int):
    reservation = get_reservation_by_id(db, reservation_id=reservation_id, user_id=user_id)
    if reservation:
        reservation.status = "cancelled"
        db.commit()
        db.refresh(reservation)
    return reservation


# ---------------- FAVORITE CRUD ----------------

def get_user_favorites(db: Session, user_id: int):
    return (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .all()
    )


def add_favorite(db: Session, user_id: int, favorite: FavoriteCreate):
    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.restaurant_id == favorite.restaurant_id
        )
        .first()
    )
    if existing:
        return existing

    db_favorite = Favorite(
        user_id=user_id,
        restaurant_id=favorite.restaurant_id,
        restaurant_name=favorite.restaurant_name
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite


def remove_favorite(db: Session, user_id: int, restaurant_id: int) -> bool:
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.restaurant_id == restaurant_id
        )
        .first()
    )
    if favorite:
        db.delete(favorite)
        db.commit()
        return True
    return False