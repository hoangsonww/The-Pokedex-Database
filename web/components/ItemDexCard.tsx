import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SurfaceCard from '@/components/SurfaceCard';
import { Item } from '@/data/models/item';
import { formatName } from '@/utils/pokedex';

type ItemDexCardProps = {
  item: Item;
};

/**
 * Rich item card for the item database page.
 *
 * @param param0 The card props
 * @returns The item database card
 */
export default function ItemDexCard({ item }: ItemDexCardProps) {
  return (
    <Link href={`/item/${item.name}`}>
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <SurfaceCard className="flex h-full flex-col gap-4 bg-white/85 p-5 transition dark:bg-slate-950/70">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Item
              </p>
              <h3 className="mt-2 text-xl font-bold">
                {formatName(item.name)}
              </h3>
            </div>
            <div className="relative h-16 w-16">
              {item.sprites?.default ? (
                <Image
                  src={item.sprites.default}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Cost
              </p>
              <p className="mt-1 font-semibold">{item.cost}</p>
            </div>
            <div className="rounded-2xl bg-primary/8 px-3 py-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Category
              </p>
              <p className="mt-1 font-semibold">
                {item.category ? formatName(item.category.name) : 'Unknown'}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </motion.div>
    </Link>
  );
}
