import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CitizenDashboard.css";
import awarenessImage from "../assets/image.jpg"; // Add your awareness image
import cleanCityImage from "../assets/image1.jpg"; // Add a second relevant image

function CitizenDashboard() {
  const [points, setPoints] = useState(0);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <button onClick={() => document.getElementById("submissions-section").scrollIntoView({ behavior: "smooth" })}>View Latest Submissions</button>
        <button onClick={() => document.getElementById("reward-section").scrollIntoView({ behavior: "smooth" })}>View Reward Points</button>
        <button onClick={() => document.getElementById("reward-section").scrollIntoView({ behavior: "smooth" })}>View Leadership Board</button>
      </nav>

      <div className="awareness-section">
        {/* ✅ Added Awareness Images Above the Text */}
        <div className="image-container">
          <img src={awarenessImage} alt="Environmental Awareness" className="awareness-image" />
          <img src={cleanCityImage} alt="Clean City Initiative" className="awareness-image" />
        </div>

        <p className="awareness-text">"ClearZone: Empowering Citizens for a Cleaner Community"</p> 
        <p>
          ClearZone is a citizen-driven waste management platform designed to make waste reporting quick, easy, and impactful. 
          As a responsible citizen, you can actively contribute to keeping your surroundings clean by using ClearZone to report 
          waste accumulation in your area. Simply capture an image, share the location, and submit the report—all in just a few clicks.
        </p>
        <p>
          With real-time tracking, your reports are directly sent to the designated waste management workers, ensuring timely collection 
          and disposal. You can also track the progress of your reports and see how your contributions are making a difference.
        </p>
        <p>
          To encourage active participation, ClearZone offers a reward points system—every waste report you submit earns you points, 
          which can later be redeemed for benefits. By using ClearZone, you are not just reporting waste; you are playing a vital role 
          in creating a cleaner, healthier, and more sustainable environment for everyone. Join us in making a difference today!
        </p>

        <button className="report-btn" onClick={() => navigate("/capture-waste")}>Report Waste</button>
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
