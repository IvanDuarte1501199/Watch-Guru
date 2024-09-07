import React from 'react';
import Button from '@components/common/Button';
import { Link } from 'react-router-dom';
import { Layout } from '@components/Layout';
import PopularShows from '@components/series/PupularShowsList';

const Home: React.FC = () => {
    return (
        <Layout>
            <h1 className="h1-guru text-center uppercase pb-6 pt-6">Welcome to your next binge-worthy recommendation!</h1>
            <PopularShows />
        </Layout>
    );
};

export default Home;