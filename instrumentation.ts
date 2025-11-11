/**
 * Next.js Instrumentation Hook
 *
 * This file is called once when the Next.js server starts up
 * Perfect for initialising the word list cache
 */

export async function register() {
  // Only run on server (not edge runtime)
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }

  // Load word list cache on startup
  const { wordListProvider } = await import('./lib/anagram');

  try {
    await wordListProvider.load();

    const stats = wordListProvider.getStats();
    if (stats) {
      console.log(
        `✓ Word list loaded: ${stats.totalWords.toLocaleString()} words, ` +
        `${stats.uniqueSignatures.toLocaleString()} unique signatures`
      );
    }
  } catch (error) {
    console.error('✗ Failed to load word list:', error);
    // Don't throw - let the app start, but search will fail gracefully
  }
}
