/**
 * Word List Cache - Singleton Pattern
 *
 * In-memory cache using a HashMap (Map<signature, words[]>)
 * Loads once on server startup and persists across requests
 *
 * Structure: Map<"aekst", ["steak", "takes", "skate", "Keats"]>
 * This enables O(1) anagram lookup by character signature
 */

import { fetchWordList } from './word-list-fetcher';
import { generateSignature } from './word-normaliser';

export enum CacheStatus {
  Uninitialised = 'uninitialised',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

export interface WordListCacheState {
  status: CacheStatus;
  wordCount: number;
  signatureCount: number;
  error?: string;
}

/**
 * Singleton cache instance
 * Map structure: signature -> array of words with that signature
 */
class WordListCache {
  private cache: Map<string, string[]> | null = null;
  private state: WordListCacheState = {
    status: CacheStatus.Uninitialised,
    wordCount: 0,
    signatureCount: 0,
  };
  private loadPromise: Promise<void> | null = null;

  /**
   * Gets the current cache state
   */
  getState(): WordListCacheState {
    return { ...this.state };
  }

  /**
   * Checks if the cache is loaded and ready
   */
  isLoaded(): boolean {
    return this.state.status === CacheStatus.Loaded && this.cache !== null;
  }

  /**
   * Loads the word list and builds the signature HashMap
   * Uses singleton pattern - only loads once
   */
  async load(): Promise<void> {
    // If already loaded, return immediately
    if (this.isLoaded()) {
      return;
    }

    // If currently loading, wait for existing load to complete
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.loadPromise = this.performLoad();
    return this.loadPromise;
  }

  /**
   * Internal method to perform the actual loading
   */
  private async performLoad(): Promise<void> {
    try {
      this.state = {
        status: CacheStatus.Loading,
        wordCount: 0,
        signatureCount: 0,
      };

      console.log('[WordListCache] Starting to load word list...');
      const startTime = Date.now();

      // Fetch the word list
      const result = await fetchWordList();

      if (!result.success || !result.words) {
        throw new Error(result.error || 'Failed to fetch word list');
      }

      // Build the signature HashMap
      const signatureMap = new Map<string, string[]>();

      for (const word of result.words) {
        const signature = generateSignature(word);

        // Skip if signature is empty (word had no alphanumeric characters)
        if (signature.length === 0) {
          continue;
        }

        // Add word to the signature bucket
        const existing = signatureMap.get(signature);
        if (existing) {
          existing.push(word);
        } else {
          signatureMap.set(signature, [word]);
        }
      }

      // Store the cache
      this.cache = signatureMap;

      const duration = Date.now() - startTime;
      const wordCount = result.words.length;
      const signatureCount = signatureMap.size;

      this.state = {
        status: CacheStatus.Loaded,
        wordCount,
        signatureCount,
      };

      console.log(
        `[WordListCache] Successfully loaded ${wordCount} words ` +
        `into ${signatureCount} signature buckets in ${duration}ms`
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[WordListCache] Error loading word list:', errorMessage);

      this.state = {
        status: CacheStatus.Error,
        wordCount: 0,
        signatureCount: 0,
        error: errorMessage,
      };

      throw error;
    }
  }

  /**
   * Finds all anagrams for a given signature
   * Returns empty array if signature not found or cache not loaded
   *
   * @param signature - The character signature to look up
   * @returns Array of words matching the signature
   */
  findBySignature(signature: string): readonly string[] {
    if (!this.isLoaded() || !this.cache) {
      return [];
    }

    return this.cache.get(signature) || [];
  }

  /**
   * Gets all signatures (for debugging/testing)
   */
  getAllSignatures(): readonly string[] {
    if (!this.isLoaded() || !this.cache) {
      return [];
    }

    return Array.from(this.cache.keys());
  }

  /**
   * Clears the cache (useful for testing)
   */
  clear(): void {
    this.cache = null;
    this.loadPromise = null;
    this.state = {
      status: CacheStatus.Uninitialised,
      wordCount: 0,
      signatureCount: 0,
    };
  }
}

/**
 * Singleton instance - persists in Node.js module cache
 * This stays in memory across requests
 */
const wordListCache = new WordListCache();

/**
 * Export the singleton instance
 */
export { wordListCache };
