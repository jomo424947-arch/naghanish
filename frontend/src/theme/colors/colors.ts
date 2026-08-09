/**
 * colors.ts — Design System Color Tokens
 *
 * Source of truth for the brand palette. Mirrors the values actually
 * wired into tailwind.config.ts (`theme.extend.colors`) and the CSS
 * variables in styles/globals.css — kept here as documentation/reference
 * so the palette isn't only discoverable by reading the Tailwind config.
 *
 * Two kinds of colors on purpose:
 *  - Theme-aware roles (background, foreground, card, muted, border, ...)
 *    are driven by CSS variables (hsl(var(--x))) and flip automatically
 *    between the `:root` (dark) and `:root.light` blocks in globals.css.
 *    Always prefer these for text/background/border on regular UI.
 *  - Fixed brand accents (purple, blue, orange, gold, ...) are static
 *    hex values, identical in light and dark mode. Use these for icons,
 *    badges, chips, and small accents — never pair them with a `dark:`
 *    variant of a *different* raw Tailwind color (e.g. `text-purple-600
 *    dark:text-cyan-400`); that pairing only renders correctly if the
 *    `dark`/`light` class happens to be present, and silently breaks
 *    otherwise. Use the static brand token instead (`text-brand-purple`).
 */

export const colors = {
  brand: {
    purple: '#7C3AED',
    purpleDark: '#6D28D9',
    purpleLight: '#9333EA',
    blue: '#00D2FF',
    blueLight: '#38BDF8',
    cyan: '#06B6D4',
    orange: '#FF7315',
    gold: '#EAB308',
    green: '#10B981',
    pink: '#EC4899',
  },
  // Theme-aware roles — reference only. The actual values live as CSS
  // variables in styles/globals.css (`:root` = dark, `:root.light` = light)
  // and are consumed via Tailwind classes: bg-background, text-foreground,
  // bg-card, text-muted-foreground, border-border, bg-brand-card, etc.
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
