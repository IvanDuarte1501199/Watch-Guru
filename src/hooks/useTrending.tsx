import { useEffect, useState } from 'react';
import { getTrendingAll } from '@services/tmdbService';
import { GenericItemProps } from '@types/common/genericItemProps';

const useTrendingData = () => {
    const [trending, setTrending] = useState<GenericItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const trendingResult = await getTrendingAll();
                setTrending(trendingResult);
            } catch (err) {
                setError("Failed to load trending data");
                console.error('Error fetching trending data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return { trending, isLoading, error };
};

export default useTrendingData;