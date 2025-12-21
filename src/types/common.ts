// Common type definitions and utility types

export type Language = 'en' | 'hi';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'farmer' | 'expert' | 'admin';

export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Form state types
export interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Translation function type
export type TranslationFunction = (key: string, defaultValue?: string) => string;
