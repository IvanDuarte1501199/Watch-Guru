import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import SeriesInfo from './pages/SeriesInfo'; // Importa la nueva página

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/series/:id', // Ruta con parámetro 'id'
        element: <SeriesInfo />,
    },
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;