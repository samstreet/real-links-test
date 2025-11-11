/**
 * Anagram Search API Route
 *
 * POST /api/anagram/search
 * Searches for anagrams of the provided input
 */

import { NextRequest, NextResponse } from "next/server";
import { anagramSearchService } from "@/lib/anagram";
import type { SearchQuery, SearchOptions } from "@/types/anagram.types";

export async function POST(request: NextRequest) {
  try {
    // TEMP: Skip authentication for testing
    // const session = await getServerSession(authOptions);
    // if (!session) { ... }

    // Parse request body
    const body = await request.json();
    const { input, options }: { input: string; options?: SearchOptions } = body;

    // Validate input exists
    if (input === undefined || input === null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Input is required",
            statusCode: 400,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Create search query
    const query: SearchQuery = { input };

    // Ensure word list is loaded (fallback in case instrumentation hasn't run yet)
    const { wordListProvider } = await import("@/lib/anagram");
    if (!wordListProvider.isLoaded()) {
      try {
        await wordListProvider.load();
      } catch (error) {
        console.error("[API] Failed to load word list:", error);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SERVICE_UNAVAILABLE",
              message: "Failed to load word list. Please try again later.",
              statusCode: 503,
              timestamp: new Date().toISOString(),
            },
          },
          { status: 503 }
        );
      }
    }

    // Perform search
    const result = await anagramSearchService.search(query, options);

    if (!result.success) {
      return NextResponse.json(result, {
        status: result.error.statusCode,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API] Anagram search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
