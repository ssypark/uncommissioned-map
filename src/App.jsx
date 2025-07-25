import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FilterArtistGrid from './components/FilterArtistGrid';
import EmbedMap from './components/EmbedMap';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FilterArtistGrid />} />
          <Route path="/embed-map" element={<EmbedMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;