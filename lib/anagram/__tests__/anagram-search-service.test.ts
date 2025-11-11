/**
 * Unit Tests for AnagramSearchService
 *
 * Tests the core anagram search functionality with a subset of words
 */

import { describe, it, expect, beforeAll } from "vitest";
import { AnagramSearchService } from "../anagram-search-service";
import { wordListCache, type CachedWord } from "../word-list-cache";
import { generateSignature, normalise } from "../word-normaliser";
import { SortOrder } from "@/types/anagram.types";

/**
 * Test word list - subset of words to validate logic
 * Includes all words needed for the test cases
 */
const TEST_WORDS = [
  // Test case: "steak"
  "steak",
  "takes",
  "skate",
  "stake",
  "teaks",
  "Keats",
  "Skeat",

  // Test case: "eeenginr"
  "engineer",
  "re-engine",

  // Additional test words
  "iceman",
  "cinema",
  "Worth",
  "throw",
  "test",
  "hello",
  "world",
];

/**
 * Manually populate cache with test words
 * This simulates the word list being loaded
 */
function loadTestWordList() {
  // Clear any existing cache
  wordListCache.clear();

  // Manually build the signature map for testing
  const signatureMap = new Map<string, CachedWord[]>();

  for (const word of TEST_WORDS) {
    const normalized = normalise(word);
    const signature = generateSignature(normalized);

    const existing = signatureMap.get(signature);
    if (existing) {
      existing.push({ word, normalized });
    } else {
      signatureMap.set(signature, [{ word, normalized }]);
    }
  }

  // Use internal cache property (this is a test-only workaround)
  // In production, cache is loaded via fetchWordList
  (wordListCache as any).cache = signatureMap;
  (wordListCache as any).state = {
    status: "loaded",
    wordCount: TEST_WORDS.length,
    signatureCount: signatureMap.size,
  };
}

describe("AnagramSearchService", () => {
  let service: AnagramSearchService;

  beforeAll(() => {
    // Load test word list before running tests
    loadTestWordList();
    service = new AnagramSearchService();
  });

  describe("Test Case 1: Empty Input", () => {
    it("should return empty result for empty string", async () => {
      const result = await service.search({ input: "" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("");
        expect(result.data.matches).toEqual([]);
        expect(result.data.totalMatches).toBe(0);
        expect(result.data.isEmpty).toBe(true);
      }
    });

    it("should return empty result for whitespace-only input", async () => {
      const result = await service.search({ input: "   " });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isEmpty).toBe(true);
        expect(result.data.totalMatches).toBe(0);
      }
    });
  });

  describe("Test Case 2: No Anagrams Found", () => {
    it('should return empty matches for "asdfghjk"', async () => {
      const result = await service.search({ input: "asdfghjk" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("asdfghjk");
        expect(result.data.matches).toEqual([]);
        expect(result.data.totalMatches).toBe(0);
        expect(result.data.isEmpty).toBe(true);
      }
    });
  });

  describe('Test Case 3: "steak" Anagrams', () => {
    it('should find all anagrams of "steak"', async () => {
      const result = await service.search({ input: "steak" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("steak");
        expect(result.data.isEmpty).toBe(false);
        expect(result.data.totalMatches).toBeGreaterThan(0);

        // Extract word strings for easier comparison
        const words = result.data.matches.map((m) => m.word);

        // Should include all expected words
        expect(words).toContain("steak");
        expect(words).toContain("takes");
        expect(words).toContain("skate");
        expect(words).toContain("stake");
        expect(words).toContain("teaks");
        expect(words).toContain("Keats");
        expect(words).toContain("Skeat");

        // Should have exactly 7 matches (based on our test data)
        expect(result.data.totalMatches).toBe(7);
      }
    });

    it('should mark "steak" as original input', async () => {
      const result = await service.search({ input: "steak" });

      expect(result.success).toBe(true);
      if (result.success) {
        const steakMatch = result.data.matches.find((m) => m.word === "steak");
        expect(steakMatch).toBeDefined();
        expect(steakMatch?.isOriginalInput).toBe(true);
      }
    });

    it('should handle different casing for "steak"', async () => {
      const result = await service.search({ input: "STEAK" });

      expect(result.success).toBe(true);
      if (result.success) {
        // Should still find all matches (case-insensitive)
        expect(result.data.totalMatches).toBe(7);

        // "steak" should still be marked as original (normalised match)
        const steakMatch = result.data.matches.find((m) => m.word === "steak");
        expect(steakMatch?.isOriginalInput).toBe(true);
      }
    });
  });

  describe('Test Case 4: "eeenginr" Anagrams', () => {
    it('should find "engineer" and "re-engine"', async () => {
      const result = await service.search({ input: "eeenginr" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe("eeenginr");
        expect(result.data.isEmpty).toBe(false);

        const words = result.data.matches.map((m) => m.word);

        expect(words).toContain("engineer");
        expect(words).toContain("re-engine");
        expect(result.data.totalMatches).toBe(2);
      }
    });

    it("should handle hyphenated words correctly", async () => {
      // "re-engine" when normalised is "reengine" which matches "engineer" rearranged
      const result = await service.search({ input: "reengine" });

      expect(result.success).toBe(true);
      if (result.success) {
        const words = result.data.matches.map((m) => m.word);
        // Both should be found as they're anagrams
        expect(words).toContain("re-engine");
        expect(words).toContain("engineer");
      }
    });
  });

  describe("Additional Test Cases", () => {
    it('should find anagrams for "iceman"', async () => {
      const result = await service.search({ input: "iceman" });

      expect(result.success).toBe(true);
      if (result.success) {
        const words = result.data.matches.map((m) => m.word);
        expect(words).toContain("iceman");
        expect(words).toContain("cinema");
        expect(result.data.totalMatches).toBe(2);
      }
    });

    it('should find anagrams for "Worth"', async () => {
      const result = await service.search({ input: "Worth" });

      expect(result.success).toBe(true);
      if (result.success) {
        const words = result.data.matches.map((m) => m.word);
        expect(words).toContain("Worth");
        expect(words).toContain("throw");
        expect(result.data.totalMatches).toBe(2);
      }
    });
  });

  describe("Search Options", () => {
    it("should sort results alphabetically", async () => {
      const result = await service.search(
        { input: "steak" },
        { sortOrder: SortOrder.Alphabetical }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        const words = result.data.matches.map((m) => m.word);
        const sortedWords = [...words].sort((a, b) => a.localeCompare(b));
        expect(words).toEqual(sortedWords);
      }
    });

    it("should limit results with maxResults option", async () => {
      const result = await service.search(
        { input: "steak" },
        { maxResults: 3 }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.matches.length).toBe(3);
        expect(result.data.totalMatches).toBe(3);
      }
    });

    it("should filter by minimum word length", async () => {
      const result = await service.search(
        { input: "steak" },
        { minWordLength: 6 }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // All matches should be at least 6 characters
        for (const match of result.data.matches) {
          expect(match.word.length).toBeGreaterThanOrEqual(6);
        }
      }
    });

    it("should exclude original input when requested", async () => {
      const result = await service.search(
        { input: "steak" },
        { includeOriginal: false }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        // Should not include "steak"
        const words = result.data.matches.map((m) => m.word);
        expect(words).not.toContain("steak");

        // But should still have other matches
        expect(result.data.totalMatches).toBeGreaterThan(0);
      }
    });
  });

  describe("Service Status", () => {
    it("should report ready status", () => {
      expect(service.isReady()).toBe(true);
    });

    it("should return statistics", () => {
      const stats = service.getStats();

      expect(stats).not.toBeNull();
      expect(stats?.totalWords).toBe(TEST_WORDS.length);
      expect(stats?.uniqueSignatures).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in input", async () => {
      const result = await service.search({ input: "!!!invalid!!!" });

      expect(result.success).toBe(true);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should handle punctuation correctly", async () => {
      const result = await service.search({ input: "re-engine" });

      expect(result.success).toBe(true);
      if (result.success) {
        // Should find matches (punctuation ignored)
        const words = result.data.matches.map((m) => m.word);
        // "re-engine" normalised to "reengine" matches "engineer"
        expect(words).toContain("re-engine");
        expect(words).toContain("engineer");
      }
    });

    it("should handle numbers in input", async () => {
      const result = await service.search({ input: "3D" });

      expect(result.success).toBe(true);
      // May or may not have matches depending on test data
    });
  });
});
