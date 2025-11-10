/**
 * API Type Definitions
 *
 * Following SOLID principles:
 * - Single Responsibility: Each type represents a single API concern
 * - Open/Closed: Extensible response types with proper error handling
 * - Dependency Inversion: Generic response types for any data payload
 */

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * HTTP status codes
 */
export type HttpStatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 502 | 503;

/**
 * API error codes
 * Application-specific error codes for client handling
 */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN_ERROR';

/**
 * Validation error detail
 * Specific field-level validation error
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: unknown;
}

/**
 * API error response
 * Standardized error response structure
 */
export interface ApiError {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly statusCode: HttpStatusCode;
  readonly timestamp: string;
  readonly path?: string;
  readonly validationErrors?: ReadonlyArray<ValidationError>;
  readonly details?: Record<string, unknown>;
}

/**
 * Successful API response
 * Generic wrapper for successful responses
 */
export interface ApiSuccess<T = unknown> {
  readonly success: true;
  readonly data: T;
  readonly timestamp: string;
  readonly meta?: ApiResponseMeta;
}

/**
 * Failed API response
 * Wrapper for error responses
 */
export interface ApiFailure {
  readonly success: false;
  readonly error: ApiError;
}

/**
 * API response type
 * Discriminated union for all API responses
 */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFailure;

/**
 * Response metadata
 * Additional information about the response
 */
export interface ApiResponseMeta {
  readonly requestId?: string;
  readonly duration?: number;
  readonly pagination?: PaginationMeta;
  readonly version?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  readonly items: ReadonlyArray<T>;
  readonly pagination: PaginationMeta;
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers?: Record<string, string>;
  readonly body?: unknown;
  readonly timeout?: number;
  readonly signal?: AbortSignal;
}

/**
 * API client options
 */
export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly timeout?: number;
  readonly headers?: Record<string, string>;
  readonly retries?: number;
  readonly retryDelay?: number;
}

/**
 * Type guard for API success response
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

/**
 * Type guard for API failure response
 */
export function isApiFailure(response: ApiResponse): response is ApiFailure {
  return response.success === false;
}

/**
 * Extract data type from API response
 */
export type ExtractApiData<T> = T extends ApiResponse<infer D> ? D : never;

/**
 * Async operation result
 * Generic result type for async operations
 */
export type AsyncResult<T, E = ApiError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };
