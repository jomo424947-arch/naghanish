/**
 * themeStore.ts
 *
 * Theme preference state (light / dark / system) with DOM class toggling.
 */
export type ThemeMode = 'dark' | 'light' | 'system';
export type LanguageMode = 'ar' | 'en';
interface ThemeState {
    theme: ThemeMode;
    language: LanguageMode;
    dir: 'rtl' | 'ltr';
    soundEnabled: boolean;
    notificationsEnabled: boolean;
}
interface ThemeActions {
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    setLanguage: (lang: LanguageMode) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
}
type ThemeStore = ThemeState & ThemeActions;
export declare const useThemeStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ThemeStore>, "setState" | "persist"> & {
    setState(partial: ThemeStore | Partial<ThemeStore> | ((state: ThemeStore) => ThemeStore | Partial<ThemeStore>), replace?: false | undefined): unknown;
    setState(state: ThemeStore | ((state: ThemeStore) => ThemeStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ThemeStore, ThemeStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ThemeStore) => void) => () => void;
        onFinishHydration: (fn: (state: ThemeStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ThemeStore, ThemeStore, unknown>>;
    };
}>;
export {};
