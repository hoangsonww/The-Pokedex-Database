/**
 * Data model to represent species data from the Pokemon Species API
 * API: https://pokeapi.co/api/v2/pokemon-species/{pokemon-name}/
 */
export type PokemonSpecies = {
  // Name of the Pokemon species
  name: string;
  // Capture rate used in the core games
  capture_rate: number;
  // The generation this species belongs to
  generation: {
    name: string;
  };
  // Habitat when listed by the API
  habitat: {
    name: string;
  } | null;
  // Whether the Pokemon is a legendary
  is_legendary: boolean;
  // Whether the Pokemon is a mythical
  is_mythical: boolean;
  // The flavor text of the move in different languages - you want to find the English one!
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  // The name of the Pokemon that this species evolves from, if any
  evolves_from_species: { name: string } | null;
  // Evolution chain endpoint
  evolution_chain: {
    url: string;
  };
};
