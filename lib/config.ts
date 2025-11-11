/**
 * Application Configuration
 *
 * Centralized configuration loader for all app settings
 * Follows SOLID principles - Single source of truth for config
 */

export interface AppConfig {
  wordList: {
    url: string;
    cacheRevalidate: number; // seconds
  };
  auth: {
    nextAuthUrl: string;
    nextAuthSecret: string;
    googleClientId: string;
    googleClientSecret: string;
  };
  environment: string;
}

/**
 * Loads application configuration from environment variables
 * Provides sensible defaults where appropriate
 */
export function loadConfig(): AppConfig {
  return {
    wordList: {
      url: process.env.WORD_LIST_URL || 'https://raw.githubusercontent.com/dwyl/english-words/master/words.txt',
      cacheRevalidate: 86400, // 24 hours
    },
    auth: {
      nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    environment: process.env.NODE_ENV || 'development',
  };
}

/**
 * Singleton config instance
 */
let configInstance: AppConfig | null = null;

/**
 * Gets the application configuration (singleton pattern)
 */
export function getConfig(): AppConfig {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}

/**
 * Gets the word list URL from configuration
 */
export function getWordListUrl(): string {
  return getConfig().wordList.url;
}
