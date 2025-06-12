import React, { useState, useMemo } from "react";
import { artists as dummyArtists } from "../data/artistsData";
import InteractiveMap from './InteractiveMap';

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

export default function FilterArtistGrid({ artists = dummyArtists }) {
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
      "France": "Europe",
      "Germany": "Europe",
      "Russia": "Europe",
      "China": "Asia",
      "Japan": "Asia",
      "Australia": "Australia",
      "South Africa": "Africa"
      // Add more mappings as needed
    };
    
    return regionMap[country] || "Other";
  };

  // 4) Memoized filtering
  const filtered = useMemo(() => {
    return artists.filter(artist => {
      // Location filtering - check if any selected region matches artist's region
      const locationMatch = () => {
        if (selected.location.size === 0) return true;
        const artistRegion = getRegion(artist.location);
        return selected.location.has(artistRegion);
      };
      
      // Medium filtering - check if any selected medium matches artist's mediums
      const mediumMatch = () => {
        if (selected.medium.size === 0) return true;
        return artist.medium.some(m => selected.medium.has(m));
      };
      
      // Curator filtering - check if selected curator matches artist's curator
      const curatorMatch = () => {
        if (selected.curator.size === 0) return true; 
        return selected.curator.has(artist.curator);
      };
      
      return locationMatch() && mediumMatch() && curatorMatch();
    });
  }, [artists, selected]);

  // 4) Toggle filter function
  const toggle = (filterType, value) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      const currentSet = new Set(newSelected[filterType]);
      
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }
      
      newSelected[filterType] = currentSet;
      return newSelected;
    });
  };

  // 5) Clear all filters function
  const clearAllFilters = () => {
    setSelected({
      location: new Set(),
      medium: new Set(),
      curator: new Set()
    });
  };

  // 6) Check if any filters are active
  const hasActiveFilters = selected.location.size > 0 || selected.medium.size > 0 || selected.curator.size > 0;

  return (
    <div className="bg-[#F5F0E6]">
      <div className="max-w-[1400px] mx-auto px-12 py-8">
        {/* Page header - updated to match screenshot
        <h1 className="text-center text-6xl font-medium mb-8 uppercase font-['Bruno_Ace_SC','Arial']">
          Artwork
        </h1> */}
        
        {/* Interactive Map - replaces static map image */}
        <InteractiveMap 
          artists={artists} 
          filteredArtists={filtered} 
        />
        
        {/* Filter sections - responsive layout */}
        <div className="flex justify-center mb-24">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-32 w-full max-w-6xl">
            {/* Location filters */}
            <div className="min-w-[250px] flex-1">
              <h2 className="text-2xl font-normal mb-6 uppercase font-['Bruno_Ace_SC','Arial']">Location</h2>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  key="North America"
                  label="North America"
                  isActive={selected.location.has("North America")}
                  onClick={() => toggle("location", "North America")}
                />
                <FilterButton
                  key="South America"
                  label="South America"
                  isActive={selected.location.has("South America")}
                  onClick={() => toggle("location", "South America")}
                />
                <FilterButton
                  key="Europe"
                  label="Europe"
                  isActive={selected.location.has("Europe")}
                  onClick={() => toggle("location", "Europe")}
                />
                <FilterButton
                  key="Africa"
                  label="Africa"
                  isActive={selected.location.has("Africa")}
                  onClick={() => toggle("location", "Africa")}
                />
                <FilterButton
                  key="Asia"
                  label="Asia"
                  isActive={selected.location.has("Asia")}
                  onClick={() => toggle("location", "Asia")}
                />
                <FilterButton
                  key="Australia"
                  label="Australia"
                  isActive={selected.location.has("Australia")}
                  onClick={() => toggle("location", "Australia")}
                />
              </div>
            </div>
            
            {/* Medium filters */}
            <div className="min-w-[250px] flex-1">
              <h2 className="text-2xl font-normal mb-6 uppercase font-['Bruno_Ace_SC','Arial']">Medium</h2>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  key="Installation"
                  label="Installation"
                  isActive={selected.medium.has("Installation")}
                  onClick={() => toggle("medium", "Installation")}
                />
                <FilterButton
                  key="Performance"
                  label="Performance"
                  isActive={selected.medium.has("Performance")}
                  onClick={() => toggle("medium", "Performance")}
                />
                <FilterButton
                  key="Sculpture"
                  label="Sculpture"
                  isActive={selected.medium.has("Sculpture")}
                  onClick={() => toggle("medium", "Sculpture")}
                />
                <FilterButton
                  key="Mixed Media"
                  label="Mixed Media"
                  isActive={selected.medium.has("Mixed Media")}
                  onClick={() => toggle("medium", "Mixed Media")}
                />
                <FilterButton
                  key="Photography"
                  label="Photography"
                  isActive={selected.medium.has("Photography")}
                  onClick={() => toggle("medium", "Photography")}
                />
                <FilterButton
                  key="Video"
                  label="Video"
                  isActive={selected.medium.has("Video")}
                  onClick={() => toggle("medium", "Video")}
                />
                <FilterButton
                  key="Digital Media"
                  label="Digital Media"
                  isActive={selected.medium.has("Digital Media")}
                  onClick={() => toggle("medium", "Digital Media")}
                />
                <FilterButton
                  key="Social Practice"
                  label="Social Practice"
                  isActive={selected.medium.has("Social Practice")}
                  onClick={() => toggle("medium", "Social Practice")}
                />
                <FilterButton
                  key="Conceptual"
                  label="Conceptual"
                  isActive={selected.medium.has("Conceptual")}
                  onClick={() => toggle("medium", "Conceptual")}
                />
                <FilterButton
                  key="Interdisciplinary"
                  label="Interdisciplinary"
                  isActive={selected.medium.has("Interdisciplinary")}
                  onClick={() => toggle("medium", "Interdisciplinary")}
                />
                <FilterButton
                  key="Textile"
                  label="Textile"
                  isActive={selected.medium.has("Textile")}
                  onClick={() => toggle("medium", "Textile")}
                />
                <FilterButton
                  key="Drawing"
                  label="Drawing"
                  isActive={selected.medium.has("Drawing")}
                  onClick={() => toggle("medium", "Drawing")}
                />
              </div>
            </div>
            
            {/* Curator filters */}
            <div className="min-w-[200px] flex-1">
              <h2 className="text-2xl font-normal mb-6 uppercase font-['Bruno_Ace_SC','Arial']">Curator</h2>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  key="Sebastian"
                  label="Sebastian"
                  isActive={selected.curator.has("Sebastian")}
                  onClick={() => toggle("curator", "Sebastian")}
                />
                <FilterButton
                  key="Miko"
                  label="Miko"
                  isActive={selected.curator.has("Miko")}
                  onClick={() => toggle("curator", "Miko")}
                />
                <FilterButton
                  key="LaRissa"
                  label="LaRissa"
                  isActive={selected.curator.has("LaRissa")}
                  onClick={() => toggle("curator", "LaRissa")}
                />
                <FilterButton
                  key="Marek"
                  label="Marek"
                  isActive={selected.curator.has("Marek")}
                  onClick={() => toggle("curator", "Marek")}
                />
                <FilterButton
                  key="Taylor"
                  label="Taylor"
                  isActive={selected.curator.has("Taylor")}
                  onClick={() => toggle("curator", "Taylor")}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Results counter */}
        <div className="text-center mb-8">
          <p className="text-sm font-['Source_Serif_4','serif'] text-gray-600">
            Showing {filtered.length} of {artists.length} artworks
            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters}
                className="ml-4 text-red-600 underline hover:no-underline"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Artist grid - responsive with fewer columns on smaller screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12 mt-8">
          {filtered.map(artist => (
            <div key={artist.id} className="mb-4">
              <div className="w-full aspect-square bg-white mb-2 overflow-hidden border border-gray-200">
                <img 
                  src={artist.thumbnailURL}
                  alt={`${artist.artworkTitle} by ${artist.artistName}`}
                  className="w-full h-full object-cover grayscale" 
                />
              </div>
              <p className="text-sm leading-6 font-['Source_Serif_4','serif']">
                {artist.artworkTitle}<br/>
                {artist.artistName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}