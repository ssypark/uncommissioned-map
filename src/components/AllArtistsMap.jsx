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

// Create a custom red marker using CSS
const createRedMarker = () => {
  return L.divIcon({
    className: 'custom-red-marker',
    html: `
      <div style="
        background-color: #B42C2C;
        width: 20px;
        height: 20px;
        border-radius: 50% 50% 50% 0;
        border: 2px solid #fff;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background-color: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [1, -20]
  });
};

// Create hover marker (larger)
const createHoverMarker = () => {
  return L.divIcon({
    className: 'custom-hover-marker',
    html: `
      <div style="
        background-color: #B42C2C;
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid #fff;
        transform: rotate(-45deg);
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        position: relative;
        cursor: pointer;
        z-index: 1000;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background-color: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [1, -24]
  });
};

export default function AllArtistsMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create map centered on world view
    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      dragging: true,
      zoomControl: true
    }).setView([20, 0], 2);

    // Add grayscale tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "grayscale-tiles"
    }).addTo(map);

    // Add markers for all artists
    artists.forEach(artist => {
      if (!artist.coordinates) return;

      const { lat, lng } = artist.coordinates;
      
      // Generate artist slug for URL
      const artistSlug = artist.artistName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const marker = L.marker([lat, lng], { icon: createRedMarker() }).addTo(map);
      
      // Store original icon for hover reset
      const originalIcon = createRedMarker();
      const hoverIcon = createHoverMarker();
      
      // Add hover effects and click handler
      marker.on('mouseover', function() {
        this.setIcon(hoverIcon);
      });
      
      marker.on('mouseout', function() {
        this.setIcon(originalIcon);
      });
      
      marker.on('click', function() {
        // Navigate to artwork page
        window.location.href = `/artwork?artist=${artistSlug}`;
      });
    });

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
      
      {/* Custom styles */}
      <style jsx global>{`
        .custom-red-marker:hover {
          transform: rotate(-45deg) scale(1.1);
        }
        
        .grayscale-tiles {
          filter: grayscale(100%) contrast(1.2);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}