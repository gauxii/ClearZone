import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import backgroundImage from "../assets/background.jpg"; // Ensure this image exists

function SignupPage() {
  const [role, setRole] = useState("user");
  const [name, setName] = useState(""); // Name (for Users)
  const [email, setEmail] = useState(""); // Email (for Users)
  const [id, setId] = useState(""); // ID (for Workers/Admins)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const apiEndpoint = `http://localhost:5002/api/auth/signup/${role}`;
    const requestBody =
      role === "user"
        ? { name, email, password }
        : { id, password };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage(data.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="signup-box">
        <h1 className="signup-title">ClearZone Waste Management</h1>
        <h2 className="signup-subtitle">Sign Up</h2>

        <form onSubmit={handleSignup}>
          {/* Role Selection */}
          <div className="input-group">
            <label>Sign up as:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Name (Only for Users) */}
          {role === "user" && (
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email for Users / ID for Workers & Admins */}
          <div className="input-group">
            <label>{role === "user" ? "Email:" : "ID:"}</label>
            <input
              type="text"
              placeholder={role === "user" ? "Enter your email" : "Enter your ID"}
              value={role === "user" ? email : id}
              onChange={(e) => (role === "user" ? setEmail(e.target.value) : setId(e.target.value))}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Error & Success Messages */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {/* Signup Button */}
          <button type="submit" className="signup-button">Sign Up</button>

          {/* Already have an account? Redirect to Login */}
          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
