// Frontend constants and configuration

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Debounce delays (ms)
export const SEARCH_DEBOUNCE_DELAY = 300;
export const INPUT_DEBOUNCE_DELAY = 500;

// Toast durations (ms)
export const TOAST_DURATION = 3000;
export const ERROR_TOAST_DURATION = 5000;
export const SUCCESS_TOAST_DURATION = 2000;

// Retry configuration
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000;

// Session storage keys
export const STORAGE_KEYS = {
  SESSION: 'session',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Crop growth stages
export const CROP_STAGES = [
  'seedling',
  'vegetative',
  'flowering',
  'fruiting',
  'harvest',
] as const;

// Date formats
export const DATE_FORMAT = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  IDENTIFY: '/identify',
  CHAT: '/chat',
  ALERTS: '/alerts',
  SPRAY_LOG: '/spray-log',
  COMMUNITY: '/community',
  PROFILE: '/profile',
} as const;
