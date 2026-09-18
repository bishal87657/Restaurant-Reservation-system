from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import models

from database import get_db
from schemas import UserCreate, UserLogin, UserResponse
from crud import (
    get_user_by_email,
    create_user,
    authenticate_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    new_user = create_user(db, user)

    return new_user


@router.post("/login", response_model=UserResponse)
def login(
    user: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):

    authenticated_user = authenticate_user(
        db,
        user.email,
        user.password
    )

    if authenticated_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Store the logged-in user's ID in the session
    request.session["user_id"] = authenticated_user.user_id

    return authenticated_user


@router.post("/logout")
def logout(request: Request):

    request.session.clear()

    return {
        "message": "Logged out successfully."
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):

    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated."
        )

    user = db.query(models.User).filter(
        models.User.user_id == user_id
    ).first()

    if user is None:
        request.session.clear()

        raise HTTPException(
            status_code=401,
            detail="User no longer exists."
        )

    return user