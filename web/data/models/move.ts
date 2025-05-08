/**
 * Data model to represent the data returned from the Pokemon Move API.
 * API: https://pokeapi.co/api/v2/move/{move-name}/
 */
export type Move = {
  // The name of the move
  name: string;
  // The accuracy of the move (0-100)
  accuracy: number;
  // The number of times a Pokemon can use the move
  pp: number;
  // The power of the move (damage dealt)
  power: number;
  // The type of the move (e.g. fire, water, etc.)
  type: { name: string };
  // The damage class of the move (physical or special attack)
  damage_class: { name: string };
  // The flavor text of the move in different languages - you want to find the English one!
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};
