import React from 'react';
import FilterArtistGrid from './FilterArtistGrid';

export function MapPage({ className }) {
  return (
    <div className={className}>
      <FilterArtistGrid />
    </div>
  );
}