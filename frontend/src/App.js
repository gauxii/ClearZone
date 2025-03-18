import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage"; 
import LoginPage from "./components/LoginPage";
import CitizenDashboard from "./components/CitizenDashboard";
import WorkerDashboard from "./components/WorkerDashboard";
import WorkerUpload from "./components/WorkerUpload";
import AdminDashboard from "./components/AdminDashboard";
import AdminRecycling from "./components/AdminRecycling";
import SignupPage from "./components/SignupPage";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />  {/* ✅ Landing Page as Default */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<CitizenDashboard />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker-upload" element={<WorkerUpload />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-recycling" element={<AdminRecycling />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutUs />} /> 
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
