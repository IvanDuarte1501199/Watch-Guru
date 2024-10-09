import { useEffect, useState } from 'react';
import {
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getTrendingMovies
} from '@services/movieService';
import { GenericItemProps } from '@types/common/genericItemProps';

const useMovies = (fetchMovies: () => Promise<GenericItemProps[]>) => {
    const [movies, setMovies] = useState<GenericItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const results = await fetchMovies();
                setMovies(results);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to load movies');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchMovies]);

    return { movies, loading, error };
};

export const useTrendingMovies = () => useMovies(getTrendingMovies);
export const useNowPlayingMovies = () => useMovies(getNowPlayingMovies);
export const usePopularMovies = () => useMovies(getPopularMovies);
export const useTopRatedMovies = () => useMovies(getTopRatedMovies);
export const useUpcomingMovies = () => useMovies(getUpcomingMovies);