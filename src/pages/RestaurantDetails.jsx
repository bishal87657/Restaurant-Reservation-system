import { useState } from "react";
import { useParams, Link } from "react-router-dom";

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
  Utensils
} from "lucide-react";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TableSelector from "../components/TableSelector";

import restaurants from "../data/restaurants";

function RestaurantDetails() {

  const { id } = useParams();

  const restaurant = restaurants.find(
    (item) => item.id === Number(id)
  );

  const [favorite, setFavorite] = useState(false);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  if (!restaurant) {
    return (
      <>
        <Navbar />

        <div className="restaurant-not-found">
          <h2>Restaurant Not Found</h2>

          <p>
            The restaurant you're looking for does not exist.
          </p>

          <Link to="/explore">
            Back to Restaurants
          </Link>
        </div>

        <Footer />
      </>
    );
  }

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
    setAvailabilityChecked(true);
  };

  const handleGuestChange = (e) => {
    setGuests(Number(e.target.value));
    setSelectedTable(null);
    setAvailabilityChecked(false);
  };

  const handleConfirmReservation = () => {

    if (!selectedTable) {
      alert("Please select an available table.");
      return;
    }

    alert(
      `Reservation confirmed!\n\n` +
      `${restaurant.name}\n` +
      `Table ${selectedTable.id}\n` +
      `${guests} Guests\n` +
      `${date}\n` +
      `${time}`
    );
  };

  return (
    <div className="restaurant-details-page">

      <Navbar />

      {/* ================================
          HERO
      ================================= */}

      <section className="restaurant-detail-hero">

        <img
          src={restaurant.image}
          alt={restaurant.name}
        />

        <div className="restaurant-detail-overlay" />

        <motion.div
          className="restaurant-detail-hero-content"

          initial={{
            opacity: 0,
            y: 35
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            duration: 0.7
          }}
        >

          <Link
            to="/explore"
            className="back-to-explore"
          >
            <ArrowLeft size={17} />
            Back to Explore
          </Link>

          <p>
            {restaurant.cuisine} CUISINE
          </p>

          <h1>
            {restaurant.name}
          </h1>

          <div className="detail-rating">

            <Star
              size={17}
              fill="currentColor"
            />

            <strong>
              {restaurant.rating}
            </strong>

            <span>
              ({restaurant.reviews} reviews)
            </span>

            <span className="hero-divider">
              |
            </span>

            <MapPin size={16} />

            <span>
              {restaurant.location}
            </span>

          </div>

        </motion.div>

      </section>


      {/* ================================
          CONTENT
      ================================= */}

      <main className="restaurant-detail-content">

        <div className="restaurant-detail-main">

          {/* ABOUT */}

          <motion.section
            className="restaurant-info-section"

            initial={{
              opacity: 0,
              y: 25
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: true
            }}
          >

            <div className="detail-heading">

              <div>

                <span>
                  ABOUT THE RESTAURANT
                </span>

                <h2>
                  A memorable dining experience
                </h2>

              </div>

              <button
                className={`detail-favorite ${
                  favorite ? "selected" : ""
                }`}

                onClick={() =>
                  setFavorite(!favorite)
                }
              >

                <Heart
                  size={20}
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                />

              </button>

            </div>

            <p className="detail-description">

              {restaurant.name} offers a carefully
              designed dining experience with delicious{" "}

              {restaurant.cuisine.toLowerCase()} cuisine,
              welcoming ambience and quality service.

              Whether you're planning a casual meal,
              family dinner or special occasion, this
              restaurant is a great choice.

            </p>

            <div className="restaurant-features">

              <div>
                <MapPin size={20} />

                <div>
                  <small>LOCATION</small>

                  <strong>
                    {restaurant.location}
                  </strong>
                </div>
              </div>

              <div>
                <Clock size={20} />

                <div>
                  <small>OPENING HOURS</small>

                  <strong>
                    11:00 AM – 11:00 PM
                  </strong>
                </div>
              </div>

              <div>
                <Star size={20} />

                <div>
                  <small>RATING</small>

                  <strong>
                    {restaurant.rating} / 5
                  </strong>
                </div>
              </div>

            </div>

          </motion.section>


          {/* ================================
              RESERVATION
          ================================= */}

          <motion.section
            className="reservation-section modern-reservation"

            initial={{
              opacity: 0,
              y: 25
            }}

            whileInView={{
              opacity: 1,
              y: 0
            }}

            viewport={{
              once: true
            }}
          >

            <div className="reservation-heading">

              <span>
                MAKE A RESERVATION
              </span>

              <h2>
                Select Date and Time
              </h2>

              <p>
                Choose your date, time, number of guests
                and select a table from the available options.
              </p>

            </div>


            {/* Reservation controls */}

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
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => {
                      setDate(e.target.value);
                      setAvailabilityChecked(false);
                    }}
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
                      setAvailabilityChecked(false);
                    }}
                  >

                    <option value="">
                      Select time
                    </option>

                    <option value="11:00 AM">
                      11:00 AM
                    </option>

                    <option value="12:00 PM">
                      12:00 PM
                    </option>

                    <option value="1:00 PM">
                      1:00 PM
                    </option>

                    <option value="2:00 PM">
                      2:00 PM
                    </option>

                    <option value="7:00 PM">
                      7:00 PM
                    </option>

                    <option value="7:30 PM">
                      7:30 PM
                    </option>

                    <option value="8:00 PM">
                      8:00 PM
                    </option>

                    <option value="9:00 PM">
                      9:00 PM
                    </option>

                    <option value="10:00 PM">
                      10:00 PM
                    </option>

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

                    <option value="1">
                      1 Guest
                    </option>

                    <option value="2">
                      2 Guests
                    </option>

                    <option value="3">
                      3 Guests
                    </option>

                    <option value="4">
                      4 Guests
                    </option>

                    <option value="5">
                      5 Guests
                    </option>

                    <option value="6">
                      6 Guests
                    </option>

                    <option value="7">
                      7 Guests
                    </option>

                    <option value="8">
                      8 Guests
                    </option>

                  </select>

                </div>

              </div>


              {/* CHECK */}

              <button
                type="submit"
                className="check-availability-button"
              >

                Check Availability

                <ArrowRight size={18} />

              </button>

            </form>


            {/* ================================
                TABLE MAP
            ================================= */}

            {availabilityChecked && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                className="availability-area"
              >

                <TableSelector
                  guests={guests}

                  onTableSelect={(table) =>
                    setSelectedTable(table)
                  }
                />

              </motion.div>

            )}

          </motion.section>

        </div>


        {/* ================================
            SIDEBAR
        ================================= */}

        <motion.aside
          className="restaurant-booking-sidebar"

          initial={{
            opacity: 0,
            x: 25
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          transition={{
            duration: 0.6
          }}
        >

          {/* Restaurant card */}

          <div className="sidebar-restaurant-card">

            <img
              src={restaurant.image}
              alt={restaurant.name}
            />

            <div className="sidebar-restaurant-content">

              <span>
                {restaurant.cuisine}
              </span>

              <h3>
                {restaurant.name}
              </h3>

              <div className="sidebar-rating">

                <Star
                  size={15}
                  fill="currentColor"
                />

                {restaurant.rating}

                <small>
                  {restaurant.reviews} reviews
                </small>

              </div>

              <div className="sidebar-location">

                <MapPin size={15} />

                {restaurant.location}

              </div>

              <div className="sidebar-hours">

                <Clock size={15} />

                Open today · 11 AM – 11 PM

              </div>

            </div>

          </div>


          {/* Selected table */}

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

                    <span>
                      {selectedTable.location}
                    </span>
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
                  <strong>
                    {selectedTable.location}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Table Type</span>
                  <strong>
                    {selectedTable.type}
                  </strong>
                </div>

              </>

            ) : (

              <div className="no-table-selected">

                <div>
                  <Utensils size={20} />
                </div>

                <p>
                  Select an available table
                  from the floor plan.
                </p>

              </div>

            )}

          </div>


          {/* Reservation summary */}

          <div className="booking-summary-card">

            <span className="summary-eyebrow">
              YOUR RESERVATION
            </span>

            <div className="reservation-summary">

              <div>
                <CalendarDays size={17} />

                <span>
                  {date || "Select date"}
                </span>
              </div>

              <div>
                <Clock size={17} />

                <span>
                  {time || "Select time"}
                </span>
              </div>

              <div>
                <Users size={17} />

                <span>
                  {guests} Guests
                </span>
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


            <button
              className="confirm-reservation-button"
              disabled={!selectedTable}
              onClick={handleConfirmReservation}
            >

              {selectedTable
                ? "Confirm Reservation"
                : "Select a Table"}

              <ArrowRight size={18} />

            </button>

            <p className="reservation-note">
              <Check size={14} />
              Tables are held for 10 minutes.
            </p>

          </div>

        </motion.aside>

      </main>

      <Footer />

    </div>
  );
}

export default RestaurantDetails;