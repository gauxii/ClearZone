import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import backgroundImage from "../assets/LandingPageback.jpg"; // Ensure this image exists
import logo from "../assets/clearzonelogo.jpg"; // Import ClearZone logo

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay"></div>
      <div className="content">
        {/* ClearZone Logo */}
        <img src={logo} alt="ClearZone Logo" className="landing-logo" />
        <h1>Welcome to ClearZone</h1>
        <p>"Join ClearZone to report waste effortlessly, track progress, earn rewards, and contribute to a cleaner, greener environment. Act now!"</p>
        
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login/SignUp
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
