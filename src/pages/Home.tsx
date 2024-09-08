import React, { useEffect, useState } from 'react';
import { Layout } from '@components/Layout';
import { PopularList } from '@components/popular/PupularList';
import { getPopularAll, getPopularMovies, getPopularTv } from '@services/tmdbService';
import { PopularItem } from '@types/popular/popularCard';

const Home: React.FC = () => {
    const [popular, setPopular] = useState<PopularItem[]>([]);
    const [popularTv, setPopularTv] = useState<PopularItem[]>([]);
    const [popularMovies, setPopularMovies] = useState<PopularItem[]>([]);

    useEffect(() => {
        const fetchAll = async () => {
            const popularResult = await getPopularAll();
            const popularTvResult = await getPopularTv();
            const popularMoviesResult = await getPopularMovies();
            setPopular(popularResult)
            setPopularTv(popularTvResult)
            setPopularMovies(popularMoviesResult)
        }
        fetchAll();
    }, []);

    useEffect(() => {
        console.log('popular', popular)
    }, [popular]);

    return (
        <Layout>
            <h1 className="h1-guru text-center uppercase pb-6 pt-6">Welcome to your next binge-worthy recommendation!</h1>
            <PopularList title='Popular Tv Shows and Movies' popularList={popular} />
            <PopularList title='Popular Tv Shows' popularList={popularTv} />
            <PopularList title='Popular Movies' popularList={popularMovies} />
        </Layout>
    );
};

export default Home;