import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CaptureWaste.css";

function CaptureWaste() {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Access Camera
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
    setImage(canvas.toDataURL("image/png"));
  };

  return (
    <div className="capture-container">
      <h2>Capture Waste Image</h2>
      <video ref={videoRef} autoPlay playsInline className="video-feed" />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture Image</button>
      {image && <img src={image} alt="Captured Waste" className="image-preview" />}
      <button onClick={() => navigate("/upload")}>Back to Dashboard</button>
    </div>
  );
}

export default CaptureWaste;
