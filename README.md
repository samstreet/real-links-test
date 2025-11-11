# Real Links Code Challenge - Anagram Finder

This is a completed implementation of the Real Links coding challenge: a modern anagram finder web application.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: HeroUI (Hero UI)
- **Authentication**: NextAuth.js with Gmail OAuth 2.0
- **Testing**: Vitest
- **Node.js**: 22+ required

## Features

- Gmail OAuth authentication
- Real-time anagram search with debouncing
- O(1) HashMap-based lookup for optimal performance
- In-memory word list cache (~370k words)
- WCAG 2.1 Level AA accessibility compliance
- Clean, minimal responsive design
- Dark mode support
- Comprehensive unit tests

## Setup Instructions

### Prerequisites

- Node.js 22 or higher
- Gmail account for OAuth
- Google Cloud Console project with OAuth 2.0 credentials

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Word List Source
WORD_LIST_URL=https://raw.githubusercontent.com/dwyl/english-words/master/words.txt

# Runtime
NEXT_RUNTIME=nodejs
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Tests

```bash
npm test
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Usage

1. Visit the application and click "Sign in with Google"
2. Authenticate with your Gmail account
3. Enter a word or phrase in the search field
4. View matching anagrams in real-time

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/lib` - Core business logic and services
- `/types` - TypeScript type definitions
- `/docs` - Project documentation and planning

## Documentation

- `CLAUDE.md` - Development guidelines and coding standards
- `docs/PLAN.md` - Phased development plan

---

## User Story

- As a logged in user
- When I enter a string of characters into the input field
- If there are matching anagrams, I want to see a list of those words (including the input, if it is a valid word)
- If there are no matching anagrams, I want the lack of matches to be clearly communicated

An anagram is defined as a word formed by rearranging the letters of a different word. In this case, we consider any word containing exactly the same alphanumeric characters to be an anagram, ignoring any punctuation or changes in case. For example:

1. “iceman” and “cinema” are considered anagrams.
2. “engineer” and “re-engineer” are considered anagrams, ignoring the hyphen.
3. “3D” and “3-D” are considered anagrams, ignoring the hyphen.
4. “Worth” and “throw” are considered anagrams, ignoring the capital letter.

### Acceptance Criteria

- The user can enter a string of characters into an input field.
- The user can see a list of anagrams of the input string.
- The user can see a message if there are no anagrams of the input string.

### UI

- Hide the anagram listing feature behind an authentication guard
- Only allow users to log in with a "Login with Gmail" button
- Use a modern UI library and framework prefereably Next.js with HeroUI
- Make sure that the UI is very intuitive and easy to interact with

### Test Cases

1. When the input is empty, the user should see no message or list of results.
2. For the input “asdfghjk”, the user should see the message “No anagrams found”.
3. For the input “steak”, the user should see a list of results including the words: “Keats”, “skate”, “Skeat”, “stake”, “steak”, “takes”, “teaks”.
4. For the input “eeenginr”, the user should see a list of results including the words: “engineer”, “re-engine”.
