
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";

function Explore() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Bhubaneswar");
  const [cuisine, setCuisine] = useState("All");

  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch restaurants whenever filters change
  useEffect(() => {
    let cancelled = false;

    const fetchRestaurants = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          location: city,
          search: search,
          category: cuisine === "All" ? "" : cuisine,
          limit: "200",
        });

        const data = await apiRequest(
          `/restaurants/?${params.toString()}`
        );

        if (!cancelled) {
          setRestaurants(data.restaurants || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load restaurants.");
          setRestaurants([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchRestaurants, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [city, search, cuisine]);

  // Fetch the logged-in user's saved favourites
  useEffect(() => {
    let cancelled = false;

    async function fetchFavorites() {
      try {
        const data = await apiRequest("/favorites/");

        if (!cancelled) {
          setFavorites(data.map((item) => item.restaurant_id));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Could not load favourites:", err);
        }
      }
    }

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  // Get available cuisine/category names
  const cuisines = [
    "All",
    ...new Set(
      restaurants
        .map((restaurant) => restaurant.cuisine)
        .filter(Boolean)
    ),
  ];

  // Add or remove a restaurant from favourites
  const toggleFavorite = async (restaurant) => {
    const id = restaurant.id;

    if (favoriteLoading.includes(id)) return;

    setFavoriteLoading((current) => [...current, id]);

    try {
      if (favorites.includes(id)) {
        await apiRequest(`/favorites/${id}`, {
          method: "DELETE",
        });

        setFavorites((current) =>
          current.filter((item) => item !== id)
        );
      } else {
        await apiRequest("/favorites/", {
          method: "POST",
          body: JSON.stringify({
            restaurant_id: id,
            restaurant_name: restaurant.name,
          }),
        });

        setFavorites((current) => [...current, id]);
      }
    } catch (err) {
      alert(err.message || "Could not update favourites.");
    } finally {
      setFavoriteLoading((current) =>
        current.filter((item) => item !== id)
      );
    }
  };

  return (
    <div className="explore-page">
      <Navbar />

      {/* Page Header */}
      <section className="explore-header">
        <motion.div
          className="explore-header-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p>DISCOVER • DINE • ENJOY</p>
          <h1>Explore Restaurants</h1>
          <span>
            Find the perfect place for your next dining experience.
          </span>
        </motion.div>
      </section>

      {/* Search & Filters */}
      <section className="explore-controls">
        <div className="explore-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search restaurant, cuisine or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* City Selector */}
        <div className="city-filter">
          <MapPin size={18} />

          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCuisine("All");
            }}
          >
            <option value="Bhubaneswar">Bhubaneswar</option>
            <option value="Cuttack">Cuttack</option>
            <option value="Puri">Puri</option>
            <option value="All">All Cities</option>
          </select>
        </div>

        {/* Cuisine Filters */}
        <div className="cuisine-filters">
          {cuisines.map((item) => (
            <button
              key={item}
              className={cuisine === item ? "active" : ""}
              onClick={() => setCuisine(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Results */}
      <section className="explore-restaurants">
        <div className="explore-title">
          <div>
            <p>OUR COLLECTION</p>
            <h2>
              {loading ? "Loading..." : `${restaurants.length} Restaurants`}
            </h2>
          </div>

          <span>
            {city === "All" ? "All Cities" : city}
          </span>
        </div>

        {loading ? (
          <div className="no-results">
            <p>Finding restaurants for you...</p>
          </div>
        ) : error ? (
          <div className="no-results">
            <h3>Could not load restaurants</h3>
            <p>{error}</p>
            <p>Check that your FastAPI backend is running.</p>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="explore-grid">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="explore-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.03, 0.3),
                }}
                whileHover={{ y: -8 }}
              >
                {/* Image */}
                <div className="explore-card-image">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="restaurant-image-placeholder">
                      <MapPin size={32} />
                    </div>
                  )}

                  {/* Favourite Button */}
                  <button
                    type="button"
                    className="explore-favorite"
                    disabled={favoriteLoading.includes(restaurant.id)}
                    onClick={() => toggleFavorite(restaurant)}
                    aria-label={
                      favorites.includes(restaurant.id)
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                  >
                    <Heart
                      size={19}
                      fill={
                        favorites.includes(restaurant.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <div className="explore-rating">
                    <Star size={14} fill="currentColor" />
                    {restaurant.rating != null
                      ? Number(restaurant.rating).toFixed(1)
                      : "New"}
                  </div>
                </div>

                {/* Content */}
                <div className="explore-card-content">
                  <p className="explore-cuisine">
                    {restaurant.cuisine || "Restaurant"}
                  </p>

                  <h3>{restaurant.name}</h3>

                  <div className="explore-location">
                    <MapPin size={15} />
                    {restaurant.location ||
                      restaurant.city ||
                      "Location unavailable"}
                  </div>

                  <div className="explore-card-bottom">
                    <span>
                      {restaurant.reviews != null
                        ? `${restaurant.reviews} reviews`
                        : "No reviews"}
                    </span>

                    <Link to={`/restaurant/${restaurant.id}`}>
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <Search size={40} />
            <h3>No restaurants found</h3>
            <p>
              Try another restaurant, cuisine or location.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Explore;
