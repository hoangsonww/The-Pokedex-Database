import { useDeferredValue, useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  BoltIcon,
  FunnelIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import MoveCard from '@/components/MoveCard';
import Pagination from '@/components/Pagination';
import SearchField from '@/components/SearchField';
import SurfaceCard from '@/components/SurfaceCard';
import LoadingState from '@/components/LoadingState';
import { Move } from '@/data/models/move';
import { Pokedex } from '@/data/models/pokedex';

const MOVE_PAGE_SIZE = 24;

/**
 * Move dex page with search and class filtering.
 *
 * @returns The move dex page
 */
export default function MovesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [damageClass, setDamageClass] = useState('all');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput.trim().toLowerCase());

  const { data: moveList } = useQuery<Pokedex>({
    queryKey: ['allMoves'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/move?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch moves.');
      }

      return (await response.json()) as Pokedex;
    }
  });

  const searchedMoves =
    deferredSearch === ''
      ? (moveList?.results ?? [])
      : (moveList?.results.filter((move) =>
          move.name.includes(deferredSearch)
        ) ?? []);

  useEffect(() => {
    setPage(1);
  }, [damageClass]);

  const pagedMoveRefs = searchedMoves.slice(
    (page - 1) * MOVE_PAGE_SIZE,
    page * MOVE_PAGE_SIZE
  );

  const moveQueries = useQueries({
    queries: pagedMoveRefs.map((move) => ({
      queryKey: ['moveDexEntry', move.name],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/move/${move.name}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch move entry.');
        }

        return (await response.json()) as Move;
      }
    }))
  });

  const isLoadingMoves = moveQueries.some((query) => query.isLoading);
  const loadedMoves = moveQueries
    .map((query) => query.data)
    .filter((move): move is Move => Boolean(move));

  const displayedMoves =
    damageClass === 'all'
      ? loadedMoves
      : loadedMoves.filter((move) => move.damage_class.name === damageClass);

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(99,102,241,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(99,102,241,0.1))]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Move database
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse the move dex with quick battle context instead of dead-end
              links.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Search the global move index, skim power and accuracy at a glance,
              and open richer move pages without needing to enter through a
              specific Pokémon profile first.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Indexed moves
              </p>
              <p className="mt-2 text-3xl font-bold">{moveList?.count ?? 0}</p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Current filter
              </p>
              <p className="mt-2 text-3xl font-bold capitalize">
                {damageClass}
              </p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Results now
              </p>
              <p className="mt-2 text-3xl font-bold">{displayedMoves.length}</p>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Search moves
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Find attacks, buffs, and tech moves
            </h2>
          </div>
          <SearchField
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            placeholder="Search moves..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'physical', 'special', 'status'].map((value) => (
            <button
              key={value}
              onClick={() => setDamageClass(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                damageClass === value
                  ? 'bg-primary text-white'
                  : 'border border-primary/20 bg-white text-primaryDark hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800'
              }`}>
              {value === 'all' ? 'All classes' : value}
            </button>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.32fr]">
        <SurfaceCard className="space-y-6">
          {isLoadingMoves ? (
            <LoadingState label="Loading moves" />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {displayedMoves.map((move) => (
                  <MoveCard key={move.name} move={move} />
                ))}
              </div>
              {displayedMoves.length === 0 && (
                <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
                  No moves matched the current search and class combination on
                  this page.
                </p>
              )}
            </>
          )}

          <Pagination
            currentPage={page}
            totalCount={searchedMoves.length}
            pageSize={MOVE_PAGE_SIZE}
            onPageChange={setPage}
          />
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <BoltIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Quick read</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Physical moves usually key off Attack, special moves off Special
              Attack, and status moves shape momentum, setup, or disruption.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <FunnelIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Filter tip</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Search first, then narrow by class when you already know whether
              you want direct damage or utility.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Why this helps</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              The app now treats moves as first-class data, not just leaf nodes
              attached to individual Pokémon pages.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
