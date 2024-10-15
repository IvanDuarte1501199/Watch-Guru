import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import TvShowInfo from '@pages/TvShowInfo';
import MovieInfo from '@pages/MovieInfo';
import TvShows from '@pages/TvShows';
import Movies from '@pages/Movies';
import PageNotFound from '@pages/PageNotFound';
import Genre from '@pages/Genre';
import SandBox from '@pages/SandBox';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={true ? <Home /> : <SandBox />} />
        <Route path="/tv-shows/:id" element={<TvShowInfo />} />
        <Route path="/movies/:id" element={<MovieInfo />} />
        <Route path="/tv-shows" element={<TvShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/genres/:id" element={<Genre />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
