# Anagram Finder - Phased Development Plan

This document outlines the complete development plan for the Real Links Anagram Finder coding challenge, from initial design through final delivery.

## Phase 1: Design & Architecture

**Deliverables:**
- Technical stack decision (Next.js, TypeScript, HeroUI, NextAuth.js)
- Authentication flow diagram (OAuth 2.0 with Gmail)
- Data model for anagram matching (character signature approach)
- UI wireframes for login page and anagram finder interface

## Phase 2: Project Setup

**Deliverables:**
- Initialized Next.js project with TypeScript configuration
- HeroUI library installed and configured
- Project folder structure (components, lib, pages/app, utils)
- Environment variables template for OAuth credentials
- Git repository with initial commit

## Phase 3: Authentication System

**Deliverables:**
- NextAuth.js configured with Google OAuth provider
- Login page with "Login with Gmail" button
- Authentication guard middleware protecting anagram routes
- Session management and logout functionality
- Redirect flow (unauthenticated → login → anagram finder)

## Phase 4: Word List Integration

**Deliverables:**
- Utility to fetch words from dwyl/english-words repository
- Data processing for word list (normalize, create signatures)
- Caching mechanism (server-side or static generation)
- Error handling for failed word list loads

## Phase 5: Anagram Algorithm

**Deliverables:**
- Character normalization function (remove punctuation, lowercase)
- Signature generation (sort characters for comparison)
- Anagram matching algorithm
- Performance optimization for large word list searches

## Phase 6: Core UI Components

**Deliverables:**
- Input field component with real-time search
- Results list component displaying matching anagrams
- Empty state (no input entered)
- "No anagrams found" message component
- Layout and navigation structure

## Phase 7: User Experience Polish

**Deliverables:**
- Loading indicators during search
- Smooth transitions and animations
- Responsive design (mobile, tablet, desktop)
- Accessibility features (ARIA labels, keyboard navigation)
- Intuitive interaction patterns

## Phase 8: Test Case Validation

**Deliverables:**
- Test 1: Empty input shows no message/results ✓
- Test 2: "asdfghjk" → "No anagrams found" ✓
- Test 3: "steak" → returns Keats, skate, Skeat, stake, steak, takes, teaks ✓
- Test 4: "eeenginr" → returns engineer, re-engine ✓
- Edge case testing (special characters, numbers, very long inputs)

## Phase 9: Final Delivery

**Deliverables:**
- Code cleanup and refactoring
- README with setup/run instructions
- Environment setup documentation
- Deployed version (optional: Vercel/Netlify)
- Email submission to marton.takacs@reallinks.io with repository link

---

## User Story Reference

**As a logged in user:**
- When I enter a string of characters into the input field
- If there are matching anagrams, I want to see a list of those words (including the input, if it is a valid word)
- If there are no matching anagrams, I want the lack of matches to be clearly communicated

**Anagram Definition:**
A word formed by rearranging the letters of a different word, where:
- Any word containing exactly the same alphanumeric characters is an anagram
- Punctuation is ignored
- Case changes are ignored

**Examples:**
1. "iceman" and "cinema" are anagrams
2. "engineer" and "re-engineer" are anagrams (ignore hyphen)
3. "3D" and "3-D" are anagrams (ignore hyphen)
4. "Worth" and "throw" are anagrams (ignore case)

## Acceptance Criteria

- The user can enter a string of characters into an input field
- The user can see a list of anagrams of the input string
- The user can see a message if there are no anagrams of the input string
- Hide anagram listing feature behind authentication guard
- Only allow users to log in with "Login with Gmail" button
- Use modern UI library and framework (preferably Next.js with HeroUI)
- UI must be intuitive and easy to interact with

## Word List Source

https://raw.githubusercontent.com/dwyl/english-words/master/words.txt
