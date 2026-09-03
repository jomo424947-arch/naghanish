/**
 * AuthContext.tsx
 *
 * Raw React context for authentication state.
 * Consumed by AuthProvider and useAuth hook.
 */
import { createContext } from 'react';
export const AuthContext = createContext(null);
