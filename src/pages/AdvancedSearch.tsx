import { MediaType } from '@appTypes/common/MediaType';
import { Genre } from '@appTypes/genres/genre';
import { Layout } from '@components/common/Layout';
import Pagination from '@components/common/Pagination';
import MediaGrid from '@components/shared/MediaGrid';
import { useAdvancedSearch } from '@hooks/advancedSearch/useAdvancedSearch';
import useGenres from '@hooks/useGenres';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(12px)',
    borderColor: state.isFocused ? '#5fb3cd' : 'rgba(73, 131, 182, 0.2)',
    boxShadow: state.isFocused ? '0 0 0 1px #5fb3cd' : 'none',
    color: '#ffffff',
    '&:hover': {
      borderColor: '#5fb3cd',
    },
    borderRadius: '0.5rem',
    padding: '2px',
    borderWidth: '1px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#090530',
    border: '1px solid rgba(73, 131, 182, 0.15)',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
    borderRadius: '0.5rem',
    zIndex: 50,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#5fb3cd' 
      : state.isFocused 
        ? 'rgba(95, 179, 205, 0.15)' 
        : 'transparent',
    color: state.isSelected ? '#08042c' : '#ffffff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#5fb3cd',
      color: '#08042c',
    },
    padding: '10px 14px',
    fontSize: '0.875rem',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(95, 179, 205, 0.15)',
    border: '1px solid rgba(95, 179, 205, 0.25)',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#5fb3cd',
    fontWeight: '600',
    fontSize: '0.75rem',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#5fb3cd',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#5fb3cd',
      color: '#08042c',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#ffffff',
    fontSize: '0.875rem',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.875rem',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#5fb3cd',
    },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#ef4444',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }),
};

const AdvancedSearchPage = () => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  const sortByMoviesOptions = [
    { value: "popularity", label: t.popularity },
    { value: "release_date", label: t.releaseDate },
    { value: "vote_average", label: t.voteAverage },
    { value: "revenue", label: t.revenue },
    { value: "vote_count", label: t.voteCount },
  ];

  const sortByTvShowsOptions = [
    { value: "popularity", label: t.popularity },
    { value: "release_date", label: t.releaseDate },
    { value: "vote_average", label: t.voteAverage },
    { value: "vote_count", label: t.voteCount },
  ];

  const orderOptions = [
    { value: "desc", label: t.descending },
    { value: "asc", label: t.ascending },
  ];

  const MediaTypesSwitch = {
    Tv: t.tvShows,
    Movie: t.movies,
  };

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const newPage = Number(query.get('page')) || 1;
  const navigate = useNavigate();

  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Movie);

  const handleMediaTypeChange = (type: MediaType) => {
    goToPage(1);
    setMediaType(type);
  };

  const goToPage = (page: number) => {
    query.set('page', page.toString());
    navigate({
      pathname: '/search',
      search: query.toString(),
    });
    setPage(page);
  };

  const { moviesGenres, tvGenres } = useGenres();

  const [filterGenres, setFilterGenres] = useState<Genre[]>([]);

  useEffect(() => {
    if (mediaType === MediaType.Movie) {
      setFilterGenres(moviesGenres);
    } else if (mediaType === MediaType.Tv) {
      setFilterGenres(tvGenres);
    }
  }, [mediaType, moviesGenres, tvGenres]);

  const [filters, setFilters] = useState({
    sort: "popularity",
    order: "desc",
    sort_by: "popularity.desc",
    with_genres: '',
    include_adult: false,
  });

  const handleSortChange = (selectedOption: SingleValue<{ value: string; label: string }>,) => {
    goToPage(1);
    if (selectedOption) {
      const selectedSort = selectedOption.value;
      setFilters((prev) => ({
        ...prev,
        sort: selectedSort,
        sort_by: `${selectedSort}.${prev.order}`,
      }));
    }
  };

  const handleOrderChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    goToPage(1);
    if (selectedOption) {
      const selectedOrder = selectedOption.value;
      setFilters((prev) => ({
        ...prev,
        order: selectedOrder,
        sort_by: `${prev.sort}.${selectedOrder}`,
      }));
    }
  };

  const handleGenreChange = (selectedOption: any | null) => {
    const genreValues = selectedOption && selectedOption.length > 0 
      ? selectedOption.map((op: any) => op.value).join(',') 
      : '';
    setFilters((prev) => ({
      ...prev,
      with_genres: genreValues,
    }));
    goToPage(1);
  };

  const { results, isLoading, page, total_pages, setPage } = useAdvancedSearch({
    mediaType,
    initialParams: filters,
  });

  useEffect(() => {
    setPage(newPage);
  }, [newPage]);

  return (
    <Layout>
      <h1 className='h1-guru text-center mt-20 mb-6'>{t.advancedSearch}</h1>
      <form className='flex flex-col gap-10'>
        <div className='flex m-auto'>
          {Object.keys(MediaTypesSwitch).map((media) => {
            const mediaKey = media as keyof typeof MediaTypesSwitch;
            const isActive = mediaKey.toLowerCase() === mediaType.toLowerCase();
            return (
              <p
                key={mediaKey}
                onClick={() => handleMediaTypeChange(MediaType[mediaKey])}
                className={`p-guru text-xl p-2 cursor-pointer transition-all duration-300 ${isActive ? 'bg-secondary' : ''} ${mediaKey === 'Tv' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
              >
                {MediaTypesSwitch[mediaKey]}
              </p>
            );
          })}
        </div>
        <span className='flex flex-col gap-4 lg:flex-row items-start lg:items-center justify-between mb-4 md:mb-8'>
          <span>
            <h2 className='h2-guru text-base mb-2 lg:mb-0'>{t.filterByGenre}</h2>
            <Select
              options={filterGenres.map(genre => ({ value: genre.id.toString(), label: genre.name }))}
              onChange={handleGenreChange}
              isClearable
              isMulti
              isSearchable
              styles={customSelectStyles}
              className='w-80'
              placeholder={currentLanguage === 'es' ? "Seleccionar género..." : "Select genre..."}
              noOptionsMessage={() => currentLanguage === 'es' ? "No hay opciones" : "No options"}
            />
          </span>
          <span className='flex gap-2 items-start lg:items-center flex-col lg:flex-row'>
            <h2 className='h2-guru text-base lg:mr-4'>{t.orderBy}</h2>
            <span className='flex gap-2 lg:gap-4 items-center'>
              <Select
                options={(mediaType === MediaType.Movie) ? sortByMoviesOptions : sortByTvShowsOptions}
                isSearchable={false}
                onChange={handleSortChange}
                defaultValue={(mediaType === MediaType.Movie) ? sortByMoviesOptions[0] : sortByTvShowsOptions[0]}
                styles={customSelectStyles}
                className='w-32 lg:w-40'
              />
              <Select
                options={orderOptions}
                isSearchable={false}
                onChange={handleOrderChange}
                defaultValue={orderOptions[0]}
                styles={customSelectStyles}
                className='w-36 min-w-36 max-w-36'
              />
            </span>
          </span>
        </span>
      </form>
      {results && results.length > 0 && <div className='flex flex-wrap gap-4'>
        <MediaGrid media={results} />
      </div>}

      <Pagination currentPage={page} totalPages={total_pages} path='/search' customClass='mb-4 md:mb-8' />

    </Layout>
  );
};

export default AdvancedSearchPage;
