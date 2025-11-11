# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a coding challenge repository for Real Links. The task is to build an anagram finder web application with Gmail authentication.

**Current State**: The repository contains only a basic skeleton HTML file (`anagrams.html`) with a minimal Vue.js setup using CDN imports. This is meant to be replaced or significantly expanded.

**Goal**: Build a complete anagram finder application with:
- Gmail OAuth authentication
- Anagram search functionality using word list from https://raw.githubusercontent.com/dwyl/english-words/master/words.txt
- Modern UI using Next.js and HeroUI (preferred) or Vue.js

## User Story Requirements

The application must:
1. Hide anagram finder behind authentication (Gmail login only)
2. Accept string input and find all anagrams
3. Display matching anagrams (including input if it's a valid word)
4. Show "No anagrams found" message when no matches exist
5. Show nothing when input is empty

**Anagram Rules**:
- Ignore punctuation (hyphens, etc.)
- Case-insensitive matching
- Match on alphanumeric characters only
- Examples: "iceman"/"cinema", "engineer"/"re-engineer", "3D"/"3-D", "Worth"/"throw"

## Test Cases to Validate

1. Empty input → no message or results
2. "asdfghjk" → "No anagrams found"
3. "steak" → should return: "Keats", "skate", "Skeat", "stake", "steak", "takes", "teaks"
4. "eeenginr" → should return: "engineer", "re-engine"

## Development Approach

**Recommended**: Start fresh with Next.js + HeroUI rather than building on the existing Vue skeleton, as this aligns with Real Links' current stack migration from Vue to Next.

**Core Algorithm**: To find anagrams efficiently:
- Normalize input (remove punctuation, lowercase)
- Create sorted character signature of input
- Compare against word list by matching sorted signatures
- Filter and return matches

**Authentication**: Implement Gmail OAuth 2.0 flow (use NextAuth.js for Next.js implementations)

## Development Principles

### SOLID Principles
- **Single Responsibility**: Separate concerns (auth logic, anagram algorithm, UI components, data fetching)
- **Open/Closed**: Design components and utilities to be extensible without modification
- **Liskov Substitution**: Ensure component interfaces are consistent and interchangeable
- **Interface Segregation**: Create focused interfaces (e.g., separate authentication, search, and UI concerns)
- **Dependency Inversion**: Depend on abstractions (e.g., searchService interface rather than concrete implementation)

**Application to this project**:
- Separate anagram algorithm into pure utility functions
- Create distinct services for authentication, word list management, and search
- Keep UI components focused on presentation, not business logic
- Use composition over tight coupling

### WCAG Accessibility Guidelines
Must meet WCAG 2.1 Level AA standards:

- **Keyboard Navigation**: All interactive elements accessible via keyboard (Tab, Enter, Escape)
- **Screen Reader Support**: Proper ARIA labels, roles, and live regions for dynamic content
- **Color Contrast**: Minimum 4.5:1 ratio for text, 3:1 for UI components
- **Focus Indicators**: Clear visual focus states on all interactive elements
- **Semantic HTML**: Use proper heading hierarchy, landmarks, and form labels
- **Error Identification**: Clear error messages and input validation feedback
- **Loading States**: Announce loading/searching states to screen readers

**Specific requirements**:
- Input field must have proper label association
- Results list should use `role="list"` or semantic `<ul>`
- Search status updates should use `aria-live="polite"`
- Login button must be keyboard accessible and properly labeled

### Next.js Best Practices

**App Router (Recommended)**:
- Use Server Components by default, Client Components only when needed (`'use client'`)
- Implement Server Actions for form submissions and mutations
- Use `middleware.ts` for authentication guards
- Leverage `loading.tsx` and `error.tsx` for better UX

**Performance**:
- Implement word list caching (consider `unstable_cache` or static data)
- Use `next/image` for any images
- Optimize bundle size with dynamic imports if needed
- Implement proper loading states and Suspense boundaries

**Code Organization**:
```
/app                 # App Router pages and layouts
/components          # React components
  /ui                # HeroUI wrapper/base components
  /features          # Feature-specific components
/lib                 # Business logic and utilities
  /auth              # Authentication utilities
  /anagram           # Anagram algorithm and services
/types               # TypeScript type definitions
```

**TypeScript**:
- Use strict mode
- Define proper types for props, API responses, and domain models
- Avoid `any` types
- **Use enums for fixed sets of values** instead of string literal unions
- **Use British English spelling** for all code (normalise, initialise, etc.)

### TypeScript Enums

**Rule**: Always use TypeScript enums for fixed sets of values instead of string literal unions.

**Why**:
- Better type safety and autocompletion
- Easier refactoring (change value in one place)
- Runtime value access
- More maintainable code

**Examples**:

❌ **Don't** use string literal unions:
```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
```

✅ **Do** use enums:
```typescript
enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
```

**When to use enums**:
- Status values (loading states, cache states, search states)
- Sort orders (alphabetical, length, confidence)
- Error types (validation, authentication, server errors)
- Any fixed set of string or numeric constants

**Naming**:
- Enum names: PascalCase (e.g., `CacheStatus`, `SortOrder`)
- Enum members: PascalCase (e.g., `Status.Idle`, `SortOrder.Alphabetical`)
- Use British English (e.g., `CacheStatus.Uninitialised`)

### British English

**Rule**: Use British English spelling throughout the codebase.

**Examples**:
- `normalise` not `normalize`
- `initialise` not `initialize`
- `colour` not `color`
- `favourite` not `favorite`
- File names: `word-normaliser.ts` not `word-normalizer.ts`
- Enums: `CacheStatus.Uninitialised` not `CacheStatus.Uninitialized`

## Running the Current Skeleton

Open `anagrams.html` directly in a browser - it uses Vue 3 via CDN, no build step required.
