import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CitizenDashboard from "./components/CitizenDashboard"; // Updated import
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
          <Route path="/" element={<LoginPage />} />
          <Route path="/upload" element={<CitizenDashboard />} /> {/* Updated route */}
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker-upload" element={<WorkerUpload />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-recycling" element={<AdminRecycling />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;