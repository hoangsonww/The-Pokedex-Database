import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { startTransition, useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  ArrowRightIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import SurfaceCard from '@/components/SurfaceCard';
import LoadingState from '@/components/LoadingState';
import TypeBadge from '@/components/TypeBadge';
import { PokemonType, TypeList } from '@/data/models/type';
import {
  formatName,
  getPokemonArtworkUrl,
  getPokemonIdFromUrl
} from '@/utils/pokedex';

/**
 * Discover page for type browsing and rotating Pokemon spotlights.
 *
 * @returns The discover page
 */
export default function DiscoverPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('fire');

  useEffect(() => {
    if (typeof router.query.type === 'string') {
      setSelectedType(router.query.type);
    }
  }, [router.query.type]);

  const { data: typeList } = useQuery<TypeList>({
    queryKey: ['pokemonTypes'],
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type');

      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon types.');
      }

      return (await response.json()) as TypeList;
    }
  });

  const { data: typeData, isLoading } = useQuery<PokemonType>({
    queryKey: ['pokemonType', selectedType],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/type/${selectedType}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon type data.');
      }

      return (await response.json()) as PokemonType;
    }
  });

  const selectableTypes =
    typeList?.results.filter(
      (type) => type.name !== 'unknown' && type.name !== 'shadow'
    ) ?? [];

  const featuredPokemon = typeData?.pokemon[0]?.pokemon;
  const featuredPokemonId = featuredPokemon
    ? getPokemonIdFromUrl(featuredPokemon.url)
    : '';

  const handleShuffleType = () => {
    if (selectableTypes.length === 0) {
      return;
    }

    const currentIndex = selectableTypes.findIndex(
      (type) => type.name === selectedType
    );
    const nextIndex =
      currentIndex < 0 ? 0 : (currentIndex + 3) % selectableTypes.length;

    startTransition(() => {
      setSelectedType(selectableTypes[nextIndex].name);
    });
  };

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.16),rgba(255,255,255,0.95)_38%,rgba(56,189,248,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(56,189,248,0.12))]">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Type discovery
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse the Pokédex by elemental identity instead of just name.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Inspect offensive and defensive relationships, rotate into another
              type instantly, and jump into featured Pokémon from the selected
              category.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShuffleType}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                <ArrowPathIcon className="h-5 w-5" />
                Shuffle type
              </button>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
                Compare matchups
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <SurfaceCard className="space-y-3 bg-white/85 dark:bg-slate-950/70">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Current focus
            </p>
            <div className="flex items-center gap-3">
              <TypeBadge type={selectedType} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {typeData?.pokemon.length ?? 0} Pokémon
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {typeData?.moves.length ?? 0} moves appear in this category, with
              quick matchup guidance below.
            </p>
          </SurfaceCard>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Pick a type
            </p>
            <h2 className="mt-1 text-2xl font-bold">Switch focus instantly</h2>
          </div>
          <BoltIcon className="h-6 w-6 text-primary" />
        </div>

        <div className="flex flex-wrap gap-2">
          {selectableTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => setSelectedType(type.name)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedType === type.name
                  ? 'border-primary bg-primary text-white'
                  : 'border-white/70 bg-white/80 hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-slate-900 dark:hover:bg-slate-800'
              }`}>
              {formatName(type.name)}
            </button>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Spotlight
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {featuredPokemon
                  ? formatName(featuredPokemon.name)
                  : 'Loading...'}
              </h2>
            </div>
            <TypeBadge type={selectedType} />
          </div>

          {featuredPokemon && (
            <>
              <div className="relative mx-auto h-56 w-56">
                <Image
                  src={getPokemonArtworkUrl(featuredPokemonId)}
                  alt={featuredPokemon.name}
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>

              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                The first species in this type group makes a reliable anchor
                when you want to jump into a themed run of related Pokémon.
              </p>

              <Link
                href={`/pokemon/${featuredPokemon.name}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
                Open featured Pokémon
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Matchup guide
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Understand strengths quickly
              </h2>
            </div>
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
          </div>

          {isLoading ? (
            <LoadingState label="Loading type data" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-200">
                  Strong against
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeData?.damage_relations.double_damage_to.length ? (
                    typeData.damage_relations.double_damage_to.map((type) => (
                      <TypeBadge key={type.name} type={type.name} />
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      No double-damage types listed.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-rose-50 p-4 dark:bg-rose-950/30">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-700 dark:text-rose-200">
                  Vulnerable to
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeData?.damage_relations.double_damage_from.length ? (
                    typeData.damage_relations.double_damage_from.map((type) => (
                      <TypeBadge key={type.name} type={type.name} />
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      No direct vulnerabilities listed.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-sky-50 p-4 dark:bg-sky-950/30">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700 dark:text-sky-200">
                  Resists
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeData?.damage_relations.half_damage_from.length ? (
                    typeData.damage_relations.half_damage_from.map((type) => (
                      <TypeBadge key={type.name} type={type.name} />
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      No resistance entries available.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-amber-50 p-4 dark:bg-amber-950/30">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">
                  Reduced damage to
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeData?.damage_relations.half_damage_to.length ? (
                    typeData.damage_relations.half_damage_to.map((type) => (
                      <TypeBadge key={type.name} type={type.name} />
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      No reduced-damage entries available.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </SurfaceCard>
      </div>

      <SurfaceCard className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Type roster
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Pokémon you can inspect in the {formatName(selectedType)} lineup
            </h2>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primaryDark dark:text-pink-100">
            {typeData?.pokemon.length ?? 0} available
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {typeData?.pokemon.slice(0, 12).map((entry) => {
            const pokemonId = getPokemonIdFromUrl(entry.pokemon.url);
            return (
              <Link
                key={entry.pokemon.name}
                href={`/pokemon/${entry.pokemon.name}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/70 bg-white/80 p-4 text-center transition hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800">
                  <div className="relative mx-auto h-28 w-28">
                    <Image
                      src={getPokemonArtworkUrl(pokemonId)}
                      alt={entry.pokemon.name}
                      fill
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 text-lg font-semibold">
                    {formatName(entry.pokemon.name)}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Sample moves
        </p>
        <div className="flex flex-wrap gap-2">
          {typeData?.moves.slice(0, 14).map((move) => (
            <Link
              key={move.name}
              href={`/move/${move.name}`}
              className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/14 dark:border-white/10 dark:bg-white/5 dark:text-pink-100 dark:hover:bg-white/10">
              {formatName(move.name)}
            </Link>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
