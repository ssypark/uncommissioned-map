import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FilterArtistGrid from './components/FilterArtistGrid';
import { ArtistPage } from './components/ArtistPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilterArtistGrid />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
      </Routes>
    </Router>
  );
}

export default App;