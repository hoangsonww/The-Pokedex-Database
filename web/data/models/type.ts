/**
 * Data model for the Pokemon type list endpoint.
 */
export type TypeList = {
  results: {
    name: string;
    url: string;
  }[];
};

/**
 * Data model for a single Pokemon type.
 */
export type PokemonType = {
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
  };
  moves: { name: string }[];
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
};
