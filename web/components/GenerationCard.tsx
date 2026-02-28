import Link from 'next/link';
import { motion } from 'framer-motion';
import SurfaceCard from '@/components/SurfaceCard';
import { Generation } from '@/data/models/generation';
import { formatName } from '@/utils/pokedex';

type GenerationCardProps = {
  generation: Generation;
};

/**
 * Summary card for a Pokemon generation.
 *
 * @param param0 The card props
 * @returns The generation card
 */
export default function GenerationCard({ generation }: GenerationCardProps) {
  return (
    <Link href={`/generation/${generation.name}`}>
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <SurfaceCard className="flex h-full flex-col gap-4 bg-white/85 p-5 transition dark:bg-slate-950/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Generation
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              {formatName(generation.name)}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {formatName(generation.main_region.name)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Species
              </p>
              <p className="mt-1 font-semibold">
                {generation.pokemon_species.length}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Moves
              </p>
              <p className="mt-1 font-semibold">{generation.moves.length}</p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Abilities
              </p>
              <p className="mt-1 font-semibold">
                {generation.abilities.length}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Types
              </p>
              <p className="mt-1 font-semibold">{generation.types.length}</p>
            </div>
          </div>
        </SurfaceCard>
      </motion.div>
    </Link>
  );
}
