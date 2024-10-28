import React, { useEffect, useState } from 'react';
import { MediaType } from '@appTypes/common/MediaType';
import { useSearch } from '@hooks/useSearch';
import SearchItem from './SearchItem';

type SearchProps = {
  type?: MediaType;
}

const Search: React.FC<SearchProps> = ({ type }) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, error } = useSearch(query, type);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' && !isOpen) {
        setIsOpen(true);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="hidden md:block relative">
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
          autoComplete="off"
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          className="block w-96 p-2 pl-10 text-sm text-gray-900 border border-primary rounded-md focus:outline-none"
          placeholder="Search"
        />
      </div>
      {isOpen && results.length > 0 && (
        <ul className="absolute top-10 left-0 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-scroll">
          {results.map((item) => (
            <SearchItem key={item.id} item={item} onClick={() => {
              setQuery('');
              setIsOpen(false);
            }} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
