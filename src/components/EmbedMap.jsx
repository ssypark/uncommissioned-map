import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { artists } from "../data/artistsData";
import customPin from '../assets/un-pin.svg'; // Import your custom pin

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon using your SVG
const customIcon = L.icon({
  iconUrl: customPin,
  iconSize: [24, 27],
  iconAnchor: [12, 27],
  popupAnchor: [0, -27],
});

export default function EmbedMap() {
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
    return <div>Artist not found</div>;
  }

  const { lat, lng } = artist.coordinates;
  
  // Check if it's mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Handle artist click - same logic as InteractiveMap
  const handleArtistClick = (artist) => {
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const baseUrl = "https://uncommissioned.art";
    window.open(`${baseUrl}/artistpage/${artistSlug}`, '_blank');
  };

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true,
      worldCopyJump: false,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1.0,
      minZoom: 1,
      maxZoom: 18
    }).setView([lat, lng], isMobile ? 10 : 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "grayscale-map-tiles"
    }).addTo(map);

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    marker.bindPopup(`
      <div class="text-sm font-['Source_Serif_4','serif'] cursor-pointer hover:opacity-80 transition-opacity">
        <strong style="color: #B42C2C">${artist.artistName}</strong><br/>
        <em>${artist.artworkTitle}</em><br/>
        ${artist.location}<br/>
        <span class="text-gray-600">
          ${artist.medium.join(', ')}
        </span><br/>
        <small class="text-blue-600 underline mt-2 block">
          View artist page
        </small>
      </div>
    `);

    marker.on('click', () => handleArtistClick(artist));

    return () => {
      map.remove();
    };
  }, [artist, lat, lng, isMobile]);

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