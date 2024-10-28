import React from 'react';
import { TvProps } from "@appTypes/tv/tvProps";
import GenresList from '@components/genres/GenreList';

interface TvShowDetailsProps {
  tvShow: TvProps;
}

const TvShowDetails = ({ tvShow }: TvShowDetailsProps) => (
  <div className="mt-6 md:mt-0 animate-fade-in-left">
    <h1 className="text-4xl font-bold mb-4">{tvShow?.name}</h1>
    <p className="text-lg mb-6">{tvShow?.overview}</p>
    {tvShow?.genres && <GenresList genres={tvShow.genres} />}
  </div>
);

export default TvShowDetails;
