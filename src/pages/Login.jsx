import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Utensils,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Basic frontend validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Send login request to FastAPI
      const response = await fetch(
        "http://localhost:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          // Allows the browser to receive/store the session cookie
          credentials: "include",
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(data.detail || "Login failed.");
        return;
      }

      // Login successful
      navigate("/dashboard");

    } catch (error) {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Left Visual */}
      <div className="auth-visual">

        <div className="auth-visual-overlay" />

        <Link to="/" className="auth-back">
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <motion.div
          className="auth-visual-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Utensils size={38} />

          <h1>
            Good food.
            <br />
            Great moments.
          </h1>

          <p>
            Discover amazing restaurants and reserve
            your perfect table with RRS.
          </p>
        </motion.div>

      </div>


      {/* Login */}
      <div className="auth-form-area">

        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* Logo */}
          <Link to="/" className="auth-logo">

            <div className="auth-logo-icon">
              <Utensils size={20} />
            </div>

            <div>
              <strong>Restora</strong>
              <span>Dine. Reserve. Repeat.</span>
            </div>

          </Link>


          {/* Heading */}
          <div className="auth-heading">

            <p>WELCOME BACK</p>

            <h2>
              Sign in to your account
            </h2>

            <span>
              Manage your reservations and discover
              new dining experiences.
            </span>

          </div>


          {/* Form */}
          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            {/* Email */}
            <div className="auth-input-group">

              <label>Email Address</label>

              <div className="auth-input">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            {/* Password */}
            <div className="auth-input-group">

              <div className="password-label">

                <label>Password</label>

                <a href="#">
                  Forgot password?
                </a>

              </div>

              <div className="auth-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Remember */}
            <label className="remember-me">

              <input type="checkbox" />

              <span>
                Remember me
              </span>

            </label>


            {/* Error Message */}
            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}


            {/* Login */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>


            {/* Divider */}
            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>


            {/* Google UI */}
            <button
              type="button"
              className="google-button"
              onClick={() =>
                alert("Google login will be connected later.")
              }
            >
              <strong>G</strong>
              Continue with Google
            </button>

          </form>


          {/* Signup Link */}
          <p className="auth-switch">

            Don't have an account?

            <Link to="/signup">
              Create an account
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}

export default Login;