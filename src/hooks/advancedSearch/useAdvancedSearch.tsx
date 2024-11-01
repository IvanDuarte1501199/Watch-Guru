import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';
import { TmdbGenericResponse } from '@appTypes/common/tmdbResponse';
import { advancedSearch } from '@services/advancedSearchService';
import { useState, useEffect } from 'react';

interface UseAdvancedSearchProps {
  mediaType: MediaType;
  initialParams: {
    sort_by: string;
    with_genres?: string;
    include_adult: boolean;
  };
}

export const useAdvancedSearch = ({ mediaType, initialParams }: UseAdvancedSearchProps) => {
  const [response, setResponse] = useState<TmdbGenericResponse>({} as TmdbGenericResponse);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvancedSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await advancedSearch(mediaType, { ...initialParams, page });
      setResponse(data);
    } catch (err) {
      setError('Error loading results');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancedSearch();
  }, [mediaType, initialParams, page]);

  return {
    results: response.results,
    page: response.page,
    total_pages: response.total_pages,
    total_results: response.total_results,
    isLoading,
    error,
    setPage,
    fetchAdvancedSearch
  };
};
