# TypeScript Type Architecture

This directory contains the complete type definitions for the Anagram Finder application, designed following SOLID principles.

## Architecture Overview

The type system is organized into focused modules, each with a single responsibility:

```
types/
├── auth.types.ts         # Authentication domain types
├── anagram.types.ts      # Anagram domain types
├── api.types.ts          # API response and error types
├── services.types.ts     # Service interface abstractions
├── config.types.ts       # Configuration types
├── components.types.ts   # React component props types
└── index.ts             # Central export point
```

## SOLID Principles Application

### Single Responsibility Principle (SRP)

Each type file has a single, well-defined purpose:

- **auth.types.ts**: Only authentication-related types
- **anagram.types.ts**: Only anagram domain concepts
- **services.types.ts**: Only service interface definitions
- **components.types.ts**: Only UI component prop types

Example:
```typescript
// auth.types.ts focuses solely on authentication
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
}

// anagram.types.ts focuses solely on anagram domain
export interface Word {
  readonly original: string;
  readonly signature: string;
}
```

### Open/Closed Principle (OCP)

Types are designed to be extended without modification:

1. **Discriminated Unions**: Allow adding new error types without breaking existing code
```typescript
export type AuthError =
  | { readonly type: 'UNAUTHORIZED'; readonly message: string }
  | { readonly type: 'INVALID_CREDENTIALS'; readonly message: string }
  | { readonly type: 'TOKEN_EXPIRED'; readonly message: string };
  // Easy to add new error types without modifying existing ones
```

2. **Optional Properties**: Enable feature additions without breaking changes
```typescript
export interface SearchOptions {
  readonly sortOrder?: SortOrder;
  readonly maxResults?: number;
  readonly minWordLength?: number; // Can add new options
}
```

3. **Generic Types**: Support any data type without modification
```typescript
export interface ApiSuccess<T = unknown> {
  readonly success: true;
  readonly data: T; // Works with any data type
}
```

### Liskov Substitution Principle (LSP)

All service interface implementations can be substituted:

```typescript
// Any implementation of IAnagramSearchService can be used interchangeably
export interface IAnagramSearchService {
  search(query: SearchQuery): Promise<AsyncResult<AnagramResult>>;
  isReady(): boolean;
}

// Usage: works with any implementation
function searchAnagrams(
  service: IAnagramSearchService,
  query: SearchQuery
) {
  return service.search(query);
}
```

### Interface Segregation Principle (ISP)

Interfaces are focused and minimal:

```typescript
// Separate interfaces for different concerns
export interface IWordNormalizer {
  normalize(text: string): string;
  generateSignature(text: string): string;
}

export interface IAnagramMatcher {
  findMatches(signature: string, wordList: ReadonlyArray<Word>): ReadonlyArray<Word>;
}

// Not a single bloated interface with all methods
```

### Dependency Inversion Principle (DIP)

High-level modules depend on abstractions (interfaces), not concrete implementations:

```typescript
// High-level code depends on interface
export interface IWordListProvider {
  load(): Promise<AsyncResult<ReadonlyArray<Word>>>;
  isLoaded(): boolean;
}

// Implementation can be swapped without affecting consumers
class FileWordListProvider implements IWordListProvider { /* ... */ }
class ApiWordListProvider implements IWordListProvider { /* ... */ }
class CachedWordListProvider implements IWordListProvider { /* ... */ }
```

## Type Safety Features

### 1. Readonly by Default

All types use `readonly` to prevent accidental mutations:

```typescript
export interface User {
  readonly id: string;
  readonly email: string;
}

export interface AnagramResult {
  readonly matches: ReadonlyArray<AnagramMatch>; // Immutable array
}
```

### 2. Discriminated Unions

Type-safe state and error handling:

```typescript
export type SearchState =
  | { readonly status: 'idle' }
  | { readonly status: 'searching' }
  | { readonly status: 'success'; readonly result: AnagramResult }
  | { readonly status: 'error'; readonly error: SearchError };

// TypeScript knows which properties exist based on status
function handleState(state: SearchState) {
  if (state.status === 'success') {
    console.log(state.result); // TypeScript knows result exists
  }
}
```

### 3. Type Guards

Runtime type checking with type narrowing:

```typescript
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

// Usage
if (isApiSuccess(response)) {
  console.log(response.data); // TypeScript knows data exists
}
```

### 4. Result Types

Explicit success/failure handling without exceptions:

```typescript
export type AsyncResult<T, E = ApiError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// Forces explicit error handling
async function loadWords(): AsyncResult<ReadonlyArray<Word>> {
  try {
    const words = await fetch(url);
    return { success: true, data: words };
  } catch (error) {
    return { success: false, error: toApiError(error) };
  }
}
```

## Usage Examples

### Example 1: Implementing an Anagram Search Service

```typescript
import type { IAnagramSearchService, IWordListProvider, IWordNormalizer } from '@/types';

class AnagramSearchService implements IAnagramSearchService {
  constructor(
    private readonly wordListProvider: IWordListProvider,
    private readonly normalizer: IWordNormalizer
  ) {}

  async search(query: SearchQuery): Promise<AsyncResult<AnagramResult>> {
    if (!this.wordListProvider.isLoaded()) {
      return {
        success: false,
        error: {
          type: 'WORD_LIST_NOT_LOADED',
          message: 'Word list must be loaded first'
        }
      };
    }

    const signature = this.normalizer.generateSignature(query.input);
    // ... matching logic
  }

  isReady(): boolean {
    return this.wordListProvider.isLoaded();
  }
}
```

### Example 2: Creating a Component with Props

```typescript
import type { SearchInputProps } from '@/types';

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Enter text to find anagrams...',
  isSearching = false,
  disabled = false,
  autoFocus = false
}: SearchInputProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
      placeholder={placeholder}
      disabled={disabled || isSearching}
      autoFocus={autoFocus}
      aria-label="Anagram search input"
    />
  );
}
```

### Example 3: Handling API Responses

```typescript
import type { ApiResponse, AnagramResult } from '@/types';
import { isApiSuccess } from '@/types';

async function searchAnagrams(query: string): Promise<void> {
  const response: ApiResponse<AnagramResult> = await fetch('/api/search', {
    method: 'POST',
    body: JSON.stringify({ query })
  }).then(r => r.json());

  if (isApiSuccess(response)) {
    // TypeScript knows response.data exists and is AnagramResult
    console.log(`Found ${response.data.totalMatches} matches`);
    displayResults(response.data);
  } else {
    // TypeScript knows response.error exists and is ApiError
    console.error(response.error.message);
    displayError(response.error);
  }
}
```

### Example 4: Dependency Injection Pattern

```typescript
import type { ServiceContainer, ServiceFactory } from '@/types';

// Create service factories
const createAnagramSearchService: ServiceFactory<IAnagramSearchService> = (deps) => {
  return new AnagramSearchService(
    deps.wordListProvider!,
    deps.wordNormalizer!
  );
};

// Build service container
const container: ServiceContainer = {
  wordNormalizer: new WordNormalizer(),
  wordListProvider: new CachedWordListProvider(/* ... */),
  anagramSearch: createAnagramSearchService({
    wordListProvider: wordListProvider,
    wordNormalizer: wordNormalizer
  }),
  // ... other services
};

// Use services through abstraction
function performSearch(query: string) {
  return container.anagramSearch.search({ input: query });
}
```

### Example 5: Configuration Management

```typescript
import type { Configuration } from '@/types';

const config: Configuration = {
  app: {
    env: 'production',
    debug: false,
    baseUrl: 'https://anagram-finder.com',
    apiUrl: 'https://api.anagram-finder.com',
    version: '1.0.0'
  },
  wordList: {
    sourceUrl: 'https://raw.githubusercontent.com/dwyl/english-words/master/words.txt',
    cacheEnabled: true,
    cacheTtl: 3600,
    preload: true,
    minWordLength: 2,
    maxWordLength: 50
  },
  search: {
    maxResults: 100,
    timeout: 5000,
    defaultSortOrder: 'alphabetical',
    cacheResults: true,
    cacheTtl: 300
  },
  // ... other config sections
};
```

## Type Coverage Goals

- **100% type coverage** for all public APIs
- **No `any` types** without explicit justification
- **Strict null checks** enabled
- **Readonly by default** for immutability
- **Discriminated unions** for state management
- **Result types** for error handling

## Integration with Next.js

Types are designed to work seamlessly with Next.js App Router:

```typescript
// app/search/page.tsx - Server Component
import type { AnagramResult } from '@/types';

export default async function SearchPage() {
  const result: AnagramResult = await searchAnagrams('example');
  return <AnagramResults result={result} />;
}

// components/SearchInput.tsx - Client Component
'use client';

import type { SearchInputProps } from '@/types';

export function SearchInput(props: SearchInputProps) {
  // ... implementation
}
```

## Testing Support

Types support comprehensive testing:

```typescript
import type { IAnagramSearchService } from '@/types';

// Mock implementation for testing
class MockAnagramSearchService implements IAnagramSearchService {
  constructor(private mockResults: AnagramResult) {}

  async search(): Promise<AsyncResult<AnagramResult>> {
    return { success: true, data: this.mockResults };
  }

  isReady(): boolean {
    return true;
  }
}

// Type-safe test
test('search returns results', async () => {
  const mockService = new MockAnagramSearchService({
    query: 'test',
    matches: [],
    totalMatches: 0,
    searchTimeMs: 0,
    isEmpty: true
  });

  const result = await mockService.search({ input: 'test' });
  expect(result.success).toBe(true);
});
```

## Best Practices

1. **Always use types from the central index**: `import type { User } from '@/types'`
2. **Prefer interfaces over types** for object shapes (better error messages)
3. **Use discriminated unions** for state and errors
4. **Make everything readonly** unless mutation is required
5. **Use Result types** instead of throwing exceptions
6. **Depend on interfaces** not concrete implementations
7. **Keep types focused** - one concern per file
8. **Document complex types** with JSDoc comments

## Future Extensions

The type system is designed to support future features:

- Multi-language anagram search (add `language` to SearchQuery)
- Advanced search filters (extend SearchOptions)
- User preferences (extend User interface)
- Search history (add new types in anagram.types.ts)
- Real-time collaboration (add new service interfaces)

All extensions can be added without modifying existing types, following the Open/Closed Principle.
