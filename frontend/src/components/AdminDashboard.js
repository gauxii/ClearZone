import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [recyclingMaterials, setRecyclingMaterials] = useState([]);

  useEffect(() => {
    // Load accepted tasks
    const storedTasks = JSON.parse(localStorage.getItem("acceptedTasks")) || [];
    setAcceptedTasks(storedTasks);

    // Load assigned recycling materials
    const storedMaterials = JSON.parse(localStorage.getItem("recyclingData")) || [];
    setRecyclingMaterials(storedMaterials);
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

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
  );
}

export default AdminDashboard;


