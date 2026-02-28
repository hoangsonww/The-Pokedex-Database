import React from 'react';

type LoadingStateProps = {
  label?: string;
  className?: string;
};

/**
 * Shared branded loading state used across pages.
 *
 * @param param0 The component props
 * @returns The loading indicator
 */
export default function LoadingState({
  label = 'Loading data',
  className = ''
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-8 text-center ${className}`}>
      <div className="pokedex-loader" aria-hidden="true">
        <div className="pokedex-loader__orb" />
        <div className="pokedex-loader__core" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
          {label}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Syncing the Pokédex database view.
        </p>
      </div>
    </div>
  );
}
