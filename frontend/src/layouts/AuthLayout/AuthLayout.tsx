/**
 * AuthLayout.tsx
 *
 * Layout wrapper for unauthenticated pages (Login, Register, etc.).
 * Handles centering, background, and shared auth UI elements.
 */

import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  // TODO: Implement auth layout shell (centered card, background, logo)
  return <Outlet />
}
