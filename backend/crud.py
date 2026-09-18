from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):

    hashed_password = password_hash.hash(user.password)

    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, email: str, password: str):

    user = get_user_by_email(db, email)

    if user is None:
        return None

    if not password_hash.verify(password, user.password):
        return None

    return user