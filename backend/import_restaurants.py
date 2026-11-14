
import argparse
import json
from datetime import datetime
from pathlib import Path

from database import Base, engine, SessionLocal
from models import Restaurant


def parse_datetime(value):
    """Convert an ISO date string into a Python datetime."""
    if not value:
        return None

    try:
        return datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )
    except (ValueError, TypeError):
        return None


def clean_record(record, normalized_city):
    """Convert one Apify record into our database format."""

    location = record.get("location") or {}

    place_id = record.get("placeId")
    name = record.get("title")

    # Records without these fields cannot be imported safely.
    if not place_id or not name:
        return None

    raw_city = record.get("city")

    return {
        "place_id": str(place_id),

        "name": name,
        "subtitle": record.get("subTitle"),
        "description": record.get("description"),
        "price": record.get("price"),
        "category_name": record.get("categoryName"),

        "address": record.get("address"),
        "neighborhood": record.get("neighborhood"),
        "street": record.get("street"),

        # Use the source file's city, not the inconsistent
        # city field returned by the scraper.
        "city": normalized_city,
        "raw_city": raw_city,

        "postal_code": record.get("postalCode"),
        "state": record.get("state"),
        "country_code": record.get("countryCode"),

        "latitude": location.get("lat"),
        "longitude": location.get("lng"),

        "phone": record.get("phone"),
        "website": record.get("website"),

        "rating": record.get("totalScore"),
        "reviews_count": record.get("reviewsCount"),
        "reviews_distribution": record.get("reviewsDistribution"),

        "image_url": record.get("imageUrl"),
        "images_count": record.get("imagesCount"),

        "categories": record.get("categories"),
        "opening_hours": record.get("openingHours"),
        "additional_opening_hours": record.get(
            "additionalOpeningHours"
        ),

        "permanently_closed": bool(
            record.get("permanentlyClosed", False)
        ),
        "temporarily_closed": bool(
            record.get("temporarilyClosed", False)
        ),

        "source_url": record.get("url"),
        "scraped_at": parse_datetime(record.get("scrapedAt")),

        # Preserve the original record for future use.
        "raw_data": record,
    }


def import_dataset(db, file_path, city, seen_place_ids):
    """Import one city's dataset."""

    file_path = Path(file_path)

    print(f"\nReading {city}: {file_path.name}")

    with file_path.open("r", encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list):
        raise ValueError(
            f"{file_path.name} does not contain a JSON list."
        )

    imported = 0
    skipped = 0
    duplicates = 0

    for record in records:
        cleaned = clean_record(record, city)

        if cleaned is None:
            skipped += 1
            continue

        place_id = cleaned["place_id"]

        # Avoid duplicates across all three datasets.
        if place_id in seen_place_ids:
            duplicates += 1
            continue

        seen_place_ids.add(place_id)

        restaurant = Restaurant(**cleaned)
        db.add(restaurant)
        imported += 1

    db.commit()

    print(f"Records in file: {len(records)}")
    print(f"Imported: {imported}")
    print(f"Skipped: {skipped}")
    print(f"Duplicates: {duplicates}")

    return imported


def main():
    parser = argparse.ArgumentParser(
        description="Import Apify restaurant datasets into Restora."
    )

    parser.add_argument("--bhubaneswar", required=True)
    parser.add_argument("--cuttack", required=True)
    parser.add_argument("--puri", required=True)

    args = parser.parse_args()

    # Create tables if they do not already exist.
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # This importer is intended for a clean initial import.
        # It clears only the restaurants table.
        db.query(Restaurant).delete()
        db.commit()

        seen_place_ids = set()
        total_imported = 0

        datasets = [
            (args.bhubaneswar, "Bhubaneswar"),
            (args.cuttack, "Cuttack"),
            (args.puri, "Puri"),
        ]

        for file_path, city in datasets:
            total_imported += import_dataset(
                db,
                file_path,
                city,
                seen_place_ids,
            )

        print("\n------------------------------")
        print("IMPORT COMPLETED")
        print(f"Total imported: {total_imported}")
        print("------------------------------")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()
