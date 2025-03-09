// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>
      <button onClick={() => navigate('/upload')}>Go to Upload Page</button>
    </div>
  );
}

export default Dashboard;
