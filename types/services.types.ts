/**
 * Service Interface Definitions
 *
 * Following SOLID principles:
 * - Interface Segregation: Focused, specific interfaces for each service
 * - Dependency Inversion: Abstractions that concrete implementations depend on
 * - Open/Closed: Extensible through implementation, closed for modification
 * - Liskov Substitution: Any implementation can be substituted
 */

import type { SearchQuery, AnagramResult, SearchOptions, WordListStats, Word } from './anagram.types';
import type { User, Session, AuthCredentials, AuthProvider } from './auth.types';
import type { AsyncResult, ApiError } from './api.types';

/**
 * Anagram Search Service Interface
 *
 * Abstraction for anagram search logic
 * Implementations can use different algorithms or data structures
 */
export interface IAnagramSearchService {
  /**
   * Search for anagrams of the given query
   */
  search(query: SearchQuery, options?: SearchOptions): Promise<AsyncResult<AnagramResult, ApiError>>;

  /**
   * Check if the service is ready to perform searches
   */
  isReady(): boolean;

  /**
   * Get statistics about the loaded word list
   */
  getStats(): WordListStats | null;
}

/**
 * Word List Provider Interface
 *
 * Abstraction for word data source
 * Implementations can load from file, API, database, cache, etc.
 */
export interface IWordListProvider {
  /**
   * Load the word list from the data source
   */
  load(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>>;

  /**
   * Reload the word list (useful for cache invalidation)
   */
  reload(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>>;

  /**
   * Check if the word list is currently loaded
   */
  isLoaded(): boolean;

  /**
   * Get the source URL or identifier
   */
  getSource(): string;

  /**
   * Get statistics about the word list
   */
  getStats(): WordListStats | null;
}

/**
 * Authentication Service Interface
 *
 * Abstraction for authentication logic
 * Implementations can use different auth providers (NextAuth, Auth0, custom)
 */
export interface IAuthenticationService {
  /**
   * Authenticate with credentials
   */
  signIn(credentials: AuthCredentials): Promise<AsyncResult<Session, ApiError>>;

  /**
   * Authenticate with OAuth provider
   */
  signInWithProvider(provider: AuthProvider): Promise<AsyncResult<Session, ApiError>>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<AsyncResult<void, ApiError>>;

  /**
   * Get the current session
   */
  getSession(): Promise<AsyncResult<Session | null, ApiError>>;

  /**
   * Refresh the current session
   */
  refreshSession(): Promise<AsyncResult<Session, ApiError>>;

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Get the current user
   */
  getCurrentUser(): Promise<User | null>;
}

/**
 * Cache Service Interface
 *
 * Abstraction for caching mechanism
 * Implementations can use memory, Redis, localStorage, etc.
 */
export interface ICacheService<T = unknown> {
  /**
   * Get value from cache
   */
  get<K extends T>(key: string): Promise<K | null>;

  /**
   * Set value in cache
   */
  set<K extends T>(key: string, value: K, ttlSeconds?: number): Promise<void>;

  /**
   * Delete value from cache
   */
  delete(key: string): Promise<void>;

  /**
   * Clear entire cache
   */
  clear(): Promise<void>;

  /**
   * Check if key exists in cache
   */
  has(key: string): Promise<boolean>;
}

/**
 * Logger Service Interface
 *
 * Abstraction for logging
 * Implementations can use console, file, external service, etc.
 */
export interface ILogger {
  /**
   * Log info level message
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Log warning level message
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Log error level message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void;

  /**
   * Log debug level message
   */
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Word Normalization Service Interface
 *
 * Abstraction for text normalization logic
 * Single responsibility: normalize text according to anagram rules
 */
export interface IWordNormalizer {
  /**
   * Normalize text for anagram matching
   * Removes punctuation, converts to lowercase, handles special chars
   */
  normalize(text: string): string;

  /**
   * Generate character signature for anagram matching
   * Returns sorted character representation
   */
  generateSignature(text: string): string;

  /**
   * Check if two strings are anagrams
   */
  areAnagrams(text1: string, text2: string): boolean;
}

/**
 * Anagram Matcher Service Interface
 *
 * Abstraction for matching algorithm
 * Single responsibility: match anagrams efficiently
 */
export interface IAnagramMatcher {
  /**
   * Find all matching anagrams for the given signature
   */
  findMatches(signature: string, wordList: ReadonlyArray<Word>): ReadonlyArray<Word>;

  /**
   * Build internal data structures for efficient matching (optional optimization)
   */
  buildIndex(wordList: ReadonlyArray<Word>): void;
}

/**
 * Service container configuration
 * Dependency injection container for services
 */
export interface ServiceContainer {
  readonly anagramSearch: IAnagramSearchService;
  readonly wordListProvider: IWordListProvider;
  readonly authentication: IAuthenticationService;
  readonly cache: ICacheService;
  readonly logger: ILogger;
  readonly wordNormalizer: IWordNormalizer;
  readonly anagramMatcher: IAnagramMatcher;
}

/**
 * Service factory type
 * Factory pattern for creating service instances
 */
export type ServiceFactory<T> = (dependencies: Partial<ServiceContainer>) => T;
