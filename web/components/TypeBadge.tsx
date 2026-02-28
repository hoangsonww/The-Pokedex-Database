import React from 'react';
import { formatName, getTypeBadgeClass } from '@/utils/pokedex';

type TypeBadgeProps = {
  type: string;
  className?: string;
};

/**
 * Shared badge for Pokemon types.
 *
 * @param param0 The component props
 * @returns The rendered badge
 */
export default function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getTypeBadgeClass(type)} ${className}`}>
      {formatName(type)}
    </span>
  );
}
