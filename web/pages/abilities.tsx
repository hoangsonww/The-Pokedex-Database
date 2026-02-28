import { useDeferredValue, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  PuzzlePieceIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import AbilityCard from '@/components/AbilityCard';
import LoadingState from '@/components/LoadingState';
import Pagination from '@/components/Pagination';
import SearchField from '@/components/SearchField';
import SurfaceCard from '@/components/SurfaceCard';
import { Ability, AbilityList } from '@/data/models/ability';

const ABILITY_PAGE_SIZE = 24;

/**
 * Ability dex page.
 *
 * @returns The ability dex page
 */
export default function AbilitiesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput.trim().toLowerCase());

  const { data: abilityList } = useQuery<AbilityList>({
    queryKey: ['allAbilities'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/ability?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch abilities.');
      }

      return (await response.json()) as AbilityList;
    }
  });

  const searchedAbilities =
    deferredSearch === ''
      ? (abilityList?.results ?? [])
      : (abilityList?.results.filter((ability) =>
          ability.name.includes(deferredSearch)
        ) ?? []);

  const pagedAbilityRefs = searchedAbilities.slice(
    (page - 1) * ABILITY_PAGE_SIZE,
    page * ABILITY_PAGE_SIZE
  );

  const abilityQueries = useQueries({
    queries: pagedAbilityRefs.map((ability) => ({
      queryKey: ['abilityDexEntry', ability.name],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/ability/${ability.name}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch ability entry.');
        }

        return (await response.json()) as Ability;
      }
    }))
  });

  const loadedAbilities = abilityQueries
    .map((query) => query.data)
    .filter((ability): ability is Ability => Boolean(ability));
  const isLoadingAbilities = abilityQueries.some((query) => query.isLoading);

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(16,185,129,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(16,185,129,0.08))]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Ability database
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse passive abilities as a real database, not hidden metadata.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Search the full ability index, see which Pokémon use an effect,
              and open dedicated detail pages for strategy context.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Indexed abilities
              </p>
              <p className="mt-2 text-3xl font-bold">
                {abilityList?.count ?? 0}
              </p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Current page
              </p>
              <p className="mt-2 text-3xl font-bold">{page}</p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Loaded now
              </p>
              <p className="mt-2 text-3xl font-bold">
                {loadedAbilities.length}
              </p>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Search abilities
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Trace passives and hidden tech
            </h2>
          </div>
          <SearchField
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            placeholder="Search abilities..."
          />
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.32fr]">
        <SurfaceCard className="space-y-6">
          {isLoadingAbilities ? (
            <LoadingState label="Loading abilities" />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {loadedAbilities.map((ability) => (
                  <AbilityCard key={ability.name} ability={ability} />
                ))}
              </div>
              {loadedAbilities.length === 0 && (
                <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
                  No abilities matched that search.
                </p>
              )}
            </>
          )}

          <Pagination
            currentPage={page}
            totalCount={searchedAbilities.length}
            pageSize={ABILITY_PAGE_SIZE}
            onPageChange={setPage}
          />
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <PuzzlePieceIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Database note</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Abilities now have dedicated browseable pages, which makes team
              planning and Pokémon profile reading much more useful.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Planning angle</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Open an ability page to see which Pokémon share an effect before
              you commit a slot in the team builder.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Cross-linked</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Pokémon detail pages can now link back into the ability database,
              which closes a major navigation gap.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
