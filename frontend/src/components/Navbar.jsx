import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [logoutError, setLogoutError] = useState("");

  const navigate = useNavigate();

  // Check whether a user has an active backend session.
  useEffect(() => {
    let cancelled = false;

    async function checkLogin() {
      try {
        const response = await fetch(
          "http://localhost:8000/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!cancelled) {
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Unable to check login status:", error);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    checkLogin();

    return () => {
      cancelled = true;
    };
  }, []);

  // End the backend session.
  const handleLogout = async () => {
    setLogoutError("");

    try {
      const response = await fetch(
        "http://localhost:8000/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setLogoutError("Unable to log out. Please try again.");
        return;
      }

      setUser(null);
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError("Unable to connect to the server.");
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
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
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="nav-search"
            aria-label="Search"
            onClick={() => navigate("/explore")}
          >
            <Search size={20} />
          </button>

          {!checkingAuth && (
            user ? (
              <>
                <Link to="/dashboard" className="login-btn">
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="signup-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Login
                </Link>

                <Link to="/signup" className="signup-btn">
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/explore" onClick={closeMenu}>Explore</Link>
          <a href="/#about" onClick={closeMenu}>About</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>

          {!checkingAuth && (
            user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Login</Link>
                <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
              </>
            )
          )}
        </div>
      )}

      {logoutError && (
        <p className="auth-error" role="alert">
          {logoutError}
        </p>
      )}
    </nav>
  );
}

export default Navbar;