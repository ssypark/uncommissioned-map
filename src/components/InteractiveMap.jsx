import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker icon - updated to match AllArtistsMap style
const redIcon = L.divIcon({
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

const InteractiveMap = ({ artists, filteredArtists }) => {
  // Show pins only for filtered artists, or all if no filters
  const visibleArtists = (filteredArtists?.length === artists?.length)
    ? artists || []
    : filteredArtists || [];

  return (
    <div className="w-full h-[400px] mb-12 border border-gray-300 overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Grayscale OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-map-tiles"
        />
        
        {/* Artist markers - now using consistent style */}
        {visibleArtists.map(artist => (
          artist.coordinates && (
            <Marker
              key={artist.id}
              position={[artist.coordinates.lat, artist.coordinates.lng]}
              icon={redIcon}
            >
              <Popup>
                <div className="text-sm font-['Source_Serif_4','serif']">
                  <strong style={{color: '#B42C2C'}}>{artist.artistName}</strong><br/>
                  <em>{artist.artworkTitle}</em><br/>
                  {artist.location}<br/>
                  <span className="text-gray-600">
                    {artist.medium.join(', ')}
                  </span>
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