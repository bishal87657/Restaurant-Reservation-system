
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models import Restaurant

router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"],
)

SUPPORTED_CITIES = {
    "bhubaneswar": "Bhubaneswar",
    "cuttack": "Cuttack",
    "puri": "Puri",
}


def restaurant_to_dict(restaurant):
    """
    Convert a database Restaurant object into the format
    expected by the existing frontend, plus the extra fields.
    """

    return {
        "id": restaurant.id,
        "place_id": restaurant.place_id,

        "name": restaurant.name,
        "subtitle": restaurant.subtitle,
        "description": restaurant.description,
        "price": restaurant.price,

        # Compatibility with the current Explore page
        "location": restaurant.address,
        "cuisine": restaurant.category_name,
        "rating": restaurant.rating,
        "reviews": restaurant.reviews_count,
        "image": restaurant.image_url,

        "categories": restaurant.categories,
        "latitude": restaurant.latitude,
        "longitude": restaurant.longitude,

        "city": restaurant.city,
        "raw_city": restaurant.raw_city,
        "neighborhood": restaurant.neighborhood,
        "street": restaurant.street,
        "postal_code": restaurant.postal_code,
        "state": restaurant.state,
        "country_code": restaurant.country_code,

        "phone": restaurant.phone,
        "website": restaurant.website,

        "reviews_distribution": restaurant.reviews_distribution,
        "images_count": restaurant.images_count,
        "opening_hours": restaurant.opening_hours,
        "additional_opening_hours": restaurant.additional_opening_hours,

        "permanently_closed": restaurant.permanently_closed,
        "temporarily_closed": restaurant.temporarily_closed,

        "source_url": restaurant.source_url,
        "scraped_at": restaurant.scraped_at,
    }


@router.get("/")
def search_restaurants(
    location: str = Query(default="Bhubaneswar"),
    search: str = Query(default="", max_length=100),
    category: str = Query(default="", max_length=100),
    limit: int = Query(default=200, ge=1, le=200),
    db: Session = Depends(get_db),
):
    city_key = location.strip().lower()

    # "All" allows searching across all three cities.
    if city_key != "all" and city_key not in SUPPORTED_CITIES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported city. Choose Bhubaneswar, Cuttack, Puri, or All.",
        )

    query = db.query(Restaurant)

    if city_key != "all":
        city_name = SUPPORTED_CITIES[city_key]
        query = query.filter(Restaurant.city == city_name)

    if search.strip():
        search_term = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Restaurant.name.ilike(search_term),
                Restaurant.address.ilike(search_term),
                Restaurant.neighborhood.ilike(search_term),
                Restaurant.category_name.ilike(search_term),
            )
        )

    if category.strip():
        category_term = f"%{category.strip()}%"
        query = query.filter(
            Restaurant.category_name.ilike(category_term)
        )

    restaurants = (
        query
        .order_by(
            Restaurant.rating.desc(),
            Restaurant.reviews_count.desc(),
        )
        .limit(limit)
        .all()
    )

    return {
        "location": (
            "All" if city_key == "all"
            else SUPPORTED_CITIES[city_key]
        ),
        "count": len(restaurants),
        "restaurants": [
            restaurant_to_dict(restaurant)
            for restaurant in restaurants
        ],
    }


@router.get("/cities")
def get_restaurant_cities(db: Session = Depends(get_db)):
    """Return the cities that currently have imported restaurants."""

    cities = (
        db.query(Restaurant.city)
        .distinct()
        .order_by(Restaurant.city)
        .all()
    )

    return [city[0] for city in cities]


@router.get("/{restaurant_id}")
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    restaurant = (
        db.query(Restaurant)
        .filter(Restaurant.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found.",
        )

    return restaurant_to_dict(restaurant)
