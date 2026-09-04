/**
 * authStore.ts
 *
 * User authentication, profile, onboarding, and interest selection state.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  level: number
  xp: number
  maxXp: number
  coins: number
  rank: string
  interests: string[]
  bio?: string
  favoriteCategory?: string
  hasCompletedOnboarding: boolean
  hasCompletedProfileSetup: boolean
}

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  selectedInterests: string[]
  pendingEmailForOtp: string | null
  refreshToken: string | null
}

interface AuthActions {
  login: (user: Partial<UserProfile>, token?: string, refreshToken?: string) => void
  logout: () => void
  setPendingEmail: (email: string) => void
  setInterests: (interests: string[]) => void
  toggleInterest: (interestId: string) => void
  updateProfile: (profileData: Partial<UserProfile>) => void
  completeOnboarding: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      selectedInterests: [],
      pendingEmailForOtp: null,

      login: (userData, token = '', refreshToken = '') => {
        const currentUser = get().user
        const mergedUser: UserProfile = {
          id: userData.id || currentUser?.id || `usr_${Date.now()}`,
          name: userData.name || currentUser?.name || 'لاعب نغنِش',
          username: userData.username || currentUser?.username || 'player',
          email: userData.email || currentUser?.email || '',
          avatar: userData.avatar || currentUser?.avatar || '/avatars/mascot-1.svg',
          level: userData.level ?? currentUser?.level ?? 1,
          xp: userData.xp ?? currentUser?.xp ?? 0,
          maxXp: userData.maxXp ?? currentUser?.maxXp ?? 1000,
          coins: userData.coins ?? currentUser?.coins ?? 100,
          rank: userData.rank || currentUser?.rank || '#--',
          interests: userData.interests || currentUser?.interests || [],
          bio: userData.bio || currentUser?.bio || '',
          favoriteCategory: userData.favoriteCategory || currentUser?.favoriteCategory || '',
          hasCompletedOnboarding: userData.hasCompletedOnboarding ?? currentUser?.hasCompletedOnboarding ?? false,
          hasCompletedProfileSetup: userData.hasCompletedProfileSetup ?? currentUser?.hasCompletedProfileSetup ?? false,
        }
        set({
          user: mergedUser,
          token: token || get().token,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: Boolean(token || get().token),
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          selectedInterests: [],
          pendingEmailForOtp: null,
        })
      },

      setPendingEmail: (email: string) => {
        set({ pendingEmailForOtp: email })
      },

      setInterests: (interests: string[]) => {
        set({ selectedInterests: interests })
        if (get().user) {
          set({ user: { ...get().user!, interests } })
        }
      },

      toggleInterest: (interestId: string) => {
        const current = get().selectedInterests
        const updated = current.includes(interestId)
          ? current.filter((id) => id !== interestId)
          : [...current, interestId]
        set({ selectedInterests: updated })
        if (get().user) {
          set({ user: { ...get().user!, interests: updated } })
        }
      },

      updateProfile: (profileData: Partial<UserProfile>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...profileData },
          })
        }
      },

      completeOnboarding: () => {
        if (get().user) {
          set({ user: { ...get().user!, hasCompletedOnboarding: true } })
        }
      },
    }),
    {
      name: 'naghanish-auth-storage',
    }
  )
)
