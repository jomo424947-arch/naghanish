/**
 * ThemeProvider.tsx
 *
 * Manages application-wide theme (light / dark / system).
 * Reads from localStorage and applies the correct class to <html>.
 */
import type { ReactNode } from 'react';
interface ThemeProviderProps {
    children: ReactNode;
}
export declare function ThemeProvider({ children }: ThemeProviderProps): import("react").JSX.Element;
export {};
