import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

