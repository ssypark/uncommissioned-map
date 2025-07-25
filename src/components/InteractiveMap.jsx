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

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const InteractiveMap = ({ artists, filteredArtists }) => {
  // Show pins only for filtered artists, or all if no filters
  const visibleArtists = (filteredArtists?.length === artists?.length)
    ? artists || []
    : filteredArtists || [];

  return (
    <div className="w-full h-[400px] mb-12 border border-gray-300 rounded-lg overflow-hidden">
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
        
        {/* Artist markers - will remain colored */}
        {visibleArtists.map(artist => (
          artist.coordinates && (
            <Marker
              key={artist.id}
              position={[artist.coordinates.lat, artist.coordinates.lng]}
              icon={redIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{artist.artistName}</strong><br/>
                  {artist.artworkTitle}<br/>
                  <em>{artist.location}</em><br/>
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