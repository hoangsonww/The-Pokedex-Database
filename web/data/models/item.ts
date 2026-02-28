/**
 * Data model for Items
 * API: https://pokeapi.co/api/v2/item/{item-name}
 */
export type Item = {
  // The name of the item
  name: string;
  // The cost of the item
  cost: number;
  // The category of the item
  category?: {
    name: string;
  };
  // Additional attributes for the item
  attributes?: {
    name: string;
  }[];
  // Power used when fling is available
  fling_power?: number | null;
  // The effects of the item, including the short effect and the long effect as well as the language
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string };
  }[];
  // The flavor text of the item in different languages
  flavor_text_entries: {
    text: string;
    language: { name: string };
  }[];
  // The sprites of the item, including the default sprite
  sprites: {
    default: string | null;
  };
};
