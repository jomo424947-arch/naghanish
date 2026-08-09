/**
 * AuthContext.tsx
 *
 * Raw React context for authentication state.
 * Consumed by AuthProvider and useAuth hook.
 */

import { createContext } from 'react'
import type { User } from '../types/user.types'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
