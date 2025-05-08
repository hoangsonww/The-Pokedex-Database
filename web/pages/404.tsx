import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import React from 'react';

/**
 * A custom 404 page for our app
 * I will display a 404 error message and a button to go back to the home page
 * I choose not to use the default 404 page because I want to make the 404 page more visually appealing
 * and consistent with the rest of the app's design
 *
 * @returns The Custom404 component
 */
export default function Custom404() {
  // The 404 page will have a large 404 text, a message, and a button to go back to the home page
  // Also some animations to make the page more visually appealing
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* The 404 page content, animation is as follows: fade in and slide up */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>

        <p className="mb-8 text-lg">
          Oops! The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary dark:bg-gray-700 text-white rounded hover:bg-secondary dark:hover:bg-gray-600 transition">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
