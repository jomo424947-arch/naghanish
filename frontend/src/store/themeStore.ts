/**
 * themeStore.ts
 *
 * Theme preference state (light / dark / system) with DOM class toggling.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light' | 'system'
export type LanguageMode = 'ar' | 'en'

interface ThemeState {
  theme: ThemeMode
  language: LanguageMode
  dir: 'rtl' | 'ltr'
  soundEnabled: boolean
  notificationsEnabled: boolean
}

interface ThemeActions {
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setLanguage: (lang: LanguageMode) => void
  setSoundEnabled: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'ar',
      dir: 'rtl',
      soundEnabled: true,
      notificationsEnabled: true,

      setTheme: (theme: ThemeMode) => {
        set({ theme })
        const root = document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          root.classList.add(systemDark ? 'dark' : 'light')
        } else {
          root.classList.add(theme)
        }
      },

      toggleTheme: () => {
        const current = get().theme
        const nextTheme = current === 'dark' ? 'light' : 'dark'
        get().setTheme(nextTheme)
      },

      setLanguage: (lang: LanguageMode) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.dir = dir
        document.documentElement.lang = lang
        set({ language: lang, dir })
      },

      setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
      setNotificationsEnabled: (notificationsEnabled: boolean) => set({ notificationsEnabled }),
    }),
    {
      name: 'naghanish-theme-storage',
    }
  )
)
