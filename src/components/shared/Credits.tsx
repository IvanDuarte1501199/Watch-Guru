import React from 'react';
import { Link } from 'react-router-dom';
import { CreditsProps } from '@appTypes/credits/credits';

type CreditsPropsComponent = {
  credits?: CreditsProps;
};

const Credits: React.FC<CreditsPropsComponent> = ({ credits }) => {
  if (!credits || !credits.cast || credits.cast.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="h2-guru text-xl font-semibold text-center mb-2 md:mb-4">Cast</h2>
      <ul className="flex flex-row flex-wrap gap-4 mb-4 md:mb-8">
        {credits.cast.slice(0, 20).map((castMember) => (
          <li key={castMember.id} className="bg-tertiary px-4 py-1 rounded-lg hover:bg-tertiary-80">
            <Link to={`/person/${castMember.id}`}>
              <h3 className="p-guru text-lg font-semibold">{castMember.name}</h3>
              <p className="p-guru text-primary text-sm">{castMember.character}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Credits;
