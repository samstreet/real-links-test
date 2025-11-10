# TypeScript Types Quick Reference

Quick reference guide for using the type system in the Anagram Finder application.

## Import Patterns

Always import types from the central index:

```typescript
// ✓ GOOD - Import from central index
import type {
  User,
  Session,
  AnagramResult,
  SearchQuery,
  IAnagramSearchService,
  ApiResponse
} from '@/types';

// ✗ BAD - Don't import from individual files
import type { User } from '@/types/auth.types';
```

## Common Type Patterns

### 1. Service Dependency Injection

```typescript
import type { IAnagramSearchService, IWordListProvider } from '@/types';

class MyService {
  constructor(
    private readonly searchService: IAnagramSearchService,
    private readonly provider: IWordListProvider
  ) {}
}
```

### 2. Component Props

```typescript
import type { SearchInputProps } from '@/types';

export function SearchInput(props: SearchInputProps) {
  // Implementation
}
```

### 3. API Response Handling

```typescript
import type { ApiResponse, AnagramResult } from '@/types';
import { isApiSuccess } from '@/types';

const response: ApiResponse<AnagramResult> = await fetch('/api/search');

if (isApiSuccess(response)) {
  console.log(response.data); // AnagramResult
} else {
  console.error(response.error); // ApiError
}
```

### 4. Result Type Pattern

```typescript
import type { AsyncResult, AnagramResult } from '@/types';

async function search(query: string): Promise<AsyncResult<AnagramResult>> {
  try {
    const data = await performSearch(query);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        statusCode: 500,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Usage
const result = await search('test');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 5. State Management with Discriminated Unions

```typescript
import type { SearchState } from '@/types';

const [state, setState] = useState<SearchState>({ status: 'idle' });

// TypeScript knows which properties exist
switch (state.status) {
  case 'idle':
    return <EmptyState />;
  case 'searching':
    return <LoadingState />;
  case 'success':
    return <Results data={state.result} />;
  case 'error':
    return <ErrorState error={state.error} />;
}
```

### 6. Error Handling with Exhaustive Checking

```typescript
import type { SearchError } from '@/types';

function handleError(error: SearchError): string {
  switch (error.type) {
    case 'INVALID_INPUT':
      return 'Invalid input';
    case 'WORD_LIST_NOT_LOADED':
      return 'Loading...';
    case 'SEARCH_TIMEOUT':
      return 'Timeout';
    case 'UNKNOWN_ERROR':
      return 'Unknown error';
    default:
      // Compiler ensures all cases handled
      const _exhaustive: never = error;
      return 'Unknown';
  }
}
```

## Type Cheat Sheet

### Authentication Types

```typescript
import type { User, Session, AuthState, IAuthenticationService } from '@/types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  image: null,
  emailVerified: true
};

const session: Session = {
  user,
  expiresAt: new Date(),
  provider: 'google'
};

const state: AuthState = {
  status: 'authenticated',
  session
};
```

### Anagram Types

```typescript
import type {
  Word,
  SearchQuery,
  AnagramResult,
  SearchOptions,
  IAnagramSearchService
} from '@/types';

const query: SearchQuery = {
  input: 'cinema',
  caseSensitive: false
};

const options: SearchOptions = {
  sortOrder: 'alphabetical',
  maxResults: 100
};

const result: AnagramResult = {
  query: 'cinema',
  matches: [
    { word: 'cinema', isOriginalInput: true, confidence: 1.0 },
    { word: 'iceman', isOriginalInput: false, confidence: 1.0 }
  ],
  totalMatches: 2,
  searchTimeMs: 15,
  isEmpty: false
};
```

### API Types

```typescript
import type { ApiResponse, ApiError, ApiSuccess } from '@/types';
import { isApiSuccess, isApiFailure } from '@/types';

// Success response
const success: ApiSuccess<string> = {
  success: true,
  data: 'Hello',
  timestamp: new Date().toISOString()
};

// Error response
const failure: ApiFailure = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    statusCode: 404,
    timestamp: new Date().toISOString()
  }
};

// Type guards
if (isApiSuccess(response)) {
  console.log(response.data);
}
```

### Configuration Types

```typescript
import type { Configuration, AppConfig, SearchConfig } from '@/types';

const config: Configuration = {
  app: {
    env: 'production',
    debug: false,
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com',
    version: '1.0.0'
  },
  search: {
    maxResults: 100,
    timeout: 5000,
    defaultSortOrder: 'alphabetical',
    cacheResults: true,
    cacheTtl: 300
  },
  // ... other config
};
```

## Service Interface Quick Start

### Implement IAnagramSearchService

```typescript
import type { IAnagramSearchService, SearchQuery, AnagramResult, AsyncResult } from '@/types';

class MySearchService implements IAnagramSearchService {
  async search(query: SearchQuery): Promise<AsyncResult<AnagramResult>> {
    // Implementation
  }

  isReady(): boolean {
    return true;
  }

  getStats() {
    return null;
  }
}
```

### Implement IWordListProvider

```typescript
import type { IWordListProvider, Word, AsyncResult } from '@/types';

class MyProvider implements IWordListProvider {
  async load(): Promise<AsyncResult<ReadonlyArray<Word>>> {
    // Implementation
  }

  async reload(): Promise<AsyncResult<ReadonlyArray<Word>>> {
    // Implementation
  }

  isLoaded(): boolean {
    return true;
  }

  getSource(): string {
    return 'my-source';
  }

  getStats() {
    return null;
  }
}
```

### Implement IAuthenticationService

```typescript
import type { IAuthenticationService, Session, AsyncResult } from '@/types';

class MyAuthService implements IAuthenticationService {
  async signIn(credentials) {
    // Implementation
  }

  async signOut() {
    // Implementation
  }

  async getSession() {
    // Implementation
  }

  // ... other methods
}
```

## Component Props Quick Start

### Search Input Component

```typescript
import type { SearchInputProps } from '@/types';

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  isSearching = false,
  disabled = false
}: SearchInputProps) {
  // Implementation
}
```

### Results Component

```typescript
import type { AnagramResultsProps } from '@/types';

export function AnagramResults({
  result,
  isLoading = false,
  error,
  emptyMessage = 'No results'
}: AnagramResultsProps) {
  // Implementation
}
```

### Auth Button Component

```typescript
import type { AuthButtonProps } from '@/types';

export function AuthButton({
  onSignIn,
  onSignOut,
  isLoading = false,
  disabled = false
}: AuthButtonProps) {
  // Implementation
}
```

## Testing Patterns

### Mock Service Implementation

```typescript
import type { IAnagramSearchService, AnagramResult, AsyncResult } from '@/types';

class MockSearchService implements IAnagramSearchService {
  constructor(private mockData: AnagramResult) {}

  async search(): Promise<AsyncResult<AnagramResult>> {
    return { success: true, data: this.mockData };
  }

  isReady() { return true; }
  getStats() { return null; }
}

// Usage in tests
const mockService = new MockSearchService({
  query: 'test',
  matches: [],
  totalMatches: 0,
  searchTimeMs: 0,
  isEmpty: true
});
```

### Type-Safe Test Fixtures

```typescript
import type { User, AnagramResult, Word } from '@/types';

const mockUser: User = {
  id: 'test-id',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  emailVerified: true
};

const mockResult: AnagramResult = {
  query: 'test',
  matches: [],
  totalMatches: 0,
  searchTimeMs: 0,
  isEmpty: true
};

const mockWords: ReadonlyArray<Word> = [
  { original: 'test', normalized: 'test', signature: 'estt', length: 4 }
];
```

## Common Gotchas

### 1. Don't Use Optional Chaining with Readonly Arrays

```typescript
// ✗ BAD
const match = result.matches?.[0]; // Type is AnagramMatch | undefined

// ✓ GOOD
const match = result.matches[0]; // Type is AnagramMatch | undefined (noUncheckedIndexedAccess)
```

### 2. Always Handle Both Success and Failure

```typescript
// ✗ BAD - Doesn't handle error case
const result = await service.search(query);
console.log(result.data); // Compile error!

// ✓ GOOD - Handles both cases
const result = await service.search(query);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 3. Use Type Guards for Discriminated Unions

```typescript
import { isApiSuccess } from '@/types';

// ✗ BAD - Type narrowing doesn't work
if (response.success) {
  console.log(response.data); // May not work correctly
}

// ✓ GOOD - Use type guard
if (isApiSuccess(response)) {
  console.log(response.data); // TypeScript knows data exists
}
```

### 4. Import Types with 'type' Keyword

```typescript
// ✓ GOOD - Type-only import
import type { User, Session } from '@/types';

// ✗ BAD - Value import (can affect tree-shaking)
import { User, Session } from '@/types';
```

## Path Aliases

Configured in tsconfig.json:

```typescript
import type { User } from '@/types';           // types/index.ts
import type { User } from '@/types/auth';      // types/auth.types.ts
import { SearchService } from '@/lib/anagram'; // lib/anagram/...
import { SearchInput } from '@/components';    // components/...
import { SearchPage } from '@/app/search';     // app/search/...
```

## Next.js Integration

### Server Component

```typescript
// app/search/page.tsx
import type { AnagramResult } from '@/types';

export default async function SearchPage() {
  const result: AnagramResult = await searchAnagrams('test');
  return <Results result={result} />;
}
```

### Client Component

```typescript
// components/SearchInput.tsx
'use client';

import type { SearchInputProps } from '@/types';
import { useState } from 'react';

export function SearchInput(props: SearchInputProps) {
  const [value, setValue] = useState('');
  // Implementation
}
```

### API Route

```typescript
// app/api/search/route.ts
import type { ApiResponse, AnagramResult } from '@/types';

export async function POST(request: Request) {
  const response: ApiResponse<AnagramResult> = {
    success: true,
    data: {
      query: 'test',
      matches: [],
      totalMatches: 0,
      searchTimeMs: 0,
      isEmpty: true
    },
    timestamp: new Date().toISOString()
  };

  return Response.json(response);
}
```

## Resources

- **README.md**: Architecture overview and usage patterns
- **ARCHITECTURE.md**: Design decisions and rationale
- **EXAMPLES.md**: Comprehensive code examples
- **SUMMARY.md**: Complete implementation summary

## Getting Help

1. Check type definitions in `/types/*.types.ts`
2. Review examples in `EXAMPLES.md`
3. Read architecture decisions in `ARCHITECTURE.md`
4. Use IDE autocomplete (TypeScript IntelliSense)
5. Compiler errors provide helpful messages with strict mode enabled
