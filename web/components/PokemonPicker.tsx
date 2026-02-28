import React from 'react';
import { formatName } from '@/utils/pokedex';

type PokemonPickerProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (nextValue: string) => void;
  options: string[];
  helperText?: string;
};

/**
 * Reusable Pokémon name picker backed by a datalist.
 *
 * @param param0 The component props
 * @returns The rendered picker
 */
export default function PokemonPicker({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  helperText
}: PokemonPickerProps) {
  const normalizedValue = value.trim().toLowerCase();
  const displayedOptions = options
    .filter((name) => name.includes(normalizedValue))
    .slice(0, 12);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
        {label}
      </span>

      <input
        list={`${id}-options`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
      />

      <datalist id={`${id}-options`}>
        {displayedOptions.map((name) => (
          <option key={name} value={name}>
            {formatName(name)}
          </option>
        ))}
      </datalist>

      {helperText && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </label>
  );
}
