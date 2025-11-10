/**
 * Authentication Type Definitions
 *
 * Following SOLID principles:
 * - Single Responsibility: Each type represents a single concept
 * - Interface Segregation: Focused, specific interfaces
 * - Open/Closed: Extensible through union types and optional properties
 */

/**
 * Authentication provider types
 * Extensible to support additional providers beyond Gmail
 */
export type AuthProvider = 'google' | 'github' | 'credentials';

/**
 * Core user identity
 * Represents the authenticated user's profile
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly image: string | null;
  readonly emailVerified: boolean;
}

/**
 * Authentication session
 * Represents an active authenticated session
 */
export interface Session {
  readonly user: User;
  readonly expiresAt: Date;
  readonly provider: AuthProvider;
}

/**
 * Authentication token
 * Used for API authentication and OAuth flows
 */
export interface AuthToken {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer' | 'Basic';
}

/**
 * Authentication credentials
 * Used for credential-based authentication flows
 */
export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * OAuth configuration
 * Configuration for OAuth providers
 */
export interface OAuthConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scope: string[];
}

/**
 * Authentication error types
 * Discriminated union for type-safe error handling
 */
export type AuthError =
  | { readonly type: 'UNAUTHORIZED'; readonly message: string }
  | { readonly type: 'INVALID_CREDENTIALS'; readonly message: string }
  | { readonly type: 'TOKEN_EXPIRED'; readonly message: string }
  | { readonly type: 'PROVIDER_ERROR'; readonly provider: AuthProvider; readonly message: string }
  | { readonly type: 'NETWORK_ERROR'; readonly message: string }
  | { readonly type: 'UNKNOWN_ERROR'; readonly message: string; readonly error?: unknown };

/**
 * Authentication result
 * Result type for authentication operations
 */
export type AuthResult<T = Session> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: AuthError };

/**
 * Authentication state
 * Represents the current authentication state
 */
export type AuthState =
  | { readonly status: 'loading' }
  | { readonly status: 'authenticated'; readonly session: Session }
  | { readonly status: 'unauthenticated' }
  | { readonly status: 'error'; readonly error: AuthError };
