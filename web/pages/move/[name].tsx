import { GetServerSideProps } from 'next';
import { Move } from '@/data/models/move';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * type alias for the MovePage component props
 */
type MovePageProps = {
  move: Move;
  description: string;
};

/**
 * MovePage component
 * Each move will have a name, a type, a damage class, power, accuracy, and pp
 *
 * @param param0 The props for the MovePage component
 * @returns The MovePage component
 */
export default function MovePage({ move, description }: MovePageProps) {
  // Using next/router to navigate back to the previous page
  const router = useRouter();

  // Capitalized type name
  const capitalizedType =
    move.type.name.charAt(0).toUpperCase() + move.type.name.slice(1);

  // Capitalized damage class name
  const capitalizedDamageClass =
    move.damage_class.name.charAt(0).toUpperCase() +
    move.damage_class.name.slice(1);

  // Each move will have a name, a type, a damage class, power, accuracy, and pp
  // Also, a description of the move
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
        <h1 className="text-3xl font-bold capitalize mb-4">{move.name}</h1>

        <p>
          <strong className="text-lg mr-1">Type:</strong> {capitalizedType}
        </p>

        <p className="mt-2">
          <strong className="text-lg mr-1">Damage Class:</strong>{' '}
          {capitalizedDamageClass}
        </p>

        <div className="flex items-center space-x-2 mt-2">
          <span>
            <strong className="text-lg">Power:</strong>
          </span>
          <p className="ml-2">{move.power ?? 'N/A'}</p>
          {/* If the power is not null, show a progress bar for better visualization */}
          {move.power !== null && move.power !== undefined && (
            <div className="w-24 h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-blue-500 rounded-full"
                style={{
                  width: `${move.power > 100 ? 100 : move.power}%`
                }}></div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <span>
            <strong className="text-lg">Accuracy:</strong>
          </span>
          <p className="ml-2">{move.accuracy ?? 'N/A'}</p>
          {move.accuracy !== null && move.accuracy !== undefined && (
            <div className="w-24 h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-green-500 rounded-full"
                style={{
                  width: `${move.accuracy > 100 ? 100 : move.accuracy}%`
                }}></div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <span>
            <strong className="text-lg">PP:</strong>
          </span>
          <p className="ml-2">{move.pp}</p>
          <div className="w-24 h-4 bg-gray-200 rounded-full mr-2">
            <div
              className="h-4 bg-purple-500 rounded-full"
              style={{ width: `${move.pp > 100 ? 100 : move.pp}%` }}></div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Description:</h2>
          <p>{description}</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Fetch move data from the PokeAPI (Server Side)
 *
 * @param context The context object for the request
 * @returns The move data and description
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the move name from the query
  const { name } = context.query;

  // If the name is not a string, return a 404
  if (!name || typeof name !== 'string') {
    return { notFound: true };
  }

  // Fetch move data from the PokeAPI
  const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`);

  // If the response is not okay, stop immediately
  if (!res.ok) {
    return { notFound: true };
  }

  // Parse the response as a Move object
  const move = (await res.json()) as Move;

  // Find the English flavor text for the move
  const englishFlavor = move.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );

  // Format the flavor text
  const description = englishFlavor
    ? formatFlavorText(englishFlavor.flavor_text)
    : 'No description found.';

  // Return the move data and description
  return {
    props: {
      move,
      description
    }
  };
};
