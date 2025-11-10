# Anagram Finder - Setup Guide

This guide will help you set up and run the Anagram Finder application locally.

## Prerequisites

- Node.js 22.0.0 or higher
- npm 10.0.0 or higher
- A Google Cloud Platform account (for Gmail OAuth)

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd real-links-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Set up Google OAuth** (see detailed instructions below)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Google OAuth Setup

To enable Gmail authentication, you need to create OAuth 2.0 credentials:

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Anagram Finder (or your preferred name)
   - User support email: Your email
   - Developer contact: Your email
4. Application type: **Web application**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - (For production, add your production URL)
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### Step 3: Update Environment Variables

Edit your `.env` file with the credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

## Available Scripts

- `npm run dev` - Start the development server on port 3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
real-links-test/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/         # NextAuth.js endpoints
│   ├── auth/             # Authentication pages
│   ├── anagram/          # Anagram finder page (protected)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── providers.tsx     # Client-side providers
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── lib/                   # Business logic
│   ├── auth/             # Authentication utilities
│   └── anagram/          # Anagram algorithm
├── types/                 # TypeScript type definitions
├── public/               # Static assets
├── docs/                 # Documentation
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Development Guidelines

### TypeScript

This project uses TypeScript in strict mode. All files must be properly typed, and `any` types should be avoided.

### Code Formatting

We use Prettier for code formatting. Run `npm run format` before committing changes.

### Linting

ESLint is configured with Next.js recommended rules. Run `npm run lint` to check for issues.

### Accessibility

All components must meet WCAG 2.1 Level AA standards:
- Proper ARIA labels and roles
- Keyboard navigation support
- Sufficient color contrast
- Screen reader compatibility

## Troubleshooting

### Port 3000 is already in use

If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm run dev
```

### OAuth errors

- Ensure your `.env` file has all required variables
- Verify redirect URIs in Google Cloud Console match your local/production URLs
- Check that the OAuth consent screen is configured correctly

### Module not found errors

Try clearing the Next.js cache and reinstalling dependencies:
```bash
rm -rf .next node_modules
npm install
```

## Phase 1 Implementation Status

Phase 1 (Design & Architecture) is complete with:

- ✅ Next.js 14+ with TypeScript and App Router
- ✅ HeroUI component library with Tailwind CSS
- ✅ NextAuth.js configuration (OAuth placeholder)
- ✅ Basic page structure (home, login, anagram finder)
- ✅ Type definitions for domain models
- ✅ Folder structure following best practices
- ✅ ESLint and Prettier configuration
- ✅ Environment variables template

## Next Steps (Phase 2+)

1. **Phase 2: Project Setup** - Currently in progress
2. **Phase 3: Authentication System** - Implement full OAuth flow
3. **Phase 4: Word List Integration** - Fetch and cache word list
4. **Phase 5: Anagram Algorithm** - Implement core functionality
5. **Phase 6: Core UI Components** - Real-time search and results
6. **Phase 7: User Experience Polish** - Loading states, animations
7. **Phase 8: Test Case Validation** - Verify all test cases
8. **Phase 9: Final Delivery** - Documentation and deployment

## Support

For issues or questions, please refer to:
- [CLAUDE.md](./CLAUDE.md) - Project overview and requirements
- [docs/PLAN.md](./docs/PLAN.md) - Detailed development plan
- [README.md](./README.md) - Original project description

## License

This is a coding challenge project for Real Links.
