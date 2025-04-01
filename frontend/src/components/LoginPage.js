import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import backgroundImage from "../assets/background.jpg"; // Ensure this image exists

function LoginPage() {
  const [role, setRole] = useState("user"); // Default role
  const [identifier, setIdentifier] = useState(""); // Email for User, ID for Worker/Admin
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const apiEndpoint = `http://localhost:5002/api/auth/login/${role}`;
  
    const requestBody =
      role === "user"
        ? { email: identifier, password }
        : role === "worker"
        ? { employeeId: identifier, password }
        : { adminId: identifier, password };
  
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log("📝 Server Response:", data); // Debugging log
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name); 
        localStorage.setItem("workerId", data._id); // ✅ Fix: Save `identifier` instead of `_id`
  
        console.log("🔑 Token:", data.token);
        console.log("👤 Identifier:", data._id);
  
        const redirectPath =
          role === "user"
            ? "/upload"
            : role === "worker"
            ? "/worker-dashboard"
            : "/admin-dashboard";
        navigate(redirectPath);
      } else {
        setErrorMessage(data.error || "Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setErrorMessage("Server error. Please try again.");
    }
  };
  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-box">
        <h1 className="login-title">ClearZone</h1>
        <h2 className="login-subtitle">Login</h2>

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

          {/* Error Message */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Buttons (Login + Sign Up) */}
          {/* Buttons (Login + Sign Up) */}
<div className="button-group">
  <button type="submit" className="login-button">Login</button>

  {/* Conditionally render the Sign Up button */}
  {role !== "admin" && (
    <button 
      type="button" 
      className="signup-button" 
      onClick={() => navigate("/signup")}  
    >
      Sign Up
    </button>
  )}
</div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;