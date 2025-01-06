"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (currentPage)
      pageNumbers.push(
        <li>
          <a
            className={`btn btn-sm ${currentPage ? "btn-active" : ""}`}
            onClick={() => onPageChange(currentPage)}
          >
            {currentPage}
          </a>
        </li>,
      );

    return pageNumbers;
  };

  return (
    <div className="my-4 flex w-full flex-row overflow-x-scroll py-4">
      <div className="btn-group flex w-full items-center justify-center space-x-4">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          «
        </button>
        <ul className="btn-group flex flex-row gap-2">{renderPageNumbers()}</ul>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
