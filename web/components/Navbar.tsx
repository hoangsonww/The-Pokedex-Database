import React from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { BoltIcon } from '@heroicons/react/24/outline';

/**
 * A simple navbar component for our pokedex app.
 *
 * @returns {JSX.Element} The navbar component.
 */
export default function Navbar() {
  return (
    <nav className="bg-primary dark:bg-gray-800 text-white py-3 border-b border-primary-dark dark:border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: My app's name */}
        <Link href="/" className="flex items-center space-x-2 hover:underline">
          <BoltIcon className="h-6 w-6 text-white" />
          <span className="font-semibold text-xl">Pokédex</span>
        </Link>

        {/* Right: Dark mode toggle and link back to homepage */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:underline hidden sm:block">
            Home
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
