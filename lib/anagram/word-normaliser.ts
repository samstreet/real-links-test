/**
 * Word Normalisation Utilities
 *
 * Provides functions to normalise text and generate character signatures
 * for anagram matching according to the project requirements:
 * - Remove all punctuation (hyphens, etc.)
 * - Convert to lowercase
 * - Keep only alphanumeric characters
 */

/**
 * Normalises text by removing punctuation and converting to lowercase
 *
 * @example
 * normalise("Re-Engineer") // returns "reengineer"
 * normalise("3-D") // returns "3d"
 * normalise("Worth!") // returns "worth"
 */
export function normalise(text: string): string {
  // Remove all non-alphanumeric characters and convert to lowercase
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Generates a character signature by sorting the characters
 * Used as the key for the anagram hashmap
 *
 * @example
 * generateSignature("steak") // returns "aekst"
 * generateSignature("takes") // returns "aekst"
 * generateSignature("Re-Engineer") // returns "eeeeginnrr"
 */
export function generateSignature(text: string): string {
  const normalised = normalise(text);
  // Sort characters alphabetically to create signature
  return normalised.split('').sort().join('');
}

/**
 * Checks if text is valid (contains at least one alphanumeric character)
 */
export function isValidInput(text: string): boolean {
  return /[a-z0-9]/i.test(text);
}
