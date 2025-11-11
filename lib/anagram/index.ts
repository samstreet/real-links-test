/**
 * Anagram Module
 *
 * Central export point for all anagram-related functionality
 */

// Word normalisation utilities
export { normalise, generateSignature, isValidInput } from './word-normaliser';

// Word list provider
export {
  WordListProvider,
  createWordListProvider,
  wordListProvider
} from './word-list-provider';

// Cache
export { wordListCache, CacheStatus } from './word-list-cache';
export type { WordListCacheState } from './word-list-cache';

// Fetcher (usually not needed directly, but exported for flexibility)
export { fetchWordList } from './word-list-fetcher';
export type { FetchWordListResult } from './word-list-fetcher';
