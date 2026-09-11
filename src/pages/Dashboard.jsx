import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Star,
  Heart
} from "lucide-react";

import RestaurantCard from "../components/RestaurantCard";
import restaurants from "../data/restaurants";

function Dashboard({ setPage }) {
  return (
    <div className="content">

      <section className="welcome">
        <h1>Welcome back! 👋</h1>
        <p>Good food is just a reservation away.</p>
      </section>

      <section className="stats-grid">

        <div className="stat-card orange">
          <div className="stat-icon">📅</div>

          <div>
            <p>Upcoming Reservation</p>
            <h2>1</h2>
            <span>
              View your next booking
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">🍽️</div>

          <div>
            <p>Past Reservations</p>
            <h2>8</h2>
            <span>
              See your history
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-icon">
            <Heart size={25} />
          </div>

          <div>
            <p>Favorite Restaurants</p>
            <h2>5</h2>
            <span>
              Your saved places
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">🏷️</div>

          <div>
            <p>Available Offers</p>
            <h2>3</h2>
            <span>
              Grab exciting deals
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

      </section>

      <section className="main-grid">

        <div className="reservation-card">

          <div className="card-title">
            <h2>Upcoming Reservation</h2>
            <span className="confirmed">Confirmed</span>
          </div>

          <div className="reservation-body">

            <div className="restaurant-photo">
              🍴
            </div>

            <div className="reservation-details">

              <h2>The Garden Bistro</h2>

              <p className="location">
                <MapPin size={16} />
                Koramangala, Bengaluru
              </p>

              <div className="reservation-info">

                <div>
                  <CalendarDays size={18} />

                  <span>
                    <strong>24 May 2024</strong>
                    Friday
                  </span>
                </div>

                <div>
                  <Clock size={18} />

                  <span>
                    <strong>7:30 PM</strong>
                    Dinner
                  </span>
                </div>

                <div>
                  <Users size={18} />

                  <span>
                    <strong>4 People</strong>
                    Table for 4
                  </span>
                </div>

              </div>

              <button className="details-btn">
                View Details
              </button>

            </div>

          </div>

        </div>

        <div className="offer-card">

          <div>

            <small>SPECIAL FOR YOU</small>

            <h1>Flat 20% Off</h1>

            <p>on your next reservation!</p>

            <div className="promo">
              Use Code: <strong>RESTO20</strong>
            </div>

            <button onClick={() => setPage("restaurants")}>
              Book Now
            </button>

          </div>

          <div className="offer-food">
            🍕
          </div>

        </div>

      </section>

      <section className="bottom-grid">

        <div className="section-card">

          <div className="card-title">
            <h2>Recommended for You</h2>

            <a onClick={() => setPage("restaurants")}>
              View All
            </a>
          </div>

          <div className="restaurants">

            {restaurants.slice(0, 3).map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}

          </div>

        </div>

        <div className="section-card">

          <div className="card-title">
            <h2>Top Cuisines</h2>

            <a onClick={() => setPage("restaurants")}>
              View All
            </a>
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
  );
}

export default Dashboard;