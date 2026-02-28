import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import { formatName } from '@/utils/pokedex';

/**
 * Type for the PokemonCard component props
 */
type PokemonCardProps = {
  name: string;
  spriteUrl?: string;
  isFavorite: boolean;
  onToggleFavorite: (pokemonName: string) => void;
};

/**
 * PokemonCard component
 *
 * @param param0 The props for the PokemonCard component
 * @returns The PokemonCard component
 */
export default function PokemonCard({
  name,
  spriteUrl,
  isFavorite,
  onToggleFavorite
}: PokemonCardProps) {
  // Using next/router to navigate to the pokemon details page when the card is clicked
  const router = useRouter();

  // Track if the sprite is valid (not 404, etc.)
  const [isSpriteValid, setIsSpriteValid] = useState(true);

  useEffect(() => {
    setIsSpriteValid(Boolean(spriteUrl));
  }, [spriteUrl]);

  // Navigate to the pokemon details page when the card is clicked
  const handleCardClick = () => {
    router.push(`/pokemon/${name.toLowerCase()}`);
  };

  // Handle the favorite button click
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the card click event from firing
    e.stopPropagation();

    // Toggle the favorite status of the pokemon
    onToggleFavorite(name);
  };

  // Each card will have a name, an image, and a favorite button
  // The favorite button will be a star icon that changes color based on whether the pokemon is a favorite or not
  // The card will also have a hover effect and a click effect
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleCardClick}
      className="flex cursor-pointer flex-col items-center rounded-3xl border border-white/70 bg-white/90 p-4 text-gray-800 shadow-soft transition-all dark:border-white/10 dark:bg-slate-900/80 dark:text-gray-100 dark:hover:bg-slate-800">
      <div className="mb-3 flex w-full items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Pokémon
          </p>
          <h2 className="text-lg font-semibold">{formatName(name)}</h2>
        </div>

        <button onClick={handleFavoriteClick} aria-label="Toggle Favorite">
          {isFavorite ? (
            <SolidStar className="h-5 w-5 text-yellow-400 hover:text-gray-500" />
          ) : (
            <OutlineStar className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
          )}
        </button>
      </div>

      {/* ONLY display the pokemon sprite if it exists and is valid - lazy load the image so it doesn't block rendering */}
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

      <div className="mt-4 flex w-full items-center justify-between rounded-2xl bg-primary/8 px-3 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
        <span>Open details</span>
        <span className="font-semibold text-primaryDark dark:text-pink-100">
          #{name.slice(0, 3).toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}
