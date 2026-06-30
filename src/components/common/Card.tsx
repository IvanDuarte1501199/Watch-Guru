import React, { useState } from 'react';
import { CardProps } from '@appTypes/common/CardProps';
import { Fade } from 'react-awesome-reveal';
import { MediaType } from '@appTypes/common/MediaType';
import CircularVote from '@components/shared/CircularVote';
import { Link } from 'react-router-dom';

export const Card: React.FC<CardProps> = ({
  id,
  poster_path,
  vote_average,
  name,
  title,
  media_type,
  release_date,
  first_air_date,
}: CardProps) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  const url = media_type === MediaType.Tv ? 'tv-show' : 'movie';
  const displayTitle = title || name || '';
  const dateStr = release_date || first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : null;

  return (
    <Fade triggerOnce className="h-full">
      <article
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full min-h-[340px] flex flex-col rounded-xl bg-slate-950 border border-slate-800/80 shadow-md overflow-hidden hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-300"
      >
        <Link to={`/${url}/${id}`} className="block h-full w-full relative overflow-hidden">
          {/* Image Container with Zoom */}
          <div className="h-full w-full overflow-hidden relative">
            {poster_path ? (
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                title={displayTitle}
                alt={displayTitle}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div
                className="flex h-full min-h-[340px] items-center justify-center bg-gradient-to-br from-slate-900 to-slate-850 text-white text-center p-6"
                title={displayTitle}
              >
                <h2 className="text-base font-bold tracking-tight text-gray-300">{displayTitle}</h2>
              </div>
            )}
            
            {/* Dark Gradient / Glass Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Title & Release Year Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-sm font-bold text-white tracking-wide line-clamp-2 leading-snug group-hover:text-secondary transition-colors duration-200">
                {displayTitle}
              </h3>
              {year && (
                <span className="text-xs font-semibold text-slate-400">
                  {year}
                </span>
              )}
            </div>
          </div>

          {/* Rating Badge - Glassmorphic position */}
          {vote_average > 0 && (
            <span className="absolute left-3 top-3 z-20">
              <CircularVote voteAverage={vote_average} />
            </span>
          )}
        </Link>
      </article>
    </Fade>
  );
};
