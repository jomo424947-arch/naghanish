/**
 * authStore.ts
 *
 * User authentication, profile, onboarding, and interest selection state.
 */
export interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    maxXp: number;
    coins: number;
    rank: string;
    interests: string[];
    bio?: string;
    favoriteCategory?: string;
    hasCompletedOnboarding: boolean;
    hasCompletedProfileSetup: boolean;
}
interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    selectedInterests: string[];
    pendingEmailForOtp: string | null;
}
interface AuthActions {
    login: (user: Partial<UserProfile>, token?: string) => void;
    logout: () => void;
    setPendingEmail: (email: string) => void;
    setInterests: (interests: string[]) => void;
    toggleInterest: (interestId: string) => void;
    updateProfile: (profileData: Partial<UserProfile>) => void;
    completeOnboarding: () => void;
}
type AuthStore = AuthState & AuthActions;
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthStore>, "setState" | "persist"> & {
    setState(partial: AuthStore | Partial<AuthStore> | ((state: AuthStore) => AuthStore | Partial<AuthStore>), replace?: false | undefined): unknown;
    setState(state: AuthStore | ((state: AuthStore) => AuthStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthStore, AuthStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthStore) => void) => () => void;
        onFinishHydration: (fn: (state: AuthStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthStore, AuthStore, unknown>>;
    };
}>;
export {};
