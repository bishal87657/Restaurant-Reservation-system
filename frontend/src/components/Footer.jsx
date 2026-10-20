import { Link } from "react-router-dom";
import { Utensils } from "lucide-react";

function Footer() {
  return (
    <footer className="footer" id="contact">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <div className="footer-logo">
            <Utensils size={30} />

            <div>
              <h2>Restora</h2>
              <p>Dine. Reserve. Repeat.</p>
            </div>
          </div>

          <p className="footer-description">
            Discover amazing restaurants, reserve your perfect table,
            and create memorable dining experiences.
          </p>

        </div>


        {/* Quick Links */}
        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/explore">
            Explore Restaurants
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Sign Up
          </Link>

        </div>


        {/* Support */}
        <div className="footer-links">

          <h3>Support</h3>

          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>

        </div>


        {/* Social Media */}
        <div className="footer-social">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="#" aria-label="Facebook">
              <span className="social-text facebook-text">
                f
              </span>
            </a>

            <a href="#" aria-label="Instagram">
              <span className="social-text">
                ◎
              </span>
            </a>

            <a href="#" aria-label="Twitter">
              <span className="social-text">
                𝕏
              </span>
            </a>

            <a href="#" aria-label="YouTube">
              <span className="social-text youtube-text">
                ▶
              </span>
            </a>

          </div>

        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © 2026 Restaurant Reservation System.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;