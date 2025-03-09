import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import backgroundImage from "../assets/background.jpg"; // Import image from assets folder

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple authentication check (for testing)
    if (email === "admin@example.com" && password === "admin123") {
      navigate("/admin-dashboard"); // Redirect admin to the dashboard
    } else if (email === "worker@example.com" && password === "worker123") {
      navigate("/worker-dashboard"); // Redirect worker to upload page
    } else if (email === "citizen@example.com" && password === "citizen123") {
      navigate("/upload"); // Redirect citizen to waste upload page
    } else {
      setErrorMessage("Invalid email or password!");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported image here
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Heading for ClearZone with green color */}
      <h1 style={{ textAlign: "center", color: "#2ecc71", fontSize: "36px" }}>
        ClearZone Waste Management
      </h1>

      <h2 style={{ textAlign: "center", color: "#2ecc71", marginTop: "20px" }}>Login</h2>
      
      <form onSubmit={handleLogin} style={{ maxWidth: "400px", width: "100%" }}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;


