import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CubeIcon } from '@heroicons/react/24/outline';
import { formatName } from '@/utils/pokedex';

/**
 * Type alias for the ItemCard component props
 */
type ItemCardProps = {
  name: string;
  spriteUrl?: string | null; // The sprite URL may be null and it's optional
};

/**
 * ItemCard component
 *
 * @param param0 The props for the ItemCard component
 * @returns The ItemCard component
 */
export default function ItemCard({ name, spriteUrl }: ItemCardProps) {
  const router = useRouter();

  // Track if the sprite is valid (not 404, etc.)
  const [isSpriteValid, setIsSpriteValid] = useState(true);

  useEffect(() => {
    setIsSpriteValid(Boolean(spriteUrl));
  }, [spriteUrl]);

  // Navigate to the item details page when the card is clicked
  const handleClick = () => {
    router.push(`/item/${name.toLowerCase()}`);
  };

  // Here I am also using framer motion for better animations and smooth transitions
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="flex cursor-pointer flex-col items-center rounded-3xl border border-white/70 bg-white/90 p-4 text-gray-800 shadow-soft transition-all dark:border-white/10 dark:bg-slate-900/80 dark:text-gray-100 dark:hover:bg-slate-800">
      <div className="mb-3 flex items-center space-x-2">
        <CubeIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{formatName(name)}</h2>
      </div>

      {spriteUrl && isSpriteValid && (
        <div className="relative h-24 w-24">
          <Image
            src={spriteUrl}
            alt={name}
            fill
            sizes="(max-width: 96px) 96px"
            style={{ objectFit: 'contain' }}
            loading="lazy"
            unoptimized
            onError={() => setIsSpriteValid(false)}
          />
        </div>
      )}

      {!isSpriteValid && (
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <p className="text-gray-500 dark:text-gray-400">No image</p>
        </div>
      )}

      <div className="mt-4 w-full rounded-2xl bg-primary/8 px-3 py-2 text-center text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
        Inspect item details
      </div>
    </motion.div>
  );
}
