import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { Bars3Icon, BoltIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/types', label: 'Types' },
  { href: '/items', label: 'Items' },
  { href: '/moves', label: 'Moves' },
  { href: '/abilities', label: 'Abilities' },
  { href: '/generations', label: 'Generations' },
  { href: '/compare', label: 'Compare' },
  { href: '/team-builder', label: 'Team Builder' }
];

/**
 * A simple navbar component for our pokedex app.
 *
 * @returns {JSX.Element} The navbar component.
 */
export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  return (
    <nav className="sticky top-0 z-20 border-b border-white/60 bg-white/80 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 xl:hidden">
          <Link
            href="/"
            className="flex w-fit items-center space-x-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primaryDark transition hover:border-primary/40 hover:bg-primary/15 dark:border-primary/30 dark:bg-primary/10 dark:text-pink-100">
            <BoltIcon className="h-6 w-6" />
            <span className="font-display text-xl font-bold tracking-tight">
              Pokédex
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white p-2.5 text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu">
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 rounded-[2rem] border border-white/60 bg-white/92 p-3 shadow-soft dark:border-white/10 dark:bg-slate-950/92 xl:hidden">
            <div className="grid gap-2 sm:grid-cols-2">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-primary text-white shadow-soft'
                        : 'border border-transparent bg-white/60 text-slate-700 hover:border-primary/20 hover:bg-primary/10 hover:text-primaryDark dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="hidden items-center justify-between gap-4 xl:flex">
          <Link
            href="/"
            className="shrink-0 flex items-center space-x-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primaryDark transition hover:border-primary/40 hover:bg-primary/15 dark:border-primary/30 dark:bg-primary/10 dark:text-pink-100">
            <BoltIcon className="h-6 w-6" />
            <span className="font-display text-xl font-bold tracking-tight">
              Pokédex
            </span>
          </Link>

          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex min-w-max items-center justify-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-primary text-white shadow-soft'
                        : 'border border-transparent bg-white/60 text-slate-700 hover:border-primary/20 hover:bg-primary/10 hover:text-primaryDark dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 flex justify-end">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
