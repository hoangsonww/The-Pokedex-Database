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
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
        className="flex items-center space-x-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-primaryDark shadow-soft transition hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Prev</span>
      </button>

      {/* Page Indicator */}
      <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-lg font-medium shadow-soft dark:border-white/10 dark:bg-slate-900/80">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="flex items-center space-x-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-primaryDark shadow-soft transition hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
        <span>Next</span>
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
