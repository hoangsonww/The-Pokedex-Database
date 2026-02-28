import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid';
import SurfaceCard from '@/components/SurfaceCard';
import TypeBadge from '@/components/TypeBadge';
import { EvolutionChain, EvolutionNode } from '@/data/models/evolution-chain';
import { Pokemon } from '@/data/models/pokemon';
import { PokemonSpecies } from '@/data/models/pokemon-species';
import { usePersistentState } from '@/hooks/usePersistentState';
import { formatFlavorText } from '@/utils/flavor-text-formatter';
import {
  formatName,
  formatStatLabel,
  getPokemonArtworkUrl,
  getTotalBaseStats,
  TEAM_LIMIT,
  updateRecentPokemon
} from '@/utils/pokedex';
import { STORAGE_KEYS } from '@/utils/storage';

type PokemonPageProps = {
  pokemon: Pokemon;
  species: PokemonSpecies;
  description: string;
  evolvesFrom: string | null;
  evolutionChain: EvolutionChain;
};

const statColors: Record<string, string> = {
  hp: 'bg-rose-500',
  attack: 'bg-orange-500',
  defense: 'bg-amber-500',
  'special-attack': 'bg-fuchsia-500',
  'special-defense': 'bg-sky-500',
  speed: 'bg-emerald-500'
};

/**
 * Pokemon detail page with quick actions and richer profile information.
 *
 * @param param0 The component props
 * @returns The Pokemon page
 */
export default function PokemonPage({
  pokemon,
  species,
  description,
  evolvesFrom,
  evolutionChain
}: PokemonPageProps) {
  const router = useRouter();
  const [favorites, setFavorites, favoritesHydrated] = usePersistentState<
    string[]
  >(STORAGE_KEYS.favorites, []);
  const [team, setTeam, teamHydrated] = usePersistentState<string[]>(
    STORAGE_KEYS.team,
    []
  );
  const [, setRecentPokemon, recentHydrated] = usePersistentState<string[]>(
    STORAGE_KEYS.recentPokemon,
    []
  );

  useEffect(() => {
    if (!recentHydrated) {
      return;
    }

    setRecentPokemon((previous) => updateRecentPokemon(previous, pokemon.name));
  }, [pokemon.name, recentHydrated, setRecentPokemon]);

  const isFavorite = favorites.includes(pokemon.name);
  const isOnTeam = team.includes(pokemon.name);
  const totalBaseStats = getTotalBaseStats(pokemon);
  const artwork =
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default;
  const displayedMoves = pokemon.moves.slice(0, 24);
  const remainingMoves = pokemon.moves.length - displayedMoves.length;
  const flattenedEvolutionChain = flattenEvolutionChain(evolutionChain.chain);

  const toggleFavorite = () => {
    if (!favoritesHydrated) {
      return;
    }

    setFavorites((previous) =>
      previous.includes(pokemon.name)
        ? previous.filter((entry) => entry !== pokemon.name)
        : [...previous, pokemon.name]
    );
  };

  const toggleTeamMember = () => {
    if (!teamHydrated) {
      return;
    }

    setTeam((previous) => {
      if (previous.includes(pokemon.name)) {
        return previous.filter((entry) => entry !== pokemon.name);
      }

      if (previous.length >= TEAM_LIMIT) {
        return previous;
      }

      return [...previous, pokemon.name];
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={toggleFavorite}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
            isFavorite
              ? 'bg-primary text-white hover:bg-primaryDark'
              : 'border border-primary/20 bg-white text-primaryDark hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800'
          }`}>
          <HeartIcon className="h-5 w-5" />
          {isFavorite ? 'Favorited' : 'Add favorite'}
        </button>
        <button
          onClick={toggleTeamMember}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
            isOnTeam
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'border border-primary/20 bg-white text-primaryDark hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800'
          }`}>
          <PlusCircleIcon className="h-5 w-5" />
          {isOnTeam
            ? 'On team'
            : team.length >= TEAM_LIMIT
              ? 'Team full'
              : 'Add to team'}
        </button>
        <Link
          href={`/compare?left=${pokemon.name}`}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800">
          <ArrowsRightLeftIcon className="h-5 w-5" />
          Compare
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}>
        <SurfaceCard className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(236,72,153,0.15),rgba(255,255,255,0.5))] p-6 text-center dark:bg-[linear-gradient(180deg,rgba(236,72,153,0.2),rgba(15,23,42,0.2))]">
                {artwork && (
                  <div className="relative mx-auto h-72 w-72 max-w-full">
                    <Image
                      src={artwork}
                      alt={pokemon.name}
                      fill
                      sizes="288px"
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Height
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Weight
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Pokémon profile
                </p>
                <h1 className="text-4xl font-bold">
                  {formatName(pokemon.name)}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types
                    .slice()
                    .sort((left, right) => left.slot - right.slot)
                    .map((type) => (
                      <TypeBadge key={type.type.name} type={type.type.name} />
                    ))}
                </div>
                <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Legendary
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {species.is_legendary ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Mythical
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {species.is_mythical ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Total base stats
                  </p>
                  <p className="mt-2 text-xl font-semibold">{totalBaseStats}</p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Generation
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatName(species.generation.name)}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Evolves from
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {evolvesFrom ? (
                      <Link
                        href={`/pokemon/${evolvesFrom}`}
                        className="text-primaryDark hover:underline dark:text-pink-100">
                        {formatName(evolvesFrom)}
                      </Link>
                    ) : (
                      'Base form'
                    )}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Habitat
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {species.habitat
                      ? formatName(species.habitat.name)
                      : 'Unknown'}
                  </p>
                </div>
                <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Capture rate
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {species.capture_rate}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-primary/8 p-4 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Abilities
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <Link
                      key={ability.ability.name}
                      href={`/ability/${ability.ability.name}`}
                      className="rounded-full border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-950 dark:text-pink-100 dark:hover:bg-slate-800">
                      {formatName(ability.ability.name)}
                      {ability.is_hidden ? ' • Hidden' : ''}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr_0.9fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Base stats</h2>
              <div className="grid gap-3">
                {pokemon.stats.map((entry) => (
                  <div
                    key={entry.stat.name}
                    className="rounded-3xl border border-white/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        {formatStatLabel(entry.stat.name)}
                      </p>
                      <p className="text-lg font-bold">{entry.base_stat}</p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-2 rounded-full ${statColors[entry.stat.name] ?? 'bg-primary'}`}
                        style={{
                          width: `${Math.min(100, (entry.base_stat / 180) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Evolution line</h2>
              <div className="grid gap-4">
                {flattenedEvolutionChain.map((entry) => (
                  <Link key={entry.name} href={`/pokemon/${entry.name}`}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className={`flex items-center gap-4 rounded-3xl border p-4 transition ${
                        entry.name === pokemon.name
                          ? 'border-primary/40 bg-primary/8 dark:border-primary/40 dark:bg-primary/10'
                          : 'border-white/70 bg-white/70 hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-slate-900'
                      }`}>
                      <div className="relative h-20 w-20">
                        {entry.id !== '0' && (
                          <Image
                            src={getPokemonArtworkUrl(entry.id)}
                            alt={entry.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          Stage {entry.stage}
                        </p>
                        <p className="text-lg font-semibold">
                          {formatName(entry.name)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Moves</h2>
              <div className="flex flex-wrap gap-2">
                {displayedMoves.map((move) => (
                  <Link
                    key={move.move.name}
                    href={`/move/${move.move.name}`}
                    className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/14 dark:border-white/10 dark:bg-white/5 dark:text-pink-100 dark:hover:bg-white/10">
                    {formatName(move.move.name)}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/moves"
                  className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-950 dark:text-pink-100 dark:hover:bg-slate-800">
                  Open move database
                </Link>
                <Link
                  href={`/compare?left=${pokemon.name}`}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primaryDark transition hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-950 dark:text-pink-100 dark:hover:bg-slate-800">
                  Compare this Pokémon
                </Link>
              </div>
              {remainingMoves > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {remainingMoves} more moves are available for this Pokémon.
                </p>
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

  const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!pokemonRes.ok) {
    return { notFound: true };
  }

  const pokemon = (await pokemonRes.json()) as Pokemon;

  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.species.name}`
  );
  if (!speciesRes.ok) {
    return { notFound: true };
  }

  const species = (await speciesRes.json()) as PokemonSpecies;

  const englishFlavor = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const description = englishFlavor
    ? formatFlavorText(englishFlavor.flavor_text)
    : 'No description found.';

  const evolvesFrom = species.evolves_from_species
    ? species.evolves_from_species.name
    : null;
  const evolutionResponse = await fetch(species.evolution_chain.url);

  if (!evolutionResponse.ok) {
    return { notFound: true };
  }

  const evolutionChain = (await evolutionResponse.json()) as EvolutionChain;

  return {
    props: {
      pokemon,
      species,
      description,
      evolvesFrom,
      evolutionChain
    }
  };
};

function flattenEvolutionChain(
  node: EvolutionNode,
  stage = 1
): { id: string; name: string; stage: number }[] {
  const nodeId =
    node.species.url.match(/\/pokemon-species\/(\d+)\//)?.[1] ?? '0';
  const current = [{ id: nodeId, name: node.species.name, stage }];

  return [
    ...current,
    ...node.evolves_to.flatMap((entry) =>
      flattenEvolutionChain(entry, stage + 1)
    )
  ];
}
