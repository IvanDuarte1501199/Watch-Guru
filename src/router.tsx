import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home';
import TvShowInfo from '@pages/TvShowInfo';
import MovieInfo from '@pages/MovieInfo';
import TvShows from '@pages/TvShows';
import Movies from '@pages/Movies';
import PageNotFound from '@pages/PageNotFound';
import Genres from '@pages/Genres';
import SandBox from '@pages/SandBox';

const router = createBrowserRouter([
    {
        path: '/',
        element: true ? <Home /> : <SandBox />,
    },
    {
        path: '/tv-shows/:id',
        element: <TvShowInfo />,
    },
    {
        path: '/movies/:id',
        element: <MovieInfo />,
    },
    {
        path: '/tv-shows',
        element: <TvShows />,
    },
    {
        path: '/movies',
        element: <Movies />,
    },
    {
        path: '/genres/:id',
        element: <Genres />,
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
