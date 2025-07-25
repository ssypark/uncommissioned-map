import React from 'react';
import { useParams } from 'react-router-dom';
import { artists } from '../data/artistsData'; // Changed to import 'artists'

export function ArtistPage({ className }) {
  const { artistId } = useParams();
  const artist = artists.find(a => a.id === parseInt(artistId));

  if (!artist) {
    return (
      <div className={className}>
        <h1>Artist not found</h1>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => window.history.back()}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Map
        </button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src={artist.thumbnailURL} 
              alt={artist.artworkTitle}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{artist.artistName}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{artist.artworkTitle}</h2>
            
            <div className="space-y-4">
              <div>
                <strong>Location:</strong> {artist.location}
              </div>
              <div>
                <strong>Medium:</strong> {artist.medium.join(', ')}
              </div>
              {artist.curator && (
                <div>
                  <strong>Curator:</strong> {artist.curator}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistPage;