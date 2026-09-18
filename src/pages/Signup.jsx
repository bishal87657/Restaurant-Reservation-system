import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Utensils,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    // Check if all fields are filled
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send registration request to FastAPI
      const response = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password
          })
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(data.detail || "Registration failed.");
        return;
      }

      // Registration successful
      navigate("/login");

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

      {/* LEFT SIDE */}
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
            Your table.
            <br />
            Your moment.
          </h1>

          <p>
            Create your RRS account and start discovering
            amazing restaurants around you.
          </p>
        </motion.div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-form-area">

        <motion.div
          className="auth-form-container signup-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* LOGO */}
          <Link to="/" className="auth-logo">

            <div className="auth-logo-icon">
              <Utensils size={20} />
            </div>

            <div>
              <strong>RRS</strong>
              <span>Dine. Reserve. Repeat.</span>
            </div>

          </Link>


          {/* HEADING */}
          <div className="auth-heading">

            <p>GET STARTED</p>

            <h2>
              Create your account
            </h2>

            <span>
              Join RRS and make your next dining experience
              easier and more memorable.
            </span>

          </div>


          {/* FORM */}
          <form
            className="auth-form"
            onSubmit={handleSignup}
          >

            {/* NAME */}
            <div className="auth-input-group">

              <label>Full Name</label>

              <div className="auth-input">

                <User size={18} />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

            </div>


            {/* EMAIL */}
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


            {/* PHONE */}
            <div className="auth-input-group">

              <label>Phone Number</label>

              <div className="auth-input">

                <Phone size={18} />

                <input
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  maxLength="10"
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="auth-input-group">

              <label>Password</label>

              <div className="auth-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
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


            {/* CONFIRM PASSWORD */}
            <div className="auth-input-group">

              <label>Confirm Password</label>

              <div className="auth-input">

                <Lock size={18} />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* TERMS */}
            <label className="remember-me signup-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions and
                Privacy Policy.
              </span>

            </label>


            {/* ERROR MESSAGE */}
            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}


            {/* BUTTON */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* LOGIN LINK */}
          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}

export default Signup;