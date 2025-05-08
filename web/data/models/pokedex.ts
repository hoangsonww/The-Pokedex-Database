/**
 * Data model to represent the data returned from the Pokedex API.
 * API: https://pokeapi.co/api/v2/pokemon?limit=1000&offset={N}
 */
export type Pokedex = {
  // The total number of Pokemon in the Pokedex
  count: number;
  // All of the pokemon within the paging limit
  // (results from offset to offset + limit)
  results: { name: string; url: string }[];
};
