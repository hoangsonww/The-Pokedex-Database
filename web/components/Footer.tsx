import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

/**
 * A simple footer component for our pokedex app.
 *
 * @returns {JSX.Element} The footer component.
 */
export default function Footer() {
  return (
    <footer
      className="bg-primary dark:bg-gray-800 text-white py-3 mt-8 border-t 
                          border-primary-dark dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        <p className="text-sm flex items-center space-x-1">
          <span>Built with</span>

          <HeartIcon className="h-4 w-4 text-red-300 animate-pulse" />

          <span>
            by{' '}
            <a
              href="https://github.com/hoangsonww"
              target="_blank"
              className="text-white font-semibold hover:underline hover:text-primary-dark transition duration-200">
              David Nguyen
            </a>
            , using{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              className="text-white font-semibold hover:underline hover:text-primary-dark transition duration-200">
              Next.js
            </a>{' '}
            and{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              className="text-white font-semibold hover:underline hover:text-primary-dark transition duration-200">
              PokeAPI
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
