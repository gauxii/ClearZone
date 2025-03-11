import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [reports, setReports] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchReports();
  }, []);

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

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImage(imageUrl);
  };

  const handleSubmitReport = async () => {
    if (!image || !location || !description) {
      alert("Please provide an image (captured or uploaded), description, and allow location access.");
      return;
    }

    const formData = new FormData();
    formData.append("image", dataURItoBlob(image), "waste.png");
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);

    try {
      await axios.post("http://localhost:5002/api/waste/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      alert("Waste reported successfully!");
      fetchReports();
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to report waste. Please try again.");
    }
  };

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

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <button onClick={() => scrollToSection("report-section")}>Report Waste</button>
        <button onClick={() => scrollToSection("submissions-section")}>View Latest Submissions</button>
        <button onClick={() => scrollToSection("reward-section")}>View Reward Points</button>
      </nav>

      <h2>Citizen Waste Reporting Dashboard</h2>

      <div id="report-section" className="upload-section">
        <h3>Report Waste</h3>
        {location && <p>📍 Your Location: {location.latitude}, {location.longitude}</p>}

        <textarea
          placeholder="Describe the waste location..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline className="video-feed" />
          <button onClick={captureImage}>Capture Waste Image</button>
        </div>

        {image && <img src={image} alt="Captured Waste" className="image-preview" />}

        <button onClick={handleSubmitReport}>Submit Waste Report</button>
      </div>

      <div id="submissions-section" className="latest-reports">
        <h3>Latest Submissions</h3>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul>
            {reports.map((report) => (
              <li key={report._id} className="report-item">
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Status:</strong> {report.status}</p>
                <p><strong>Assigned To:</strong> {report.assigned || "None"}</p>
                <p><strong>Submitted On:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                <img src={report.imageUrl} alt="Reported Waste" className="report-image" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div id="reward-section" className="reward-section">
        <h3>Reward Points</h3>
        <p>You currently have {points} points.</p>
      </div>
    </div>
  );
}

export default CitizenDashboard;
