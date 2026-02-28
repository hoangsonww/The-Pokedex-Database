/**
 * Data model for a Pokemon evolution chain.
 */
export type EvolutionChain = {
  chain: EvolutionNode;
};

export type EvolutionNode = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
};
