from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"],
)

def get_logged_in_user_id(request: Request) -> int:
    user_id = request.session.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in first.",
        )
    return user_id


@router.get("/", response_model=list[schemas.FavoriteResponse])
def get_favorites(
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)
    return crud.get_user_favorites(
        db=db,
        user_id=user_id,
    )


@router.post("/", response_model=schemas.FavoriteResponse)
def add_favorite(
    favorite: schemas.FavoriteCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)
    return crud.add_favorite(
        db=db,
        user_id=user_id,
        favorite=favorite,
    )


@router.delete("/{restaurant_id}")
def delete_favorite(
    restaurant_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)
    removed = crud.remove_favorite(
        db=db,
        user_id=user_id,
        restaurant_id=restaurant_id,
    )

    if not removed:
        raise HTTPException(
            status_code=404,
            detail="Favorite restaurant not found.",
        )

    return {
        "message": "Favorite removed successfully."
    }