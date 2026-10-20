import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let ignore = false;
    apiRequest("/favorites/")
      .then((data) => {
        if (!ignore) setFavorites(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load favorites. Please log in.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRemove = async (restaurantId) => {
    try {
      setRemovingId(restaurantId);
      await apiRequest(`/favorites/${restaurantId}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((f) => f.restaurant_id !== restaurantId));
    } catch (err) {
      alert(err.message || "Could not remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="utility-page-shell">
      <Navbar />

      <main className="utility-page">
        <div className="utility-heading">
          <h1>Saved Favorites</h1>
          <p>Quickly access and book your preferred restaurants.</p>
        </div>

        {loading ? (
          <div className="utility-card utility-empty">
            <p>Loading your favorite restaurants...</p>
          </div>
        ) : error ? (
          <div className="utility-card utility-empty">
            <h2>Authentication Required</h2>
            <p className="utility-error">{error}</p>
            <Link to="/login" className="restaurant-button" style={{ marginTop: 16 }}>
              Sign In to View Favorites
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="utility-card utility-empty">
            <Heart size={48} />
            <h2>No Favorites Added Yet</h2>
            <p>Explore restaurants and save your favorites here.</p>
            <Link to="/explore" className="restaurant-button" style={{ marginTop: 16 }}>
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="utility-restaurant-grid">
            {favorites.map((item) => (
              <div key={item.favorite_id} className="utility-restaurant-card">
                <div style={{ padding: 20 }}>
                  <h2>{item.restaurant_name}</h2>
                  <div className="utility-card-actions" style={{ marginTop: 14 }}>
                    <Link
                      to={`/restaurant/${item.restaurant_id}`}
                      className="restaurant-button"
                    >
                      Book Table
                    </Link>
                    <button
                      type="button"
                      className="icon-danger"
                      disabled={removingId === item.restaurant_id}
                      onClick={() => handleRemove(item.restaurant_id)}
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Favorites;