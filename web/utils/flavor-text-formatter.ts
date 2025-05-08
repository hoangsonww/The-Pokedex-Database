/**
 * The flavor text that comes out of the API contains
 * special characters that might render incorrectly in the
 * browser. This function removes those characters.
 *
 * @param flavorText The flavor text to format
 * @returns The formatted flavor text
 */
export const formatFlavorText = (flavorText: string): string => {
  return flavorText.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
};
