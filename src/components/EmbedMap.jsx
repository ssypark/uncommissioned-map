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
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid #fff;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        position: relative;
        filter: none !important;
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
    
    // Create map
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true
    }).setView([lat, lng], 8);

    // Add grayscale tiles with custom class
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "grayscale-tiles" // Apply grayscale only to tiles
    }).addTo(map);

    // Add marker with custom red icon
    L.marker([lat, lng], { icon: createRedMarker() })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: 'Source Serif 4', serif;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 500; color: #B42C2C;">${artist.artistName}</h3>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666; font-style: italic;">${artist.artworkTitle}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #999;">${artist.location}</p>
        </div>
      `)
      .openPopup();

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