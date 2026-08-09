/**
 * themeStore.ts
 *
 * Theme preference state (light / dark / system) with DOM class toggling.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create()(persist((set, get) => ({
    theme: 'dark',
    language: 'ar',
    dir: 'rtl',
    soundEnabled: true,
    notificationsEnabled: true,
    setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemDark ? 'dark' : 'light');
        }
        else {
            root.classList.add(theme);
        }
    },
    toggleTheme: () => {
        const current = get().theme;
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
    },
    setLanguage: (lang) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        set({ language: lang, dir });
    },
    setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
}), {
    name: 'naghanish-theme-storage',
}));
