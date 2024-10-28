import React from 'react';

interface TvShowPosterProps {
  src: string;
  alt: string;
}

const TvShowPoster = ({ src, alt }: TvShowPosterProps) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className="w-full md:w-1/3 rounded-lg shadow-lg"
  />
);

export default TvShowPoster;
