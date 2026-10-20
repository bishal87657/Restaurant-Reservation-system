import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <motion.div
      className="restaurant-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="restaurant-image">

        <img
          src={restaurant.image}
          alt={restaurant.name}
        />

        <button className="favorite-btn">
          <Heart size={19} />
        </button>

        <div className="rating-badge">
          <Star size={14} fill="currentColor" />
          {restaurant.rating}
        </div>

      </div>

      <div className="restaurant-card-content">

        <h3>{restaurant.name}</h3>

        <p className="restaurant-meta">
          {restaurant.cuisine}
        </p>

        <p className="restaurant-location">
          <MapPin size={15} />
          {restaurant.location}
        </p>

        <Link
          to={`/restaurant/${restaurant.id}`}
          className="details-btn"
        >
          View Details
          <ArrowRight size={16} />
        </Link>

      </div>
    </motion.div>
  );
}

export default RestaurantCard;