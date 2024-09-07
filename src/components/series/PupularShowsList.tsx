import React, { useState, useEffect } from 'react';
import { getPopularShows } from '@services/tmdbService';
import { ShowCardProps } from 'src/types/shows/ShowCardProps';
import { ShowCard } from './ShowCard';

const ShowsList: React.FC = () => {
  const [popularShows, setPopularShows] = useState<any[]>([]);

  useEffect(() => {
      const fetchShows = async () => {
          const popularShowsResult = await getPopularShows();
          setPopularShows(popularShowsResult)
      }
      fetchShows();
      console.log(popularShows)
  }, []);

  return (
    <div>
      <h2 className="h2-guru text-center pb-4">Popular Shows</h2>
      <ul>
        {popularShows.map((s: ShowCardProps, i: number) => (
          <ShowCard key={i} {...s}/>
        ))}
      </ul>
    </div>
  );
};

export default ShowsList;