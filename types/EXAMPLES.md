# TypeScript Type System Usage Examples

This document provides practical examples of using the type system in the Anagram Finder application.

## Table of Contents
1. [Service Implementation Examples](#service-implementation-examples)
2. [Component Examples](#component-examples)
3. [API Integration Examples](#api-integration-examples)
4. [Error Handling Examples](#error-handling-examples)
5. [Testing Examples](#testing-examples)

---

## Service Implementation Examples

### Example 1: Implementing IAnagramSearchService

```typescript
// lib/anagram/search-service.ts
import type {
  IAnagramSearchService,
  IWordListProvider,
  IWordNormalizer,
  IAnagramMatcher,
  SearchQuery,
  SearchOptions,
  AnagramResult,
  AsyncResult,
  ApiError
} from '@/types';

export class AnagramSearchService implements IAnagramSearchService {
  constructor(
    private readonly wordListProvider: IWordListProvider,
    private readonly normalizer: IWordNormalizer,
    private readonly matcher: IAnagramMatcher,
    private readonly logger: ILogger
  ) {}

  async search(
    query: SearchQuery,
    options?: SearchOptions
  ): Promise<AsyncResult<AnagramResult, ApiError>> {
    const startTime = Date.now();

    try {
      // Check if word list is loaded
      if (!this.wordListProvider.isLoaded()) {
        return {
          success: false,
          error: {
            code: 'WORD_LIST_NOT_LOADED',
            message: 'Word list must be loaded before searching',
            statusCode: 503,
            timestamp: new Date().toISOString()
          }
        };
      }

      // Validate input
      if (!query.input || query.input.trim().length === 0) {
        return {
          success: true,
          data: {
            query: query.input,
            matches: [],
            totalMatches: 0,
            searchTimeMs: Date.now() - startTime,
            isEmpty: true
          }
        };
      }

      // Normalize and generate signature
      const normalized = this.normalizer.normalize(query.input);
      const signature = this.normalizer.generateSignature(normalized);

      // Find matches
      const wordList = await this.wordListProvider.load();
      if (!wordList.success) {
        return wordList; // Propagate error
      }

      const matchingWords = this.matcher.findMatches(signature, wordList.data);

      // Build result
      const matches = matchingWords.map(word => ({
        word: word.original,
        isOriginalInput: word.original.toLowerCase() === query.input.toLowerCase(),
        confidence: 1.0
      }));

      // Apply options
      const sortedMatches = this.sortMatches(matches, options?.sortOrder);
      const limitedMatches = options?.maxResults
        ? sortedMatches.slice(0, options.maxResults)
        : sortedMatches;

      const result: AnagramResult = {
        query: query.input,
        matches: limitedMatches,
        totalMatches: matches.length,
        searchTimeMs: Date.now() - startTime,
        isEmpty: matches.length === 0
      };

      this.logger.info('Search completed', {
        query: query.input,
        matches: result.totalMatches,
        timeMs: result.searchTimeMs
      });

      return { success: true, data: result };
    } catch (error) {
      this.logger.error('Search failed', error as Error, { query: query.input });

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred during search',
          statusCode: 500,
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message }
        }
      };
    }
  }

  isReady(): boolean {
    return this.wordListProvider.isLoaded();
  }

  getStats(): WordListStats | null {
    return this.wordListProvider.getStats();
  }

  private sortMatches(
    matches: ReadonlyArray<AnagramMatch>,
    order: SortOrder = 'alphabetical'
  ): ReadonlyArray<AnagramMatch> {
    const sorted = [...matches];

    switch (order) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.word.localeCompare(b.word));
      case 'length':
        return sorted.sort((a, b) => a.word.length - b.word.length);
      case 'original-first':
        return sorted.sort((a, b) => {
          if (a.isOriginalInput) return -1;
          if (b.isOriginalInput) return 1;
          return a.word.localeCompare(b.word);
        });
      default:
        return sorted;
    }
  }
}
```

### Example 2: Implementing IWordListProvider

```typescript
// lib/anagram/word-list-provider.ts
import type {
  IWordListProvider,
  ICacheService,
  ILogger,
  Word,
  WordListStats,
  AsyncResult,
  ApiError
} from '@/types';

export class CachedWordListProvider implements IWordListProvider {
  private readonly CACHE_KEY = 'word-list';
  private readonly sourceUrl: string;
  private wordList: ReadonlyArray<Word> | null = null;
  private stats: WordListStats | null = null;

  constructor(
    sourceUrl: string,
    private readonly cache: ICacheService<ReadonlyArray<Word>>,
    private readonly logger: ILogger
  ) {
    this.sourceUrl = sourceUrl;
  }

  async load(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>> {
    // Check if already loaded
    if (this.wordList) {
      return { success: true, data: this.wordList };
    }

    // Try cache first
    const cached = await this.cache.get<ReadonlyArray<Word>>(this.CACHE_KEY);
    if (cached) {
      this.logger.info('Word list loaded from cache');
      this.wordList = cached;
      this.computeStats();
      return { success: true, data: cached };
    }

    // Fetch from source
    try {
      const response = await fetch(this.sourceUrl);
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: `Failed to fetch word list: ${response.statusText}`,
            statusCode: response.status,
            timestamp: new Date().toISOString()
          }
        };
      }

      const text = await response.text();
      const words = this.parseWordList(text);

      // Cache the result
      await this.cache.set(this.CACHE_KEY, words, 3600); // 1 hour TTL

      this.wordList = words;
      this.computeStats();

      this.logger.info('Word list loaded from source', {
        source: this.sourceUrl,
        count: words.length
      });

      return { success: true, data: words };
    } catch (error) {
      this.logger.error('Failed to load word list', error as Error);

      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Failed to load word list',
          statusCode: 503,
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message }
        }
      };
    }
  }

  async reload(): Promise<AsyncResult<ReadonlyArray<Word>, ApiError>> {
    await this.cache.delete(this.CACHE_KEY);
    this.wordList = null;
    this.stats = null;
    return this.load();
  }

  isLoaded(): boolean {
    return this.wordList !== null;
  }

  getSource(): string {
    return this.sourceUrl;
  }

  getStats(): WordListStats | null {
    return this.stats;
  }

  private parseWordList(text: string): ReadonlyArray<Word> {
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    return lines.map(line => {
      const original = line.trim();
      const normalized = this.normalize(original);
      const signature = this.generateSignature(normalized);

      return {
        original,
        normalized,
        signature,
        length: normalized.length
      };
    });
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private generateSignature(text: string): string {
    return text.split('').sort().join('');
  }

  private computeStats(): void {
    if (!this.wordList) return;

    const signatures = new Set(this.wordList.map(w => w.signature));
    const totalLength = this.wordList.reduce((sum, w) => sum + w.length, 0);

    this.stats = {
      totalWords: this.wordList.length,
      uniqueSignatures: signatures.size,
      averageWordLength: totalLength / this.wordList.length,
      loadedAt: new Date(),
      source: this.sourceUrl
    };
  }
}
```

---

## Component Examples

### Example 3: Search Input Component

```typescript
// components/features/SearchInput.tsx
'use client';

import type { SearchInputProps } from '@/types';
import { useState, useEffect, useRef } from 'react';

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Enter text to find anagrams...',
  isSearching = false,
  disabled = false,
  autoFocus = false,
  maxLength = 100,
  className,
  testId = 'search-input'
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching && value.trim()) {
      onSearch(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <label htmlFor="anagram-search" className="sr-only">
        Search for anagrams
      </label>
      <input
        ref={inputRef}
        id="anagram-search"
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSearching}
        maxLength={maxLength}
        aria-label="Anagram search input"
        aria-busy={isSearching}
        aria-describedby="search-help"
        data-testid={testId}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
      />
      <p id="search-help" className="sr-only">
        Enter text and press Enter to search for anagrams
      </p>
    </div>
  );
}
```

### Example 4: Anagram Results Component

```typescript
// components/features/AnagramResults.tsx
import type { AnagramResultsProps } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { AnagramList } from './AnagramList';

export function AnagramResults({
  result,
  isLoading = false,
  error,
  emptyMessage = 'No anagrams found',
  className,
  testId = 'anagram-results'
}: AnagramResultsProps) {
  if (isLoading) {
    return <LoadingState message="Searching for anagrams..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!result) {
    return null;
  }

  if (result.isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={className} data-testid={testId}>
      <div
        className="mb-4 text-sm text-gray-600"
        aria-live="polite"
        aria-atomic="true"
      >
        Found {result.totalMatches} anagram{result.totalMatches !== 1 ? 's' : ''}{' '}
        for "{result.query}" in {result.searchTimeMs}ms
      </div>

      <AnagramList
        matches={result.matches.map(m => m.word)}
        originalWord={result.query}
        highlightOriginal
      />
    </div>
  );
}
```

---

## API Integration Examples

### Example 5: API Client with Type Safety

```typescript
// lib/api/client.ts
import type {
  ApiResponse,
  ApiRequestConfig,
  ApiClientOptions,
  ApiError
} from '@/types';
import { isApiSuccess } from '@/types';

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
  }

  async request<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${config.url}`;
      const headers = { ...this.defaultHeaders, ...config.headers };

      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: config.signal
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: this.mapStatusToErrorCode(response.status),
          message: data.message || response.statusText,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          validationErrors: data.validationErrors
        };

        return { success: false, error };
      }

      return {
        success: true,
        data: data as T,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          statusCode: 500,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get<T>(url: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, signal });
  }

  async post<T>(
    url: string,
    body: unknown,
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, body, signal });
  }

  private mapStatusToErrorCode(status: number): ApiErrorCode {
    switch (status) {
      case 400: return 'VALIDATION_ERROR';
      case 401: return 'AUTHENTICATION_REQUIRED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 409: return 'CONFLICT';
      case 429: return 'RATE_LIMITED';
      case 500: return 'INTERNAL_ERROR';
      case 503: return 'SERVICE_UNAVAILABLE';
      default: return 'UNKNOWN_ERROR';
    }
  }
}

// Usage example
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
});

export async function searchAnagrams(query: string) {
  const response = await apiClient.post<AnagramResult>('/search', { query });

  if (isApiSuccess(response)) {
    return response.data; // TypeScript knows data is AnagramResult
  } else {
    throw new Error(response.error.message);
  }
}
```

---

## Error Handling Examples

### Example 6: Type-Safe Error Handling

```typescript
// lib/utils/error-handler.ts
import type { ApiError, SearchError, AuthError } from '@/types';

export function handleSearchError(error: SearchError): string {
  switch (error.type) {
    case 'INVALID_INPUT':
      return 'Please enter valid text to search for anagrams';
    case 'WORD_LIST_NOT_LOADED':
      return 'Word list is loading, please try again in a moment';
    case 'SEARCH_TIMEOUT':
      return 'Search took too long, please try a shorter query';
    case 'UNKNOWN_ERROR':
      return 'An unexpected error occurred. Please try again';
    default:
      // TypeScript ensures exhaustive checking
      const _exhaustive: never = error;
      return 'Unknown error';
  }
}

export function handleAuthError(error: AuthError): string {
  switch (error.type) {
    case 'UNAUTHORIZED':
      return 'Please sign in to continue';
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password';
    case 'TOKEN_EXPIRED':
      return 'Your session has expired. Please sign in again';
    case 'PROVIDER_ERROR':
      return `Authentication with ${error.provider} failed`;
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection';
    case 'UNKNOWN_ERROR':
      return 'Authentication failed. Please try again';
    default:
      const _exhaustive: never = error;
      return 'Unknown authentication error';
  }
}

export function handleApiError(error: ApiError): string {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return error.validationErrors?.[0]?.message || 'Validation failed';
    case 'AUTHENTICATION_REQUIRED':
      return 'Please sign in to continue';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action';
    case 'NOT_FOUND':
      return 'The requested resource was not found';
    case 'RATE_LIMITED':
      return 'Too many requests. Please try again later';
    default:
      return error.message;
  }
}
```

---

## Testing Examples

### Example 7: Testing with Mock Services

```typescript
// __tests__/services/anagram-search.test.ts
import type {
  IAnagramSearchService,
  IWordListProvider,
  IWordNormalizer,
  Word,
  AnagramResult,
  AsyncResult
} from '@/types';
import { AnagramSearchService } from '@/lib/anagram/search-service';

// Mock implementations
class MockWordListProvider implements IWordListProvider {
  constructor(private words: ReadonlyArray<Word>) {}

  async load(): Promise<AsyncResult<ReadonlyArray<Word>>> {
    return { success: true, data: this.words };
  }

  async reload(): Promise<AsyncResult<ReadonlyArray<Word>>> {
    return this.load();
  }

  isLoaded(): boolean {
    return true;
  }

  getSource(): string {
    return 'mock';
  }

  getStats() {
    return null;
  }
}

class MockWordNormalizer implements IWordNormalizer {
  normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  generateSignature(text: string): string {
    return text.split('').sort().join('');
  }

  areAnagrams(text1: string, text2: string): boolean {
    return this.generateSignature(text1) === this.generateSignature(text2);
  }
}

describe('AnagramSearchService', () => {
  let service: IAnagramSearchService;

  beforeEach(() => {
    const mockWords: ReadonlyArray<Word> = [
      { original: 'cinema', normalized: 'cinema', signature: 'aceim', length: 6 },
      { original: 'iceman', normalized: 'iceman', signature: 'aceim', length: 6 },
      { original: 'steak', normalized: 'steak', signature: 'aekst', length: 5 },
      { original: 'takes', normalized: 'takes', signature: 'aekst', length: 5 },
    ];

    service = new AnagramSearchService(
      new MockWordListProvider(mockWords),
      new MockWordNormalizer(),
      new MockAnagramMatcher(),
      new MockLogger()
    );
  });

  test('should find anagrams', async () => {
    const result = await service.search({ input: 'cinema' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.matches).toHaveLength(2);
      expect(result.data.matches.map(m => m.word)).toContain('cinema');
      expect(result.data.matches.map(m => m.word)).toContain('iceman');
    }
  });

  test('should handle empty input', async () => {
    const result = await service.search({ input: '' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isEmpty).toBe(true);
      expect(result.data.matches).toHaveLength(0);
    }
  });

  test('should return no results for non-matching input', async () => {
    const result = await service.search({ input: 'asdfghjk' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isEmpty).toBe(true);
      expect(result.data.matches).toHaveLength(0);
    }
  });
});
```

### Example 8: Component Testing

```typescript
// __tests__/components/SearchInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '@/components/features/SearchInput';
import type { SearchInputProps } from '@/types';

describe('SearchInput', () => {
  const defaultProps: SearchInputProps = {
    value: '',
    onChange: jest.fn(),
    onSearch: jest.fn(),
  };

  test('renders with placeholder', () => {
    render(<SearchInput {...defaultProps} placeholder="Test placeholder" />);
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  test('calls onChange when typing', () => {
    const onChange = jest.fn();
    render(<SearchInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onChange).toHaveBeenCalledWith('test');
  });

  test('calls onSearch when pressing Enter', () => {
    const onSearch = jest.fn();
    render(<SearchInput {...defaultProps} value="test" onSearch={onSearch} />);

    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  test('disables input when isSearching', () => {
    render(<SearchInput {...defaultProps} isSearching />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });
});
```

---

These examples demonstrate:
1. Type-safe service implementations following SOLID principles
2. Component development with proper TypeScript types
3. API client integration with discriminated unions
4. Comprehensive error handling with exhaustive checking
5. Testable code with mockable interfaces

All code is 100% type-safe with strict TypeScript enabled.
