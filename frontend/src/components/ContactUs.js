import React from "react";
import { Link } from "react-router-dom"; // For navigation links
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <header className="header">
        <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="logo" />
        <span className="site-name">ClearZone</span>
      </header>

      <section className="contact-content">
        <h1>Contact Us</h1>
        <p>Feel free to reach out to us through the following:</p>
        <ul>
          <li><strong>Email:</strong> clearzone06@gmail.com</li>
          <li><strong>Phone:</strong> +1 234 567 890</li>
          <li><strong>Address:</strong> 123 Green Street, Clean City, Earth</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          {/* Logo & Site Name */}
          <div className="footer-left">
            <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="footer-logo" />
            <span className="footer-site-name">ClearZone</span>
          </div>

          {/* Quick Links */}
          {/*<div className="footer-middle">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>*/}

          {/* Social Media Links */}
          <div className="footer-right">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/facebook-icon.png")} alt="Facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/twitter-icon.png")} alt="Twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={require("../assets/instagram-icon.png")} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <p>©️ 2025 ClearZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;