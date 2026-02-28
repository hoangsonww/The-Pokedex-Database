import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

/**
 * Shared search input used across database pages.
 *
 * @param param0 The component props
 * @returns The rendered search field
 */
export default function SearchField({
  value,
  onChange,
  placeholder,
  className = ''
}: SearchFieldProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
      />
      <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
