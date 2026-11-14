
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../api";

import {
  MapPin,
  Star,
  Heart,
  Clock,
  Users,
  CalendarDays,
  ArrowLeft,
  Check,
  ArrowRight,
  Utensils,
} from "lucide-react";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TableSelector from "../components/TableSelector";

// Convert the opening-hours data into readable text
function formatOpeningHours(openingHours) {
  if (!openingHours) {
    return "Opening hours not available";
  }

  if (Array.isArray(openingHours)) {
    const entries = openingHours
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item === "object" && item !== null) {
          const day = item.day || "";
          const hours = item.hours || "";

          return `${day}: ${hours}`.trim();
        }

        return "";
      })
      .filter(Boolean);

    return entries.length
      ? entries.join(" · ")
      : "Opening hours not available";
  }

  if (typeof openingHours === "object") {
    return Object.entries(openingHours)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join(" · ");
  }

  return String(openingHours);
}

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [favorite, setFavorite] = useState(false);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Fetch the selected restaurant from the backend
  useEffect(() => {
    let cancelled = false;

    const fetchRestaurant = async () => {
      setLoading(true);
      setFetchError("");
      setRestaurant(null);

      try {
        const data = await apiRequest(`/restaurants/${id}`);

        if (!cancelled) {
          setRestaurant(data);
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError(
            error.message || "Could not load restaurant details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRestaurant();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Check date, time and table availability in the UI
  const handleCheckAvailability = (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!time) {
      alert("Please select a time.");
      return;
    }

    setSelectedTable(null);
    setBookingError("");
    setBookingSuccess("");
    setAvailabilityChecked(true);
  };

  // Reset table selection when guest count changes
  const handleGuestChange = (e) => {
    setGuests(Number(e.target.value));
    setSelectedTable(null);
    setAvailabilityChecked(false);
    setBookingError("");
    setBookingSuccess("");
  };

  // Create reservation through the FastAPI backend
  const handleConfirmReservation = async () => {
    if (!selectedTable) {
      setBookingError("Please select an available table.");
      return;
    }

    if (!date || !time || Number(guests) < 1) {
      setBookingError(
        "Please select a date, time, and number of guests."
      );
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      const result = await apiRequest("/reservations/", {
        method: "POST",

        body: JSON.stringify({
          restaurant_id: restaurant.id,
          restaurant_name: restaurant.name,
          reservation_date: date,
          reservation_time:
            time.length === 5 ? `${time}:00` : time,
          guests: Number(guests),
          table_number: String(selectedTable.id),
        }),
      });

      setBookingSuccess(
        `Reservation confirmed! Booking ID: ${result.reservation_id}`
      );
    } catch (error) {
      setBookingError(
        error.message || "Could not create reservation."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="restaurant-not-found">
          <h2>Loading restaurant...</h2>
          <p>Please wait while we retrieve the details.</p>
        </div>

        <Footer />
      </>
    );
  }

  // Error or restaurant not found
  if (!restaurant) {
    return (
      <>
        <Navbar />

        <div className="restaurant-not-found">
          <h2>Restaurant Not Found</h2>

          <p>
            {fetchError || "The restaurant you're looking for does not exist."}
          </p>

          <Link to="/explore">
            Back to Restaurants
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const openingHours = formatOpeningHours(
    restaurant.opening_hours
  );

  const cuisine = restaurant.cuisine || "Restaurant";
  const location = restaurant.location || "Location unavailable";

  const description =
    restaurant.description ||
    restaurant.subtitle ||
    "Additional information about this restaurant is not available.";

  return (
    <div className="restaurant-details-page">
      <Navbar />

      {/* HERO SECTION */}
      <section className="restaurant-detail-hero">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <div className="restaurant-detail-overlay" />

        <motion.div
          className="restaurant-detail-hero-content"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <Link
            to="/explore"
            className="back-to-explore"
          >
            <ArrowLeft size={17} />
            Back to Explore
          </Link>

          <p>{cuisine.toUpperCase()}</p>

          <h1>{restaurant.name}</h1>

          <div className="detail-rating">
            <Star size={17} fill="currentColor" />

            <strong>
              {restaurant.rating != null
                ? Number(restaurant.rating).toFixed(1)
                : "New"}
            </strong>

            <span>
              ({restaurant.reviews ?? 0} reviews)
            </span>

            <span className="hero-divider">|</span>

            <MapPin size={16} />

            <span>{location}</span>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <main className="restaurant-detail-content">
        <div className="restaurant-detail-main">

          {/* ABOUT THE RESTAURANT */}
          <motion.section
            className="restaurant-info-section"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div className="detail-heading">
              <div>
                <span>ABOUT THE RESTAURANT</span>

                <h2>
                  {restaurant.subtitle || restaurant.name}
                </h2>
              </div>

              <button
                type="button"
                className={`detail-favorite ${
                  favorite ? "selected" : ""
                }`}
                onClick={() => setFavorite(!favorite)}
                aria-label={
                  favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Heart
                  size={20}
                  fill={favorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            <p className="detail-description">
              {description}
            </p>

            {restaurant.categories?.length > 0 && (
              <div className="restaurant-categories">
                {restaurant.categories.map((category, index) => (
                  <span key={`${category}-${index}`}>
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div className="restaurant-features">
              <div>
                <MapPin size={20} />

                <div>
                  <small>LOCATION</small>

                  <strong>{location}</strong>
                </div>
              </div>

              <div>
                <Clock size={20} />

                <div>
                  <small>OPENING HOURS</small>

                  <strong>{openingHours}</strong>
                </div>
              </div>

              <div>
                <Star size={20} />

                <div>
                  <small>RATING</small>

                  <strong>
                    {restaurant.rating != null
                      ? `${Number(restaurant.rating).toFixed(1)} / 5`
                      : "Not rated"}
                  </strong>
                </div>
              </div>
            </div>

            {restaurant.phone && (
              <p className="restaurant-contact">
                <strong>Phone:</strong> {restaurant.phone}
              </p>
            )}

            {restaurant.website && (
              <p className="restaurant-contact">
                <strong>Website:</strong>{" "}
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit website
                </a>
              </p>
            )}
          </motion.section>

          {/* RESERVATION SECTION */}
          <motion.section
            className="reservation-section modern-reservation"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div className="reservation-heading">
              <span>MAKE A RESERVATION</span>

              <h2>Select Date and Time</h2>

              <p>
                Choose your date, time, number of guests
                and select a table from the available options.
              </p>
            </div>

            {/* RESERVATION CONTROLS */}
            <form
              className="reservation-controls"
              onSubmit={handleCheckAvailability}
            >
              {/* DATE */}
              <div className="reservation-control">
                <label>
                  <CalendarDays size={17} />
                  Date
                </label>

                <div className="reservation-input">
                  <CalendarDays size={18} />

                  <input
                    type="date"
                    value={date}
                    min={new Date().toLocaleDateString("en-CA")}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedTable(null);
                      setAvailabilityChecked(false);
                      setBookingError("");
                      setBookingSuccess("");
                    }}
                    required
                  />
                </div>
              </div>

              {/* TIME */}
              <div className="reservation-control">
                <label>
                  <Clock size={17} />
                  Time
                </label>

                <div className="reservation-input">
                  <Clock size={18} />

                  <select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setSelectedTable(null);
                      setAvailabilityChecked(false);
                      setBookingError("");
                      setBookingSuccess("");
                    }}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="11:00:00">11:00 AM</option>
                    <option value="12:00:00">12:00 PM</option>
                    <option value="13:00:00">1:00 PM</option>
                    <option value="14:00:00">2:00 PM</option>
                    <option value="19:00:00">7:00 PM</option>
                    <option value="19:30:00">7:30 PM</option>
                    <option value="20:00:00">8:00 PM</option>
                    <option value="21:00:00">9:00 PM</option>
                    <option value="22:00:00">10:00 PM</option>
                  </select>
                </div>
              </div>

              {/* GUESTS */}
              <div className="reservation-control">
                <label>
                  <Users size={17} />
                  Guests
                </label>

                <div className="reservation-input">
                  <Users size={18} />

                  <select
                    value={guests}
                    onChange={handleGuestChange}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests</option>
                    <option value={7}>7 Guests</option>
                    <option value={8}>8 Guests</option>
                  </select>
                </div>
              </div>

              {/* CHECK AVAILABILITY */}
              <button
                type="submit"
                className="check-availability-button"
              >
                Check Availability
                <ArrowRight size={18} />
              </button>
            </form>

            {/* TABLE SELECTOR */}
            {availabilityChecked && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="availability-area"
              >
                <TableSelector
                  guests={guests}
                  onTableSelect={(table) => {
                    setSelectedTable(table);
                    setBookingError("");
                    setBookingSuccess("");
                  }}
                />
              </motion.div>
            )}
          </motion.section>
        </div>

        {/* BOOKING SIDEBAR */}
        <motion.aside
          className="restaurant-booking-sidebar"
          initial={{
            opacity: 0,
            x: 25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          {/* RESTAURANT CARD */}
          <div className="sidebar-restaurant-card">
            {restaurant.image && (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className="sidebar-restaurant-content">
              <span>{cuisine}</span>

              <h3>{restaurant.name}</h3>

              <div className="sidebar-rating">
                <Star size={15} fill="currentColor" />

                {restaurant.rating != null
                  ? Number(restaurant.rating).toFixed(1)
                  : "Not rated"}

                <small>
                  {restaurant.reviews ?? 0} reviews
                </small>
              </div>

              <div className="sidebar-location">
                <MapPin size={15} />
                {location}
              </div>

              <div className="sidebar-hours">
                <Clock size={15} />
                {openingHours}
              </div>
            </div>
          </div>

          {/* SELECTED TABLE */}
          <div className="booking-summary-card">
            <span className="summary-eyebrow">
              SELECTED TABLE
            </span>

            {selectedTable ? (
              <>
                <div className="selected-table-preview">
                  <div className="selected-table-icon">
                    <Utensils size={21} />
                  </div>

                  <div>
                    <strong>
                      Table {selectedTable.id}
                    </strong>

                    <span>{selectedTable.location}</span>
                  </div>
                </div>

                <div className="summary-row">
                  <span>Capacity</span>

                  <strong>
                    {selectedTable.seats} Seats
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Location</span>

                  <strong>{selectedTable.location}</strong>
                </div>

                <div className="summary-row">
                  <span>Table Type</span>

                  <strong>{selectedTable.type}</strong>
                </div>
              </>
            ) : (
              <div className="no-table-selected">
                <div>
                  <Utensils size={20} />
                </div>

                <p>
                  Select an available table from the floor plan.
                </p>
              </div>
            )}
          </div>

          {/* RESERVATION SUMMARY */}
          <div className="booking-summary-card">
            <span className="summary-eyebrow">
              YOUR RESERVATION
            </span>

            <div className="reservation-summary">
              <div>
                <CalendarDays size={17} />
                <span>{date || "Select date"}</span>
              </div>

              <div>
                <Clock size={17} />
                <span>{time || "Select time"}</span>
              </div>

              <div>
                <Users size={17} />
                <span>{guests} Guests</span>
              </div>

              <div>
                <Utensils size={17} />

                <span>
                  {selectedTable
                    ? `Table ${selectedTable.id}`
                    : "No table selected"}
                </span>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {bookingError && (
              <p
                role="alert"
                style={{
                  color: "#b42318",
                  marginBottom: 12,
                }}
              >
                {bookingError}
              </p>
            )}

            {/* SUCCESS MESSAGE */}
            {bookingSuccess && (
              <p
                role="status"
                style={{
                  color: "#067647",
                  marginBottom: 12,
                }}
              >
                {bookingSuccess}
              </p>
            )}

            {/* CONFIRM RESERVATION */}
            <button
              type="button"
              className="confirm-reservation-button"
              disabled={!selectedTable || bookingLoading}
              onClick={handleConfirmReservation}
            >
              {bookingLoading
                ? "Confirming..."
                : selectedTable
                  ? "Confirm Reservation"
                  : "Select a Table"}

              <ArrowRight size={18} />
            </button>

            <p className="reservation-note">
              <Check size={14} />
              Your reservation will be saved to your account.
            </p>
          </div>
        </motion.aside>
      </main>

      <Footer />
    </div>
  );
}

export default RestaurantDetails;
