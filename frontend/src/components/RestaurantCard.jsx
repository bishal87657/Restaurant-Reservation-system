
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

function RestaurantCard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  // Fetch the user's saved favourites
  useEffect(() => {
    let isMounted = true;

    async function fetchFavoriteStatus() {
      try {
        const favorites = await apiRequest("/favorites/");

        if (isMounted) {
          const alreadyFavorite = favorites.some(
            (item) => item.restaurant_id === restaurant.id
          );

          setIsFavorite(alreadyFavorite);
        }
      } catch (error) {
        console.error("Could not load favorite status:", error);
      }
    }

    fetchFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [restaurant.id]);

  // Add or remove restaurant from favourites
  const toggleFavorite = async () => {
    if (loading) return;

    setLoading(true);
    setFavoriteError("");

    try {
      if (isFavorite) {
        await apiRequest(`/favorites/${restaurant.id}`, {
          method: "DELETE"
        });

        setIsFavorite(false);
      } else {
        await apiRequest("/favorites/", {
          method: "POST",
          body: JSON.stringify({
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name
          })
        });

        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Favorite update failed:", error);
      setFavoriteError(error.message || "Could not update favourite.");
      alert(error.message || "Could not update favourite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="restaurant-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="restaurant-image">
        <img src={restaurant.image} alt={restaurant.name} />

        <button
          type="button"
          className="favorite-btn"
          onClick={toggleFavorite}
          disabled={loading}
          aria-label={
            isFavorite
              ? "Remove from favourites"
              : "Add to favourites"
          }
          title={
            favoriteError ||
            (isFavorite ? "Remove from favourites" : "Add to favourites")
          }
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
            color={isFavorite ? "#e63946" : "currentColor"}
          />
        </button>

        <div className="rating-badge">
          <Star size={14} fill="currentColor" />
          {restaurant.rating ?? "N/A"}
        </div>
      </div>

      <div className="restaurant-card-content">
        <h3>{restaurant.name}</h3>

        <p className="restaurant-meta">{restaurant.cuisine}</p>

        <p className="restaurant-location">
          <MapPin size={15} />
          {restaurant.location}
        </p>

        <Link
          to={`/restaurant/${restaurant.id}`}
          className="details-btn"
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

export default RestaurantCard;
