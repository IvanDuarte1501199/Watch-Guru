import { useEffect, useState } from 'react';
import tmdbApi from '@services/tmdbApi';

export const useSeasonEpisodes = (tvId: string, seasons: any[]) => {
    const [allEpisodes, setAllEpisodes] = useState<Record<number, any[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllEpisodes = async () => {
            setLoading(true);
            setError(null);
            const episodesBySeason: Record<number, any[]> = {};
            try {
                for (const season of seasons) {
                    const response = await tmdbApi.get(`/tv/${tvId}/season/${season.season_number}`);
                    episodesBySeason[season.season_number] = response.data.episodes;
                }
                setAllEpisodes(episodesBySeason);
            } catch (error) {
                setError('Failed to fetch episodes for all seasons');
            } finally {
                setLoading(false);
            }
        };

        if (seasons.length > 0) {
            fetchAllEpisodes();
        }
    }, [tvId, seasons]);

    return { allEpisodes, loading, error };
};