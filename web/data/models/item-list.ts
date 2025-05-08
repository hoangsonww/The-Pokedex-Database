/**
 * Represents a paginated response for items in the PokeAPI.
 * API: https://pokeapi.co/api/v2/item
 */
export type ItemList = {
  // Total number of items
  count: number;
  // List of items with name and URL
  results: Array<{ name: string; url: string }>;
};
