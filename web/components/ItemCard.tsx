import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CubeIcon } from '@heroicons/react/24/outline';

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
        // If any error occurs, I consider it as invalid
        setIsSpriteValid(false);
      }
    };

    // Call the function to check the sprite
    checkSprite();
  }, [spriteUrl]);

  // Navigate to the item details page when the card is clicked
  const handleClick = () => {
    router.push(`/item/${name.toLowerCase()}`);
  };

  // Here I am also using framer motion for better animations and smooth transitions
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-all
                 rounded-md shadow-xl p-4 cursor-pointer flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-2">
        <CubeIcon className="h-5 w-5" />

        <h2 className="text-lg font-semibold capitalize">{name}</h2>
      </div>

      {/* ONLY display the item sprite if it's valid - lazy load the image so it doesn't block rendering */}
      {spriteUrl && isSpriteValid && (
        <div className="relative w-20 h-20">
          <Image
            src={spriteUrl}
            alt={name}
            fill
            sizes="(max-width: 40px) 40px"
            style={{ objectFit: 'contain' }}
            loading="lazy"
            unoptimized
          />
        </div>
        // I added the unoptimized prop to prevent Next.js from optimizing the image, which is taking too much of my Vercel quota
      )}

      {/* Display a message if the sprite is not valid */}
      {!isSpriteValid && (
        <div className="relative w-20 h-20 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No image</p>
        </div>
      )}
    </motion.div>
  );
}
