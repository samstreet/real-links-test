/**
 * Word List Provider
 *
 * Implementation of IWordListProvider interface
 * Provides access to the word list cache following SOLID principles
 */

import type { IWordListProvider } from '@/types/services.types';
import type { Word, WordListStats } from '@/types/anagram.types';
import type { AsyncResult, ApiError } from '@/types/api.types';
import { wordListCache, CacheStatus } from './word-list-cache';
import { getWordListUrl } from '../config';

/**
 * Word List Provider Implementation
 *
 * Follows Dependency Inversion Principle:
 * - Implements IWordListProvider interface
 * - Can be easily mocked for testing
 * - Can be swapped with alternative implementations
 */
export class WordListProvider implements IWordListProvider {
  /**
   * Load the word list from the data source
   */
  async load(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>> {
    try {
      await wordListCache.load();

      const state = wordListCache.getState();

      if (state.status === CacheStatus.Error) {
        return {
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: state.error || 'Failed to load word list',
            statusCode: 503,
            timestamp: new Date().toISOString(),
          }
        };
      }

      // Return empty array as placeholder - actual words are in cache
      return {
        success: true,
        data: []
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        }
      };
    }
  }

  /**
   * Reload the word list (useful for cache invalidation)
   */
  async reload(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>> {
    wordListCache.clear();
    return this.load();
  }

  /**
   * Checks if the word list is loaded and ready to use
   */
  isLoaded(): boolean {
    return wordListCache.isLoaded();
  }

  /**
   * Get the source URL or identifier
   */
  getSource(): string {
    return getWordListUrl();
  }

  /**
   * Gets statistics about the loaded word list
   */
  getStats(): WordListStats | null {
    const state = wordListCache.getState();

    if (state.status !== CacheStatus.Loaded) {
      return null;
    }

    return {
      totalWords: state.wordCount,
      uniqueSignatures: state.signatureCount,
      averageWordLength: 0, // TODO: Calculate average word length
      loadedAt: new Date(),
      source: this.getSource(),
    };
  }

  /**
   * Gets all words matching a specific character signature
   *
   * @param signature - The normalised, sorted character signature
   * @returns Array of words with matching signature (empty if not found)
   */
  getWordsBySignature(signature: string): readonly string[] {
    return wordListCache.findBySignature(signature);
  }

  /**
   * Gets the current loading status
   */
  getStatus(): CacheStatus {
    return wordListCache.getState().status;
  }
}

/**
 * Factory function to create a new WordListProvider instance
 * Useful for dependency injection
 */
export function createWordListProvider(): IWordListProvider {
  return new WordListProvider();
}

/**
 * Singleton instance for convenient access
 * Use this in application code when DI is not needed
 */
export const wordListProvider = new WordListProvider();
