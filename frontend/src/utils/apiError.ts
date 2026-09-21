/**
 * apiError.ts
 *
 * Extracts a human-readable message out of an unknown thrown value,
 * falling back to a caller-supplied message for non-API failures.
 */

import { isAxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string' && detail.trim()) return detail
    if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') return detail[0].msg
  }
  return fallback
}
