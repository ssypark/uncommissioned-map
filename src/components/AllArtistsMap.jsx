import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { artists } from "../data/artistsData";
import customPin from '../assets/un-pin.svg';

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
  // Handle artist click - navigate to correct artist pages
  const handleArtistClick = (artist) => {
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const baseUrl = "https://uncommissioned.art";
    
    // Use the correct URL structure: /artists/{artist-slug}
    window.open(`${baseUrl}/artists/${artistSlug}`, '_blank');
  };

  // Better responsive zoom levels to show all countries
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      background: "#F7F2E8",
      padding: "0",
      margin: "0",
      overflow: "hidden"
    }}>
      <MapContainer
        center={[20, 0]}
        zoom={isMobile ? 1 : isTablet ? 2 : 2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
        worldCopyJump={false}
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
                <div className="text-sm font-['Source_Serif_4','serif']">
                  <strong style={{color: '#B42C2C'}}>{artist.artistName}</strong><br/>
                  <em style={{color: '#666'}}>{artist.artworkTitle}</em><br/>
                  <span style={{color: '#999'}}>{artist.location}</span><br/>
                  <span className="text-gray-600" style={{fontSize: '12px'}}>
                    {artist.medium.join(', ')}
                  </span><br/>
                  <button 
                    onClick={() => handleArtistClick(artist)}
                    className="text-blue-600 underline mt-2 block cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      marginTop: '8px', 
                      background: 'none', 
                      border: 'none', 
                      padding: '0',
                      font: 'inherit'
                    }}
                  >
                    View artist page →
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}