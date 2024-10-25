import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  path: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, path }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const updateQuery = (newPage: number) => {
    const query = new URLSearchParams(location.search);
    query.set('page', newPage.toString());

    navigate({
      pathname: path,
      search: query.toString(),
    });
  };

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => updateQuery(page)}
      className={`mx-1 p-guru hover:font-bold ${currentPage === page ? 'font-bold underline ' : ''}`}
    >
      {page}
    </button>
  );

  if (totalPages > 500) totalPages = 500;

  const renderPagination = () => {
    const pages: JSX.Element[] = [];

    if (totalPages <= 1) return null;

    pages.push(
      <button
        key="previous"
        onClick={() => currentPage > 1 && updateQuery(currentPage - 1)}
        className={`mx-1 p-guru mr-8 hover:font-bold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === 1}
      >
        <img src="/chevron-left.svg" alt="Previous" className="w-4 h-4" />
      </button>
    );



    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
    } else {
      if (currentPage < 5) {
        for (let i = 1; i <= 5; i++) {
          pages.push(renderPageButton(i));
        }
        pages.push(<span key="ellipsis-end" className='mx-1 p-guru'>...</span>);
        pages.push(renderPageButton(totalPages));
      } else if (currentPage > totalPages - 4) {
        pages.push(renderPageButton(1));
        pages.push(<span key="ellipsis-start" className='mx-1 p-guru'>...</span>);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(renderPageButton(i));
        }
      } else {
        pages.push(renderPageButton(1));
        pages.push(<span key="ellipsis-start" className='mx-1 p-guru'>...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(renderPageButton(i));
        }
        pages.push(<span key="ellipsis-end" className='mx-1 p-guru'>...</span>);
        pages.push(renderPageButton(totalPages));
      }
    }

    pages.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && updateQuery(currentPage + 1)}
        className={`mx-1 p-guru ml-8 hover:font-bold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === totalPages}
      >
        <img src="/chevron-right.svg" alt="Next" className="w-4 h-4" />
      </button>
    );

    return pages;
  };

  return (
    <div className="flex items-center justify-center">
      {renderPagination()}
    </div>
  );
};

export default Pagination;
