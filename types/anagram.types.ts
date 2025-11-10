/**
 * Anagram Domain Type Definitions
 *
 * Following SOLID principles:
 * - Single Responsibility: Each type represents a single domain concept
 * - Open/Closed: Extensible through optional properties and union types
 * - Liskov Substitution: Consistent interfaces for substitutable implementations
 */

/**
 * Word from word list
 * Represents a single word with its normalized signature
 */
export interface Word {
  readonly original: string;
  readonly normalized: string;
  readonly signature: string;
  readonly length: number;
}

/**
 * Character signature
 * Sorted representation of characters for anagram matching
 */
export type CharacterSignature = string;

/**
 * Search query input
 * Represents user input for anagram search
 */
export interface SearchQuery {
  readonly input: string;
  readonly caseSensitive?: boolean;
  readonly includePunctuation?: boolean;
}

/**
 * Normalized search query
 * Processed version of search query ready for matching
 */
export interface NormalizedQuery {
  readonly original: string;
  readonly normalized: string;
  readonly signature: CharacterSignature;
  readonly length: number;
}

/**
 * Anagram match
 * Represents a single matching anagram result
 */
export interface AnagramMatch {
  readonly word: string;
  readonly isOriginalInput: boolean;
  readonly confidence: number; // 0-1 score for match quality
}

/**
 * Anagram search result
 * Contains all matches and metadata for a search
 */
export interface AnagramResult {
  readonly query: string;
  readonly matches: ReadonlyArray<AnagramMatch>;
  readonly totalMatches: number;
  readonly searchTimeMs: number;
  readonly isEmpty: boolean;
}

/**
 * Word list statistics
 * Metadata about the loaded word list
 */
export interface WordListStats {
  readonly totalWords: number;
  readonly uniqueSignatures: number;
  readonly averageWordLength: number;
  readonly loadedAt: Date;
  readonly source: string;
}

/**
 * Search error types
 * Discriminated union for type-safe error handling
 */
export type SearchError =
  | { readonly type: 'INVALID_INPUT'; readonly message: string }
  | { readonly type: 'WORD_LIST_NOT_LOADED'; readonly message: string }
  | { readonly type: 'SEARCH_TIMEOUT'; readonly message: string }
  | { readonly type: 'UNKNOWN_ERROR'; readonly message: string; readonly error?: unknown };

/**
 * Search result wrapper
 * Result type for search operations
 */
export type SearchResult =
  | { readonly success: true; readonly data: AnagramResult }
  | { readonly success: false; readonly error: SearchError };

/**
 * Word list load result
 * Result type for word list loading operations
 */
export type WordListLoadResult =
  | { readonly success: true; readonly stats: WordListStats }
  | { readonly success: false; readonly error: SearchError };

/**
 * Search state
 * Represents the current state of a search operation
 */
export type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'searching' }
  | { readonly status: 'success'; readonly result: AnagramResult }
  | { readonly status: 'error'; readonly error: SearchError };

/**
 * Sort order for results
 */
export type SortOrder = 'alphabetical' | 'length' | 'confidence' | 'original-first';

/**
 * Search options
 * Configuration for search behavior
 */
export interface SearchOptions {
  readonly sortOrder?: SortOrder;
  readonly maxResults?: number;
  readonly minWordLength?: number;
  readonly includeOriginal?: boolean;
}
