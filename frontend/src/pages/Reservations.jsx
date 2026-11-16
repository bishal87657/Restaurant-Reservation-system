
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Users,
  Utensils,
  XCircle,
  Pencil,
  Save,
  X
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Amendment states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    reservation_date: "",
    reservation_time: "",
    guests: 1,
    table_number: ""
  });
  const [savingId, setSavingId] = useState(null);
  const [editError, setEditError] = useState("");

  // Fetch reservations
  useEffect(() => {
    let ignore = false;

    apiRequest("/reservations/my")
      .then((data) => {
        if (!ignore) setReservations(data);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err.message || "Failed to load reservations. Please log in."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Open the editing form
  const startEditing = (reservation) => {
    setEditingId(reservation.reservation_id);
    setEditError("");

    setEditForm({
      reservation_date: reservation.reservation_date,
      reservation_time: reservation.reservation_time.slice(0, 5),
      guests: reservation.guests,
      table_number: reservation.table_number || ""
    });
  };

  // Update form values
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: name === "guests" ? Number(value) : value
    }));
  };

  // Save reservation amendments
  const handleSaveAmendment = async (id) => {
    if (
      !editForm.reservation_date ||
      !editForm.reservation_time ||
      editForm.guests < 1 ||
      editForm.guests > 20
    ) {
      setEditError("Please enter valid reservation details.");
      return;
    }

    try {
      setSavingId(id);
      setEditError("");

      const updatedReservation = await apiRequest(
        `/reservations/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            reservation_date: editForm.reservation_date,
            reservation_time: editForm.reservation_time,
            guests: editForm.guests,
            table_number: editForm.table_number.trim()
          })
        }
      );

      // Update the reservation displayed on the page
      setReservations((current) =>
        current.map((reservation) =>
          reservation.reservation_id === id
            ? updatedReservation
            : reservation
        )
      );

      setEditingId(null);
    } catch (err) {
      setEditError(
        err.message || "Could not update this reservation."
      );
    } finally {
      setSavingId(null);
    }
  };

  // Cancel reservation
  const handleCancel = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this reservation?"
      )
    ) {
      return;
    }

    try {
      setCancellingId(id);

      await apiRequest(`/reservations/${id}`, {
        method: "DELETE"
      });

      setReservations((current) =>
        current.map((reservation) =>
          reservation.reservation_id === id
            ? { ...reservation, status: "cancelled" }
            : reservation
        )
      );

      if (editingId === id) {
        setEditingId(null);
      }
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

            <Link
              to="/login"
              className="restaurant-button"
              style={{ marginTop: 16 }}
            >
              Sign In to View Bookings
            </Link>
          </div>
        ) : reservations.length === 0 ? (
          <div className="utility-card utility-empty">
            <Utensils size={48} />
            <h2>No Reservations Yet</h2>
            <p>You haven't made any dining reservations yet.</p>

            <Link
              to="/explore"
              className="restaurant-button"
              style={{ marginTop: 16 }}
            >
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="utility-list">
            {reservations.map((item) => {
              const isEditing =
                editingId === item.reservation_id;

              const isCancelled =
                item.status === "cancelled";

              return (
                <div
                  key={item.reservation_id}
                  className="utility-card reservation-row"
                >
                  <div className="utility-card-icon">
                    <CalendarDays size={26} />
                  </div>

                  <div className="utility-card-main">
                    <div className="reservation-title-line">
                      <h2>{item.restaurant_name}</h2>

                      <span
                        className={`status-badge ${
                          isCancelled ? "status-cancelled" : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="reservation-details">
                      <span>
                        <CalendarDays size={15} />
                        {item.reservation_date}
                      </span>

                      <span>
                        <Clock size={15} />
                        {item.reservation_time.slice(0, 5)}
                      </span>

                      <span>
                        <Users size={15} />
                        {item.guests}{" "}
                        {item.guests === 1 ? "Guest" : "Guests"}
                      </span>

                      {item.table_number && (
                        <span>
                          <Utensils size={15} />
                          Table {item.table_number}
                        </span>
                      )}
                    </p>

                    {/* Editing form */}
                    {isEditing && (
                      <div className="reservation-edit-panel">
                        <h3>Edit Reservation</h3>

                        <div className="reservation-edit-grid">
                          <label>
                            Reservation Date
                            <input
                              type="date"
                              name="reservation_date"
                              min={getLocalDateString()}
                              value={editForm.reservation_date}
                              onChange={handleEditChange}
                              required
                            />
                          </label>

                          <label>
                            Reservation Time
                            <input
                              type="time"
                              name="reservation_time"
                              value={editForm.reservation_time}
                              onChange={handleEditChange}
                              required
                            />
                          </label>

                          <label>
                            Number of Guests
                            <input
                              type="number"
                              name="guests"
                              min="1"
                              max="20"
                              value={editForm.guests}
                              onChange={handleEditChange}
                              required
                            />
                          </label>

                          <label>
                            Table Number
                            <input
                              type="text"
                              name="table_number"
                              placeholder="e.g. T4"
                              value={editForm.table_number}
                              onChange={handleEditChange}
                            />
                          </label>
                        </div>

                        {editError && (
                          <p className="reservation-edit-error">
                            {editError}
                          </p>
                        )}

                        <div className="reservation-edit-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleSaveAmendment(item.reservation_id)
                            }
                            disabled={
                              savingId === item.reservation_id
                            }
                          >
                            <Save size={16} />
                            {savingId === item.reservation_id
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            className="reservation-close-button"
                            onClick={() => {
                              setEditingId(null);
                              setEditError("");
                            }}
                            disabled={
                              savingId === item.reservation_id
                            }
                          >
                            <X size={16} />
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit and Cancel buttons */}
                  {!isCancelled && !isEditing && (
                    <div className="reservation-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => startEditing(item)}
                        disabled={
                          Boolean(savingId) ||
                          Boolean(cancellingId)
                        }
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="cancel-button"
                        disabled={
                          cancellingId === item.reservation_id
                        }
                        onClick={() =>
                          handleCancel(item.reservation_id)
                        }
                      >
                        <XCircle size={16} />
                        {cancellingId === item.reservation_id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Reservations;
