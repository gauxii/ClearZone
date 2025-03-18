import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import backgroundImage from "../assets/admin-bg.png";
import logo from "../assets/clearzonelogo.jpg"; // ✅ Import your logo image

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5002/api/waste/all-reports", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
      }

      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div 
      className="admin-dashboard-container" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* ✅ Navbar Section */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="ClearZone Logo" className="logo" />
          <span className="site-name">ClearZone</span>
        </div>
      </nav>

      <h2>Admin Dashboard</h2>

      <div className="dashboard-content">
        {error && <p className="error-message">⚠️ {error}</p>}

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="tasks-container">
            <h3>All Waste Reports</h3>
            {reports.length === 0 ? (
              <p>No reports available.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>📍 Location</th>
                    <th>📝 Description</th>
                    <th>👤 Reported By</th>
                    <th>👷 Assigned Worker</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.location?.latitude}, {report.location?.longitude}</td>
                      <td>{report.description}</td>
                      <td>{report.userId?.name || "Unknown"}</td>
                      <td>{report.assigned?.name || "Not Assigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;