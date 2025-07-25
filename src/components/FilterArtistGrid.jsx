import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';
import { artists } from '../data/artistsData';

// Filter button component for reusability
const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1 rounded-md border text-sm font-light transition-all font-['Source_Serif_4','serif']
      ${isActive 
        ? "bg-red-600 text-white border-red-600" 
        : "bg-white text-gray-500 border-gray-400 hover:border-gray-600"}
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

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* Map */}
        <div className="mb-12">
          <InteractiveMap artists={artistsProp} filteredArtists={filtered} />
        </div>

        {/* Filter Controls - 3 Column Layout */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* Location Filters */}
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-gray-800 text-center uppercase tracking-wider">
                Location
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
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
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-gray-800 text-center uppercase tracking-wider">
                Medium
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
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
              <h3 className="text-lg font-medium mb-4 font-['Source_Serif_4','serif'] text-gray-800 text-center uppercase tracking-wider">
                Curator
              </h3>
              <div className="flex flex-wrap gap-2 justify-start">
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
        </div>

        {/* Results count and Clear filters - Centered */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600 font-['Source_Serif_4','serif'] mb-2">
            Showing {filtered.length} of {artistsProp.length} artworks
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:underline font-['Source_Serif_4','serif']"
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