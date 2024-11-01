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

const sortByMoviesOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "release_date", label: "Release Date" },
  { value: "vote_average", label: "Vote Average" },
  { value: "revenue", label: "Revenue" },
  { value: "vote_count", label: "Vote Count" },
];

const sortByTvShowsOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "release_date", label: "Release Date" },
  { value: "vote_average", label: "Vote Average" },
  { value: "vote_count", label: "Vote Count" },
];

const orderOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

const MediaTypesSwitch = {
  Tv: 'TV Shows',
  Movie: 'Movies',
};

const AdvancedSearchPage = () => {
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
    if (selectedOption) {
      setFilters((prev) => ({
        ...prev,
        with_genres: selectedOption.map((op) => op.value),
      }));
      goToPage(1);
    }
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
      <h1 className='h1-guru text-center mt-20 mb-6'>Advanced Search</h1>
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
            <h2 className='h2-guru text-base mb-2 lg:mb-0'>Filter by genre</h2>
            <Select
              options={filterGenres.map(genre => ({ value: genre.id.toString(), label: genre.name }))}
              onChange={handleGenreChange}
              isClearable
              isMulti
              isSearchable
              className='rounded-sm w-80'
            />
          </span>
          <span className='flex gap-2 items-start lg:items-center flex-col lg:flex-row'>
            <h2 className='h2-guru text-base lg:mr-4'>Order by</h2>
            <span className='flex gap-2 lg:gap-4 items-center'>
              <Select
                options={(mediaType === MediaType.Movie) ? sortByMoviesOptions : sortByTvShowsOptions}
                isSearchable={false}
                onChange={handleSortChange}
                defaultValue={(mediaType === MediaType.Movie) ? sortByMoviesOptions[0] : sortByTvShowsOptions[0]}
                className='rounded-sm w-32 lg:w-40'
              />
              <Select
                options={orderOptions}
                isSearchable={false}
                onChange={handleOrderChange}
                defaultValue={orderOptions[0]}
                className='rounded-sm w-36 min-w-36 max-w-36'
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
