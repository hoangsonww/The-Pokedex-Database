import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowsRightLeftIcon, TrophyIcon } from '@heroicons/react/24/outline';
import PokemonPicker from '@/components/PokemonPicker';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import LoadingState from '@/components/LoadingState';
import { Pokedex } from '@/data/models/pokedex';
import { Pokemon } from '@/data/models/pokemon';
import {
  formatName,
  formatStatLabel,
  getPokemonArtworkUrl,
  getPokemonStatMap,
  getTotalBaseStats,
  normalizePokemonName
} from '@/utils/pokedex';

const comparisonStatKeys = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed'
];

/**
 * Compare page for side-by-side Pokemon analysis.
 *
 * @returns The compare page
 */
export default function ComparePage() {
  const router = useRouter();
  const [leftName, setLeftName] = useState('pikachu');
  const [rightName, setRightName] = useState('charizard');

  useEffect(() => {
    if (typeof router.query.left === 'string') {
      setLeftName(normalizePokemonName(router.query.left));
    }

    if (typeof router.query.right === 'string') {
      setRightName(normalizePokemonName(router.query.right));
    }
  }, [router.query.left, router.query.right]);

  const { data: pokemonIndex } = useQuery<Pokedex>({
    queryKey: ['pokemonIndexForCompare'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pokemon index.');
      }

      return (await response.json()) as Pokedex;
    }
  });

  const {
    data: leftPokemon,
    error: leftError,
    isFetching: isFetchingLeft
  } = useQuery<Pokemon>({
    queryKey: ['comparePokemon', leftName],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${normalizePokemonName(leftName)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch left Pokemon.');
      }

      return (await response.json()) as Pokemon;
    },
    enabled: leftName.trim().length > 0
  });

  const {
    data: rightPokemon,
    error: rightError,
    isFetching: isFetchingRight
  } = useQuery<Pokemon>({
    queryKey: ['comparePokemon', rightName],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${normalizePokemonName(rightName)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch right Pokemon.');
      }

      return (await response.json()) as Pokemon;
    },
    enabled: rightName.trim().length > 0
  });

  const pokemonNames =
    pokemonIndex?.results.map((pokemon) => pokemon.name) ?? [];

  const leftStats = leftPokemon ? getPokemonStatMap(leftPokemon) : null;
  const rightStats = rightPokemon ? getPokemonStatMap(rightPokemon) : null;
  const handleSwapPokemon = () => {
    setLeftName(rightName);
    setRightName(leftName);
  };

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(251,191,36,0.14))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(251,191,36,0.1))]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
            Side-by-side comparison
          </p>
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Put two Pokémon on the same board before you commit to a team slot.
          </h1>
          <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            Compare base stats, size, type mix, and abilities with a single
            lookup. Query params are supported, so detail pages can deep-link
            straight into this view.
          </p>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <SurfaceCard className="space-y-4">
          <PokemonPicker
            id="compare-left"
            label="Left Pokémon"
            placeholder="Pick a Pokémon"
            value={leftName}
            onChange={setLeftName}
            options={pokemonNames}
            helperText="Search by API name, like pikachu or mr-mime."
          />
          {leftError && (
            <p className="text-sm text-red-500">
              No Pokémon found for that input.
            </p>
          )}
        </SurfaceCard>

        <div className="flex justify-center">
          <button
            onClick={handleSwapPokemon}
            type="button"
            className="rounded-full bg-primary p-4 text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primaryDark focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label="Swap compared Pokemon">
            <ArrowsRightLeftIcon className="h-6 w-6" />
          </button>
        </div>

        <SurfaceCard className="space-y-4">
          <PokemonPicker
            id="compare-right"
            label="Right Pokémon"
            placeholder="Pick another Pokémon"
            value={rightName}
            onChange={setRightName}
            options={pokemonNames}
            helperText="Try roles that compete for the same team job."
          />
          {rightError && (
            <p className="text-sm text-red-500">
              No Pokémon found for that input.
            </p>
          )}
        </SurfaceCard>
      </div>

      {isFetchingLeft || isFetchingRight ? (
        <LoadingState label="Loading comparison" />
      ) : leftPokemon && rightPokemon ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {[leftPokemon, rightPokemon].map((pokemon) => (
              <SurfaceCard key={pokemon.name} className="space-y-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative h-36 w-36">
                    <Image
                      src={getPokemonArtworkUrl(pokemon.id)}
                      alt={pokemon.name}
                      fill
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Profile
                      </p>
                      <h2 className="mt-1 text-3xl font-bold">
                        {formatName(pokemon.name)}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type) => (
                        <TypeBadge key={type.type.name} type={type.type.name} />
                      ))}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Height
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                          {(pokemon.height / 10).toFixed(1)} m
                        </p>
                      </div>
                      <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Weight
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                          {(pokemon.weight / 10).toFixed(1)} kg
                        </p>
                      </div>
                      <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5 sm:col-span-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Abilities
                        </p>
                        <p className="mt-1 text-base font-medium">
                          {pokemon.abilities
                            .map((ability) =>
                              ability.is_hidden
                                ? `${formatName(ability.ability.name)} (Hidden)`
                                : formatName(ability.ability.name)
                            )
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>

          <SurfaceCard className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Stat battle
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  Metric-by-metric winners
                </h2>
              </div>
              <TrophyIcon className="h-6 w-6 text-primary" />
            </div>

            <div className="grid gap-4">
              {comparisonStatKeys.map((statKey) => {
                const leftValue = leftStats?.[statKey] ?? 0;
                const rightValue = rightStats?.[statKey] ?? 0;
                const leftWins = leftValue > rightValue;
                const rightWins = rightValue > leftValue;
                const maxValue = Math.max(leftValue, rightValue, 1);

                return (
                  <div
                    key={statKey}
                    className="grid gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40 md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)] md:items-stretch">
                    <div
                      className={`flex min-h-32 flex-col justify-between rounded-2xl px-4 py-3 ${
                        leftWins
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                          : 'bg-primary/8 dark:bg-white/5'
                      }`}>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {formatName(leftPokemon.name)}
                      </p>
                      <p className="mt-2 text-2xl font-bold">{leftValue}</p>
                      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(leftValue / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-center">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {formatStatLabel(statKey)}
                      </p>
                    </div>

                    <div
                      className={`flex min-h-32 flex-col justify-between rounded-2xl px-4 py-3 ${
                        rightWins
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100'
                          : 'bg-primary/8 dark:bg-white/5'
                      }`}>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {formatName(rightPokemon.name)}
                      </p>
                      <p className="mt-2 text-2xl font-bold">{rightValue}</p>
                      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(rightValue / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Total base stats
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {formatName(leftPokemon.name)}:{' '}
                  {getTotalBaseStats(leftPokemon)}
                </p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Total base stats
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {formatName(rightPokemon.name)}:{' '}
                  {getTotalBaseStats(rightPokemon)}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </>
      ) : (
        <SurfaceCard>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Pick two valid Pokémon to start the comparison.
          </p>
        </SurfaceCard>
      )}
    </div>
  );
}
