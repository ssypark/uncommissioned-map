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
    
    // Check if it's mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768;
    
    // Create map with different zoom for mobile vs desktop
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true
    }).setView([lat, lng], isMobile ? 10 : 13); // Zoomed out more on mobile

    // Add grayscale tiles with custom class
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "grayscale-tiles"
    }).addTo(map);

    // Create a circle like Airbnb (covers nearby area)
    // ~500 meters radius = covers immediate neighborhood area
    const circle = L.circle([lat, lng], {
      color: '#B42C2C',
      fillColor: '#B42C2C',
      fillOpacity: 0.2,
      radius: 500, // Changed from 2000 to 500 meters (0.5km)
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