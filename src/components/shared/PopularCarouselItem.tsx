import { MediaType } from '@appTypes/common/MediaType';
import React from 'react';
import { useNavigate } from 'react-router';

export interface PopularCarouselItemProps {
  backdrop_path: string;
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  overview?: string;
  media_type: string;
  genres?: string[];
}

const PopularCarouselItem: React.FC<PopularCarouselItemProps> = ({
  id,
  backdrop_path,
  title,
  release_date,
  vote_average,
  overview,
  media_type,
  genres
}) => {
  const navigate = useNavigate();

  const getUrlByMediaType = () => {
    switch (media_type) {
      case MediaType.Movie:
        return `/movie/${id}`;
      case MediaType.Tv:
        return `/tv-show/${id}`;
      case MediaType.Person:
        return `/person/${id}`;
      default:
        return '#';
    }
  };
  const handleRedirect = () => navigate(getUrlByMediaType());

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border border-slate-900 bg-slate-950 mx-2 my-4"
      onClick={handleRedirect}
    >
      {/* Background Image Container */}
      <div className="h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden relative">
        {backdrop_path ? (
          <img
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
            title={title}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        {/* Soft dark vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>
      
      {/* Absolute details box at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col gap-3 justify-end z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-20">
        
        {/* Genre Tags */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {genres.map((genre) => (
              <span 
                key={genre} 
                className="bg-secondary/10 border border-secondary/20 backdrop-blur-md text-secondary text-[11px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* Movie/Show Title */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none group-hover:text-secondary transition-colors duration-200">
          {title}
        </h2>

        {/* Overview Description */}
        {overview && (
          <p className="text-slate-300 text-sm md:text-base font-normal max-w-3xl line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
            {overview}
          </p>
        )}

        {/* Meta Info Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-2 pt-3 border-t border-slate-900/60 text-slate-300">
          {release_date && (
            <span className="bg-slate-900/80 border border-slate-800/80 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm">
              {new Date(release_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
            </span>
          )}
          {media_type && (
            <span className="bg-slate-900/80 border border-slate-800/80 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm">
              {media_type === MediaType.Tv ? 'TV Show' : 'Movie'}
            </span>
          )}
          {vote_average > 0 && (
            <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center gap-1.5">
              ★ {vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularCarouselItem;
