import React, { useEffect, useState } from 'react'
import { Layout } from '@components/Layout'
import { GenericList } from '@components/common/GenericList'
import { getTrendingAll } from '@services/tmdbService'
import { GenericItemProps } from '@types/common/genericItemProps'
import { getTrendingMovies } from '@services/movieService'
import { getTrendingTv } from '@services/tvService'
import useGenres from '@hooks/useGenres'
import { useAppSelector } from '@hooks/store'

const Home: React.FC = () => {
  const { tvGenres, moviesGenres, isLoading, error } = useGenres()
  const genre = useAppSelector((state) => state.genres)

  useEffect(() => {
    console.log('genre.tvGenres', genre.tvGenres)
    console.log('genre.moviesGenres', genre.moviesGenres)
    console.log('isLoading', isLoading)
    console.log('error', error)
  })

  const [trending, setTrending] = useState<GenericItemProps[]>([])
  const [trendingTv, setTrendingTv] = useState<GenericItemProps[]>([])
  const [trendingMovies, setTrendingMovies] = useState<GenericItemProps[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      const trendingResult = await getTrendingAll()
      const trendingTvResult = await getTrendingTv()
      const trendingMoviesResult = await getTrendingMovies()
      setTrending(trendingResult)
      setTrendingTv(trendingTvResult)
      setTrendingMovies(trendingMoviesResult)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    console.log('trending', trending)
  }, [trending])

  return (
    <Layout>
      <h1 className="h1-guru pb-6 pt-6 text-center uppercase">
        Welcome to your next binge-worthy recommendation!
      </h1>
      {isLoading ? <h1>is Loading</h1> : <></>}
      {error ? <h1>Error</h1> : <></>}
      {genre.moviesGenres && genre.moviesGenres.map((genre) => {
        return <p>{genre.name}</p>
      })}

      <hr className='border-black my-5'/>
      {tvGenres && tvGenres.map((genre) => {
        return <p>{genre.name}</p>
      })}
      {/* trending all */}
      <GenericList
        title="Trending Tv Shows and Movies"
        genericList={trending.slice(0, 5)}
      />
      {/* trending tv shows */}
      <GenericList
        title="Trending Tv Shows"
        genericList={trendingTv.slice(0, 5)}
      />
      {/* tendring movies */}
      <GenericList
        title="Trending Movies"
        genericList={trendingMovies.slice(0, 5)}
      />
      {/* MOVIE LISTS
            Now Playing
            Popular
            Top Rated
            Upcoming */}

      {/* TV SERIES LISTS
            Airing Today
            On The Air
            Popular
            Top Rated */}

      {/* popular tv shows */}

      {/* top rated tv shows */}
      {/* popular movie list */}
      {/* now playing movie list */}
      {/*  */}
    </Layout>
  )
}

export default Home
