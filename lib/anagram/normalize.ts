/**
 * Normalizes a string for anagram comparison
 * Removes punctuation, converts to lowercase, and keeps only alphanumeric characters
 *
 * @param input - The string to normalize
 * @returns Normalized string with only alphanumeric characters in lowercase
 *
 * @example
 * normalizeString("Re-engineer") // returns "reengineer"
 * normalizeString("3-D") // returns "3d"
 */
export function normalizeString(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Creates a character signature for anagram comparison
 * Returns a sorted string of all characters
 *
 * @param input - The string to create a signature for
 * @returns Sorted character signature
 *
 * @example
 * createSignature("steak") // returns "aekst"
 * createSignature("takes") // returns "aekst"
 */
export function createSignature(input: string): string {
  const normalized = normalizeString(input);
  return normalized.split("").sort().join("");
}
