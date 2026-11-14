
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Users,
  ChevronRight,
  Heart
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { apiRequest } from "../api";

// Format date as 14 November 2026
function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Format time as 7:30 PM
function formatTime(timeString) {
  if (!timeString) return "Time unavailable";

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

// Get weekday from reservation date
function getWeekday(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "long"
  });
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        const [
          reservationResult,
          favoriteResult,
          restaurantResult
        ] = await Promise.allSettled([
          apiRequest("/reservations/my"),
          apiRequest("/favorites/"),
          apiRequest("/restaurants/?location=Bhubaneswar&limit=4")
        ]);

        if (!isMounted) return;

        // Reservations
        if (reservationResult.status === "fulfilled") {
          setReservations(reservationResult.value);
        } else {
          setError("Could not load your reservations.");
          console.error(
            "Reservation fetch error:",
            reservationResult.reason
          );
        }

        // Favorite count
        if (favoriteResult.status === "fulfilled") {
          setFavoriteCount(favoriteResult.value.length);
        } else {
          console.error(
            "Favorites fetch error:",
            favoriteResult.reason
          );
        }

        // Recommended restaurants
        if (restaurantResult.status === "fulfilled") {
          setRecommendedRestaurants(restaurantResult.value.restaurants);
        } else {
          console.error(
            "Restaurant fetch error:",
            restaurantResult.reason
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate reservation statistics
  const today = getTodayDate();

  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.status.toLowerCase() !== "cancelled"
  );

  const upcomingReservations = activeReservations
    .filter(
      (reservation) => reservation.reservation_date >= today
    )
    .sort((a, b) => {
      const dateComparison = a.reservation_date.localeCompare(
        b.reservation_date
      );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return a.reservation_time.localeCompare(b.reservation_time);
    });

  const pastReservations = activeReservations.filter(
    (reservation) => reservation.reservation_date < today
  );

  const nextReservation = upcomingReservations[0];

  return (
    <div className="dashboard-page-shell">
      <Navbar />

      <div className="content">
        <section className="welcome">
          <h1>Welcome back! 👋</h1>
          <p>Good food is just a reservation away.</p>
        </section>

        {/* Dashboard Statistics */}
        <section className="stats-grid">
          <Link
            to="/reservations"
            className="stat-card orange"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-icon">📅</div>
            <div>
              <p>Upcoming Reservation</p>
              <h2>
                {loading ? "..." : upcomingReservations.length}
              </h2>
              <span>
                View your next booking
                <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          <Link
            to="/reservations"
            className="stat-card green"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-icon">🍽️</div>
            <div>
              <p>Past Reservations</p>
              <h2>
                {loading ? "..." : pastReservations.length}
              </h2>
              <span>
                See your history
                <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="stat-card yellow"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-icon">
              <Heart size={25} />
            </div>
            <div>
              <p>Favorite Restaurants</p>
              <h2>
                {loading ? "..." : favoriteCount}
              </h2>
              <span>
                Your saved places
                <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          <Link
            to="/explore"
            className="stat-card red"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="stat-icon">🏷️</div>
            <div>
              <p>Available Offers</p>
              <h2>3</h2>
              <span>
                Grab exciting deals
                <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        </section>

        {/* Main Dashboard Content */}
        <section className="main-grid">

          {/* Upcoming Reservation */}
          <div className="reservation-card">
            <div className="card-title">
              <h2>Upcoming Reservation</h2>

              {nextReservation && (
                <span className="confirmed">
                  {nextReservation.status}
                </span>
              )}
            </div>

            {loading ? (
              <p>Loading your reservations...</p>
            ) : error ? (
              <p>{error}</p>
            ) : nextReservation ? (
              <div className="reservation-body">
                <div className="restaurant-photo">🍴</div>

                <div className="reservation-details">
                  <h2>{nextReservation.restaurant_name}</h2>

                  <div className="reservation-info">
                    <div>
                      <CalendarDays size={18} />
                      <span>
                        <strong>
                          {formatDate(nextReservation.reservation_date)}
                        </strong>
                        {getWeekday(nextReservation.reservation_date)}
                      </span>
                    </div>

                    <div>
                      <Clock size={18} />
                      <span>
                        <strong>
                          {formatTime(nextReservation.reservation_time)}
                        </strong>
                        Reservation time
                      </span>
                    </div>

                    <div>
                      <Users size={18} />
                      <span>
                        <strong>
                          {nextReservation.guests} People
                        </strong>
                        Table{" "}
                        {nextReservation.table_number || "Not assigned"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="details-btn"
                    onClick={() => navigate("/reservations")}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="reservation-empty">
                <p>You don't have any upcoming reservations.</p>

                <button
                  type="button"
                  className="details-btn"
                  onClick={() => navigate("/explore")}
                >
                  Book a Table
                </button>
              </div>
            )}
          </div>

          {/* Offers Card */}
          <div className="offer-card">
            <div>
              <small>SPECIAL FOR YOU</small>
              <h1>Flat 20% Off</h1>
              <p>on your next reservation!</p>

              <div className="promo">
                Use Code: <strong>RESTO20</strong>
              </div>

              <button
                type="button"
                onClick={() => navigate("/explore")}
              >
                Book Now
              </button>
            </div>

            <div className="offer-food">🍕</div>
          </div>
        </section>

        {/* Recommendations and Cuisines */}
        <section className="bottom-grid">
          <div className="section-card">
            <div className="card-title">
              <h2>Recommended for You</h2>

              <Link
                to="/explore"
                style={{
                  cursor: "pointer",
                  color: "#526447",
                  fontWeight: 600
                }}
              >
                View All
              </Link>
            </div>

            <div className="restaurants">
              {recommendedRestaurants.length > 0 ? (
                recommendedRestaurants.slice(0, 3).map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))
              ) : (
                <p>No recommended restaurants available right now.</p>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="card-title">
              <h2>Top Cuisines</h2>

              <Link
                to="/explore"
                style={{
                  cursor: "pointer",
                  color: "#526447",
                  fontWeight: 600
                }}
              >
                View All
              </Link>
            </div>

            <div className="cuisines">
              <div>
                <span>🍕</span>
                <p>Italian</p>
              </div>

              <div>
                <span>🍛</span>
                <p>Indian</p>
              </div>

              <div>
                <span>🍜</span>
                <p>Chinese</p>
              </div>

              <div>
                <span>🌮</span>
                <p>Mexican</p>
              </div>

              <div>
                <span>🍣</span>
                <p>Japanese</p>
              </div>

              <div>
                <span>🍲</span>
                <p>Thai</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>How It Works</h2>

          <div className="steps">
            <div className="step">
              <span>🍽️</span>
              <div>
                <strong>1. Choose Restaurant</strong>
                <p>Find your favorite restaurant</p>
              </div>
            </div>

            <ChevronRight />

            <div className="step">
              <span>📅</span>
              <div>
                <strong>2. Select Date & Time</strong>
                <p>Pick your preferred date and time</p>
              </div>
            </div>

            <ChevronRight />

            <div className="step">
              <span>✓</span>
              <div>
                <strong>3. Confirm Reservation</strong>
                <p>Book your table in seconds</p>
              </div>
            </div>

            <ChevronRight />

            <div className="step">
              <span>😊</span>
              <div>
                <strong>4. Enjoy Your Meal</strong>
                <p>Have a great dining experience!</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
