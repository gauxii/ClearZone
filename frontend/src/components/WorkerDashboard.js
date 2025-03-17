import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";
// import MiniMap from "./MiniMap"; // ❌ Temporarily Commented Out

function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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

      if (response.data.success && Array.isArray(response.data.wasteReports)) {
        const assignedTasks = response.data.wasteReports.filter(task => task.status === "assigned");
        const completedTasks = response.data.wasteReports.filter(task => task.status === "completed");

        setTasks(assignedTasks);
        setCompletedTasks(completedTasks);
      } else {
        console.error("❌ Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching tasks:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCompleteWork = (taskId) => {
    setUploadingTaskId(taskId);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadCompletedWork = async (taskId) => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("completedImage", selectedFile);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5002/api/waste/complete`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Work completed:", response.data);

      setUploadingTaskId(null);
      setSelectedFile(null);
      alert("✅ Task marked as completed!");
      fetchAssignedTasks(workerId); // Refresh tasks
    } catch (error) {
      console.error("❌ Error completing work:", error.response?.data || error.message);
      alert("❌ Error completing task. Please try again.");
    }
  };

  return (
    <div className="worker-dashboard">
      {/* ✅ Navbar */}
      
      <nav className="navbar">
      <div className="logo-container">
    <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="logo" />
    <span className="site-name">ClearZone</span>
  </div>
        <h2>Welcome, {workerName || "Worker"}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      <h3>Assigned Tasks</h3>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>📍 Location:</strong> {task.location?.latitude}, {task.location?.longitude}</p>

            {/* ❌ MiniMap Removed */}
            {/* {task.location?.latitude && task.location?.longitude ? (
              <MiniMap latitude={task.location.latitude} longitude={task.location.longitude} />
            ) : (
              <p>📍 Location not available</p>
            )} */}

            {task.imageUrl && <img src={task.imageUrl} alt="Waste Report" className="task-image" />}

            {task.status === "assigned" && (
              <>
                <button className="complete-button" onClick={() => handleCompleteWork(task._id)}>
                  Mark as Completed
                </button>

                {uploadingTaskId === task._id && (
                  <div className="upload-container">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button className="upload-button" onClick={() => uploadCompletedWork(task._id)}>
                      Upload Completed Image
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No tasks assigned yet.</p>
      )}

      {/* ✅ Completed Tasks Table */}
      <h3>Completed Tasks</h3>
      {completedTasks.length > 0 ? (
        <table className="completed-tasks-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Location</th>
              <th>Reported Image</th>
              <th>Completed Image</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map(task => (
              <tr key={task._id}>
                <td>{task.description}</td>
                <td>
                  {/* ❌ MiniMap Removed */}
                  {/* {task.location?.latitude && task.location?.longitude ? (
                    <MiniMap latitude={task.location.latitude} longitude={task.location.longitude} />
                  ) : (
                    "📍 Location not available"
                  )} */}
                  {task.location?.latitude}, {task.location?.longitude}
                </td>
                <td><img src={task.imageUrl} alt="Waste Report" className="table-image" /></td>
                <td>{task.completedImage ? <img src={task.completedImage} alt="Completed Work" className="table-image" /> : "No Image"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No completed tasks yet.</p>
      )}
    </div>
  );
}

export default WorkerDashboard;