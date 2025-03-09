import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";

function WorkerDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, location: "Area A", status: "Pending" },
    { id: 2, location: "Area B", status: "Pending" },
  ]);
  const [workerName, setWorkerName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load worker name if previously entered
    const savedName = localStorage.getItem("workerName");
    if (savedName) {
      setWorkerName(savedName);
    }
  }, []);

  const acceptTask = (id) => {
    if (!workerName) {
      const name = prompt("Enter your name to accept the task:");
      if (!name) return;
      setWorkerName(name);
      localStorage.setItem("workerName", name);
    }

    // Find the selected task and update the status
    const updatedTasks = tasks.map((task) =>
      task.id === id && task.status === "Pending"
        ? { ...task, status: `Accepted by ${workerName}` }
        : task
    );

    setTasks(updatedTasks);
    setSelectedTask(id);

    // Save to local storage for admin to view
    localStorage.setItem("acceptedTasks", JSON.stringify(updatedTasks));
  };

  const proceedToUpload = () => {
    navigate("/worker-upload");
  };

  return (
    <div className="worker-dashboard">
      <h2>Worker Dashboard</h2>
      <p>Welcome, {workerName || "Worker"}!</p>

      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <p>📍 Location: {task.location}</p>
          {task.status.startsWith("Accepted") ? (
            <p>✅ {task.status}</p>
          ) : (
            <button
              onClick={() => acceptTask(task.id)}
              disabled={task.status !== "Pending"} // Disable if task is accepted
            >
              Accept Task
            </button>
          )}
        </div>
      ))}

      {/* Show Camera Button Only After Accepting Task */}
      {selectedTask && (
        <button className="proceed-button" onClick={proceedToUpload}>
          Proceed to Upload Cleaned Image
        </button>
      )}
    </div>
  );
}

export default WorkerDashboard;
