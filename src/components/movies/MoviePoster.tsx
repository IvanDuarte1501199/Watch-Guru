import React from 'react';

interface MoviePosterProps {
  src: string;
  alt: string;
}

const MoviePoster = ({ src, alt }: MoviePosterProps) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className="w-full md:w-1/3 rounded-lg shadow-lg object-contain animate-fade-in-right"
  />
);

export default MoviePoster;
