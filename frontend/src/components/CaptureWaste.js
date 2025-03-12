import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CaptureWaste.css";

function CaptureWaste() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Start Camera
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  // Capture Image from Video Stream
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImage(imageUrl);
  };

  // Fetch User's Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  };

  // Convert Base64 Image to File
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Upload Image & Report Waste
  const handleSubmit = async () => {
    if (!image || !description || !location) {
      alert("Please capture an image, enter a description, and allow location access.");
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
      navigate("/upload");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to report waste. Please try again.");
    }
  };

  return (
    <div className="capture-container">
      <h2>Capture Waste Image</h2>
      <video ref={videoRef} autoPlay playsInline className="video-feed" />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture Image</button>

      {image && <img src={image} alt="Captured Waste" className="image-preview" />}
      
      <textarea
        placeholder="Describe the waste location..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={fetchLocation}>Fetch Location</button>
      {location && <p>📍 Location: {location.latitude}, {location.longitude}</p>}

      <button onClick={handleSubmit}>Submit Waste Report</button>
      <button onClick={() => navigate("/upload")}>Back to Dashboard</button>
    </div>
  );
}

export default CaptureWaste;
