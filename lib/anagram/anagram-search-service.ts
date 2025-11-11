/**
 * Anagram Search Service
 *
 * Implementation of IAnagramSearchService
 * Provides anagram search functionality using the word list cache
 */

import type { IAnagramSearchService } from '@/types/services.types';
import type {
  SearchQuery,
  SearchOptions,
  AnagramResult,
  AnagramMatch,
  WordListStats,
} from '@/types/anagram.types';
import { SortOrder } from '@/types/anagram.types';
import type { AsyncResult, ApiError } from '@/types/api.types';
import { wordListProvider } from './word-list-provider';
import { generateSignature, isValidInput, normalise } from './word-normaliser';

/**
 * Anagram Search Service Implementation
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only searches for anagrams
 * - Dependency Inversion: Depends on IWordListProvider abstraction
 * - Open/Closed: Extensible through options parameter
 */
export class AnagramSearchService implements IAnagramSearchService {
  /**
   * Search for anagrams of the given query
   *
   * @param query - Search query with input text
   * @param options - Optional search configuration
   * @returns AsyncResult with anagram matches or error
   */
  async search(
    query: SearchQuery,
    options?: SearchOptions
  ): Promise<AsyncResult<AnagramResult, ApiError>> {
    const startTime = Date.now();

    try {
      // Validate that word list is loaded
      if (!wordListProvider.isLoaded()) {
        return {
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Word list is not loaded yet. Please try again in a moment.',
            statusCode: 503,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Validate input - keep original for response, normalise for processing
      const originalInput = query.input.trim();
      const normalisedInput = normalise(originalInput);

      if (normalisedInput.length === 0) {
        // Empty input after normalisation - return empty result (not an error per requirements)
        return {
          success: true,
          data: {
            query: originalInput,
            matches: [],
            totalMatches: 0,
            searchTimeMs: Date.now() - startTime,
            isEmpty: true,
          },
        };
      }

      // Generate signature for lookup
      const signature = generateSignature(normalisedInput);

      // If signature is empty after normalisation, treat as invalid
      if (signature.length === 0) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input must contain at least one alphanumeric character',
            statusCode: 400,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Get matches from cache (O(1) lookup)
      const words = wordListProvider.getWordsBySignature(signature);

      // Build matches array
      let matches: AnagramMatch[] = Array.from(words).map((word) => ({
        word,
        isOriginalInput: normalise(word) === normalisedInput,
        confidence: 1.0, // All HashMap matches are 100% confident
      }));

      // Apply options
      if (options) {
        // Filter by minimum word length
        if (options.minWordLength !== undefined && options.minWordLength > 0) {
          matches = matches.filter((m) => m.word.length >= options.minWordLength!);
        }

        // Exclude original if requested
        if (options.includeOriginal === false) {
          matches = matches.filter((m) => !m.isOriginalInput);
        }

        // Apply sort order
        if (options.sortOrder) {
          matches = this.sortMatches(matches, options.sortOrder);
        }

        // Limit results
        if (options.maxResults !== undefined && options.maxResults > 0) {
          matches = matches.slice(0, options.maxResults);
        }
      }

      const searchTimeMs = Date.now() - startTime;

      return {
        success: true,
        data: {
          query: originalInput,
          matches,
          totalMatches: matches.length,
          searchTimeMs,
          isEmpty: matches.length === 0,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[AnagramSearchService] Search error:', error);

      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `Search failed: ${message}`,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Check if the service is ready to perform searches
   */
  isReady(): boolean {
    return wordListProvider.isLoaded();
  }

  /**
   * Get statistics about the loaded word list
   */
  getStats(): WordListStats | null {
    return wordListProvider.getStats();
  }

  /**
   * Sort matches according to the specified order
   */
  private sortMatches(matches: AnagramMatch[], sortOrder: SortOrder): AnagramMatch[] {
    const sorted = [...matches];

    switch (sortOrder) {
      case SortOrder.Alphabetical:
        sorted.sort((a, b) => a.word.localeCompare(b.word));
        break;

      case SortOrder.Length:
        sorted.sort((a, b) => {
          // Sort by length descending, then alphabetically
          if (a.word.length !== b.word.length) {
            return b.word.length - a.word.length;
          }
          return a.word.localeCompare(b.word);
        });
        break;

      case SortOrder.Confidence:
        // Sort by confidence descending, then alphabetically
        sorted.sort((a, b) => {
          if (a.confidence !== b.confidence) {
            return b.confidence - a.confidence;
          }
          return a.word.localeCompare(b.word);
        });
        break;

      case SortOrder.OriginalFirst:
        // Sort by: isOriginalInput first, then alphabetically
        sorted.sort((a, b) => {
          if (a.isOriginalInput !== b.isOriginalInput) {
            return a.isOriginalInput ? -1 : 1;
          }
          return a.word.localeCompare(b.word);
        });
        break;
    }

    return sorted;
  }
}

/**
 * Factory function to create a new AnagramSearchService instance
 */
export function createAnagramSearchService(): IAnagramSearchService {
  return new AnagramSearchService();
}

/**
 * Singleton instance for convenient access
 */
export const anagramSearchService = new AnagramSearchService();
