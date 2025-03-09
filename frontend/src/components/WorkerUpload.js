import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerUpload.css";

function WorkerUpload() {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [taskAccepted, setTaskAccepted] = useState(false);

  useEffect(() => {
    // Check if a task has been accepted
    const acceptedTasks = JSON.parse(localStorage.getItem("acceptedTasks")) || [];
    if (acceptedTasks.length > 0) {
      setTaskAccepted(true);
    } else {
      alert("You must accept a task before uploading an image.");
      navigate("/worker-dashboard"); // Redirect back to dashboard if no task is accepted
    }
  }, [navigate]);

  useEffect(() => {
    if (taskAccepted) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [taskAccepted]);

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    setImage(imageUrl);

    alert("Image Captured! Notification sent to Admin.");
  };

  return (
    <div className="worker-upload-container">
      <h2>Upload Cleaned Area Image</h2>

      {taskAccepted ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="video-feed" />
          <button onClick={captureImage}>Capture Cleared Image</button>

          {image && (
            <div className="image-preview">
              <h3>Captured Image:</h3>
              <img src={image} alt="Cleared Area" />
            </div>
          )}
        </>
      ) : (
        <p>Please accept a task first.</p>
      )}
    </div>
  );
}

export default WorkerUpload;

