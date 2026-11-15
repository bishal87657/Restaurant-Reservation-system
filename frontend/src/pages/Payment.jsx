
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
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

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="payment-page">
          <h2>Booking details not found</h2>
          <p>Please select your restaurant and table again.</p>
          <button onClick={() => navigate("/explore")}>
            Explore Restaurants
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Demo payment simulation only.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Save reservation after simulated payment succeeds.
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

      navigate("/payment-success", {
        state: {
          booking,
          reservationId: result.reservation_id,
          paymentMethod: method,
        },
      });
    } catch (err) {
      setError(err.message || "Payment or reservation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-wrapper">
      <Navbar />

      <main className="payment-page">
        <button
          className="payment-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="payment-heading">
          <span>SECURE CHECKOUT</span>
          <h1>Complete Your Booking</h1>
          <p>Review your reservation and select a demo payment method.</p>
        </div>

        <div className="payment-layout">
          <section className="payment-method-card">
            <h2>Choose Payment Method</h2>

            <button
              type="button"
              className={`payment-method ${method === "upi" ? "active" : ""}`}
              onClick={() => setMethod("upi")}
            >
              <Smartphone />
              <span>
                <strong>UPI Demo</strong>
                <small>Simulated UPI payment</small>
              </span>
              <input type="radio" checked={method === "upi"} readOnly />
            </button>

            <button
              type="button"
              className={`payment-method ${method === "card" ? "active" : ""}`}
              onClick={() => setMethod("card")}
            >
              <CreditCard />
              <span>
                <strong>Card Demo</strong>
                <small>Simulated card payment</small>
              </span>
              <input type="radio" checked={method === "card"} readOnly />
            </button>

            <button
              type="button"
              className={`payment-method ${method === "restaurant" ? "active" : ""}`}
              onClick={() => setMethod("restaurant")}
            >
              <Banknote />
              <span>
                <strong>Pay at Restaurant</strong>
                <small>Payment at the restaurant counter</small>
              </span>
              <input
                type="radio"
                checked={method === "restaurant"}
                readOnly
              />
            </button>

            <div className="demo-payment-notice">
              <ShieldCheck size={19} />
              <p>
                This is a demonstration checkout. No real payment is
                processed. Never enter actual banking credentials.
              </p>
            </div>

            {error && (
              <p role="alert" className="payment-error">
                {error}
              </p>
            )}

            <button
              className="pay-now-button"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Demo Payment"}
            </button>
          </section>

          <aside className="payment-summary-card">
            <h2>Reservation Summary</h2>

            <div className="payment-summary-row">
              <span>Restaurant</span>
              <strong>{booking.restaurantName}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Date</span>
              <strong>{booking.date}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Time</span>
              <strong>{booking.time}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Guests</span>
              <strong>{booking.guests}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Table</span>
              <strong>{booking.table.id}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Table Type</span>
              <strong>{booking.table.type}</strong>
            </div>

            <div className="payment-summary-row">
              <span>Location</span>
              <strong>{booking.table.location}</strong>
            </div>

            <div className="payment-total">
              <span>Payment Type</span>
              <strong>Demo / No charge</strong>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Payment;
