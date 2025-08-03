import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FilterArtistGrid from './components/FilterArtistGrid';
import EmbedMap from './components/EmbedMap';
import AllArtistsMap from './components/AllArtistsMap';
import './index.css';

// Add the auto-resize hook
function useEmbedAutoResize() {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "embed-auto-height", height: document.body.scrollHeight },
        "*"
      );
    };

    // Send initial height
    sendHeight();

    // Send height whenever the page's size changes
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);
    
    return () => resizeObserver.disconnect();
  }, []);
}

function App() {
  // Add the auto-resize hook
  useEmbedAutoResize();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FilterArtistGrid />} />
          <Route path="/embed-map" element={<EmbedMap />} />
          <Route path="/all-artists-map" element={<AllArtistsMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;