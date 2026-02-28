import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import { Move } from '@/data/models/move';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import { formatName } from '@/utils/pokedex';

type MovePageProps = {
  move: Move;
  description: string;
  effectText: string;
};

/**
 * Move detail page.
 *
 * @param param0 The move page props
 * @returns The move page
 */
export default function MovePage({
  move,
  description,
  effectText
}: MovePageProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}>
        <SurfaceCard className="space-y-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Move profile
                </p>
                <h1 className="mt-2 text-4xl font-bold">
                  {formatName(move.name)}
                </h1>
              </div>
              <TypeBadge type={move.type.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Power
                </p>
                <p className="mt-2 text-3xl font-bold">{move.power ?? 'N/A'}</p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Accuracy
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {move.accuracy ?? 'N/A'}
                </p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  PP
                </p>
                <p className="mt-2 text-3xl font-bold">{move.pp}</p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Priority
                </p>
                <p className="mt-2 text-3xl font-bold">{move.priority}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Battle context</h2>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Damage class
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatName(move.damage_class.name)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Target
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatName(move.target.name)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Flavor text
                  </p>
                  <p className="mt-2 leading-7">{description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Effect</h2>
              <div className="rounded-3xl border border-white/70 bg-white/75 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <p className="leading-7">{effectText}</p>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </motion.div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.query;

  if (!name || typeof name !== 'string') {
    return { notFound: true };
  }

  const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`);

  if (!res.ok) {
    return { notFound: true };
  }

  const move = (await res.json()) as Move;

  const englishFlavor = move.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const description = englishFlavor
    ? formatFlavorText(englishFlavor.flavor_text)
    : 'No description found.';

  const englishEffect = move.effect_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const effectText = englishEffect
    ? formatFlavorText(englishEffect.short_effect)
    : 'No effect details found.';

  return {
    props: {
      move,
      description,
      effectText
    }
  };
};
