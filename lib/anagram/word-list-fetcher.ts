/**
 * Word List Fetcher
 *
 * Handles downloading the word list from the remote source
 * Uses configuration from environment variables
 */

import { getConfig } from '../config';

export interface FetchWordListResult {
  success: boolean;
  words?: string[];
  error?: string;
}

/**
 * Fetches the word list from the configured URL
 * Returns an array of words, one per line
 *
 * @returns Promise with success status and words array or error message
 */
export async function fetchWordList(): Promise<FetchWordListResult> {
  const config = getConfig();
  const url = config.wordList.url;

  try {
    console.log(`[WordList] Fetching word list from ${url}...`);
    const startTime = Date.now();

    const response = await fetch(url, {
      // Cache based on config
      next: { revalidate: config.wordList.cacheRevalidate }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch word list: ${response.status} ${response.statusText}`
      };
    }

    const text = await response.text();
    const words = text
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    const duration = Date.now() - startTime;
    console.log(`[WordList] Successfully fetched ${words.length} words in ${duration}ms`);

    return {
      success: true,
      words
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WordList] Error fetching word list:', errorMessage);

    return {
      success: false,
      error: `Failed to fetch word list: ${errorMessage}`
    };
  }
}
