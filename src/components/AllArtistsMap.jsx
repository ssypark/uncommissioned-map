import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function AllArtistsMap() {
  // Handle artist click - same logic as InteractiveMap
  const handleArtistClick = (artist) => {
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Navigate to artwork page
    window.location.href = `/artwork?artist=${artistSlug}`;
  };

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      background: "#F7F2E8",
      padding: "0",
      margin: "0"
    }}>
      <MapContainer
        center={[20, 0]}
        zoom={isMobile ? 1 : 2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        minZoom={1}
        maxZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-map-tiles"
        />
        
        {/* Artist markers */}
        {artists.map(artist => (
          artist.coordinates && (
            <Marker
              key={artist.id}
              position={[artist.coordinates.lat, artist.coordinates.lng]}
              icon={customIcon}
            >
              <Popup>
                <div 
                  className="text-sm font-['Source_Serif_4','serif'] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleArtistClick(artist)}
                >
                  <strong style={{color: '#B42C2C'}}>{artist.artistName}</strong><br/>
                  <em>{artist.artworkTitle}</em><br/>
                  {artist.location}<br/>
                  <span className="text-gray-600">
                    {artist.medium.join(', ')}
                  </span><br/>
                  <small className="text-blue-600 underline mt-2 block">
                    View artwork page
                  </small>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}