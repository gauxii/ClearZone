import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CitizenDashboard.css"; // ✅ Import CSS file for styling
import awarenessImage from "../assets/image.jpg"; // ✅ Import Awareness Image

function CitizenDashboard() {
  // ✅ State Variables
  const [points, setPoints] = useState(0); // Reward points
  const [reports, setReports] = useState([]); // List of reports
  const [image, setImage] = useState(null); // Captured image
  const [description, setDescription] = useState(""); // Waste description
  const [location, setLocation] = useState(null); // User's location
  const [showPopup, setShowPopup] = useState(false); // ✅ Popup state for reward points notification
  const videoRef = useRef(null); // Reference for camera video
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    fetchReports(); // ✅ Fetch previous reports
    fetchRewardPoints(); // ✅ Fetch user's reward points
    startCamera(); // ✅ Start camera when the page loads
    fetchLocation(); // ✅ Get user's current location
  }, []);

  // ✅ Fetch Reports from Database
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/waste/my-reports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // ✅ Fetch Reward Points from Backend
  const fetchRewardPoints = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/waste/reward-points", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPoints(response.data.rewardPoints);
    } catch (error) {
      console.error("Error fetching reward points:", error);
    }
  };

  // ✅ Get User's Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  };

  // ✅ Start Camera
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  // ✅ Capture Image from Camera
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
  };

  // ✅ Convert Data URL to Blob (for sending to backend)
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // ✅ Submit Waste Report & Show Reward Points Popup
  const submitReport = async () => {
    if (!image || !description || !location) {
      alert("Please capture an image, enter a description, and allow location access.");
      return;
    }

    // ✅ Prepare Form Data
    const formData = new FormData();
    formData.append("image", dataURItoBlob(image), "waste.png");
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);

    console.log("📤 Submitting FormData:", Object.fromEntries(formData.entries()));

    try {
      // ✅ Send Report to Backend
      await axios.post("http://localhost:5002/api/waste/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("✅ Waste reported successfully!");
      setImage(null);
      setDescription("");
      fetchReports(); // Refresh reports
      fetchRewardPoints(); // Refresh reward points

      // ✅ Show reward popup for 3 seconds
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error submitting report:", error.response?.data || error);
      alert("❌ Failed to report waste. Please try again.");
    }
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove JWT Token
    navigate("/login"); // ✅ Redirect to Login Page
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Reward Popup (Centered) */}
      {showPopup && <div className="reward-popup">🎉 You got +10 points!</div>}

      <nav className="navbar">
        <button onClick={() => document.getElementById("submissions-section").scrollIntoView({ behavior: "smooth" })}>
          View Latest Submissions
        </button>
        <button onClick={() => document.getElementById("reward-section").scrollIntoView({ behavior: "smooth" })}>
          View Reward Points
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button> {/* ✅ Logout Button */}
      </nav>

      {/* ✅ Awareness Section */}
      <div className="awareness-section">
        <div className="image-container">
          <img src={awarenessImage} alt="Environmental Awareness" className="awareness-image" />
        </div>
        <p className="awareness-text">"ClearZone: Empowering Citizens for a Cleaner Community"</p>
      </div>

      {/* ✅ Latest Submissions Restored */}
      <div id="submissions-section" className="latest-reports">
        <h3>Latest Submissions</h3>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Submitted On</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.description}</td>
                  <td>{report.status}</td>
                  <td>{report.assigned || "None"}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td><img src={report.imageUrl} alt="Reported Waste" className="table-image" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Reward Points Section */}
      <div id="reward-section" className="reward-section">
        <h3>Reward Points</h3>
        <p>You currently have {points} points.</p>
      </div>
    </div>
  );
}

export default CitizenDashboard;
