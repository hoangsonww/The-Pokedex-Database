import Link from 'next/link';
import { motion } from 'framer-motion';
import SurfaceCard from '@/components/SurfaceCard';
import { Ability } from '@/data/models/ability';
import { formatName } from '@/utils/pokedex';

type AbilityCardProps = {
  ability: Ability;
};

/**
 * Animated ability summary card used in the ability dex.
 *
 * @param param0 The component props
 * @returns The ability card
 */
export default function AbilityCard({ ability }: AbilityCardProps) {
  const effect =
    ability.effect_entries.find((entry) => entry.language.name === 'en')
      ?.short_effect ?? 'No effect description found.';

  return (
    <Link href={`/ability/${ability.name}`}>
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <SurfaceCard className="flex h-full flex-col gap-4 bg-white/85 p-5 transition dark:bg-slate-950/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Ability
            </p>
            <h3 className="mt-2 text-xl font-bold">
              {formatName(ability.name)}
            </h3>
          </div>

          <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Generation
            </p>
            <p className="mt-1 font-semibold">
              {formatName(ability.generation.name)}
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {effect}
          </p>

          <p className="text-sm font-semibold text-primaryDark dark:text-pink-100">
            {ability.pokemon.length} Pokémon use this ability
          </p>
        </SurfaceCard>
      </motion.div>
    </Link>
  );
}
