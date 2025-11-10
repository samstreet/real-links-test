/**
 * Central Type Export
 *
 * Single entry point for all type definitions
 * Provides organized exports for consumers
 */

// Authentication types
export type {
  AuthProvider,
  User,
  Session,
  AuthToken,
  AuthCredentials,
  OAuthConfig,
  AuthError,
  AuthResult,
  AuthState,
} from './auth.types';

// Anagram domain types
export type {
  Word,
  CharacterSignature,
  SearchQuery,
  NormalizedQuery,
  AnagramMatch,
  AnagramResult,
  WordListStats,
  SearchError,
  SearchResult,
  WordListLoadResult,
  SearchState,
  SortOrder,
  SearchOptions,
} from './anagram.types';

// API types
export type {
  HttpMethod,
  HttpStatusCode,
  ApiErrorCode,
  ValidationError,
  ApiError,
  ApiSuccess,
  ApiFailure,
  ApiResponse,
  ApiResponseMeta,
  PaginationMeta,
  PaginatedResponse,
  ApiRequestConfig,
  ApiClientOptions,
  ExtractApiData,
  AsyncResult,
} from './api.types';

export { isApiSuccess, isApiFailure } from './api.types';

// Service interfaces
export type {
  IAnagramSearchService,
  IWordListProvider,
  IAuthenticationService,
  ICacheService,
  ILogger,
  IWordNormalizer,
  IAnagramMatcher,
  ServiceContainer,
  ServiceFactory,
} from './services.types';

// Configuration types
export type {
  Environment,
  LogLevel,
  AppConfig,
  AuthConfig,
  WordListConfig,
  SearchConfig,
  CacheConfig,
  LoggerConfig,
  PerformanceConfig,
  FeatureFlags,
  Configuration,
  IConfigurationLoader,
  EnvironmentVariables,
} from './config.types';

// Component props types
export type {
  BaseComponentProps,
  AuthButtonProps,
  LoginFormProps,
  AuthGuardProps,
  UserProfileProps,
  SearchInputProps,
  SearchFormProps,
  SearchControlsProps,
  AnagramResultsProps,
  AnagramListProps,
  AnagramItemProps,
  EmptyStateProps,
  ErrorStateProps,
  LoadingStateProps,
  LayoutProps,
  HeaderProps,
  FooterProps,
  ButtonProps,
  InputProps,
  CardProps,
  BadgeProps,
  TooltipProps,
  FormProps,
  FormFieldProps,
  AriaProps,
  ComponentState,
  ClickHandler,
  SubmitHandler,
  ChangeHandler,
  ErrorHandler,
} from './components.types';
