import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import backgroundImage from "../assets/LandingPageback.jpg"; // Ensure this image exists

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay"></div>
      <div className="content">
        <h1>Welcome to ClearZone</h1>
        <p>Revolutionizing Waste Management, One Report at a Time!</p>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login/SignUp
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
