import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';
import { artists } from '../data/artistsData';

// Filter button component for reusability - updating style to match screenshot
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1 rounded-md border text-sm font-light transition-all font-['Source_Serif_4','serif']
      ${isActive 
        ? "bg-red-600 text-white border-red-600" 
        : "bg-white text-gray-500 border-black"}
    `}
  >
    {label}
  </button>
);

export default function FilterArtistGrid({ artists: artistsProp = artists }) {
  const navigate = useNavigate();

  // 1) Track selected filters
  const [selected, setSelected] = useState({
    location: new Set(),
    medium: new Set(),
    curator: new Set()
  });

  // 2) Define predefined filter options based on actual data
  const filterOptions = {
    location: ["North America", "South America", "Europe", "Africa", "Asia", "Australia"],
    medium: ["Installation", "Performance", "Sculpture", "Mixed Media", "Photography", "Video", "Digital Media", "Social Practice", "Conceptual", "Interdisciplinary", "Textile", "Drawing"],
    curator: ["Sebastian", "Miko", "LaRissa", "Marek", "Taylor"]
  };
  
  // 3) Country to region mapping
  const getRegion = (country) => {
    const regionMap = {
      "USA": "North America",
      "Canada": "North America",
      "Mexico": "North America",
      "Netherlands": "Europe",
      "Germany": "Europe",
      "France": "Europe",
      "Russia": "Europe",
      "Belarus": "Europe",
      "Iran": "Asia",
      "China": "Asia",
      "Australia": "Australia",
      "South Africa": "Africa"
    };
    return regionMap[country] || country;
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
      if (newSelected[filterType].has(value)) {
        newSelected[filterType].delete(value);
      } else {
        newSelected[filterType].add(value);
      }
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

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Map */}
        <div className="mb-8">
          <InteractiveMap artists={artistsProp} filteredArtists={filtered} />
        </div>

        {/* Filter Controls */}
        <div className="mb-8 space-y-6">
          
          {/* Clear All Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:underline font-['Source_Serif_4','serif']"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Location Filters */}
          <div>
            <h3 className="text-lg font-medium mb-3 font-['Source_Serif_4','serif'] text-gray-800">
              Filter by Location
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.location.map(location => (
                <FilterButton
                  key={location}
                  label={location}
                  isActive={selected.location.has(location)}
                  onClick={() => toggle('location', location)}
                />
              ))}
            </div>
          </div>

          {/* Medium Filters */}
          <div>
            <h3 className="text-lg font-medium mb-3 font-['Source_Serif_4','serif'] text-gray-800">
              Filter by Medium
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.medium.map(medium => (
                <FilterButton
                  key={medium}
                  label={medium}
                  isActive={selected.medium.has(medium)}
                  onClick={() => toggle('medium', medium)}
                />
              ))}
            </div>
          </div>

          {/* Curator Filters */}
          <div>
            <h3 className="text-lg font-medium mb-3 font-['Source_Serif_4','serif'] text-gray-800">
              Filter by Curator
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.curator.map(curator => (
                <FilterButton
                  key={curator}
                  label={curator}
                  isActive={selected.curator.has(curator)}
                  onClick={() => toggle('curator', curator)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-['Source_Serif_4','serif']">
            Showing {filtered.length} of {artistsProp.length} artists
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(artist => (
            <div 
              key={artist.id} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleArtistClick(artist.id)}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                <img 
                  src={artist.thumbnailURL} 
                  alt={artist.artworkTitle}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-sm font-['Source_Serif_4','serif']">{artist.artistName}</h3>
                <p className="text-xs text-gray-600 italic font-['Source_Serif_4','serif']">{artist.artworkTitle}</p>
                <p className="text-xs text-gray-500 font-['Source_Serif_4','serif']">{artist.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}