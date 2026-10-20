import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import restaurants from "../data/restaurants";

function Explore() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine))];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(search.toLowerCase());

    const matchesCuisine =
      cuisine === "All" || restaurant.cuisine === cuisine;

    return matchesSearch && matchesCuisine;
  });

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
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

          <h1>
            Explore Restaurants
          </h1>

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
              {filteredRestaurants.length} Restaurants
            </h2>
          </div>

          <span>
            Bhubaneswar
          </span>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="explore-grid">

            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="explore-card"
                initial={{
                  opacity: 0,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08
                }}
                whileHover={{
                  y: -8
                }}
              >

                {/* Image */}
                <div className="explore-card-image">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                  />

                  <button
                    className="explore-favorite"
                    onClick={() =>
                      toggleFavorite(restaurant.id)
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
                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    {restaurant.rating}
                  </div>

                </div>

                {/* Content */}
                <div className="explore-card-content">

                  <p className="explore-cuisine">
                    {restaurant.cuisine}
                  </p>

                  <h3>
                    {restaurant.name}
                  </h3>

                  <div className="explore-location">
                    <MapPin size={15} />
                    {restaurant.location}
                  </div>

                  <div className="explore-card-bottom">

                    <span>
                      {restaurant.reviews} reviews
                    </span>

                    <Link
                      to={`/restaurant/${restaurant.id}`}
                    >
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

            <h3>
              No restaurants found
            </h3>

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