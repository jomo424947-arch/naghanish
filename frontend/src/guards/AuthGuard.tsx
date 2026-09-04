/**
 * AuthGuard.tsx
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page.
 *
 * Usage: Wrap protected <Route> elements with <AuthGuard>
 */

import { Outlet, Navigate } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
