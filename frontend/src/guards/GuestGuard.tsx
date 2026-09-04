/**
 * GuestGuard.tsx
 *
 * Prevents authenticated users from accessing guest-only pages
 * (e.g., Login, Register). Redirects them to the home page.
 */

import { Outlet, Navigate } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'

export function GuestGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
