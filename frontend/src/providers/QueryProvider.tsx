/**
 * QueryProvider.tsx
 *
 * TanStack Query (React Query) provider.
 * Configure the QueryClient defaults here.
 */

import type { ReactNode } from 'react'
// TODO: import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface QueryProviderProps {
  children: ReactNode
}

// TODO: Initialize QueryClient with default options
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//       retry: 1,
//     },
//   },
// })

export function QueryProvider({ children }: QueryProviderProps) {
  // TODO: return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  return <>{children}</>
}
