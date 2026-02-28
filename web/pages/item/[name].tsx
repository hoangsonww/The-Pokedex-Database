import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import SurfaceCard from '@/components/SurfaceCard';
import { Item } from '@/data/models/item';
import { formatName } from '@/utils/pokedex';

type ItemPageProps = {
  item: Item;
  effect: string;
  flavorText: string;
};

/**
 * Item detail page with richer metadata.
 *
 * @param param0 The page props
 * @returns The item page
 */
export default function ItemPage({ item, effect, flavorText }: ItemPageProps) {
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
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(236,72,153,0.14),rgba(255,255,255,0.5))] p-6 text-center dark:bg-[linear-gradient(180deg,rgba(236,72,153,0.2),rgba(15,23,42,0.2))]">
              {item.sprites?.default ? (
                <div className="relative mx-auto h-52 w-52">
                  <Image
                    src={item.sprites.default}
                    alt={item.name}
                    fill
                    sizes="208px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-52 items-center justify-center text-slate-500 dark:text-slate-400">
                  No image available
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Item profile
                </p>
                <h1 className="mt-2 text-4xl font-bold">
                  {formatName(item.name)}
                </h1>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Cost
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {item.cost} PokéDollars
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Category
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {item.category ? formatName(item.category.name) : 'Unknown'}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Effect
                  </p>
                  <p className="mt-2 leading-7">{effect}</p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Description
                  </p>
                  <p className="mt-2 leading-7">{flavorText}</p>
                </div>
              </div>

              {(item.attributes?.length || item.fling_power) && (
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">Extra details</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Attributes
                      </p>
                      <p className="mt-2 leading-7">
                        {item.attributes?.length
                          ? item.attributes
                              .map((attribute) => formatName(attribute.name))
                              .join(', ')
                          : 'None listed'}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Fling power
                      </p>
                      <p className="mt-2 text-2xl font-bold">
                        {item.fling_power ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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

  const response = await fetch(`https://pokeapi.co/api/v2/item/${name}`);

  if (!response.ok) {
    return { notFound: true };
  }

  const item = (await response.json()) as Item;

  const engEffect = item.effect_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const effect = engEffect ? engEffect.short_effect : 'No effect found.';

  const engFlavor = item.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const flavorText = engFlavor ? engFlavor.text : 'No description found.';

  return {
    props: {
      item,
      effect,
      flavorText
    }
  };
};
