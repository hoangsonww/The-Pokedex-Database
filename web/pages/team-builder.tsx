import { useQueries, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  PlusIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import PokemonPicker from '@/components/PokemonPicker';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import LoadingState from '@/components/LoadingState';
import { Pokedex } from '@/data/models/pokedex';
import { Pokemon } from '@/data/models/pokemon';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  formatName,
  formatStatLabel,
  getPokemonArtworkUrl,
  getPokemonStatMap,
  getTotalBaseStats,
  normalizePokemonName,
  TEAM_LIMIT
} from '@/utils/pokedex';
import { STORAGE_KEYS } from '@/utils/storage';

const statKeys = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed'
];

/**
 * Team builder page.
 *
 * @returns The team builder page
 */
export default function TeamBuilderPage() {
  const [candidateName, setCandidateName] = useState('');
  const [notice, setNotice] = useState('');
  const [team, setTeam] = usePersistentState<string[]>(STORAGE_KEYS.team, []);
  const [favorites] = usePersistentState<string[]>(STORAGE_KEYS.favorites, []);

  const { data: pokemonIndex } = useQuery<Pokedex>({
    queryKey: ['pokemonIndexForTeamBuilder'],
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

  const pokemonNames =
    pokemonIndex?.results.map((pokemon) => pokemon.name) ?? [];
  const normalizedCandidateName = normalizePokemonName(candidateName);
  const suggestedPokemon = normalizedCandidateName
    ? pokemonNames
        .filter(
          (name) =>
            name.includes(normalizedCandidateName) && !team.includes(name)
        )
        .slice(0, 5)
    : [];

  const teamQueries = useQueries({
    queries: team.map((pokemonName) => ({
      queryKey: ['teamPokemon', pokemonName],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch team member.');
        }

        return (await response.json()) as Pokemon;
      }
    }))
  });

  const teamMembers = teamQueries
    .map((queryResult) => queryResult.data)
    .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

  const isLoadingTeam = teamQueries.some(
    (queryResult) => queryResult.isLoading
  );

  const aggregateStats = statKeys.reduce<Record<string, number>>(
    (accumulator, key) => {
      accumulator[key] = teamMembers.reduce((total, pokemon) => {
        const statMap = getPokemonStatMap(pokemon);
        return total + (statMap[key] ?? 0);
      }, 0);
      return accumulator;
    },
    {}
  );

  const typeCounts = teamMembers.reduce<Record<string, number>>(
    (accumulator, pokemon) => {
      pokemon.types.forEach((type) => {
        accumulator[type.type.name] = (accumulator[type.type.name] ?? 0) + 1;
      });
      return accumulator;
    },
    {}
  );

  const sortedTypes = Object.entries(typeCounts).sort(
    (left, right) => right[1] - left[1]
  );

  const addPokemonToTeam = (rawName: string) => {
    const normalizedName = normalizePokemonName(rawName);

    if (!normalizedName) {
      setNotice('Pick a Pokémon name before adding a slot.');
      return;
    }

    if (!pokemonNames.includes(normalizedName)) {
      setNotice('That Pokémon was not found in the Pokédex index.');
      return;
    }

    if (team.includes(normalizedName)) {
      setNotice('That Pokémon is already on the team.');
      return;
    }

    if (team.length >= TEAM_LIMIT) {
      setNotice('Your team already has six members.');
      return;
    }

    setTeam([...team, normalizedName]);
    setCandidateName('');
    setNotice('');
  };

  const removePokemonFromTeam = (pokemonName: string) => {
    setTeam(team.filter((entry) => entry !== pokemonName));
  };

  const clearTeam = () => {
    setTeam([]);
    setNotice('');
  };

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.14),rgba(255,255,255,0.95)_40%,rgba(16,185,129,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_40%,rgba(16,185,129,0.08))]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
            Team builder
          </p>
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Assemble a six-slot squad and inspect its shape before battle.
          </h1>
          <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            Team state is stored locally, so you can sketch ideas quickly, reuse
            favorites, and review aggregate stats without leaving the app.
          </p>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SurfaceCard className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Add a teammate
              </p>
              <h2 className="mt-1 text-2xl font-bold">Fill up to six slots</h2>
            </div>
            <UserGroupIcon className="h-6 w-6 text-primary" />
          </div>

          <PokemonPicker
            id="team-builder"
            label="Pokémon"
            placeholder="Search a Pokémon to add"
            value={candidateName}
            onChange={setCandidateName}
            options={pokemonNames}
            helperText="Use API naming when needed, such as mr-mime."
          />

          {suggestedPokemon.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Top matches
              </p>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                {suggestedPokemon.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCandidateName(name);
                      setNotice('');
                    }}
                    className="flex items-center justify-between rounded-2xl border border-primary/15 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-primary/35 hover:bg-primary/8 hover:text-primaryDark dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-pink-100">
                    <span>{formatName(name)}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addPokemonToTeam(candidateName)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
              <PlusIcon className="h-5 w-5" />
              Add to team
            </button>
            <button
              onClick={clearTeam}
              className="rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
              Clear team
            </button>
          </div>

          {notice && (
            <p className="rounded-2xl bg-primary/8 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
              {notice}
            </p>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Quick add from favorites
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Reuse your saved collection
            </h2>
          </div>

          {favorites.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {favorites.slice(0, 18).map((favorite) => (
                <button
                  key={favorite}
                  onClick={() => addPokemonToTeam(favorite)}
                  className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/14 dark:border-white/10 dark:bg-white/5 dark:text-pink-100 dark:hover:bg-white/10">
                  {formatName(favorite)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Favorite a few Pokémon on the home page to make quick-add useful.
            </p>
          )}
        </SurfaceCard>
      </div>

      <SurfaceCard className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Current team
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {team.length}/6 slots filled
            </h2>
          </div>
        </div>

        {isLoadingTeam ? (
          <LoadingState label="Loading team" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((pokemon) => (
              <SurfaceCard
                key={pokemon.name}
                className="space-y-4 bg-white/80 p-5 dark:bg-slate-950/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Team slot
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">
                      {formatName(pokemon.name)}
                    </h3>
                  </div>

                  <button
                    onClick={() => removePokemonFromTeam(pokemon.name)}
                    className="rounded-full bg-rose-100 p-2 text-rose-700 transition hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/70"
                    aria-label={`Remove ${pokemon.name} from team`}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative mx-auto h-32 w-32">
                  <Image
                    src={getPokemonArtworkUrl(pokemon.id)}
                    alt={pokemon.name}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Total stats
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {getTotalBaseStats(pokemon)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Compare
                    </p>
                    <Link
                      href={`/compare?left=${pokemon.name}`}
                      className="mt-1 inline-flex text-sm font-semibold text-primaryDark hover:underline dark:text-pink-100">
                      Use in compare
                    </Link>
                  </div>
                </div>
              </SurfaceCard>
            ))}

            {Array.from({
              length: Math.max(TEAM_LIMIT - teamMembers.length, 0)
            }).map((_, index) => (
              <div
                key={`empty-slot-${index}`}
                className="flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-primary/25 bg-primary/5 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Empty slot
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Aggregate stats
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              See the team profile at a glance
            </h2>
          </div>

          <div className="grid gap-3">
            {statKeys.map((statKey) => {
              const totalValue = aggregateStats[statKey] ?? 0;
              const averageValue =
                teamMembers.length > 0 ? totalValue / teamMembers.length : 0;

              return (
                <div
                  key={statKey}
                  className="rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{formatStatLabel(statKey)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Avg {averageValue.toFixed(1)}
                    </p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.min(100, (averageValue / 140) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Type spread
            </p>
            <h2 className="mt-1 text-2xl font-bold">Watch for over-stacking</h2>
          </div>

          {sortedTypes.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {sortedTypes.map(([typeName, count]) => (
                  <div
                    key={typeName}
                    className="flex items-center gap-2 rounded-full bg-primary/8 px-3 py-2 dark:bg-white/5">
                    <TypeBadge type={typeName} />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      x{count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Total combined base stats:{' '}
                  <span className="font-semibold">
                    {teamMembers.reduce(
                      (total, pokemon) => total + getTotalBaseStats(pokemon),
                      0
                    )}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add at least one Pokémon to start analyzing the team spread.
            </p>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
}
