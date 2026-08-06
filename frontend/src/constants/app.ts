/**
 * app.ts — Application-wide constants
 */

export const APP_NAME = 'Naghanish'
export const APP_VERSION = '0.1.0'

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Timing constants (ms)
export const DEBOUNCE_DELAY = 300
export const TOAST_DURATION = 5000
export const SESSION_TIMEOUT = 1000 * 60 * 30 // 30 minutes

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'naghanish:access_token',
  REFRESH_TOKEN: 'naghanish:refresh_token',
  THEME: 'naghanish:theme',
  LOCALE: 'naghanish:locale',
} as const
