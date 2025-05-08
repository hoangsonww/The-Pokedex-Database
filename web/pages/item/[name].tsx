import { GetServerSideProps } from 'next';
import { Item } from '@/data/models/item';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

/**
 * type alias for the ItemPage component props
 */
type ItemPageProps = {
  item: Item;
  effect: string;
  flavorText: string;
};

/**
 * ItemPage component
 * Each item will have a name, a cost, an effect, and a description
 *
 * @param param0 The props for the ItemPage component
 * @returns The ItemPage component
 */
export default function ItemPage({ item, effect, flavorText }: ItemPageProps) {
  // Using next/router to navigate back to the previous page
  const router = useRouter();

  // Each item will have a name, a cost, an effect, and a description
  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="bg-primary dark:bg-gray-700 text-gray-100 
                  px-3 py-2 rounded hover:opacity-80 transition flex items-center space-x-2">
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded shadow-xl p-6">
        <h1 className="text-3xl font-bold capitalize mb-4">{item.name}</h1>

        {/* Details - Responsive: Arrange image and details in a row on larger screens */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {item.sprites?.default && (
            <div className="relative w-24 h-24">
              <Image
                src={item.sprites.default}
                alt={item.name}
                fill
                sizes="(max-width:96px) 96px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}

          <div>
            <p>
              <strong className="text-lg">Cost:</strong> {item.cost} PokéDollars
            </p>

            <p className="mt-2">
              <strong className="text-lg">Effect:</strong> {effect}
            </p>

            <p className="mt-2">
              <strong className="text-lg">Description:</strong> {flavorText}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Load the item data from the PokeAPI in the server side
 *
 * @param context The context object
 * @returns The props for the ItemPage component
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the name from the query parameters
  const { name } = context.query;

  // If the name is not a string or is missing, return a 404
  if (!name || typeof name !== 'string') {
    return { notFound: true };
  }

  // Fetch the item data from the PokeAPI
  const response = await fetch(`https://pokeapi.co/api/v2/item/${name}`);

  // If the response is not OK, return a 404
  if (!response.ok) {
    return { notFound: true };
  }

  // Parse the response as an Item object
  const item = (await response.json()) as Item;

  // Get the English effect text
  const engEffect = item.effect_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const effect = engEffect ? engEffect.short_effect : 'No effect found.';

  // English flavor text
  const engFlavor = item.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );

  // Get the flavor text or set a default message
  const flavorText = engFlavor ? engFlavor.text : 'No description found.';

  // Return the props for the ItemPage component
  return {
    props: {
      item,
      effect,
      flavorText
    }
  };
};
