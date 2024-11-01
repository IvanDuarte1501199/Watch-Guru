import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import TvShowInfo from '@pages/TvShowInfo';
import MovieInfo from '@pages/MovieInfo';
import TvShows from '@pages/TvShows';
import Movies from '@pages/Movies';
import PageNotFound from '@pages/PageNotFound';
import Genre from '@pages/Genre';
import SandBox from '@pages/SandBox';
import RandomMovieOrTvInfo from '@pages/RandomMovieOrTvInfo';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { fetchGenres } from '@slice/genres/genresSlice';
import MoviesBy from '@pages/MoviesBy';
import TvShowsBy from '@pages/TvShowsBy';
import MediaBy from '@pages/MediaBy';
import PersonInfo from '@pages/PersonInfo';
import { fetchCountries } from '@slice/country/countrySlice';
import AdvancedSearchPage from '@pages/AdvancedSearch';

const AppRouter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={true ? <Home /> : <SandBox />} />
        <Route path="/search" element={<AdvancedSearchPage />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/:mediaType" element={<MediaBy />} />
        <Route path="/movies/:movieType" element={<MoviesBy />} />
        <Route path="/tv-shows/:tvShowType" element={<TvShowsBy />} />
        <Route path="/person/:id" element={<PersonInfo />} />
        <Route path="/tv-show/:id" element={<TvShowInfo />} />
        <Route path="/movie/:id" element={<MovieInfo />} />
        <Route path="/tv-shows" element={<TvShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/genres/:id" element={<Genre />} />
        <Route path="/random/movie" element={<RandomMovieOrTvInfo />} />
        <Route path="/random/tv-show" element={<RandomMovieOrTvInfo />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
