import { Layout } from '@components/common/Layout';
import React from 'react';

const PageNotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full mt-30dvh">
        <h1 className="h1-guru text-6xl font-bold">500</h1>
        <p className="h2-guru text-2xl">Internal server error</p>
        <p className="p-guru">
          Sorry, something went wrong. Please try again later.
        </p>
        <a href="/" className="mt-4 text-secondary hover:underline">
          Go back to home
        </a>
      </div>
    </Layout>
  );
};

export default PageNotFound;
