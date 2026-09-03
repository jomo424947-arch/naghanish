/**
 * AuthContext.tsx
 *
 * Raw React context for authentication state.
 * Consumed by AuthProvider and useAuth hook.
 */
import type { User } from '@types/user.types';
export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export declare const AuthContext: import("react").Context<AuthContextValue | null>;
