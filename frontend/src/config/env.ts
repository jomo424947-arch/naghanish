/**
 * env.ts
 *
 * Typed environment variable access.
 * All process.env / import.meta.env reads should go through this module.
 */

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

export type AppEnv = 'development' | 'staging' | 'production'
