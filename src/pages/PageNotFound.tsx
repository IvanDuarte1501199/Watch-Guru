import { Layout } from '@components/Layout';
import React from 'react';

const PageNotFound: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="h1-guru text-6xl font-bold">404</h1>
                <p className="h2-guru text-2xl">¡Page not found!</p>
                <p className="p-guru">
                    Sorry, the page you are looking for does not exist.
                </p>
                <a href="/" className="mt-4 text-secondary hover:underline">
                    Go back to home
                </a>
            </div>
        </Layout>
    );
};

export default PageNotFound;
