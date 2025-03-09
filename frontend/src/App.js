import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";  // ✅ Import Landing Page
import LoginPage from "./components/LoginPage";
import CitizenDashboard from "./components/CitizenDashboard"; 
import WorkerDashboard from "./components/WorkerDashboard";
import WorkerUpload from "./components/WorkerUpload";
import AdminDashboard from "./components/AdminDashboard";
import AdminRecycling from "./components/AdminRecycling";
import SignupPage from "./components/SignupPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />  {/* 👈 Set Landing Page as default */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/upload" element={<CitizenDashboard />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker-upload" element={<WorkerUpload />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-recycling" element={<AdminRecycling />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
