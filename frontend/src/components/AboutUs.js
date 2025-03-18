import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="header">
      <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="logo" />
    <span className="site-name">ClearZone</span>
        <nav>
          <ul>
            <li><strong><a href="/contact">Contact us</a></strong></li>
          </ul>
        </nav>
      </header>

      <section className="about-content">
        <h1>ABOUT US</h1>
        <p><strong>ClearZone</strong> is a smart waste management platform designed to enhance urban cleanliness using IoT and AI-based solutions. Our mission is to revolutionize waste collection and recycling processes, making cities more sustainable and environmentally friendly.</p>

        <h2>Our Vision</h2>
        <p>At <strong>ClearZone</strong>, we aim to create a cleaner, greener future by optimizing waste collection and reducing environmental impact. Our platform connects waste management services with real-time data analytics to enhance efficiency.</p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Real-time waste monitoring and smart bin technology</li>
          <li>AI-powered waste classification for efficient recycling</li>
          <li>Automated waste collection scheduling</li>
          <li>Community engagement and environmental awareness</li>
        </ul>
      </section>

      <footer className="footer">
        <p>©️ 2025 ClearZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;