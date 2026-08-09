import { jsx as _jsx } from "react/jsx-runtime";
/**
 * App.tsx
 *
 * Root application component. Composes all providers and the router.
 * Add new global providers here in the correct order.
 */
import { AppProviders } from '@providers/AppProviders';
import { AppRouter } from '@routes/AppRouter';
export default function App() {
    return (_jsx(AppProviders, { children: _jsx(AppRouter, {}) }));
}
