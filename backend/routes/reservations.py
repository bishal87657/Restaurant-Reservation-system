from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"],
)

def get_logged_in_user_id(request: Request) -> int:
    user_id = request.session.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Please log in first.",
        )
    return user_id


@router.post("/", response_model=schemas.ReservationResponse)
def create_reservation(
    reservation: schemas.ReservationCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)
    try:
        return crud.create_reservation(
            db=db,
            user_id=user_id,
            reservation=reservation,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/my", response_model=list[schemas.ReservationResponse])
def get_my_reservations(
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)
    return crud.get_user_reservations(
        db=db,
        user_id=user_id,
    )


@router.delete("/{reservation_id}")
def cancel_my_reservation(
    reservation_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    user_id = get_logged_in_user_id(request)

    reservation = crud.get_reservation_by_id(
        db=db,
        reservation_id=reservation_id,
        user_id=user_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found.",
        )

    if reservation.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="This reservation is already cancelled.",
        )

    crud.cancel_reservation(
        db=db,
        reservation_id=reservation_id,
        user_id=user_id,
    )

    return {
        "message": "Reservation cancelled successfully."
    }