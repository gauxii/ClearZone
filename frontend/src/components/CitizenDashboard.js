import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CitizenDashboard.css";
import awarenessImage from "../assets/image.jpg"; 

function CitizenDashboard() {
  const [points, setPoints] = useState(0);
  const [reports, setReports] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    startCamera();
    fetchLocation();
  }, []);

  // Fetch Reports from Database
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/waste/my-reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Fetch User Location
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

  // Start Camera
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  // Capture Image
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
  };

  // Convert Data URL to Blob
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

  // Submit Waste Report
  const submitReport = async () => {
    if (!image || !description || !location) {
      alert("Please capture an image, enter a description, and allow location access.");
      return;
    }

    const formData = new FormData();
    formData.append("image", dataURItoBlob(image), "waste.png");
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);

    console.log("📤 Submitting FormData:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post("http://localhost:5002/api/waste/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("✅ Waste reported successfully!");
      setImage(null);
      setDescription("");
      fetchReports();
    } catch (error) {
      console.error("❌ Error submitting report:", error.response?.data || error);
      alert("❌ Failed to report waste. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <button onClick={() => document.getElementById("submissions-section").scrollIntoView({ behavior: "smooth" })}>
          View Latest Submissions
        </button>
        <button onClick={() => document.getElementById("reward-section").scrollIntoView({ behavior: "smooth" })}>
          View Reward Points
        </button>
        <button onClick={() => document.getElementById("reward-section").scrollIntoView({ behavior: "smooth" })}>
          View Leadership Board
        </button>
      </nav>

      {/* Awareness Section */}
      <div className="awareness-section">
        <div className="image-container">
          <img src={awarenessImage} alt="Environmental Awareness" className="awareness-image" />
        </div>
        <p className="awareness-text">"ClearZone: Empowering Citizens for a Cleaner Community"</p>
        <p>ClearZone is a citizen-driven waste management platform designed to make waste reporting quick, easy, and impactful.</p>
      </div>

      {/* Waste Reporting Section */}
      <div className="report-section">
        <h3>Report Waste</h3>
        {location && <p>📍 Location: {location.latitude}, {location.longitude}</p>}
        <textarea
          placeholder="Describe the waste location..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline className="video-feed" />
          <button onClick={captureImage}>Capture Image</button>
        </div>
        {image && <img src={image} alt="Captured Waste" className="image-preview" />}
        <button className="submit-btn" onClick={submitReport}>Submit Waste Report</button>
      </div>

      {/* Latest Submissions */}
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

      {/* Reward Points */}
      <div id="reward-section" className="reward-section">
        <h3>Reward Points</h3>
        <p>You currently have {points} points.</p>
      </div>
    </div>
  );
}

export default CitizenDashboard;
