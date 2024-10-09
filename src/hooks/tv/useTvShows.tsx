import { useEffect, useState } from 'react';
import { GenericItemProps } from '@types/common/genericItemProps';
import {
    getAiringToday,
    getOnTheAir,
    getPopularTv,
    getTopRatedTv,
    getTrendingTv
} from '@services/tvService';
import { TimeWindow } from '@types/service/imdb';

const useTvShows = (fetchTvShows: () => Promise<GenericItemProps[]>) => {
    const [tvShows, setTvShows] = useState<GenericItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const results = await fetchTvShows();
                setTvShows(results);
            } catch (error) {
                console.error('Error fetching TV shows:', error);
                setError('Failed to load TV shows');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchTvShows]);

    return { tvShows, loading, error };
};

export const useAiringToday = () => useTvShows(getAiringToday);
export const useOnTheAir = () => useTvShows(getOnTheAir);
export const usePopularTv = () => useTvShows(getPopularTv);
export const useTopRatedTv = () => useTvShows(getTopRatedTv);
export const useTrendingTv = (time: TimeWindow = 'week') => useTvShows(() => getTrendingTv(time));