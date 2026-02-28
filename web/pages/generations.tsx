import { useQueries, useQuery } from '@tanstack/react-query';
import {
  GlobeAsiaAustraliaIcon,
  QueueListIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import GenerationCard from '@/components/GenerationCard';
import SurfaceCard from '@/components/SurfaceCard';
import { Generation, GenerationList } from '@/data/models/generation';

/**
 * Generations index page.
 *
 * @returns The generations page
 */
export default function GenerationsPage() {
  const { data: generationList } = useQuery<GenerationList>({
    queryKey: ['generationList'],
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/generation');

      if (!response.ok) {
        throw new Error('Failed to fetch generations.');
      }

      return (await response.json()) as GenerationList;
    }
  });

  const generationQueries = useQueries({
    queries: (generationList?.results ?? []).map((generation) => ({
      queryKey: ['generationCard', generation.name],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/generation/${generation.name}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch generation.');
        }

        return (await response.json()) as Generation;
      }
    }))
  });

  const generations = generationQueries
    .map((query) => query.data)
    .filter((generation): generation is Generation => Boolean(generation));

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(16,185,129,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(16,185,129,0.08))]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Generation database
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse the Pokédex by generation and region, not just by entity
              type.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Each generation page pulls together species, moves, abilities, and
              version groups so the app feels like a real encyclopedic index.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Generations
              </p>
              <p className="mt-2 text-3xl font-bold">
                {generationList?.results.length ?? 0}
              </p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Total species
              </p>
              <p className="mt-2 text-3xl font-bold">
                {generations.reduce(
                  (total, generation) =>
                    total + generation.pokemon_species.length,
                  0
                )}
              </p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Loaded pages
              </p>
              <p className="mt-2 text-3xl font-bold">{generations.length}</p>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.32fr]">
        <SurfaceCard className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {generations.map((generation) => (
              <GenerationCard key={generation.name} generation={generation} />
            ))}
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <GlobeAsiaAustraliaIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Region-first browsing</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Generations connect the database to release eras and regions,
              which gives the app much better encyclopedic structure.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <QueueListIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Aggregated data</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Each generation summarizes more than species alone, including
              moves, abilities, types, and version groups.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Linked browsing</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Open any generation card to jump into a richer, filtered detail
              page with species and metadata links.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
