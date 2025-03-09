import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import backgroundImage from "../assets/admin-bg.png"; // Ensure this path is correct

function AdminDashboard() {
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [recyclingMaterials, setRecyclingMaterials] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("acceptedTasks")) || [];
    setAcceptedTasks(storedTasks);

    const storedMaterials = JSON.parse(localStorage.getItem("recyclingData")) || [];
    setRecyclingMaterials(storedMaterials);
  }, []);

  return (
    <div 
      className="admin-dashboard-container" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h2>Admin Dashboard</h2>

      {/* Flexbox container to align two boxes side by side */}
      <div className="dashboard-content">
        {/* Waste Collection Tasks Box */}
        <div className="tasks-container">
          <h3>Accepted Waste Collection Tasks</h3>
          {acceptedTasks.length === 0 ? (
            <p>No tasks accepted yet.</p>
          ) : (
            acceptedTasks.map((task) => (
              <div key={task.id} className="task-card">
                <p>📍 Location: {task.location}</p>
                <p>👷 Accepted By: {task.status.replace("Accepted by ", "")}</p>
              </div>
            ))
          )}
        </div>

        {/* Recycling Assignment Box */}
        <div className="recycling-container">
          <h3>Recycling Company Assignments</h3>
          {recyclingMaterials.length === 0 ? (
            <p>No recyclable materials assigned yet.</p>
          ) : (
            recyclingMaterials.map((material) => (
              <div key={material.id} className="recycling-card">
                <p>♻️ Material: {material.name}</p>
                <p>🏢 Assigned Company: {material.company || "Not Assigned"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

