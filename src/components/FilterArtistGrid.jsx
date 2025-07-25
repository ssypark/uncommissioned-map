import React, { useState, useMemo } from 'react';
import InteractiveMap from './InteractiveMap';
import { artists } from '../data/artistsData';

// Filter button component for reusability
const FilterButton = ({ label, isActive, onClick, darkMode = false }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-full transition-colors font-['Source_Serif_4','serif'] ${
      isActive 
        ? 'text-white' 
        : darkMode 
          ? 'text-white hover:text-[#B42C2C]' 
          : 'text-gray-700 hover:text-[#B42C2C]'
    } ${
      darkMode 
        ? `border ${isActive ? 'bg-[#B42C2C] border-[#B42C2C]' : 'border-white hover:border-[#B42C2C]'}` 
        : `border ${isActive ? 'bg-[#B42C2C] border-[#B42C2C]' : 'border-gray-300 hover:border-[#B42C2C]'}`
    }`}
    style={isActive ? {backgroundColor: '#B42C2C', borderColor: '#B42C2C'} : {}}
  >
    {label}
  </button>
);

export default function FilterArtistGrid({ artists: artistsProp = artists, darkMode = false }) {
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
      "Multidisciplinary", 
      "Film", 
      "Sculpture", 
      "Performance", 
      "Photography", 
      "Conceptual", 
      "Interdisciplinary", 
      "Video", 
      "Mural", 
      "Painting", 
      "Street Art", 
      "Textile",
      "Curatorial", 
      "Ecological", 
      "Land Art", 
      "Ephemeral", 
      "Visual Art"
    ],
    curator: ["Sebastian", "Miko", "LaRissa", "Marek", "Taylor"]
  };

  // 3) Country to region mapping (removed South American countries)
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
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-[#F7F2E8]'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        
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
          <p className={`text-sm font-['Source_Serif_4','serif'] ${darkMode ? 'text-[#95989A]' : 'text-gray-600'}`}>
            Showing {filtered.length} of {artistsProp.length} artists
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm hover:underline font-['Source_Serif_4','serif']"
              style={{color: '#B42C2C'}}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(artist => (
            <div 
              key={artist.id} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleArtistClick(artist)}
            >
              <div className={`aspect-square overflow-hidden mb-3 ${darkMode ? 'bg-white border border-white' : 'bg-gray-100'}`}>
                <img 
                  src={artist.thumbnailURL} 
                  alt={artist.artworkTitle}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="space-y-1">
                <h3 className={`font-medium text-sm font-['Source_Serif_4','serif'] ${darkMode ? 'text-white' : 'text-black'}`}>
                  {artist.artistName}
                </h3>
                <p className="text-xs italic font-['Source_Serif_4','serif']" style={{color: '#95989A'}}>
                  {artist.artworkTitle}
                </p>
                <p className="text-xs font-['Source_Serif_4','serif']" style={{color: '#95989A'}}>
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