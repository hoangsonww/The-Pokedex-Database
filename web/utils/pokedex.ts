import { Pokemon } from '@/data/models/pokemon';

export const POKEMON_PAGE_SIZE = 48;
export const ITEM_PAGE_SIZE = 48;
export const TEAM_LIMIT = 6;
export const MAX_RECENT_POKEMON = 8;

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  speed: 'Speed'
};

const typeStyles: Record<string, string> = {
  normal:
    'border-stone-300 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-100',
  fire: 'border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-700 dark:bg-orange-950/70 dark:text-orange-100',
  water:
    'border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-700 dark:bg-sky-950/70 dark:text-sky-100',
  electric:
    'border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-100',
  grass:
    'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-100',
  ice: 'border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-100',
  fighting:
    'border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-700 dark:bg-rose-950/70 dark:text-rose-100',
  poison:
    'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700 dark:border-fuchsia-700 dark:bg-fuchsia-950/70 dark:text-fuchsia-100',
  ground:
    'border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950/70 dark:text-yellow-100',
  flying:
    'border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-100',
  psychic:
    'border-pink-300 bg-pink-100 text-pink-700 dark:border-pink-700 dark:bg-pink-950/70 dark:text-pink-100',
  bug: 'border-lime-300 bg-lime-100 text-lime-700 dark:border-lime-700 dark:bg-lime-950/70 dark:text-lime-100',
  rock: 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-100',
  ghost:
    'border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-700 dark:bg-violet-950/70 dark:text-violet-100',
  dragon:
    'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-950/70 dark:text-blue-100',
  dark: 'border-slate-400 bg-slate-200 text-slate-700 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100',
  steel:
    'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100',
  fairy:
    'border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-700 dark:bg-rose-950/70 dark:text-rose-100'
};

/**
 * Extract the Pokemon id from a resource URL.
 *
 * @param url The API resource URL
 * @returns The numeric id or an empty string if parsing fails
 */
export function getPokemonIdFromUrl(url: string): string {
  const match = url.match(/\/pokemon\/(\d+)\//);

  return match?.[1] ?? '';
}

/**
 * Build the default sprite URL for a Pokemon id.
 *
 * @param id The Pokemon id
 * @returns The sprite URL
 */
export function getPokemonSpriteUrl(id: string | number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/**
 * Build the official artwork URL for a Pokemon id.
 *
 * @param id The Pokemon id
 * @returns The artwork URL
 */
export function getPokemonArtworkUrl(id: string | number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Build the item sprite URL from an item name.
 *
 * @param name The item name
 * @returns The sprite URL
 */
export function getItemSpriteUrl(name: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
}

/**
 * Convert kebab case API names into readable labels.
 *
 * @param value The raw API value
 * @returns A display label
 */
export function formatName(value: string): string {
  return value
    .split('-')
    .map((part) =>
      /^[ivxlcdm]+$/i.test(part)
        ? part.toUpperCase()
        : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(' ');
}

/**
 * Resolve the card style for a Pokemon type.
 *
 * @param type The type name
 * @returns Tailwind classes
 */
export function getTypeBadgeClass(type: string): string {
  return (
    typeStyles[type] ??
    'border-primary/30 bg-primary/10 text-primaryDark dark:border-primary/40 dark:bg-primary/10 dark:text-pink-100'
  );
}

/**
 * Build a stable stat map for comparison UIs.
 *
 * @param pokemon The Pokemon object
 * @returns A stat name to value map
 */
export function getPokemonStatMap(pokemon: Pokemon): Record<string, number> {
  return pokemon.stats.reduce<Record<string, number>>((accumulator, entry) => {
    accumulator[entry.stat.name] = entry.base_stat;
    return accumulator;
  }, {});
}

/**
 * Convert a stat key into a user facing label.
 *
 * @param value The stat key
 * @returns A display label
 */
export function formatStatLabel(value: string): string {
  return statLabels[value] ?? formatName(value);
}

/**
 * Calculate the total base stat score for a Pokemon.
 *
 * @param pokemon The Pokemon object
 * @returns The total base stat value
 */
export function getTotalBaseStats(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
}

/**
 * Create a recent-history list with dedupe and a fixed limit.
 *
 * @param current The current history list
 * @param nextValue The Pokemon to record
 * @returns The updated history list
 */
export function updateRecentPokemon(
  current: string[],
  nextValue: string
): string[] {
  return [nextValue, ...current.filter((entry) => entry !== nextValue)].slice(
    0,
    MAX_RECENT_POKEMON
  );
}

/**
 * Normalize user input for Pokemon lookups.
 *
 * @param value The raw input
 * @returns The normalized API key
 */
export function normalizePokemonName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
