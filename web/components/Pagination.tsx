import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

/**
 * The props for the Pagination component
 */
type PaginationProps = {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
};

/**
 * A simple pagination component -- used to navigate between pages of data
 *
 * @param param0 The props for the Pagination component
 * @returns The Pagination component
 */
export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}: PaginationProps) {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle the previous page button click
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // Handle the next page button click
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // The pagination component will have a previous button, a page indicator, and a next button
  return (
    <div className="flex items-center justify-center space-x-4 py-6">
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="flex items-center space-x-2 px-4 py-2 bg-primary dark:bg-gray-700 text-gray-50 
                   rounded disabled:opacity-50 hover:opacity-80 transition">
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Prev</span>
      </button>

      {/* Page Indicator */}
      <div className="font-medium text-lg">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="flex items-center space-x-2 px-4 py-2 bg-primary dark:bg-gray-700 text-gray-50 
                   rounded disabled:opacity-50 hover:opacity-80 transition">
        <span>Next</span>
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
