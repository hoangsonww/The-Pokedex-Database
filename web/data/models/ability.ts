/**
 * Data model for the Pokemon ability list endpoint.
 */
export type AbilityList = {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
};

/**
 * Data model for a single Pokemon ability.
 */
export type Ability = {
  name: string;
  generation: {
    name: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
    };
  }[];
  flavor_text_entries?: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  pokemon: {
    is_hidden: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};
