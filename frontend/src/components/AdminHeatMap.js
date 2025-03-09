import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 10.8505, // Default center (example: Kerala, India)
  lng: 76.2711,
};

const AdminHeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("wasteReports")) || [];
    const formattedData = storedData.map((report) => ({
      location: new window.google.maps.LatLng(report.lat, report.lng),
      weight: 1, // Weight can be adjusted based on frequency
    }));
    setHeatmapData(formattedData);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
        {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default AdminHeatMap;
