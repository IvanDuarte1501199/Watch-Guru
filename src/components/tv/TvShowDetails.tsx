import React from 'react';
import { TvProps } from "@appTypes/tv/tvProps";
import GenresList from '@components/genres/GenreList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

interface TvShowDetailsProps {
  tvShow: TvProps;
}

const TvShowDetails = ({ tvShow }: TvShowDetailsProps) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];
  const seasonsCount = tvShow?.seasons?.length || 0;

  return (
    <div className="mt-6 md:mt-0 animate-fade-in-left">
      <h1 className="text-4xl font-bold">{tvShow?.name}</h1>
      <p className='p-guru flex mb-2 md:mb-4'>
        {seasonsCount} {seasonsCount === 1 ? t.seasonSingular : t.seasonsPlural}
      </p>
      {
        tvShow?.overview && <>
          <h2 className="h2-guru pb-2">{t.overview}</h2>
          <p className="text-lg mb-6">{tvShow?.overview}</p>
        </>
      }
      {tvShow?.genres && <GenresList genres={tvShow.genres} />}
    </div>
  );
};

export default TvShowDetails;
