import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkerDashboard.css";

function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedWorkerName = localStorage.getItem("name");
    const savedWorkerId = localStorage.getItem("workerId");
    
    if (savedWorkerName) setWorkerName(savedWorkerName);
    if (savedWorkerId) setWorkerId(savedWorkerId);

    if (savedWorkerId) {
      fetchAssignedTasks(savedWorkerId);
    } else {
      console.error("❌ No worker ID found in local storage.");
    }
  }, []);

  const fetchAssignedTasks = async (workerId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found");
        return;
      }
  
      console.log("🔍 Fetching tasks for Worker ID:", workerId);
  
      const response = await axios.get(`http://localhost:5002/api/waste/worker/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ API Response:", response.data);
  
      if (response.data.success && Array.isArray(response.data.reports)) {
        setTasks(response.data.reports);
      } else {
        console.error("❌ Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.response?.data || error.message);
    }
  };
  const proceedToUpload = (taskId) => {
    navigate(`/worker-upload/${taskId}`);
  };

  return (
    <div className="worker-dashboard">
      <h2>Worker Dashboard</h2>
      
      {/* ✅ Debugging logs */}
      {console.log("👤 Worker Name from LocalStorage:", workerName)}
      {console.log("🆔 Worker ID from LocalStorage:", workerId)}
  
      <p>Welcome, <strong>{workerName || "Worker"}</strong>!</p>
  
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <p>📍 Location: {task.location?.latitude}, {task.location?.longitude}</p>
            <p>Description: {task.description}</p>
            <p>Status: {task.status}</p>
            {task.status === "assigned" && (
              <button className="proceed-button" onClick={() => proceedToUpload(task._id)}>
                Proceed to Upload Cleaned Image
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No tasks assigned yet.</p>
      )}
    </div>
  );
}

export default WorkerDashboard;