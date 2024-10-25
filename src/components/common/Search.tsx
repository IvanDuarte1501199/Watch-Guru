import React, { useEffect, useState } from 'react';
import { MediaType } from '@appTypes/common/MediaType';
import { useSearch } from '@hooks/useSearch';
import SearchItem from './SearchItem';

type SearchProps = {
  type?: MediaType;
}

const Search: React.FC<SearchProps> = ({ type }) => {
  const [query, setQuery] = useState<string>('');
  const { results, loading, error } = useSearch(query, type);
  return (
    <div className='hidden md:block relative'>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19L15 15M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="text"
          id="search"
          value={query}
          autoComplete='off'
          onChange={(e) => setQuery(e.target.value)}
          className="block w-96 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
        />
      </div>
      {results.length > 0 && (
        <ul className='absolute top-10 left-0 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-scroll'>
          {results.map((item) => (
            <SearchItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
