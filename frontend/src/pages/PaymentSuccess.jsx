
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, CalendarDays, Users, Utensils } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.booking) {
    return (
      <>
        <Navbar />
        <main className="payment-success-page">
          <h2>Booking information unavailable</h2>
          <button onClick={() => navigate("/explore")}>
            Explore Restaurants
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const { booking, reservationId, paymentMethod } = state;

  return (
    <>
      <Navbar />

      <main className="payment-success-page">
        <div className="success-icon">
          <CheckCircle size={65} />
        </div>

        <span>BOOKING CONFIRMED</span>
        <h1>Payment Demo Successful!</h1>

        <p>
          Your reservation has been saved successfully.
          This was a simulated payment; no money was charged.
        </p>

        <div className="success-booking-card">
          <h2>{booking.restaurantName}</h2>

          <div>
            <CalendarDays />
            <span>{booking.date} at {booking.time}</span>
          </div>

          <div>
            <Users />
            <span>{booking.guests} Guests</span>
          </div>

          <div>
            <Utensils />
            <span>Table {booking.table.id}</span>
          </div>

          <hr />

          <p>
            <strong>Reservation ID:</strong> {reservationId}
          </p>

          <p>
            <strong>Payment Method:</strong> {paymentMethod}
          </p>

          <p>
            <strong>Payment Status:</strong> Demo successful
          </p>
        </div>

        <button
          className="success-dashboard-button"
          onClick={() => navigate("/reservations")}
        >
          View My Reservations
        </button>

        <button
          className="success-home-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </main>

      <Footer />
    </>
  );
}

export default PaymentSuccess;
