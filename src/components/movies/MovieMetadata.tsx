import React from 'react';

interface MovieMetadataProps {
  releaseDate?: Date;
  rating?: number;
  runtime?: number;
}

const MovieMetadata = ({ releaseDate, rating, runtime }: MovieMetadataProps) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
    {!releaseDate ? <></> : (
      <p className="flex items-center text-lg">
        <img src="/calendar.svg" alt="Release Date" className="w-5 h-5 mr-2" />
        {new Date(releaseDate).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
      </p>
    )}
    {!rating ? <></> : (
      <p className="flex items-center text-lg">
        <img src="/star.svg" alt="Rating" className="w-5 h-5 mr-2" />
        {rating.toFixed(1)} / 10
      </p>
    )}
    {!runtime ? <></> : (
      <p className="flex items-center text-lg">
        <img src="/clock.svg" alt="Runtime" className="w-5 h-5 mr-2" />
        {Math.floor(runtime / 60)}h {runtime % 60}m
      </p>
    )}
  </div>
);

export default MovieMetadata;
