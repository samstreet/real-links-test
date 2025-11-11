/**
 * Next.js Instrumentation Hook
 *
 * This file is called once when the Next.js server starts up
 * Perfect for initialising the word list cache
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Starting server initialisation...');

    // Load word list cache on startup
    const { wordListProvider } = await import('./lib/anagram');

    try {
      console.log('[Instrumentation] Loading word list cache...');
      await wordListProvider.load();

      const stats = wordListProvider.getStats();
      if (stats) {
        console.log(
          `[Instrumentation] ✓ Word list loaded successfully:\n` +
          `  - Total words: ${stats.totalWords.toLocaleString()}\n` +
          `  - Unique signatures: ${stats.uniqueSignatures.toLocaleString()}\n` +
          `  - Source: ${stats.source}`
        );
      }
    } catch (error) {
      console.error('[Instrumentation] ✗ Failed to load word list:', error);
      // Don't throw - let the app start, but search will fail gracefully
    }
  }
}
