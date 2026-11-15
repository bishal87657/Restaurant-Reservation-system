import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  CalendarDays,
  Users,
  Utensils,
  Clock,
  MapPin,
  Lock,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cancel booking and return to restaurant details
  const handleCancelBooking = () => {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (confirmed) {
      if (booking?.restaurantId) {
        navigate(`/restaurant/${booking.restaurantId}`);
      } else {
        navigate("/explore");
      }
    }
  };

  // Handle demo payment
  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // Simulate demo payment processing
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      // Save reservation in backend
      const result = await apiRequest("/reservations/", {
        method: "POST",

        body: JSON.stringify({
          restaurant_id: booking.restaurantId,
          restaurant_name: booking.restaurantName,
          reservation_date: booking.date,
          reservation_time: booking.time,
          guests: Number(booking.guests),
          table_number: String(booking.table.id),
        }),
      });

      // Navigate to success page
      navigate("/payment-success", {
        state: {
          booking,
          reservationId: result.reservation_id,
          paymentMethod: method,
        },
      });

    } catch (err) {
      console.error("Payment error:", err);

      setError(
        err.message ||
        "Payment or reservation failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // Booking not available
  if (!booking || !booking.table) {
    return (
      <div className="payment-page-wrapper">
        <Navbar />

        <main className="payment-page payment-empty">

          <div className="payment-empty-icon">
            <CalendarDays size={40} />
          </div>

          <h2>Booking Details Not Found</h2>

          <p>
            Please select your restaurant, date, time
            and table before proceeding to payment.
          </p>

          <button
            className="payment-primary-button"
            onClick={() => navigate("/explore")}
          >
            Explore Restaurants
          </button>

        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page-wrapper">

      <Navbar />

      <main className="payment-page">

        {/* BACK BUTTON */}
        <button
          type="button"
          className="payment-back-button"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Back to Reservation
        </button>

        {/* PAGE HEADING */}
        <div className="payment-heading">

          <span>SECURE CHECKOUT</span>

          <h1>Complete Your Booking</h1>

          <p>
            You're just one step away from enjoying
            a wonderful dining experience.
          </p>

          <div className="payment-security-badge">
            <Lock size={14} />
            Secure Demo Checkout
          </div>

        </div>

        {/* PAYMENT LAYOUT */}
        <div className="payment-layout">

          {/* LEFT: PAYMENT METHODS */}
          <section className="payment-method-card">

            <div className="payment-section-heading">

              <div>
                <span>PAYMENT</span>
                <h2>Choose Payment Method</h2>
              </div>

              <div className="payment-step">
                STEP 02 / 02
              </div>

            </div>

            {/* UPI */}
            <button
              type="button"
              className={`payment-method ${
                method === "upi" ? "active" : ""
              }`}
              onClick={() => setMethod("upi")}
              disabled={loading}
              aria-pressed={method === "upi"}
            >

              <div className="payment-method-icon upi-icon">
                <Smartphone size={24} />
              </div>

              <span className="payment-method-info">

                <strong>UPI Payment</strong>

                <small>
                  Google Pay, PhonePe, Paytm (Demo)
                </small>

              </span>

              <input
                type="radio"
                checked={method === "upi"}
                readOnly
                aria-label="UPI payment selected"
              />

            </button>

            {/* CARD */}
            <button
              type="button"
              className={`payment-method ${
                method === "card" ? "active" : ""
              }`}
              onClick={() => setMethod("card")}
              disabled={loading}
              aria-pressed={method === "card"}
            >

              <div className="payment-method-icon card-icon">
                <CreditCard size={24} />
              </div>

              <span className="payment-method-info">

                <strong>Credit / Debit Card</strong>

                <small>
                  Visa, Mastercard and RuPay (Demo)
                </small>

              </span>

              <input
                type="radio"
                checked={method === "card"}
                readOnly
                aria-label="Card payment selected"
              />

            </button>

            {/* PAY AT RESTAURANT */}
            <button
              type="button"
              className={`payment-method ${
                method === "restaurant" ? "active" : ""
              }`}
              onClick={() => setMethod("restaurant")}
              disabled={loading}
              aria-pressed={method === "restaurant"}
            >

              <div className="payment-method-icon cash-icon">
                <Banknote size={24} />
              </div>

              <span className="payment-method-info">

                <strong>Pay at Restaurant</strong>

                <small>
                  Pay directly at the restaurant counter
                </small>

              </span>

              <input
                type="radio"
                checked={method === "restaurant"}
                readOnly
                aria-label="Pay at restaurant selected"
              />

            </button>

            {/* PAYMENT NOTICE */}
            <div className="demo-payment-notice">

              <ShieldCheck size={22} />

              <div>

                <strong>Demo Payment Environment</strong>

                <p>
                  This is a simulated payment system.
                  No actual transaction will take place
                  and no money will be charged.
                </p>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div
                className="payment-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* BUTTONS */}
            <div className="payment-actions">

              <button
                type="button"
                className="pay-now-button"
                onClick={handlePayment}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="payment-spinner" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle size={19} />
                    Confirm & Pay
                  </>
                )}

              </button>

              <button
                type="button"
                className="cancel-booking-button"
                onClick={handleCancelBooking}
                disabled={loading}
              >
                <ArrowLeft size={17} />
                Cancel Booking
              </button>

            </div>

            <div className="payment-footer-note">
              <Lock size={13} />
              Your booking details are handled securely.
            </div>

          </section>

          {/* RIGHT: RESERVATION SUMMARY */}
          <aside className="payment-summary-card">

            <div className="summary-card-heading">

              <span>YOUR BOOKING</span>

              <h2>Reservation Summary</h2>

            </div>

            {/* RESTAURANT */}
            <div className="payment-restaurant-info">

              <div className="payment-restaurant-icon">
                <Utensils size={25} />
              </div>

              <div>

                <h3>{booking.restaurantName}</h3>

                <span>
                  Restaurant Reservation
                </span>

              </div>

            </div>

            <div className="payment-summary-divider" />

            {/* BOOKING DETAILS */}
            <div className="payment-summary-row">

              <div>
                <CalendarDays size={17} />
                <span>Date</span>
              </div>

              <strong>{booking.date}</strong>

            </div>

            <div className="payment-summary-row">

              <div>
                <Clock size={17} />
                <span>Time</span>
              </div>

              <strong>{booking.time}</strong>

            </div>

            <div className="payment-summary-row">

              <div>
                <Users size={17} />
                <span>Guests</span>
              </div>

              <strong>{booking.guests}</strong>

            </div>

            <div className="payment-summary-row">

              <div>
                <Utensils size={17} />
                <span>Table</span>
              </div>

              <strong>{booking.table.id}</strong>

            </div>

            <div className="payment-summary-row">

              <div>
                <MapPin size={17} />
                <span>Table Location</span>
              </div>

              <strong>
                {booking.table.location || "Restaurant"}
              </strong>

            </div>

            <div className="payment-summary-row">

              <div>
                <CheckCircle size={17} />
                <span>Table Type</span>
              </div>

              <strong>
                {booking.table.type || "Standard"}
              </strong>

            </div>

            <div className="payment-summary-divider" />

            {/* TOTAL */}
            <div className="payment-total">

              <div>
                <span>Payment Amount</span>
                <small>Demo reservation</small>
              </div>

              <strong>₹0.00</strong>

            </div>

            <div className="payment-summary-bottom">

              <ShieldCheck size={19} />

              <p>
                No real payment required.
                This booking is for demonstration purposes.
              </p>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Payment;