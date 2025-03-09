import React, { useState, useEffect } from "react";
import "./AdminRecycling.css";

function AdminRecycling() {
  const [materials, setMaterials] = useState([
    { id: 1, name: "Plastic", company: "" },
    { id: 2, name: "Metal", company: "" },
    { id: 3, name: "Glass", company: "" },
  ]);
  const [company, setCompany] = useState("");

  useEffect(() => {
    const storedMaterials = JSON.parse(localStorage.getItem("recyclingData")) || [];
    setMaterials(storedMaterials);
  }, []);

  const assignCompany = (id) => {
    if (!company) {
      alert("Enter a company name!");
      return;
    }

    const updatedMaterials = materials.map((material) =>
      material.id === id ? { ...material, company } : material
    );
    setMaterials(updatedMaterials);
    localStorage.setItem("recyclingData", JSON.stringify(updatedMaterials));
    setCompany("");
  };

  return (
    <div className="admin-recycling">
      <h2>Assign Recycling Companies</h2>

      {materials.map((material) => (
        <div key={material.id} className="recycling-card">
          <p>♻️ Material: {material.name}</p>
          <p>🏢 Assigned Company: {material.company || "None"}</p>
          <input
            type="text"
            placeholder="Enter Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <button onClick={() => assignCompany(material.id)}>Assign</button>
        </div>
      ))}
    </div>
  );
}

export default AdminRecycling;

