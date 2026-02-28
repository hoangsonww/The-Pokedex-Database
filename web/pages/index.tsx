import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BookOpenIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  SparklesIcon,
  SwatchIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import PokemonCard from '@/components/PokemonCard';
import Pagination from '@/components/Pagination';
import ItemCard from '@/components/ItemCard';
import LoadingState from '@/components/LoadingState';
import SurfaceCard from '@/components/SurfaceCard';
import { Pokedex } from '@/data/models/pokedex';
import { ItemList } from '@/data/models/item-list';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  formatName,
  getItemSpriteUrl,
  getPokemonArtworkUrl,
  getPokemonIdFromUrl,
  getPokemonSpriteUrl,
  ITEM_PAGE_SIZE,
  POKEMON_PAGE_SIZE
} from '@/utils/pokedex';
import { STORAGE_KEYS } from '@/utils/storage';

const featureLinks = [
  {
    href: '/discover',
    title: 'Discover by type',
    description:
      'Browse type matchups, themed lineups, and a rotating spotlight.',
    icon: SparklesIcon
  },
  {
    href: '/compare',
    title: 'Compare two Pokémon',
    description: 'Stack stats, size, abilities, and typings side by side.',
    icon: ScaleIcon
  },
  {
    href: '/team-builder',
    title: 'Build a six-slot squad',
    description: 'Save a team locally and inspect its shared strengths.',
    icon: UserGroupIcon
  },
  {
    href: '/moves',
    title: 'Open the move dex',
    description: 'Browse attacks, utility moves, and damage classes directly.',
    icon: BoltIcon
  },
  {
    href: '/abilities',
    title: 'Trace abilities',
    description: 'Inspect passive effects and every Pokemon that can use them.',
    icon: BookOpenIcon
  },
  {
    href: '/types',
    title: 'Study the type dex',
    description: 'Use the matchup calculator and browse every elemental type.',
    icon: SwatchIcon
  },
  {
    href: '/items',
    title: 'Browse the item dex',
    description: 'Search held items, recovery tools, and battle gear directly.',
    icon: ArchiveBoxIcon
  }
];

/**
 * Home page component
 *
 * @returns The JSX element
 */
export default function Home() {
  const [pokemonPage, setPokemonPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [pokemonSearchInput, setPokemonSearchInput] = useState('');
  const [itemSearchInput, setItemSearchInput] = useState('');
  const [favoriteSearchInput, setFavoriteSearchInput] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [favorites, setFavorites] = usePersistentState<string[]>(
    STORAGE_KEYS.favorites,
    []
  );
  const [team] = usePersistentState<string[]>(STORAGE_KEYS.team, []);
  const [recentPokemon] = usePersistentState<string[]>(
    STORAGE_KEYS.recentPokemon,
    []
  );

  const pokemonSearch = useDeferredValue(
    pokemonSearchInput.trim().toLowerCase()
  );
  const itemSearch = useDeferredValue(itemSearchInput.trim().toLowerCase());
  const favoriteSearch = useDeferredValue(
    favoriteSearchInput.trim().toLowerCase()
  );

  useEffect(() => {
    setPokemonPage(1);
  }, [pokemonSearch]);

  useEffect(() => {
    setItemPage(1);
  }, [itemSearch]);

  useEffect(() => {
    setFavoritePage(1);
  }, [favoriteSearch]);

  useEffect(() => {
    if (isCarouselPaused || featureLinks.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCarouselDirection(1);
      setActiveFeature((previous) => (previous + 1) % featureLinks.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused]);

  const offsetPokemon = (pokemonPage - 1) * POKEMON_PAGE_SIZE;
  const offsetItems = (itemPage - 1) * ITEM_PAGE_SIZE;
  const favoritePageSize = 24;
  const offsetFavorites = (favoritePage - 1) * favoritePageSize;

  const {
    data: pokemonData,
    isLoading: pokemonLoading,
    error: pokemonError
  } = useQuery<Pokedex>({
    queryKey: ['pokemonList', pokemonPage],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PAGE_SIZE}&offset=${offsetPokemon}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pokemons list.');
      }

      return (await response.json()) as Pokedex;
    }
  });

  const { data: allPokemonData } = useQuery<Pokedex>({
    queryKey: ['allPokemonData'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch all pokemons list.');
      }

      return (await response.json()) as Pokedex;
    }
  });

  const {
    data: itemData,
    isLoading: itemLoading,
    error: itemError
  } = useQuery<ItemList>({
    queryKey: ['itemList', itemPage],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/item?limit=${ITEM_PAGE_SIZE}&offset=${offsetItems}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch item list.');
      }

      return (await response.json()) as ItemList;
    }
  });

  const { data: allItemData } = useQuery<ItemList>({
    queryKey: ['allItemData'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/item?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch all item list.');
      }

      return (await response.json()) as ItemList;
    }
  });

  const handleToggleFavorite = (pokemonName: string) => {
    setFavorites((previousFavorites) => {
      if (previousFavorites.includes(pokemonName)) {
        return previousFavorites.filter((entry) => entry !== pokemonName);
      }

      return [...previousFavorites, pokemonName];
    });
  };

  const totalPokemonCount = allPokemonData?.count ?? pokemonData?.count ?? 0;
  const totalItemCount = allItemData?.count ?? itemData?.count ?? 0;

  const favoritePokemons = allPokemonData?.results.filter((pokemon) =>
    favorites.includes(pokemon.name)
  );

  const displayedFavorites =
    favoriteSearch === ''
      ? favoritePokemons
      : favoritePokemons?.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(favoriteSearch)
        );

  const paginatedFavorites = displayedFavorites?.slice(
    offsetFavorites,
    offsetFavorites + favoritePageSize
  );

  const displayedPokemon =
    pokemonSearch === ''
      ? pokemonData?.results
      : allPokemonData?.results.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(pokemonSearch)
        );

  const paginatedPokemon =
    pokemonSearch === ''
      ? displayedPokemon
      : displayedPokemon?.slice(
          offsetPokemon,
          offsetPokemon + POKEMON_PAGE_SIZE
        );

  const displayedItems =
    itemSearch === ''
      ? itemData?.results
      : allItemData?.results.filter((item) =>
          item.name.toLowerCase().includes(itemSearch)
        );

  const paginatedItems =
    itemSearch === ''
      ? displayedItems
      : displayedItems?.slice(offsetItems, offsetItems + ITEM_PAGE_SIZE);

  const displayedPokemonCount = displayedPokemon?.length ?? 0;
  const displayedItemCount = displayedItems?.length ?? 0;
  const displayedFavoritesCount = displayedFavorites?.length ?? 0;

  const recentEntries = recentPokemon
    .map((name) =>
      allPokemonData?.results.find((pokemon) => pokemon.name === name)
    )
    .filter(Boolean) as Pokedex['results'];

  const spotlightPool = allPokemonData?.results ?? [];
  const spotlightSeed = new Date().toISOString().slice(0, 10);
  const spotlightIndex =
    spotlightPool.length === 0
      ? 0
      : Array.from(spotlightSeed).reduce(
          (total, character) => total + character.charCodeAt(0),
          0
        ) % spotlightPool.length;
  const spotlightPokemon = spotlightPool[spotlightIndex];
  const spotlightId = spotlightPokemon
    ? getPokemonIdFromUrl(spotlightPokemon.url)
    : '';
  const currentFeature = featureLinks[activeFeature];
  const CurrentFeatureIcon = currentFeature.icon;

  return (
    <div className="space-y-8 pb-4">
      <section className="space-y-6">
        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.14),rgba(255,255,255,0.92)_40%,rgba(249,168,212,0.18))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.18),rgba(15,23,42,0.92)_42%,rgba(14,165,233,0.1))]">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primaryDark dark:text-pink-100">
                Explore faster
              </p>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-4xl font-bold text-ink sm:text-5xl lg:text-6xl dark:text-white">
                  A richer Pokédex for collecting, comparing, and planning your
                  next squad.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Search the full index, inspect items and moves, keep favorites
                  local, compare matchups, and shape a six-slot team without
                  losing the app&apos;s existing look and feel.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Pokémon
                  </p>
                  <p className="mt-2 text-3xl font-bold">{totalPokemonCount}</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Items
                  </p>
                  <p className="mt-2 text-3xl font-bold">{totalItemCount}</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Favorites
                  </p>
                  <p className="mt-2 text-3xl font-bold">{favorites.length}</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Team Slots
                  </p>
                  <p className="mt-2 text-3xl font-bold">{team.length}/6</p>
                </div>
              </div>
            </div>

            <div
              className="space-y-4"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Fast links
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Quick access to key features
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <p className="hidden text-sm text-slate-500 lg:block dark:text-slate-400">
                    Easily jump into popular tools and resources across the app
                  </p>
                  <button
                    onClick={() => {
                      setCarouselDirection(-1);
                      setActiveFeature(
                        (previous) =>
                          (previous - 1 + featureLinks.length) %
                          featureLinks.length
                      );
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/75 p-2 text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800"
                    aria-label="Previous feature">
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCarouselDirection(1);
                      setActiveFeature(
                        (previous) => (previous + 1) % featureLinks.length
                      );
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/75 p-2 text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800"
                    aria-label="Next feature">
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentFeature.href}
                    initial={{
                      opacity: 0,
                      x: carouselDirection > 0 ? 24 : -24
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: carouselDirection > 0 ? -24 : 24 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}>
                    <Link href={currentFeature.href} className="block">
                      <div className="grid min-h-56 gap-5 rounded-[2rem] border border-primary/20 bg-white/88 p-5 shadow-soft transition dark:border-white/10 dark:bg-slate-950/72 md:grid-cols-[auto_1fr] md:items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-primaryDark dark:text-pink-100">
                          <CurrentFeatureIcon className="h-8 w-8" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Featured tool
                          </p>
                          <h3 className="text-2xl font-bold sm:text-3xl">
                            {currentFeature.title}
                          </h3>
                          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                            {currentFeature.description}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primaryDark dark:text-pink-100">
                            Open tool
                            <ArrowRightIcon className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {featureLinks.map((feature, index) => (
                  <button
                    key={feature.href}
                    onClick={() => {
                      setCarouselDirection(index > activeFeature ? 1 : -1);
                      setActiveFeature(index);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      activeFeature === index
                        ? 'bg-primary text-white'
                        : 'bg-white/70 text-slate-500 hover:bg-primary/10 hover:text-primaryDark dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
                    }`}>
                    {feature.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(249,168,212,0.16))] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(236,72,153,0.12))]">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {spotlightPokemon && (
              <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56">
                <Image
                  src={getPokemonArtworkUrl(spotlightId)}
                  alt={spotlightPokemon.name}
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Daily spotlight
                  </p>
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    {spotlightPokemon
                      ? formatName(spotlightPokemon.name)
                      : 'Loading...'}
                  </h2>
                </div>
                <SparklesIcon className="h-7 w-7 shrink-0 text-primary" />
              </div>

              <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Today&apos;s featured entry rotates automatically. Use it as a
                quick jumping-off point when you want something fresh to
                inspect, compare, or save into a team.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Spotlight mode
                  </p>
                  <p className="mt-2 text-lg font-semibold">Daily rotation</p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Best for
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Quick exploration
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Next step
                  </p>
                  <p className="mt-2 text-lg font-semibold">Open profile</p>
                </div>
              </div>

              {spotlightPokemon && (
                <Link
                  href={`/pokemon/${spotlightPokemon.name}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark sm:w-auto">
                  View spotlight
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Recently viewed
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Jump back into your last Pokémon pages
              </h2>
            </div>
            <ClockIcon className="h-6 w-6 text-primary" />
          </div>

          {recentEntries.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
              Open a few Pokémon detail pages and they&apos;ll show up here for
              quick access.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {recentEntries.map((entry) => {
                const pokemonId = getPokemonIdFromUrl(entry.url);
                return (
                  <Link
                    key={entry.name}
                    href={`/pokemon/${entry.name}`}
                    className="group rounded-3xl border border-white/60 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="relative mx-auto h-24 w-24">
                      <Image
                        src={getPokemonSpriteUrl(pokemonId)}
                        alt={entry.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-3 text-center text-lg font-semibold">
                      {formatName(entry.name)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Collection snapshot
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Keep local progress visible
              </h2>
            </div>
            <HeartIcon className="h-6 w-6 text-primary" />
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Favorites saved
              </p>
              <p className="mt-2 text-3xl font-bold">{favorites.length}</p>
            </div>
            <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Recent Pokémon tracked
              </p>
              <p className="mt-2 text-3xl font-bold">{recentEntries.length}</p>
            </div>
            <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Team builder occupancy
              </p>
              <p className="mt-2 text-3xl font-bold">{team.length}/6</p>
            </div>
          </div>
        </SurfaceCard>
      </section>

      <SurfaceCard className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Pokémon index
            </p>
            <h2 className="mt-1 text-3xl font-bold">
              Search and save favorites
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={pokemonSearchInput}
              onChange={(event) => setPokemonSearchInput(event.target.value)}
              placeholder="Search Pokémon..."
              className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
            />
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {pokemonLoading && <LoadingState label="Loading Pokemon" />}

        {pokemonLoading ? null : pokemonError ? (
          <div className="text-red-500">{String(pokemonError)}</div>
        ) : paginatedPokemon && paginatedPokemon.length > 0 ? (
          <>
            <motion.div
              layout
              transition={{ duration: 0 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedPokemon.map((pokemon) => {
                const pokemonId = getPokemonIdFromUrl(pokemon.url);
                return (
                  <PokemonCard
                    key={pokemon.name}
                    name={pokemon.name}
                    spriteUrl={
                      pokemonId ? getPokemonSpriteUrl(pokemonId) : undefined
                    }
                    isFavorite={favorites.includes(pokemon.name)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                );
              })}
            </motion.div>

            <Pagination
              currentPage={pokemonPage}
              totalCount={
                pokemonSearch ? displayedPokemonCount : totalPokemonCount
              }
              pageSize={POKEMON_PAGE_SIZE}
              onPageChange={setPokemonPage}
            />
          </>
        ) : (
          <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
            No Pokémon matched that search.
          </p>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Item vault
            </p>
            <h2 className="mt-1 text-3xl font-bold">
              Browse held items and gear
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={itemSearchInput}
              onChange={(event) => setItemSearchInput(event.target.value)}
              placeholder="Search items..."
              className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
            />
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {itemLoading && <LoadingState label="Loading items" />}

        {itemLoading ? null : itemError ? (
          <div className="text-red-500">{String(itemError)}</div>
        ) : paginatedItems && paginatedItems.length > 0 ? (
          <>
            <motion.div
              layout
              transition={{ duration: 0 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedItems.map((item) => (
                <ItemCard
                  key={item.name}
                  name={item.name}
                  spriteUrl={getItemSpriteUrl(item.name)}
                />
              ))}
            </motion.div>

            <Pagination
              currentPage={itemPage}
              totalCount={itemSearch ? displayedItemCount : totalItemCount}
              pageSize={ITEM_PAGE_SIZE}
              onPageChange={setItemPage}
            />
          </>
        ) : (
          <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
            No items matched that search.
          </p>
        )}
      </SurfaceCard>

      {favorites.length > 0 && (
        <SurfaceCard className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Favorites
              </p>
              <h2 className="mt-1 text-3xl font-bold">Your saved Pokémon</h2>
            </div>

            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={favoriteSearchInput}
                onChange={(event) => setFavoriteSearchInput(event.target.value)}
                placeholder="Search favorites..."
                className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {paginatedFavorites && paginatedFavorites.length > 0 ? (
            <>
              <motion.div
                layout
                transition={{ duration: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {paginatedFavorites.map((pokemon) => {
                  const pokemonId = getPokemonIdFromUrl(pokemon.url);
                  return (
                    <PokemonCard
                      key={pokemon.name}
                      name={pokemon.name}
                      spriteUrl={getPokemonSpriteUrl(pokemonId)}
                      isFavorite={favorites.includes(pokemon.name)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  );
                })}
              </motion.div>

              <Pagination
                currentPage={favoritePage}
                totalCount={displayedFavoritesCount}
                pageSize={favoritePageSize}
                onPageChange={setFavoritePage}
              />
            </>
          ) : (
            <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
              No favorites matched that search.
            </p>
          )}
        </SurfaceCard>
      )}
    </div>
  );
}
