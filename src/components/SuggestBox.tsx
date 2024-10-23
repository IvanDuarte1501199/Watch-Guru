import React from 'react';
import { Link } from 'react-router-dom';

interface SuggestBoxProps {
  placeholder?: string;
  icon?: 'movie' | 'tv-shows';
  href?: string;
}

const SuggestBox: React.FC<SuggestBoxProps> = ({
  placeholder,
  icon = 'movie',
  href = '/',
}) => {
  return (
    <Link
      to={href}
      className="flex flex-col items-center justify-center"
    >
      <article
        className='w-64 h-32 relative p-2 flex items-center justify-center text-white font-semibold rounded-lg
                duration-300 ease-in-out transform bg-tertiary hover:bg-secondary hover:scale-105 hover:shadow-xl'>
        <img src={`/${icon}.svg`} alt="movie" className="w-24 h-24 absolute top-4 left-4 opacity-40" />
        <span className="text-center h3-guru text-white z-2 relative">{placeholder}</span>
      </article>
    </Link>
  );
};

export default SuggestBox;
