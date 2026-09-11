import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
  Utensils
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";


const restaurants = [
  {
    id: 1,
    name: "The Spice Room",
    cuisine: "Indian Cuisine",
    location: "Bhubaneswar",
    rating: "4.8",
    image: "/images/restaurants/spice-room.jpg"
  },
  {
    id: 2,
    name: "Skyline Grill",
    cuisine: "Continental",
    location: "Bhubaneswar",
    rating: "4.7",
    image: "/images/restaurants/skyline-grill.jpg"
  },
  {
    id: 3,
    name: "Green Leaf Cafe",
    cuisine: "Cafe & Bakery",
    location: "Bhubaneswar",
    rating: "4.6",
    image: "/images/restaurants/green-leaf-cafe.jpg"
  },
  {
    id: 4,
    name: "Royal Dine",
    cuisine: "Multi-Cuisine",
    location: "Bhubaneswar",
    rating: "4.5",
    image: "/images/restaurants/royal-dine.jpg"
  }
];


function Home() {

  return (
    <div className="home-page">

      <Navbar />

      <main>

        {/* ================= HERO ================= */}

        <section className="hero">

          {/* Animated Background Images */}

          <div className="hero-slides">

            <div className="hero-slide slide-1"></div>

            <div className="hero-slide slide-2"></div>

            <div className="hero-slide slide-3"></div>

          </div>


          <div className="hero-overlay"></div>


          <motion.div
            className="hero-content"

            initial={{
              opacity: 0,
              y: 35
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              duration: 0.9
            }}
          >

            <motion.p
              className="hero-label"

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              transition={{
                delay: 0.2
              }}
            >
              GOOD FOOD • BETTER COMPANY
            </motion.p>


            <h1>
              Find Your
              <br />
              <span>Perfect Table</span>
            </h1>


            <p className="hero-description">
              Discover amazing restaurants, check availability
              and reserve your table in just a few clicks.
            </p>


            <motion.div
              className="hero-search"

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: 0.4
              }}
            >

              <Search size={21} />

              <input
                type="text"
                placeholder="Search restaurant, cuisine or location..."
              />

              <button>
                Search
              </button>

            </motion.div>


            <div className="hero-features">

              <span>
                <Utensils size={16} />
                Great Food
              </span>


              <span>
                <CalendarDays size={16} />
                Easy Booking
              </span>


              <span>
                <Star size={16} />
                Memorable Experiences
              </span>

            </div>

          </motion.div>


          <div className="hero-scroll">

            <span></span>

            Scroll to explore

          </div>

        </section>


        {/* ================= POPULAR RESTAURANTS ================= */}

        <AnimatedSection className="section restaurants-section">

          <div className="section-heading">

            <div>

              <p className="section-label">
                DISCOVER & DINE
              </p>

              <h2>
                Popular Restaurants
              </h2>

            </div>


            <Link
              to="/explore"
              className="view-all"
            >

              View all

              <ArrowRight size={18} />

            </Link>

          </div>


          <p className="section-subtitle">
            Explore some of the most loved restaurants near you.
          </p>


          <div className="restaurant-grid">

            {restaurants.map((restaurant, index) => (

              <motion.div
                className="restaurant-card"
                key={restaurant.id}

                initial={{
                  opacity: 0,
                  y: 30
                }}

                whileInView={{
                  opacity: 1,
                  y: 0
                }}

                viewport={{
                  once: true
                }}

                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}

                whileHover={{
                  y: -8
                }}
              >

                <div className="restaurant-image">

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                  />


                  <div className="restaurant-rating">

                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    {restaurant.rating}

                  </div>

                </div>


                <div className="restaurant-card-body">

                  <h3>
                    {restaurant.name}
                  </h3>


                  <p className="restaurant-cuisine">
                    {restaurant.cuisine}
                  </p>


                  <p className="restaurant-location">

                    <MapPin size={15} />

                    {restaurant.location}

                  </p>


                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    className="restaurant-button"
                  >

                    View Details

                    <ArrowRight size={16} />

                  </Link>

                </div>

              </motion.div>

            ))}

          </div>

        </AnimatedSection>


        {/* ================= HOW IT WORKS ================= */}

        <AnimatedSection className="how-section">

          <div className="section-heading centered">

            <p className="section-label">
              SIMPLE & FAST
            </p>

            <h2>
              How It Works
            </h2>

            <p>
              Reserving your perfect table takes only three simple steps.
            </p>

          </div>


          <div className="steps">

            <Step
              number="01"
              icon={<Search />}
              title="Discover"
              text="Find restaurants based on cuisine, location and availability."
            />


            <Step
              number="02"
              icon={<CalendarDays />}
              title="Choose"
              text="Select your preferred date, time and number of guests."
            />


            <Step
              number="03"
              icon={<ShieldCheck />}
              title="Reserve"
              text="Confirm your reservation and enjoy your dining experience."
            />

          </div>

        </AnimatedSection>


        {/* ================= WHY RRS ================= */}

        <AnimatedSection
          className="section why-section"
          id="about"
        >

          <div className="section-heading centered">

            <p className="section-label">
              WHY RRS
            </p>

            <h2>
              Everything You Need for a Better Dining Experience
            </h2>

            <p>
              We make restaurant reservations simple,
              convenient and reliable.
            </p>

          </div>


          <div className="benefits">

            <Benefit
              icon={<Utensils />}
              title="Wide Restaurant Selection"
              text="Discover a variety of restaurants and cuisines in one place."
            />


            <Benefit
              icon={<CalendarDays />}
              title="Real-Time Availability"
              text="Find available tables and choose a time that works for you."
            />


            <Benefit
              icon={<ShieldCheck />}
              title="Safe & Secure"
              text="Your reservation information is handled securely."
            />


            <Benefit
              icon={<Users />}
              title="Easy Booking Management"
              text="View and manage your reservations whenever you need."
            />

          </div>

        </AnimatedSection>


        {/* ================= STATISTICS ================= */}

        <section className="stats-section">

          <Stat
            number="10K+"
            label="Happy Food Lovers"
          />

          <Stat
            number="500+"
            label="Partner Restaurants"
          />

          <Stat
            number="4.8/5"
            label="Average Rating"
          />

          <Stat
            number="1M+"
            label="Tables Reserved"
          />

        </section>


        {/* ================= TESTIMONIALS ================= */}

        <AnimatedSection className="section testimonials-section">

          <div className="section-heading centered">

            <p className="section-label">
              CUSTOMER STORIES
            </p>

            <h2>
              What Our Users Say
            </h2>

            <p>
              Real experiences from real food lovers.
            </p>

          </div>


          <div className="testimonials">

            <Testimonial
              text="Absolutely love this platform! Booking a table has never been easier."
              name="Rahul S."
            />


            <Testimonial
              text="Great selection of restaurants and a smooth booking experience."
              name="Priya M."
            />


            <Testimonial
              text="A must-have for anyone who loves dining out!"
              name="Aditya K."
            />

          </div>

        </AnimatedSection>


        {/* ================= CTA ================= */}

        <section className="cta-section">

          <div className="cta-content">

            <p className="section-label">
              YOUR NEXT MEAL AWAITS
            </p>


            <h2>
              Ready to Reserve Your Table?
            </h2>


            <p>
              Join thousands of food lovers and make your next
              dining experience special.
            </p>


            <div className="cta-buttons">

              <Link
                to="/signup"
                className="cta-primary"
              >

                Get Started

                <ArrowRight size={18} />

              </Link>


              <Link
                to="/explore"
                className="cta-secondary"
              >

                Explore Restaurants

              </Link>

            </div>

          </div>

        </section>

      </main>


      <Footer />

    </div>
  );
}


/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  icon,
  title,
  text
}) {

  return (

    <motion.div
      className="step"

      whileHover={{
        y: -7
      }}
    >

      <div className="step-number">
        {number}
      </div>


      <div className="step-icon">
        {icon}
      </div>


      <h3>
        {title}
      </h3>


      <p>
        {text}
      </p>

    </motion.div>
  );
}


/* =========================================================
   BENEFIT COMPONENT
========================================================= */

function Benefit({
  icon,
  title,
  text
}) {

  return (

    <motion.div
      className="benefit"

      whileHover={{
        y: -5
      }}
    >

      <div className="benefit-icon">
        {icon}
      </div>


      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </motion.div>
  );
}


/* =========================================================
   STAT COMPONENT
========================================================= */

function Stat({
  number,
  label
}) {

  return (

    <motion.div
      className="stat"

      whileHover={{
        scale: 1.05
      }}
    >

      <h2>
        {number}
      </h2>

      <p>
        {label}
      </p>

    </motion.div>
  );
}


/* =========================================================
   TESTIMONIAL COMPONENT
========================================================= */

function Testimonial({
  text,
  name
}) {

  return (

    <motion.div
      className="testimonial"

      whileHover={{
        y: -6
      }}
    >

      <div className="testimonial-stars">
        ★★★★★
      </div>


      <p>
        "{text}"
      </p>


      <strong>
        — {name}
      </strong>

    </motion.div>
  );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default Home;