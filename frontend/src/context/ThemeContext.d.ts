/**
 * ThemeContext.tsx
 *
 * Raw React context for theme state.
 * Consumed by ThemeProvider and useTheme hook.
 */
export type Theme = 'light' | 'dark' | 'system';
export interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}
export declare const ThemeContext: import("react").Context<ThemeContextValue | null>;
