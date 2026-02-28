/**
 * Data model for the generation list endpoint.
 */
export type GenerationList = {
  results: {
    name: string;
    url: string;
  }[];
};

/**
 * Data model for a single Pokemon generation.
 */
export type Generation = {
  name: string;
  main_region: {
    name: string;
  };
  pokemon_species: {
    name: string;
    url: string;
  }[];
  moves: {
    name: string;
  }[];
  abilities: {
    name: string;
  }[];
  types: {
    name: string;
  }[];
  version_groups: {
    name: string;
  }[];
};
