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

interface InfoBadgeProps {
  content: string;
  isHover: boolean;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ content, isHover }) => (
  <p
    className={`p-guru text-white bg-gray bg-opacity-30 px-2 py-1 rounded-sm transition-transform duration-300 ease-in-out transform
      ${isHover ? 'translate-y-0' : 'xl:translate-y-full'}`}
  >
    {content}
  </p>
);

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
  const [isHover, setIsHover] = React.useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  const handleRedirect = () => navigate(`/${media_type}/${id}`);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleRedirect}
    >
      <img
        loading="lazy"
        src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
        title={title}
        alt={title}
        className={`h-full w-full rounded-md object-cover filter brightness-50 transition-all duration-300 ease-in-out ${isHover ? 'grayscale blur-sm' : 'grayscale-0'}`}
      />
      <div>
        <p className={`p-guru text-lg xl:text-2xl absolute top-2 xl:top-6 left-4 text-white transition-all ${isHover ? 'text-4xl' : ''}`}>
          {title}
        </p>
        <p className="p-guru line-clamp-2 xl:line-clamp-4 mx-4 absolute top-10 xl:top-16">{overview}</p>

        {genres && genres.length > 0 && (
          <div className="p-guru text-white text-sm flex flex-wrap gap-1 xl:gap-6 mx-4 absolute top-24 xl:top-48">
            {genres.map((genre) => (
              <span key={genre} className="bg-gray-700 bg-opacity-60 bg-primary p-2 rounded-md">
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className={`absolute bottom-2 xl:bottom-4 left-4 flex space-x-4 xl:space-x-8 ${isHover ? 'opacity-100' : 'xl:opacity-0'} transition-opacity duration-300`}>
          {release_date && (
            <InfoBadge
              content={new Date(release_date).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
              isHover={isHover}
            />
          )}
          {media_type && (
            <InfoBadge
              content={`${MediaType.Tv === media_type ? 'TV Show' : 'Movie'}`}
              isHover={isHover}
            />
          )}
          {vote_average && (
            <InfoBadge
              content={`${vote_average.toFixed(1)} / 10`}
              isHover={isHover}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularCarouselItem;
