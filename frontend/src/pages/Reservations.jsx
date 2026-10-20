import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, Users, Utensils, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let ignore = false;
    apiRequest("/reservations/my")
      .then((data) => {
        if (!ignore) setReservations(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load reservations. Please log in.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      setCancellingId(id);
      await apiRequest(`/reservations/${id}`, { method: "DELETE" });
      setReservations((prev) =>
        prev.map((r) => (r.reservation_id === id ? { ...r, status: "cancelled" } : r))
      );
    } catch (err) {
      alert(err.message || "Could not cancel reservation.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="utility-page-shell">
      <Navbar />

      <main className="utility-page">
        <div className="utility-heading">
          <h1>My Reservations</h1>
          <p>View and manage all your table bookings.</p>
        </div>

        {loading ? (
          <div className="utility-card utility-empty">
            <p>Loading your reservations...</p>
          </div>
        ) : error ? (
          <div className="utility-card utility-empty">
            <h2>Authentication Required</h2>
            <p className="utility-error">{error}</p>
            <Link to="/login" className="restaurant-button" style={{ marginTop: 16 }}>
              Sign In to View Bookings
            </Link>
          </div>
        ) : reservations.length === 0 ? (
          <div className="utility-card utility-empty">
            <Utensils size={48} />
            <h2>No Reservations Yet</h2>
            <p>You haven't made any dining reservations yet.</p>
            <Link to="/explore" className="restaurant-button" style={{ marginTop: 16 }}>
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="utility-list">
            {reservations.map((item) => (
              <div key={item.reservation_id} className="utility-card reservation-row">
                <div className="utility-card-icon">
                  <CalendarDays size={26} />
                </div>

                <div className="utility-card-main">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0 }}>{item.restaurant_name}</h2>
                    <span
                      className={`status-badge ${
                        item.status === "cancelled" ? "status-cancelled" : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p style={{ marginTop: 8 }}>
                    <span>
                      <CalendarDays size={15} /> {item.reservation_date}
                    </span>
                    <span>
                      <Clock size={15} /> {item.reservation_time}
                    </span>
                    <span>
                      <Users size={15} /> {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
                    </span>
                    {item.table_number && (
                      <span>
                        <Utensils size={15} /> Table {item.table_number}
                      </span>
                    )}
                  </p>
                </div>

                {item.status !== "cancelled" && (
                  <button
                    type="button"
                    className="cancel-button"
                    disabled={cancellingId === item.reservation_id}
                    onClick={() => handleCancel(item.reservation_id)}
                  >
                    <XCircle size={16} />
                    {cancellingId === item.reservation_id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Reservations;