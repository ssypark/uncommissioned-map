import React, { useState, useMemo, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import { artists } from '../data/artistsData';

// Add this FilterButton component
const FilterButton = ({ label, isActive, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-sm border transition-colors font-['Source_Serif_4','serif'] ${
      isActive
        ? 'bg-[#B42C2C] text-white border-[#B42C2C]'
        : darkMode
        ? 'bg-transparent text-white border-white hover:bg-white hover:text-black'
        : 'bg-transparent text-black border-gray-400 hover:bg-[#B42C2C] hover:text-white hover:border-[#B42C2C]'
    }`}
  >
    {label}
  </button>
);

// Add this custom hook for auto-resizing
function useEmbedAutoResize() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage(
        { type: "embed-auto-height", height: height },
        "*"
      );
    };

    // Send height on load
    sendHeight();
    
    // Send height whenever layout changes
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);
    
    // Also send height when window resizes (for responsive breakpoints)
    window.addEventListener('resize', sendHeight);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, []);
}

export default function FilterArtistGrid({ artists: artistsProp = artists, darkMode: darkModeProp }) {
  // Add the auto-resize hook
  useEmbedAutoResize();

  // Check URL parameter for dark mode
  const urlParams = new URLSearchParams(window.location.search);
  const darkModeFromURL = urlParams.get('darkMode') === 'true';
  
  // Use prop if provided, otherwise use URL parameter
  const darkMode = darkModeProp !== undefined ? darkModeProp : darkModeFromURL;

  // 1) Track selected filters - updated to use invisibleThread
  const [selected, setSelected] = useState({
    location: new Set(),
    medium: new Set(),
    invisibleThread: new Set()
  });

  // 2) Define filter options - updated with invisibleThread categories
  const filterOptions = {
    location: ["North America", "Europe", "Middle East", "Asia", "Africa", "Australia", "South America"],
    medium: [
      "Installation", 
      "Social Practice", 
      "Mixed Media", 
      "Sculpture", 
      "Performance", 
      "Mural",           // Added Mural
      "Conceptual", 
      "Video", 
      "Tech-enabled"
      // Removed "Photography"
    ],
    invisibleThread: [
      "Soft Resistance",
      "Feminist Body", 
      "Absurd as Method",
      "You Were Here",
      "Wild Systems",
      "(Dis)placement",
      "Bureaucratic Fantasy",
      "Informal Monuments"
    ]
  };

  // 3) Country to region mapping - updated with South America
  const getRegion = (country) => {
    const regionMap = {
      "USA": "North America",
      "Mexico": "North America",
      "France": "Europe",
      "Germany": "Europe",
      "Spain": "Europe",
      "Portugal": "Europe",
      "United Kingdom": "Europe",
      "Switzerland": "Europe",
      "Czech Republic": "Europe",
      "Sweden": "Europe",
      "Netherlands": "Europe",
      "Austria": "Europe",
      "Lebanon": "Middle East",
      "Iraq": "Middle East",
      "Iran": "Middle East",
      "Qatar": "Middle East",
      "China": "Asia",
      "Thailand": "Asia",
      "Taiwan": "Asia",
      "South Korea": "Asia",
      "South Africa": "Africa",
      "Angola": "Africa",
      "Nigeria": "Africa",
      "Colombia": "South America",
      "South America": "South America",
      "Australia": "Australia"
    };
    return regionMap[country] || "Other";
  };

  // 4) Memoized filtering - updated to use invisibleThread
  const filtered = useMemo(() => {
    return artistsProp.filter(artist => {
      const locationMatch = selected.location.size === 0 || 
        selected.location.has(getRegion(artist.location));
      
      const mediumMatch = selected.medium.size === 0 || 
        artist.medium.some(m => selected.medium.has(m));
      
      const invisibleThreadMatch = selected.invisibleThread.size === 0 || 
        artist.invisibleThread.some(thread => selected.invisibleThread.has(thread));
      
      return locationMatch && mediumMatch && invisibleThreadMatch;
    });
  }, [artistsProp, selected]);

  // 5) Toggle filter function - updated for invisibleThread
  const toggle = (filterType, value) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      const newSet = new Set(newSelected[filterType]);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      newSelected[filterType] = newSet;
      return newSelected;
    });
  };

  // 6) Clear all filters function - updated for invisibleThread
  const clearAllFilters = () => {
    setSelected({
      location: new Set(),
      medium: new Set(),
      invisibleThread: new Set()
    });
  };

  // 7) Check if any filters are active - updated for invisibleThread
  const hasActiveFilters = selected.location.size > 0 || selected.medium.size > 0 || selected.invisibleThread.size > 0;

  // Updated handleArtistClick for external Framer URLs
  const handleArtistClick = (artist) => {
    // Convert artist name to URL-friendly slug
    const artistSlug = artist.artistName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    // Base URL for your Framer website
    const baseUrl = "https://uncommissioned.art";
    
    // Navigate to the artist page
    window.open(`${baseUrl}/artists/${artistSlug}`, '_blank'); // Opens in new tab
  };

  // Also trigger height update when filtered results change
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      const height = document.body.scrollHeight;
      window.parent.postMessage(
        { type: "embed-auto-height", height: height },
        "*"
      );
    }, 100);
    
    return () => clearTimeout(timer);
  }, [filtered]); // This runs whenever the filtered results change

  return (
    <div 
      className={`${darkMode ? 'bg-black' : 'bg-[#F7F2E8]'} font-['Source_Serif_4','serif']`}
      style={{ 
        overflow: 'hidden',
        minHeight: '100vh',
        height: 'auto',
        fontFamily: "'Source Serif 4', serif",
        // Hide scrollbars but allow scrolling
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // Internet Explorer 10+
      }}
    >
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        * {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Ensure the body and html also hide scrollbars */
        body, html {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        body::-webkit-scrollbar, html::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-4 max-w-7xl mx-auto">
        
        {/* Map */}
        <div className="mb-12">
          <InteractiveMap artists={artistsProp} filteredArtists={filtered} darkMode={darkMode} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* Location Filters */}
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-left tracking-wider" style={{color: '#B42C2C'}}>
                location
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {filterOptions.location.map(location => (
                  <FilterButton
                    key={location}
                    label={location}
                    isActive={selected.location.has(location)}
                    onClick={() => toggle('location', location)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>

            {/* Medium Filters */}
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-left tracking-wider" style={{color: '#B42C2C'}}>
                medium
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {filterOptions.medium.map(medium => (
                  <FilterButton
                    key={medium}
                    label={medium}
                    isActive={selected.medium.has(medium)}
                    onClick={() => toggle('medium', medium)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>

            {/* Invisible Thread Filters */}
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-left tracking-wider" style={{color: '#B42C2C'}}>
                invisible thread
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {filterOptions.invisibleThread.map(thread => (
                  <FilterButton
                    key={thread}
                    label={thread}
                    isActive={selected.invisibleThread.has(thread)}
                    onClick={() => toggle('invisibleThread', thread)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count and Clear filters */}
        <div className="mb-6 flex justify-center items-center gap-4">
          <p className={`font-['Source_Serif_4','serif'] ${darkMode ? 'text-[#95989A]' : 'text-gray-600'}`} style={{fontSize: '16px', lineHeight: '32px'}}>
            Showing {filtered.length} of {artistsProp.length} artists
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="hover:underline font-['Source_Serif_4','serif']"
              style={{color: '#B42C2C', fontSize: '16px', lineHeight: '32px'}}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map(artist => (
            <div 
              key={artist.id} 
              className="cursor-pointer hover:opacity-80 transition-opacity group"
              onClick={() => handleArtistClick(artist)}
            >
              <div className={`aspect-square overflow-hidden mb-3 relative ${darkMode ? 'bg-white border border-white' : 'bg-gray-100'}`}>
                <img 
                  src={artist.thumbnailURL} 
                  alt={artist.artworkTitle}
                  className="w-full h-full object-cover hover:scale-105 transition-transform grayscale"
                  loading="lazy"
                  decoding="async"
                />
                {/* Red Overlay on Hover - Default visible on mobile */}
                <div className="absolute inset-0 bg-[#B42C2C] flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-70 transition-opacity duration-300">
                  <div className="text-center">
                    <p className="text-white font-['Source_Serif_4','serif'] text-sm md:text-base font-medium tracking-wider drop-shadow-lg">
                      WORK IN<br/>PROGRESS
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className={`font-medium font-['Source_Serif_4','serif'] ${darkMode ? 'text-white' : 'text-black'}`} style={{fontSize: '20px', lineHeight: '32px'}}>
                  {artist.artistName}
                </h3>
                <p className="italic font-['Source_Serif_4','serif']" style={{color: '#95989A', fontSize: '16px', lineHeight: '16px'}}>
                  {artist.artworkTitle}
                </p>
                <p className="font-['Source_Serif_4','serif']" style={{color: '#95989A', fontSize: '16px', lineHeight: '16px'}}>
                  {artist.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}