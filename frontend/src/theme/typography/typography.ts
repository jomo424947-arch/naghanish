/**
 * typography.ts — Design System Typography Tokens
 *
 * Font families, sizes, weights, and line heights.
 * - Display/Headings: Alexandria (Google Fonts)
 * - Body/UI: Readex Pro (Google Fonts)
 * - Latin/Numbers: Plus Jakarta Sans (Google Fonts)
 */

export const typography = {
  fontFamily: {
    sans: ['Readex Pro', 'Alexandria', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    display: ['Alexandria', 'Readex Pro', 'Plus Jakarta Sans', 'sans-serif'],
    arabic: ['Alexandria', 'Readex Pro', 'sans-serif'],
    latin: ['Plus Jakarta Sans', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.65',
    loose: '1.8',
  },
} as const
