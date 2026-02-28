import Link from 'next/link';
import { motion } from 'framer-motion';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import { Move } from '@/data/models/move';
import { formatName } from '@/utils/pokedex';

type MoveCardProps = {
  move: Move;
};

/**
 * Animated move summary card used in the move dex.
 *
 * @param param0 The component props
 * @returns The move card
 */
export default function MoveCard({ move }: MoveCardProps) {
  return (
    <Link href={`/move/${move.name}`}>
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <SurfaceCard className="flex h-full flex-col gap-4 bg-white/85 p-5 transition dark:bg-slate-950/70">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Move
              </p>
              <h3 className="mt-2 text-xl font-bold">
                {formatName(move.name)}
              </h3>
            </div>
            <TypeBadge type={move.type.name} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Power
              </p>
              <p className="mt-1 font-semibold">{move.power ?? 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Accuracy
              </p>
              <p className="mt-1 font-semibold">{move.accuracy ?? 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Class
              </p>
              <p className="mt-1 font-semibold">
                {formatName(move.damage_class.name)}
              </p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                PP
              </p>
              <p className="mt-1 font-semibold">{move.pp}</p>
            </div>
          </div>
        </SurfaceCard>
      </motion.div>
    </Link>
  );
}
