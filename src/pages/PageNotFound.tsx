import { Layout } from '@components/Layout';
import React from 'react';

const PageNotFound: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="text-2xl">¡Page not found!</p>
                <p>Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="mt-4 text-blue-500 hover:underline">
                    Go back to home
                </a>
            </div>
        </Layout>
    );
};

export default PageNotFound;