import React from 'react'
import { Layout } from '@components/Layout'
import { GenericList } from '@components/common/GenericList'
import { MainTitle } from '@components/common/MainTitle'
import useGenres from '@hooks/useGenres'
import GenresSection from '@sections/GenresSection'
import FeaturedGenresSection from '@sections/FeaturedGenresSection'
import { useTrendingTv, usePopularTv, useTopRatedTv } from '@hooks/tv/useTvShows'
const TvShows: React.FC = () => {
    const { tvShows: trendingTv, loading: tvLoading, error: tvError } = useTrendingTv();
    const { tvShows: popularTv, loading: isLoadingPopular, error: errorPopular } = usePopularTv();
    const { tvShows: topRatedTv, loading: isLoadingTopRated, error: errorTopRated } = useTopRatedTv();

    const { tvGenres, isLoading: genresLoading, error: genresError } = useGenres();
    return (
        <Layout>
            <MainTitle>TV SHOWS</MainTitle>
            <GenresSection genres={tvGenres} />

            {trendingTv && trendingTv.length > 0 && <GenericList
                title="Trending Tv Shows"
                genericList={trendingTv}
            />}
            <FeaturedGenresSection />
            {popularTv && popularTv.length > 0 && <GenericList
                title="Popular Tv Shows"
                genericList={popularTv}
            />}

            {topRatedTv && topRatedTv.length > 0 && <GenericList
                title="Top Rated Tv Shows"
                genericList={topRatedTv}
            />}

        </Layout>
    )
}

export default TvShows;