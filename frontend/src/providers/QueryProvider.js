import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// TODO: Initialize QueryClient with default options
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//       retry: 1,
//     },
//   },
// })
export function QueryProvider({ children }) {
    // TODO: return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    return _jsx(_Fragment, { children: children });
}
