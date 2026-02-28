/**
 * Data model to represent species data from the Pokemon API
 * API: https://pokeapi.co/api/v2/pokemon/{pokemon-name}/
 */
export type Pokemon = {
  // The numeric Pokemon id
  id: number;
  // The name of the Pokemon
  name: string;
  // The height of the Pokemon in decimeters
  height: number;
  // The weight of the Pokemon in hectograms
  weight: number;
  // The types of the Pokemon and their order (ex. fire, water, etc.)
  // For example, if a Pokemon has two types, the type is displayed
  // in a list like so: [TYPE w/ SLOT 1] [TYPE w/ SLOT 2]
  types: { slot: number; type: { name: string } }[];
  // The abilities of the Pokemon
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
  }[];
  // The name of the Pokemon species.
  // NOTE: You can use this value when trying to access data from the
  // Pokemon Species API. See `pokemon-species.ts` for more information.
  species: { name: string };
  // Contains a URL for the "sprite", which is an image of the Pokemon.
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
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
