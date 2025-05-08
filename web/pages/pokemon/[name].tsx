import { GetServerSideProps } from 'next';
import { Pokemon } from '@/data/models/pokemon';
import { PokemonSpecies } from '@/data/models/pokemon-species';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

/**
 * Type alias for the PokemonPage component props
 */
type PokemonPageProps = {
  pokemon: Pokemon;
  species: PokemonSpecies;
  description: string;
  evolvesFrom: string | null;
};

/**
 * PokemonPage component
 * Each pokemon will have a name, a type, stats, description, and moves
 *
 * @param param0 The props for the PokemonPage component
 * @returns The PokemonPage component
 */
export default function PokemonPage({
  pokemon,
  species,
  description,
  evolvesFrom
}: PokemonPageProps) {
  // Using next/router to navigate back to the previous page
  const router = useRouter();

  // Get pokemon stats
  const pokemonStats = pokemon.stats;

  // Pokemon stats, each stat will have a name and a value
  const statsMap = pokemonStats.map((statistic) => ({
    name: statistic.stat.name,
    value: statistic.base_stat
  }));

  // Format the stats names to be capitalized
  const capitalizedStatsMap = statsMap.map((stat) => ({
    name: stat.name.charAt(0).toUpperCase() + stat.name.slice(1),
    value: stat.value
  }));

  // Colors for the progress bars based on the stat name
  const statColors: { [key: string]: string } = {
    Hp: 'bg-red-500',
    Attack: 'bg-orange-500',
    Defense: 'bg-yellow-500',
    'Special-attack': 'bg-purple-500',
    'Special-defense': 'bg-blue-500',
    Speed: 'bg-green-500'
  };

  // Make a copy of the types array
  const typesCopy = [...pokemon.types];

  // Sort the types by their slot value (to maintain order)
  typesCopy.sort((a, b) => a.slot - b.slot);

  // Extract only the type names
  const typeList = typesCopy.map((t) => t.type.name);

  // Capitalize evolvesFrom
  if (evolvesFrom) {
    evolvesFrom = evolvesFrom.charAt(0).toUpperCase() + evolvesFrom.slice(1);
  }

  // Capitalize type names
  const capitalizedTypes = typeList.map(
    (type) => type.charAt(0).toUpperCase() + type.slice(1)
  );

  // Each pokemon will have a name, a sprite, types, stats, description, and moves
  // Clicking on a move will navigate to the move details page
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
        <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

        {/* Pokemon data - responsive: arrange image and details in a row on larger screens */}
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Pokemon sprite */}
          {pokemon.sprites.front_default && (
            <div className="relative w-48 h-48">
              <Image
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                fill
                sizes="(max-width:192px) 192px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Pokemon details */}
          <div className="flex-1 space-y-4">
            <p>
              <strong className="text-lg">Type(s):</strong>{' '}
              {capitalizedTypes.join(', ')}
            </p>

            <p>
              <strong className="text-lg">Legendary:</strong>{' '}
              {species.is_legendary ? 'Yes' : 'No'}
            </p>

            <p>
              <strong className="text-lg">Mythical:</strong>{' '}
              {species.is_mythical ? 'Yes' : 'No'}
            </p>

            {/* Stats with progress bars */}
            <div>
              <p className="text-lg">
                <strong>Stats:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2">
                {capitalizedStatsMap.map((stat) => (
                  // Each stat will have a name, value, and a progress bar. A bullet point will be displayed before each stat for styling
                  <li
                    key={stat.name}
                    className="flex items-center before:content-['•'] before:mr-2">
                    <span className="mr-2">
                      <strong>{stat.name}:</strong> {stat.value}
                    </span>
                    {/* Progress Bar for better visualization */}
                    <div className="w-24 h-4 bg-gray-200 rounded-full mr-4">
                      <div
                        className={`h-4 rounded-full ${statColors[stat.name] || 'bg-gray-400'}`}
                        style={{ width: `${(stat.value / 100) * 100}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {evolvesFrom && (
              <div>
                <p>
                  <strong className="text-lg">Evolves from: </strong>
                  <Link
                    href={`/pokemon/${evolvesFrom}`}
                    className="bg-primary dark:bg-gray-700 text-gray-100 hover:bg-primary-dark dark:hover:bg-gray-600
                           px-3 py-1 rounded hover:opacity-80 transition">
                    {evolvesFrom}
                  </Link>
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold">Description:</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">Moves:</h2>

          <div className="flex flex-wrap gap-2 mt-2">
            {pokemon.moves.map((m) => (
              <Link
                key={m.move.name}
                href={`/move/${m.move.name}`}
                className="bg-primary dark:bg-gray-700 text-gray-100 hover:bg-primary-dark dark:hover:bg-gray-600
                           px-3 py-1 rounded hover:opacity-80 transition">
                {m.move.name}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Fetch the pokemon data for the given name
 *
 * @param context The context object
 * @returns The props for the PokemonPage component
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the name from the query parameters
  const { name } = context.query;

  // Check if the name is a string and not empty
  if (!name || typeof name !== 'string') {
    return { notFound: true };
  }

  // Fetch Pokemon data from the PokeAPI
  const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!pokemonRes.ok) {
    return { notFound: true };
  }

  // Parse the response as a Pokemon object
  const pokemon = (await pokemonRes.json()) as Pokemon;

  // Fetch species data from the PokeAPI
  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.species.name}`
  );
  if (!speciesRes.ok) {
    return { notFound: true };
  }

  // Parse the response as a PokemonSpecies object
  const species = (await speciesRes.json()) as PokemonSpecies;

  // Flavor text -- get the English flavor text and format it
  const englishFlavor = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const description = englishFlavor
    ? formatFlavorText(englishFlavor.flavor_text)
    : 'No description found.';

  // Get the name of the pokemon this pokemon evolves from
  const evolvesFrom = species.evolves_from_species
    ? species.evolves_from_species.name
    : null;

  // Return the props for the PokemonPage component
  return {
    props: {
      pokemon,
      species,
      description,
      evolvesFrom
    }
  };
};
