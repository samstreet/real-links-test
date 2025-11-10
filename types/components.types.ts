/**
 * Component Props Type Definitions
 *
 * Following SOLID principles:
 * - Single Responsibility: Each prop type for a specific component
 * - Interface Segregation: Minimal, focused prop interfaces
 * - Open/Closed: Extensible through composition and optional props
 */

import type { AnagramResult, SortOrder } from './anagram.types';
import type { User, Session } from './auth.types';
import type { ReactNode, FormEvent, ChangeEvent } from 'react';
// Phase 2+ imports - will be used when implementing full functionality
// import type { SearchState, SearchOptions } from './anagram.types';
// import type { AuthState } from './auth.types';

/**
 * Common component props
 */
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly testId?: string;
}

/**
 * Authentication component props
 */
export interface AuthButtonProps extends BaseComponentProps {
  readonly onSignIn?: () => void | Promise<void>;
  readonly onSignOut?: () => void | Promise<void>;
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
}

export interface LoginFormProps extends BaseComponentProps {
  readonly onSubmit: (email: string, password: string) => void | Promise<void>;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export interface AuthGuardProps extends BaseComponentProps {
  readonly session: Session | null;
  readonly isLoading?: boolean;
  readonly redirectTo?: string;
  readonly fallback?: ReactNode;
}

export interface UserProfileProps extends BaseComponentProps {
  readonly user: User;
  readonly onSignOut?: () => void | Promise<void>;
  readonly showEmail?: boolean;
}

/**
 * Search component props
 */
export interface SearchInputProps extends BaseComponentProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSearch: (value: string) => void | Promise<void>;
  readonly placeholder?: string;
  readonly isSearching?: boolean;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly maxLength?: number;
}

export interface SearchFormProps extends BaseComponentProps {
  readonly onSubmit: (query: string) => void | Promise<void>;
  readonly initialValue?: string;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export interface SearchControlsProps extends BaseComponentProps {
  readonly sortOrder: SortOrder;
  readonly onSortChange: (order: SortOrder) => void;
  readonly maxResults?: number;
  readonly onMaxResultsChange?: (max: number) => void;
  readonly disabled?: boolean;
}

/**
 * Results component props
 */
export interface AnagramResultsProps extends BaseComponentProps {
  readonly result: AnagramResult | null;
  readonly isLoading?: boolean;
  readonly error?: string;
  readonly emptyMessage?: string;
  readonly sortOrder?: SortOrder;
}

export interface AnagramListProps extends BaseComponentProps {
  readonly matches: ReadonlyArray<string>;
  readonly highlightOriginal?: boolean;
  readonly originalWord?: string;
  readonly maxDisplay?: number;
}

export interface AnagramItemProps extends BaseComponentProps {
  readonly word: string;
  readonly isOriginal?: boolean;
  readonly index: number;
  readonly onClick?: (word: string) => void;
}

export interface EmptyStateProps extends BaseComponentProps {
  readonly message: string;
  readonly icon?: ReactNode;
  readonly action?: ReactNode;
}

export interface ErrorStateProps extends BaseComponentProps {
  readonly message: string;
  readonly error?: Error;
  readonly onRetry?: () => void;
  readonly showDetails?: boolean;
}

export interface LoadingStateProps extends BaseComponentProps {
  readonly message?: string;
  readonly size?: 'small' | 'medium' | 'large';
}

/**
 * Layout component props
 */
export interface LayoutProps extends BaseComponentProps {
  readonly session: Session | null;
  readonly title?: string;
  readonly description?: string;
}

export interface HeaderProps extends BaseComponentProps {
  readonly session: Session | null;
  readonly onSignOut?: () => void | Promise<void>;
}

export interface FooterProps extends BaseComponentProps {
  readonly version?: string;
  readonly links?: ReadonlyArray<{ label: string; href: string }>;
}

/**
 * UI component props
 */
export interface ButtonProps extends BaseComponentProps {
  readonly onClick?: () => void | Promise<void>;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  readonly size?: 'small' | 'medium' | 'large';
  readonly disabled?: boolean;
  readonly isLoading?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
}

export interface InputProps extends BaseComponentProps {
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly type?: 'text' | 'email' | 'password' | 'search';
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly autoFocus?: boolean;
  readonly maxLength?: number;
}

export interface CardProps extends BaseComponentProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly footer?: ReactNode;
  readonly padding?: 'none' | 'small' | 'medium' | 'large';
  readonly shadow?: 'none' | 'small' | 'medium' | 'large';
}

export interface BadgeProps extends BaseComponentProps {
  readonly variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  readonly size?: 'small' | 'medium' | 'large';
}

export interface TooltipProps extends BaseComponentProps {
  readonly content: ReactNode;
  readonly placement?: 'top' | 'right' | 'bottom' | 'left';
  readonly delay?: number;
}

/**
 * Form handling types
 */
export interface FormProps extends BaseComponentProps {
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export interface FormFieldProps extends BaseComponentProps {
  readonly label: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly helperText?: string;
}

/**
 * Accessibility props
 */
export interface AriaProps {
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-live'?: 'polite' | 'assertive' | 'off';
  readonly 'aria-busy'?: boolean;
  readonly 'aria-disabled'?: boolean;
  readonly role?: string;
}

/**
 * Component state props
 */
export interface ComponentState {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isDisabled: boolean;
}

/**
 * Event handler types
 */
export type ClickHandler = () => void | Promise<void>;
export type SubmitHandler = (event: FormEvent) => void | Promise<void>;
export type ChangeHandler = (value: string) => void;
export type ErrorHandler = (error: Error) => void;
