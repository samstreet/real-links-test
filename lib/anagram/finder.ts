import { createSignature } from "./normalize";

/**
 * Finds all anagrams of the input string from a word list
 * This is a placeholder implementation for Phase 1
 *
 * @param input - The string to find anagrams for
 * @param wordList - Array of words to search through
 * @returns Array of matching anagrams
 *
 * @example
 * findAnagrams("steak", wordList) // returns ["Keats", "skate", ...]
 */
export function findAnagrams(input: string, wordList: string[]): string[] {
  if (!input || input.trim() === "") {
    return [];
  }

  const inputSignature = createSignature(input);

  return wordList.filter((word) => {
    const wordSignature = createSignature(word);
    return wordSignature === inputSignature;
  });
}

/**
 * Placeholder for word list loading
 * Will be implemented in Phase 4
 *
 * @returns Promise that resolves to array of words
 */
export async function loadWordList(): Promise<string[]> {
  // Placeholder - will fetch from dwyl/english-words in Phase 4
  return [];
}
