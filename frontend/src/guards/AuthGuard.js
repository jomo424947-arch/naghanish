import { jsx as _jsx } from "react/jsx-runtime";
/**
 * AuthGuard.tsx
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page.
 *
 * Usage: Wrap protected <Route> elements with <AuthGuard>
 */
import { Outlet, Navigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
// TODO: import { useAuthStore } from '@store/authStore'
export function AuthGuard() {
    // TODO: Read auth state from store
    // const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const isAuthenticated = true; // placeholder — always authenticated until auth is implemented
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: ROUTES.LOGIN, replace: true });
    }
    return _jsx(Outlet, {});
}
