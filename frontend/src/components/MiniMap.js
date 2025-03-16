import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MiniMap = ({ latitude, longitude }) => {
    if (!latitude || !longitude) {
      return <p>📍 Location not available</p>;
    }
  
    return (
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: "200px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    );
  };

export default MiniMap;