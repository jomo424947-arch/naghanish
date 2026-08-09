/**
 * QueryProvider.tsx
 *
 * TanStack Query (React Query) provider.
 * Configure the QueryClient defaults here.
 */
import type { ReactNode } from 'react';
interface QueryProviderProps {
    children: ReactNode;
}
export declare function QueryProvider({ children }: QueryProviderProps): import("react").JSX.Element;
export {};
