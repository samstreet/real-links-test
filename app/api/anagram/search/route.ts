/**
 * Anagram Search API Route
 *
 * POST /api/anagram/search
 * Searches for anagrams of the provided input
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { anagramSearchService } from '@/lib/anagram';
import type { SearchQuery, SearchOptions } from '@/types/anagram.types';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'You must be logged in to search for anagrams',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { input, options }: { input: string; options?: SearchOptions } = body;

    // Validate input exists
    if (input === undefined || input === null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input is required',
            statusCode: 400,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Create search query
    const query: SearchQuery = { input };

    // Perform search
    const result = await anagramSearchService.search(query, options);

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.error.statusCode,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API] Anagram search error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
