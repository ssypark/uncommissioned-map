import React, { useState, useMemo } from 'react';
import InteractiveMap from './InteractiveMap';
import { artists } from '../data/artistsData';

// Filter button component for reusability
const FilterButton = ({ label, isActive, onClick, darkMode = false }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-md transition-colors font-['Source_Serif_4','serif'] ${
      isActive 
        ? 'text-white' 
        : darkMode 
          ? 'text-white hover:text-[#B42C2C]' 
          : 'text-gray-700 hover:text-[#B42C2C]'
    } ${
      darkMode 
        ? `border ${isActive ? 'bg-[#B42C2C] border-[#B42C2C]' : 'border-white hover:border-[#B42C2C]'}` 
        : `border ${isActive ? 'bg-[#B42C2C] border-[#B42C2C]' : 'border-black hover:border-[#B42C2C]'}`
    }`}
    style={isActive ? {backgroundColor: '#B42C2C', borderColor: '#B42C2C'} : {}}
  >
    {label}
  </button>
);

export default function FilterArtistGrid({ artists: artistsProp = artists, darkMode: darkModeProp }) {
  // Check URL parameter for dark mode
  const urlParams = new URLSearchParams(window.location.search);
  const darkModeFromURL = urlParams.get('darkMode') === 'true';
  
  // Use prop if provided, otherwise use URL parameter
  const darkMode = darkModeProp !== undefined ? darkModeProp : darkModeFromURL;

  // 1) Track selected filters
  const [selected, setSelected] = useState({
    location: new Set(),
    medium: new Set(),
    curator: new Set()
  });

  // 2) Define filter options to match your actual data
  const filterOptions = {
    location: ["North America", "Europe", "Middle East", "Asia", "Africa", "Australia"],
    medium: [
      "Installation", 
      "Social Practice", 
      "Mixed Media", 
      "Film", 
      "Sculpture", 
      "Performance", 
      "Photography", 
      "Conceptual", 
      "Video", 
      "Mural", 
      "Painting", 
      "Street Art", 
      "Textile",
      "Curatorial", 
      "Ecological", 
      "Land Art", 
      "Ephemeral", 
      "Sound-based",
      "Tech-enabled",  // For AR and technology-based works
     
    ],
    curator: ["Sebastian", "Miko", "LaRissa", "Marek", "Taylor"]
  };

  // 3) Country to region mapping
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
      "Netherlands": "Europe",    // Added for Heimprofi
      "Lebanon": "Middle East",
      "Iraq": "Middle East",
      "Iran": "Middle East",
      "Qatar": "Middle East",
      "China": "Asia",
      "Thailand": "Asia",
      "Taiwan": "Asia",
      "South Korea": "Asia",
      "South Africa": "Africa",
      "Democratic Republic of Congo": "Africa",
      "Angola": "Africa",         // Added for Iris Buchholz Chocolate
      "Australia": "Australia"
    };
    return regionMap[country] || "Other";
  };

  // 4) Memoized filtering
  const filtered = useMemo(() => {
    return artistsProp.filter(artist => {
      const locationMatch = selected.location.size === 0 || 
        selected.location.has(getRegion(artist.location));
      
      const mediumMatch = selected.medium.size === 0 || 
        artist.medium.some(m => selected.medium.has(m));
      
      const curatorMatch = selected.curator.size === 0 || 
        selected.curator.has(artist.curator);
      
      return locationMatch && mediumMatch && curatorMatch;
    });
  }, [artistsProp, selected]);

  // 5) Toggle filter function
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

  // 6) Clear all filters function
  const clearAllFilters = () => {
    setSelected({
      location: new Set(),
      medium: new Set(),
      curator: new Set()
    });
  };

  // 7) Check if any filters are active
  const hasActiveFilters = selected.location.size > 0 || selected.medium.size > 0 || selected.curator.size > 0;

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
    window.open(`${baseUrl}/artistpage/${artistSlug}`, '_blank'); // Opens in new tab
    // OR use this for same tab:
    // window.location.href = `${baseUrl}/artistpage/${artistSlug}`;
  };

  return (
    <div 
      className={`${darkMode ? 'bg-black' : 'bg-[#F7F2E8]'} font-['Source_Serif_4','serif']`}
      style={{ 
        overflow: 'hidden',
        height: 'fit-content',
        fontFamily: "'Source Serif 4', serif" // Explicit fallback
      }}
    >
      <div className="p-4 max-w-7xl mx-auto"> {/* Reduced from p-6 to p-4 */}
        
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

            {/* Curator Filters */}
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-left tracking-wider" style={{color: '#B42C2C'}}>
                curator
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {filterOptions.curator.map(curator => (
                  <FilterButton
                    key={curator}
                    label={curator}
                    isActive={selected.curator.has(curator)}
                    onClick={() => toggle('curator', curator)}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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