import { MultiGenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import { PersonProps } from '@appTypes/person/personProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { Link } from 'react-router-dom';

interface SearchItemProps {
  item: MultiGenericItemProps;
  onClick?: () => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ item, onClick }) => {
  const getMediaTypeFullName = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return 'Movie';
      case 'tv':
        return 'TV Show';
      case 'person':
        return 'Person';
      default:
        return '';
    }
  };

  const getSrcPath = (item: MultiGenericItemProps) => {
    if (item.media_type === MediaType.Movie || item.media_type === MediaType.Tv) {
      const { poster_path } = item as MovieProps | TvProps;
      return poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : '/movie-primary.svg';
    }

    if (item.media_type === MediaType.Person) {
      const { profile_path } = item as PersonProps;
      return profile_path
        ? `https://image.tmdb.org/t/p/w500${profile_path}`
        : '/user.svg';
    }

    return '/movie.svg';
  };

  const getItemLink = () => {
    switch (item.media_type) {
      case MediaType.Movie:
        return `/movie/${item.id}`;
      case MediaType.Tv:
        return `/tv-show/${item.id}`;
      case MediaType.Person:
        return `/person/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <li className='flex items-center gap-4 hover:bg-gray dark:hover:bg-gray-700' onClick={onClick}>
      <Link to={getItemLink()} className='p-2 flex items-center gap-4 w-full'>
        <img
          src={getSrcPath(item)}
          alt={((item as MovieProps).title) || (item as TvProps | PersonProps).name}
          className='w-10 h-12 object-cover'
        />
        <div>
          <h3 className='text-md font-semibold line-clamp-1'>{((item as MovieProps).title) || (item as TvProps | PersonProps).name}</h3>
          <p className='text-sm text-tertiary dark:text-gray-400'>
            {getMediaTypeFullName(item.media_type)}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default SearchItem;
