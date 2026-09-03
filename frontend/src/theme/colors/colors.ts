/**
 * colors.ts — Design System Color Tokens
 *
 * Source of truth for the brand palette.
 * - Base background: deep black / near-black (#0A0A0C - #121217)
 * - Primary accent: warm energetic orange (#F97316 / #FB7A2B)
 * - Supporting neutral: white/off-white for headings, muted gray for secondary text
 * - World themes: distinct non-orange accent colors
 */

export const colors = {
  brand: {
    orange: '#F97316',
    orangeWarm: '#FB7A2B',
    orangeHover: '#EA580C',
    purple: '#7C3AED',
    purpleDark: '#6D28D9',
    purpleLight: '#9333EA',
    blue: '#00D2FF',
    blueLight: '#38BDF8',
    cyan: '#06B6D4',
    teal: '#14B8A6',
    gold: '#EAB308',
    green: '#10B981',
    pink: '#EC4899',
    red: '#EF4444',
  },
  themeRoles: [
    'background',
    'foreground',
    'card',
    'popover',
    'primary',
    'secondary',
    'accent',
    'muted',
    'destructive',
    'border',
    'input',
    'ring',
    'brand-darkBg',
    'brand-surface',
    'brand-card',
    'brand-cardBorder',
  ],
} as const

export type BrandColorToken = keyof typeof colors.brand
