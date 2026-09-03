/**
 * GuestGuard.tsx
 *
 * Prevents authenticated users from accessing guest-only pages
 * (e.g., Login, Register). Redirects them to the home page.
 */

import { Outlet, Navigate } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
// TODO: import { useAuthStore } from '@store/authStore'

export function GuestGuard() {
  // TODO: Read auth state from store
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAuthenticated = false // placeholder — always guest until auth is implemented

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
