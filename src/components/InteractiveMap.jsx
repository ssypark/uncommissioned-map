import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  iconSize: [24, 27], // Adjust size to match your pin proportions (width, height)
  iconAnchor: [12, 27], // Point where the pin touches the ground [x, y]
  popupAnchor: [0, -27], // Where popup appears relative to icon
});

const InteractiveMap = ({ artists, filteredArtists }) => {
  // Show pins only for filtered artists, or all if no filters
  const visibleArtists = (filteredArtists?.length === artists?.length)
    ? artists || []
    : filteredArtists || [];

  // Handle artist click - same logic as FilterArtistGrid
  const handleArtistClick = (artist) => {
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    const baseUrl = "https://uncommissioned.art";
    window.open(`${baseUrl}/artistpage/${artistSlug}`, '_blank');
  };

  return (
    <div className="w-full h-[400px] mb-12 border border-gray-300 overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        {/* Grayscale OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-map-tiles"
        />
        
        {/* Artist markers - now using custom pin */}
        {visibleArtists.map(artist => (
          artist.coordinates && (
            <Marker
              key={artist.id}
              position={[artist.coordinates.lat, artist.coordinates.lng]}
              icon={customIcon} // Changed from redIcon to customIcon
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
                    Click to view artist page
                  </small>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;