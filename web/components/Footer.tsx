import React from 'react';
import Link from 'next/link';
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketSquareIcon,
  HeartIcon
} from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * A simple footer component for our pokedex app.
 *
 * @returns {JSX.Element} The footer component.
 */
export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(252,231,243,0.78))] py-8 backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.78),rgba(15,23,42,0.94))]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-sm text-slate-600 sm:px-6 lg:px-8 dark:text-slate-300">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primaryDark dark:text-pink-100">
                Pokédex DB
              </span>
              <span className="text-slate-400">Reference-first browsing</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Built for quick collection building, comparison, and
                database-style exploration.
              </h2>
              <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                Browse Pokémon, types, moves, abilities, items, and generations
                in one place with a stronger visual system and faster navigation
                paths.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/hoangsonww/The-Pokedex-Database"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                <CodeBracketSquareIcon className="h-5 w-5" />
                View GitHub Repo
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/hoangsonww"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
                <UserCircleIcon className="h-5 w-5" />
                Creator Profile
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-soft dark:border-white/10 dark:bg-slate-950/70">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Navigate
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Link
                href="/"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Home
              </Link>
              <Link
                href="/discover"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Discover
              </Link>
              <Link
                href="/types"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Types
              </Link>
              <Link
                href="/items"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Items
              </Link>
              <Link
                href="/moves"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Moves
              </Link>
              <Link
                href="/abilities"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Abilities
              </Link>
              <Link
                href="/generations"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Generations
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Compare
              </Link>
              <Link
                href="/team-builder"
                className="rounded-2xl bg-primary/8 px-3 py-2 font-medium transition hover:bg-primary/14 hover:text-primaryDark dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-pink-100">
                Team Builder
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/60 pt-4 text-sm leading-relaxed dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Created by{' '}
            <a
              href="https://github.com/hoangsonww"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primaryDark hover:underline dark:text-pink-100">
              David Nguyen
            </a>{' '}
            with <HeartIcon className="mx-1 inline h-4 w-4 text-primary" />
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primaryDark hover:underline dark:text-pink-100">
              Next.js
            </a>{' '}
            and{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primaryDark hover:underline dark:text-pink-100">
              PokeAPI
            </a>
          </p>

          <a
            href="https://github.com/hoangsonww/The-Pokedex-Database"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 font-semibold text-primaryDark hover:underline dark:text-pink-100 sm:inline-flex">
            github.com/hoangsonww/The-Pokedex-Database
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
