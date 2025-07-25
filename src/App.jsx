import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FilterArtistGrid from './components/FilterArtistGrid';
import { ArtistPage } from './components/ArtistPage';
import { PlasmicCanvasHost } from '@plasmicapp/loader-react';
import './plasmic-init';

function MapPage() {
  return (
    <div>
      <h1>Explore Artists by Location & Medium</h1>
      <FilterArtistGrid />
    </div>
  );
}

function HomePage() {
  return (
    <div className="p-2">
      <h1>Welcome to uncommissioned</h1>
      <a href="/map">
        <button>Go to Map</button>
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/plasmic-host" element={<PlasmicCanvasHost />} />
      </Routes>
    </Router>
  );
}

export default App;