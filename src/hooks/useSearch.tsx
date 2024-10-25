import { useState, useEffect } from 'react';
import { MediaType } from '@appTypes/common/MediaType';
import { searchByType } from '@services/searchService';
import { useDebounce } from 'use-debounce';
import { MultiGenericItemProps } from '@appTypes/common/genericItemProps';

export const useSearch = (query: string, type?: MediaType,) => {
  const [results, setResults] = useState<MultiGenericItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery] = useDebounce(query, 500);
  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchByType(debouncedQuery, type);
        setResults(data.results);
      } catch (err) {
        setError('Error fetching search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, type]);

  return { results, loading, error };
};
