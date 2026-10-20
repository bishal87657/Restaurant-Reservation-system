import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">🍴</div>

          <div>
            <h2>Restora</h2>
            <span>Dine. Reserve. Repeat.</span>
          </div>
        </Link>


        {/* Desktop Navigation */}
        <div className="nav-links">

          <Link to="/">Home</Link>

          <Link to="/explore">Explore</Link>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

        </div>


        {/* Desktop Actions */}
        <div className="nav-actions">

          <button className="nav-search">
            <Search size={20} />
          </button>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>

        </div>


        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

      </div>


      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/explore"
            onClick={() => setMenuOpen(false)}
          >
            Explore
          </Link>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>

        </div>
      )}

    </nav>
  );
}

export default Navbar;