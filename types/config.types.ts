/**
 * Configuration Type Definitions
 *
 * Following SOLID principles:
 * - Single Responsibility: Each config represents a specific concern
 * - Open/Closed: Extensible through optional properties
 */

import type { AuthProvider } from './auth.types';

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Application configuration
 * Main configuration for the entire application
 */
export interface AppConfig {
  readonly env: Environment;
  readonly debug: boolean;
  readonly baseUrl: string;
  readonly apiUrl: string;
  readonly version: string;
}

/**
 * Authentication configuration
 * Configuration for auth services
 */
export interface AuthConfig {
  readonly providers: ReadonlyArray<AuthProvider>;
  readonly sessionTimeout: number; // seconds
  readonly google?: {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly callbackUrl: string;
  };
  readonly github?: {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly callbackUrl: string;
  };
}

/**
 * Word list configuration
 * Configuration for word list loading and caching
 */
export interface WordListConfig {
  readonly sourceUrl: string;
  readonly cacheEnabled: boolean;
  readonly cacheTtl: number; // seconds
  readonly preload: boolean;
  readonly minWordLength: number;
  readonly maxWordLength: number;
}

/**
 * Search configuration
 * Configuration for search behavior
 */
export interface SearchConfig {
  readonly maxResults: number;
  readonly timeout: number; // milliseconds
  readonly defaultSortOrder: 'alphabetical' | 'length' | 'confidence';
  readonly cacheResults: boolean;
  readonly cacheTtl: number; // seconds
}

/**
 * Cache configuration
 * Configuration for caching layer
 */
export interface CacheConfig {
  readonly enabled: boolean;
  readonly defaultTtl: number; // seconds
  readonly maxSize?: number; // number of items
  readonly strategy: 'memory' | 'redis' | 'localStorage';
  readonly redis?: {
    readonly host: string;
    readonly port: number;
    readonly password?: string;
    readonly db: number;
  };
}

/**
 * Logger configuration
 * Configuration for logging
 */
export interface LoggerConfig {
  readonly level: LogLevel;
  readonly enabled: boolean;
  readonly pretty: boolean;
  readonly destination?: 'console' | 'file' | 'external';
  readonly file?: {
    readonly path: string;
    readonly maxSize: number; // bytes
    readonly maxFiles: number;
  };
}

/**
 * Performance configuration
 * Configuration for performance optimizations
 */
export interface PerformanceConfig {
  readonly enableCompression: boolean;
  readonly enableCaching: boolean;
  readonly maxConcurrentRequests: number;
  readonly requestTimeout: number; // milliseconds
  readonly enableMetrics: boolean;
}

/**
 * Feature flags
 * Toggle features on/off without code changes
 */
export interface FeatureFlags {
  readonly enableAdvancedSearch: boolean;
  readonly enableSearchHistory: boolean;
  readonly enableAnalytics: boolean;
  readonly enableExperimentalFeatures: boolean;
  readonly maxSearchResultsOverride?: number;
}

/**
 * Complete configuration
 * Root configuration object containing all configs
 */
export interface Configuration {
  readonly app: AppConfig;
  readonly auth: AuthConfig;
  readonly wordList: WordListConfig;
  readonly search: SearchConfig;
  readonly cache: CacheConfig;
  readonly logger: LoggerConfig;
  readonly performance: PerformanceConfig;
  readonly features: FeatureFlags;
}

/**
 * Configuration loader interface
 * Abstraction for loading configuration from different sources
 */
export interface IConfigurationLoader {
  /**
   * Load configuration from source
   */
  load(): Promise<Configuration>;

  /**
   * Reload configuration
   */
  reload(): Promise<Configuration>;

  /**
   * Get specific config section
   */
  get<K extends keyof Configuration>(key: K): Configuration[K];

  /**
   * Validate configuration
   */
  validate(config: Configuration): boolean;
}

/**
 * Environment variable mappings
 */
export interface EnvironmentVariables {
  readonly NODE_ENV: Environment;
  readonly NEXT_PUBLIC_BASE_URL: string;
  readonly NEXT_PUBLIC_API_URL: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly NEXTAUTH_SECRET: string;
  readonly NEXTAUTH_URL: string;
  readonly WORD_LIST_URL: string;
  readonly REDIS_URL?: string;
  readonly LOG_LEVEL: LogLevel;
}
