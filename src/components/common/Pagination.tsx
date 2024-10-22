import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`mx-1 p-guru hover:font-bold ${currentPage === page ? 'font-bold underline ' : ''}`}
    >
      {page}
    </button>
  );

  const renderPagination = () => {
    const pages: JSX.Element[] = [];

    if (totalPages <= 1) return null;

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="previous"
          onClick={() => onPageChange(currentPage - 1)}
          className='mx-1 p-guru mr-8 hover:font-bold'
        >
          Previous
        </button>
      );
    }

    // Render page numbers
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

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className='mx-1 p-guru ml-8 hover:font-bold'
        >
          Next
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center">
      {renderPagination()}
    </div>
  );
};

export default Pagination;
