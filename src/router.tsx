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

const AppRouter: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Tipar dispatch

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={true ? <Home /> : <SandBox />} />
        <Route path="/movies/:movieType" element={<MoviesBy />} />
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
