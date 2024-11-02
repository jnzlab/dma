"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  userLocation: { lat: number; lng: number };
  doctorLocation: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ userLocation, doctorLocation }) => {
  useEffect(() => {
  const map = L.map("map").setView([userLocation.lat, userLocation.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const userMarker = L.marker([userLocation.lat, userLocation.lng]).addTo(
      map
    );
    userMarker.bindPopup("You are here").openPopup();

    const doctorMarker = L.marker([
      doctorLocation.lat,
      doctorLocation.lng,
    ]).addTo(map);
    doctorMarker.bindPopup("Dermatologist's Location").openPopup();

    const route = L.polyline(
      [
        [userLocation.lat, userLocation.lng],
        [doctorLocation.lat, doctorLocation.lng],
      ],
      { color: "blue" }
    ).addTo(map);

    map.fitBounds(route.getBounds());

    // Cleanup function to remove map and listeners
    return () => {
      map.off(); // Remove all event listeners
      map.remove(); // Remove the map instance
    };
  }, [userLocation, doctorLocation]);

  return (
    <div className="w-full h-96 rounded-lg shadow-md overflow-hidden">
      <div id="map" className="w-full h-full" />
    </div>
  );
};

export default Map;