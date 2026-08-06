/**
 * colors.ts — Design System Color Tokens
 *
 * Define the brand color palette here.
 * Use HSL values for easy Tailwind CSS integration.
 *
 * Naming convention:
 *   <role>-<shade>
 *   e.g., primary-500, surface-100, error-600
 */

export const colors = {
  // TODO: Define brand color palette
  // primary: { ... },
  // secondary: { ... },
  // surface: { ... },
  // error: { ... },
  // warning: { ... },
  // success: { ... },
  // info: { ... },
} as const

export type ColorToken = keyof typeof colors
