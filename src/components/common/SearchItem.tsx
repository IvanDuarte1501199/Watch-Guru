import { MultiGenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import { PersonProps } from '@appTypes/person/personProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

interface SearchItemProps {
  item: MultiGenericItemProps;
  onClick?: () => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ item, onClick }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  const getMediaTypeFullName = (mediaType: string) => {
    switch (mediaType) {
      case 'movie':
        return t.movie;
      case 'tv':
        return t.tvShow;
      case 'person':
        return t.person;
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
    <li className="hover:bg-slate-900 transition-colors duration-200 cursor-pointer" onClick={onClick}>
      <Link to={getItemLink()} className="p-2.5 flex items-center gap-4 w-full">
        <img
          src={getSrcPath(item)}
          alt={((item as MovieProps).title) || (item as TvProps | PersonProps).name}
          className="w-10 h-14 object-cover rounded shadow-sm border border-slate-800"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {((item as MovieProps).title) || (item as TvProps | PersonProps).name}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {getMediaTypeFullName(item.media_type)}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default SearchItem;
