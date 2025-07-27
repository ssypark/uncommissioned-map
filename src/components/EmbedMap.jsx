import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { artists } from "../data/artistsData";

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function EmbedMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artistSlug = params.get("artist");
    
    // Find artist by matching the slug
    const artist = artists.find(a => {
      const generatedSlug = a.artistName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return generatedSlug === artistSlug;
    });

    if (!artist || !artist.coordinates) {
      console.log("Artist not found or no coordinates:", artistSlug);
      return;
    }

    const { lat, lng } = artist.coordinates;
    
    // Create map with moderate zoom to accommodate larger circle
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true
    }).setView([lat, lng], 13);

    // Add grayscale tiles with custom class
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "grayscale-tiles"
    }).addTo(map);

    // Create a large circle like Airbnb (covers multiple neighborhoods)
    // ~2000 meters radius = covers several neighborhoods/districts
    const circle = L.circle([lat, lng], {
      color: '#B42C2C',
      fillColor: '#B42C2C',
      fillOpacity: 0.2,
      radius: 2000,
      weight: 3
    }).addTo(map);

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      background: "#F7F2E8",
      padding: "0",
      margin: "0"
    }}>
      <div
        ref={mapRef}
        style={{ 
          width: "100%", 
          height: "100%"
        }}
      />
    </div>
  );
}