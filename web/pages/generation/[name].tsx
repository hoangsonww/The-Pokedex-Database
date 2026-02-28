import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import { Generation } from '@/data/models/generation';
import { formatName, getPokemonArtworkUrl } from '@/utils/pokedex';

type GenerationPageProps = {
  generation: Generation;
};

/**
 * Generation detail page.
 *
 * @param param0 The page props
 * @returns The generation detail page
 */
export default function GenerationPage({ generation }: GenerationPageProps) {
  const router = useRouter();
  const showcasedSpecies = generation.pokemon_species.slice(0, 18);

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
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Generation profile
              </p>
              <h1 className="mt-2 text-4xl font-bold">
                {formatName(generation.name)}
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                Main region: {formatName(generation.main_region.name)}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Species
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {generation.pokemon_species.length}
                </p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Moves
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {generation.moves.length}
                </p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Abilities
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {generation.abilities.length}
                </p>
              </div>
              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Version groups
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {generation.version_groups.length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Featured species</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {showcasedSpecies.map((species) => {
                  const speciesId =
                    species.url.match(/\/pokemon-species\/(\d+)\//)?.[1] ?? '0';
                  return (
                    <Link key={species.name} href={`/pokemon/${species.name}`}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}>
                        <SurfaceCard className="space-y-3 bg-white/80 p-4 dark:bg-slate-950/60">
                          <div className="relative mx-auto h-24 w-24">
                            {speciesId !== '0' ? (
                              <Image
                                src={getPokemonArtworkUrl(speciesId)}
                                alt={species.name}
                                fill
                                sizes="96px"
                                className="object-contain"
                              />
                            ) : null}
                          </div>
                          <p className="text-center text-lg font-semibold">
                            {formatName(species.name)}
                          </p>
                        </SurfaceCard>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
              {generation.pokemon_species.length > showcasedSpecies.length && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing the first {showcasedSpecies.length} species from this
                  generation for readability.
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Types introduced</h2>
                <div className="flex flex-wrap gap-2">
                  {generation.types.map((type) => (
                    <TypeBadge key={type.name} type={type.name} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Version groups</h2>
                <div className="flex flex-wrap gap-2">
                  {generation.version_groups.map((versionGroup) => (
                    <span
                      key={versionGroup.name}
                      className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 text-sm font-semibold text-primaryDark dark:border-white/10 dark:bg-white/5 dark:text-pink-100">
                      {formatName(versionGroup.name)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Sample abilities</h2>
                <div className="flex flex-wrap gap-2">
                  {generation.abilities.slice(0, 16).map((ability) => (
                    <Link
                      key={ability.name}
                      href={`/ability/${ability.name}`}
                      className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/14 dark:border-white/10 dark:bg-white/5 dark:text-pink-100 dark:hover:bg-white/10">
                      {formatName(ability.name)}
                    </Link>
                  ))}
                </div>
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

  const response = await fetch(`https://pokeapi.co/api/v2/generation/${name}`);

  if (!response.ok) {
    return { notFound: true };
  }

  const generation = (await response.json()) as Generation;

  return {
    props: {
      generation
    }
  };
};
