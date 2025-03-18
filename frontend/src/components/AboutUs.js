import React from "react";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>About Us</h1>
      <p>ClearZone is dedicated to keeping cities clean through citizen engagement.</p>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default AboutUs;