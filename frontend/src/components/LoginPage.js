import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [role, setRole] = useState("user"); // Default role selection
  const [identifier, setIdentifier] = useState(""); // Email or ID
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // API endpoint based on role
    const apiEndpoint = `http://localhost:5002/api/auth/login/${role}`;
    const requestBody =
      role === "user"
        ? { email: identifier, password }
        : { id: identifier, password }; // Worker & Admin use ID instead of email

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Redirect based on role
        if (role === "user") {
          navigate("/upload");
        } else if (role === "worker") {
          navigate("/worker-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        }
      } else {
        setErrorMessage(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* Role Selection */}
        <div className="input-group">
          <label>Login as:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Identifier (Email for User, ID for Worker/Admin) */}
        <div className="input-group">
          <label>{role === "user" ? "Email:" : "ID:"}</label>
          <input
            type="text"
            placeholder={role === "user" ? "Enter your email" : "Enter your ID"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
