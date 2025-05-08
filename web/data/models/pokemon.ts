/**
 * Data model to represent species data from the Pokemon API
 * API: https://pokeapi.co/api/v2/pokemon/{pokemon-name}/
 */
export type Pokemon = {
  // The name of the Pokemon
  name: string;
  // The types of the Pokemon and their order (ex. fire, water, etc.)
  // For example, if a Pokemon has two types, the type is displayed
  // in a list like so: [TYPE w/ SLOT 1] [TYPE w/ SLOT 2]
  types: { slot: number; type: { name: string } }[];
  // The name of the Pokemon species.
  // NOTE: You can use this value when trying to access data from the
  // Pokemon Species API. See `pokemon-species.ts` for more information.
  species: { name: string };
  // Contains a URL for the "sprite", which is an image of the Pokemon.
  sprites: {
    front_default: string;
  };
  // List of moves that the Pokemon can learn.
  // NOTE: You can use this value when trying to access data from the
  // Pokemon Move API. See `move.ts` for more information.
  moves: {
    move: { name: string };
  }[];
  // List of the base stats for the Pokemon.
  // Pokemon have the following stats:
  // - HP (Hit Points)
  // - Attack (Attack stat used to calculate damage for "physical" moves)
  // - Defense (Defense stat used to calculate damage from "physical" moves)
  // - Special Attack (Attack stat used to calculate damage for "special" moves)
  // - Special Defense (Defense stat used to calculate damage from "special" moves)
  // - Speed (Determines which Pokemon goes first in battle)
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
};
