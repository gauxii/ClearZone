import React, { useState, useEffect, useRef } from "react";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [leaderboard, setLeaderboard] = useState([
    { name: "John", points: 250 },
    { name: "Alice", points: 200 },
    { name: "Bob", points: 150 }
  ]);
  const [recyclableMaterial, setRecyclableMaterial] = useState({
    materialType: "",
    quantity: "",
    description: ""
  });

  const videoRef = useRef(null);

  // Camera Access
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Geolocation Access
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

  // Capture Image from Video Feed
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImage(imageUrl);
    alert("Waste Reported! Notification sent to Admin and Workers.");
  };

  // Submit Feedback
  const handleSubmitFeedback = () => {
    alert(`Feedback submitted: Rating: ${rating}, Comment: ${comment}`);
  };

  // Submit New Report and Award Points
  const handleNewReport = () => {
    setPoints(points + 10); // 10 points for each new report
    if (points + 10 >= 100) {
      setRewards([...rewards, "Free T-shirt for reporting 10 times!"]);
    }
    alert(`Report submitted! You earned 10 points.`);
  };

  // Handle recyclable material input change
  const handleRecyclableMaterialChange = (e) => {
    const { name, value } = e.target;
    setRecyclableMaterial((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="dashboard-container">
      <h2>Citizen Waste Reporting Dashboard</h2>

      <div className="upload-section">
        <h3>Report Waste</h3>

        {location && (
          <p>📍 Your Location: {location.latitude}, {location.longitude}</p>
        )}

        {/* Camera-based Reporting */}
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline className="video-feed" />
          <button onClick={captureImage}>Capture Waste Image</button>
        </div>

        {/* Recyclable Material Reporting */}
        <div className="recyclable-material-section">
          <h4>Recyclable Material Information</h4>
          <label>
            Material Type:
            <select
              name="materialType"
              value={recyclableMaterial.materialType}
              onChange={handleRecyclableMaterialChange}
            >
              <option value="">Select Material</option>
              <option value="plastic">Plastic</option>
              <option value="paper">Paper</option>
              <option value="metal">Metal</option>
              <option value="glass">Glass</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Quantity (in kg):
            <input
              type="number"
              name="quantity"
              value={recyclableMaterial.quantity}
              onChange={handleRecyclableMaterialChange}
              placeholder="e.g. 5"
            />
          </label>

          <label>
            Additional Description:
            <textarea
              name="description"
              value={recyclableMaterial.description}
              onChange={handleRecyclableMaterialChange}
              placeholder="Describe the recyclable material"
            />
          </label>
        </div>

        {/* Submit Report */}
        <button onClick={handleNewReport}>Submit Waste Report</button>
      </div>

      <div className="reward-section">
        <h3>Reward Points</h3>
        <p>You currently have {points} points.</p>
        <div className="rewards">
          <h4>Your Rewards:</h4>
          <ul>
            {rewards.map((reward, index) => (
              <li key={index}>{reward}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="feedback-section">
        <h3>Give Feedback on Report</h3>

        <div className="rating">
          <span>Rate your experience:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={rating >= star ? 'active' : ''}
            >
              ☆
            </button>
          ))}
        </div>

        <textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmitFeedback}>Submit Feedback</button>
      </div>

      <div className="leaderboard-section">
        <h3>Leaderboard</h3>
        <ul>
          {leaderboard.map((user, index) => (
            <li key={index}>{user.name} - {user.points} points</li>
          ))}
        </ul>
      </div>

      {/* Display Captured Image */}
      {image && (
        <div className="image-preview">
          <h3>Captured Image:</h3>
          <img src={image} alt="Captured Waste" />
        </div>
      )}
    </div>
  );
}

export default CitizenDashboard;
