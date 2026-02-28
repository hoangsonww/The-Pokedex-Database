import { useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import { PokemonType, TypeList } from '@/data/models/type';
import { formatName } from '@/utils/pokedex';

const defensiveChoices = ['none'];

/**
 * Type encyclopedia with matchup calculator.
 *
 * @returns The types page
 */
export default function TypesPage() {
  const [attackType, setAttackType] = useState('fire');
  const [defensePrimary, setDefensePrimary] = useState('grass');
  const [defenseSecondary, setDefenseSecondary] = useState('none');

  const { data: typeList } = useQuery<TypeList>({
    queryKey: ['allTypeEntries'],
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type');

      if (!response.ok) {
        throw new Error('Failed to fetch types.');
      }

      return (await response.json()) as TypeList;
    }
  });

  const validTypes =
    typeList?.results.filter(
      (type) => type.name !== 'unknown' && type.name !== 'shadow'
    ) ?? [];

  const typeQueries = useQueries({
    queries: validTypes.map((type) => ({
      queryKey: ['typeEntryFull', type.name],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/type/${type.name}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch type entry.');
        }

        return (await response.json()) as PokemonType;
      },
      enabled: validTypes.length > 0
    }))
  });

  const loadedTypes = typeQueries
    .map((query) => query.data)
    .filter((type): type is PokemonType => Boolean(type));
  const selectedAttackData = loadedTypes.find(
    (type) => type.name === attackType
  );
  const defendingTypes = [defensePrimary, defenseSecondary].filter(
    (type) => type !== 'none'
  );

  const multiplier = useMemo(() => {
    if (!selectedAttackData || defendingTypes.length === 0) {
      return 1;
    }

    return defendingTypes.reduce((total, defendingType) => {
      if (
        selectedAttackData.damage_relations.double_damage_to.some(
          (entry) => entry.name === defendingType
        )
      ) {
        return total * 2;
      }

      if (
        selectedAttackData.damage_relations.half_damage_to.some(
          (entry) => entry.name === defendingType
        )
      ) {
        return total * 0.5;
      }

      if (
        selectedAttackData.damage_relations.no_damage_to.some(
          (entry) => entry.name === defendingType
        )
      ) {
        return 0;
      }

      return total;
    }, 1);
  }, [defendingTypes, selectedAttackData]);

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(56,189,248,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(56,189,248,0.1))]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Type encyclopedia
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse every elemental type and calculate matchups live.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              This expands the earlier discovery view into a database surface:
              every type gets a card summary, and you can test attack-to-defense
              interactions without leaving the page.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Types
              </p>
              <p className="mt-2 text-3xl font-bold">{validTypes.length}</p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Attack type
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatName(attackType)}
              </p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Multiplier
              </p>
              <p className="mt-2 text-3xl font-bold">{multiplier}x</p>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SurfaceCard className="space-y-5">
          <div className="flex items-center gap-3">
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Matchup calculator
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Check type effectiveness
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Attack
              </span>
              <select
                value={attackType}
                onChange={(event) => setAttackType(event.target.value)}
                className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                {validTypes.map((type) => (
                  <option key={type.name} value={type.name}>
                    {formatName(type.name)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Defense 1
              </span>
              <select
                value={defensePrimary}
                onChange={(event) => setDefensePrimary(event.target.value)}
                className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                {validTypes.map((type) => (
                  <option key={type.name} value={type.name}>
                    {formatName(type.name)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Defense 2
              </span>
              <select
                value={defenseSecondary}
                onChange={(event) => setDefenseSecondary(event.target.value)}
                className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                {[
                  ...defensiveChoices,
                  ...validTypes.map((type) => type.name)
                ].map((type) => (
                  <option key={type} value={type}>
                    {type === 'none' ? 'None' : formatName(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <motion.div
            key={`${attackType}-${defensePrimary}-${defenseSecondary}-${multiplier}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-primary/8 p-5 dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <TypeBadge type={attackType} />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                into
              </span>
              <TypeBadge type={defensePrimary} />
              {defenseSecondary !== 'none' ? (
                <TypeBadge type={defenseSecondary} />
              ) : null}
            </div>
            <p className="mt-4 text-4xl font-bold">{multiplier}x damage</p>
          </motion.div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Selected attack profile</h2>
          </div>

          {selectedAttackData ? (
            <>
              <div className="flex flex-wrap gap-2">
                <TypeBadge type={selectedAttackData.name} />
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-200">
                    Super effective
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedAttackData.damage_relations.double_damage_to.map(
                      (type) => (
                        <TypeBadge key={type.name} type={type.name} />
                      )
                    )}
                  </div>
                </div>
                <div className="rounded-3xl bg-amber-50 p-4 dark:bg-amber-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">
                    Resisted by
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedAttackData.damage_relations.half_damage_to.map(
                      (type) => (
                        <TypeBadge key={type.name} type={type.name} />
                      )
                    )}
                  </div>
                </div>
                <div className="rounded-3xl bg-rose-50 p-4 dark:bg-rose-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-700 dark:text-rose-200">
                    No effect
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedAttackData.damage_relations.no_damage_to.length ? (
                      selectedAttackData.damage_relations.no_damage_to.map(
                        (type) => <TypeBadge key={type.name} type={type.name} />
                      )
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        No immunities for this attacking type.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SurfaceCard>
      </div>

      <SurfaceCard className="space-y-6">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              All types
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Open a type-specific exploration path
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loadedTypes.map((type) => (
            <Link key={type.name} href={`/discover?type=${type.name}`}>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <SurfaceCard className="flex h-full flex-col gap-4 bg-white/85 p-5 transition dark:bg-slate-950/70">
                  <div className="flex items-center justify-between gap-3">
                    <TypeBadge type={type.name} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {type.pokemon.length} Pokémon
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Strong into
                      </p>
                      <p className="mt-1 font-semibold">
                        {type.damage_relations.double_damage_to.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Vulnerable to
                      </p>
                      <p className="mt-1 font-semibold">
                        {type.damage_relations.double_damage_from.length}
                      </p>
                    </div>
                  </div>
                </SurfaceCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
