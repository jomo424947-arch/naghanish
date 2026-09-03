/**
 * common.types.ts
 *
 * Shared utility types used across the entire application.
 */

/** Generic paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/** Generic API error */
export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

/** Nullable helper */
export type Nullable<T> = T | null

/** Optional helper */
export type Optional<T> = T | undefined

/** ID type alias */
export type ID = string

/** ISO date string */
export type ISODateString = string

/** Generic key-value record */
export type StringRecord = Record<string, string>
