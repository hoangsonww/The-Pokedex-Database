import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

/**
 * A simple dark mode toggle button
 *
 * @returns {JSX.Element} The dark mode toggle button.
 */
export default function DarkModeToggle() {
  // State to keep track of the current theme
  const [isDark, setIsDark] = useState(false);

  // Here we use the useEffect hook to check if the user has a dark mode preference
  // stored in localStorage. If they do, we set the theme accordingly for the app
  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark') {
      setIsDark(true);
      root.classList.add('dark');
    } else {
      setIsDark(false);
      root.classList.remove('dark');
    }
  }, []);

  // Store the user's theme preference in localStorage and update the theme
  // This is done to ensure the user's theme preference is persisted across page reloads
  const toggleDarkMode = () => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // The dark mode toggle button will have a sun icon if the theme is dark
  // and a moon icon if the theme is light
  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-full border border-primary/20 bg-white px-3 py-2 font-medium text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800"
      aria-label="Toggle Dark Mode">
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
