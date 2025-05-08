import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

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

  // On mount (or whenever spriteUrl changes), verify the sprite is valid
  // I added this because sometimes, even if spriteUrl is defined, the sprite may not exist
  // on PokeAPI, so I want to check if the sprite is valid or not first before displaying it
  // This prevents displaying broken images
  useEffect(() => {
    // If no spriteUrl, it's automatically invalid
    if (!spriteUrl) {
      setIsSpriteValid(false);
      return;
    }

    // Attempt to HEAD fetch the sprite
    // I use HEAD fetch because I only need the headers, not the body, to determine if the sprite exists on the server
    const checkSprite = async () => {
      try {
        // Check if the sprite exists
        const response = await fetch(spriteUrl, { method: 'HEAD' });

        if (!response.ok) {
          // If the response is not OK (like 404), mark sprite as invalid
          setIsSpriteValid(false);
        } else {
          // Otherwise, it's valid
          setIsSpriteValid(true);
        }
      } catch {
        // If any error occurs, consider it invalid
        setIsSpriteValid(false);
      }
    };

    // Call the function to check the sprite
    checkSprite();
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-all
                 rounded-md shadow-xl p-4 cursor-pointer flex flex-col items-center">
      <div className="w-full flex justify-between mb-2">
        <h2 className="text-lg font-semibold capitalize">{name}</h2>

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
        <div className="relative w-20 h-20">
          <Image
            src={spriteUrl}
            alt={name}
            fill
            sizes="(max-width: 80px) 80px"
            style={{ objectFit: 'contain' }}
            loading="lazy"
            unoptimized
          />
        </div>
        // I added the unoptimized prop to prevent Next.js from optimizing the image, which is taking too much of my Vercel quota
      )}

      {/* Display a fallback if the sprite is invalid */}
      {!isSpriteValid && (
        <div className="relative w-20 h-20 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No image</p>
        </div>
      )}
    </motion.div>
  );
}
