import React, { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared elevated surface used across the app.
 *
 * @param param0 The component props
 * @returns The wrapped content
 */
export default function SurfaceCard({
  children,
  className = ''
}: SurfaceCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/80 ${className}`}>
      {children}
    </div>
  );
}
