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
}

interface AuthActions {
  login: (user: Partial<UserProfile>, token?: string) => void
  logout: () => void
  setPendingEmail: (email: string) => void
  setInterests: (interests: string[]) => void
  toggleInterest: (interestId: string) => void
  updateProfile: (profileData: Partial<UserProfile>) => void
  completeOnboarding: () => void
}

type AuthStore = AuthState & AuthActions

const MOCK_USER: UserProfile = {
  id: 'usr_101',
  name: 'أحمد علي',
  username: 'ahmed_naghanish',
  email: 'ahmed@example.com',
  avatar: '/avatars/mascot-1.svg',
  level: 12,
  xp: 2450,
  maxXp: 3500,
  coins: 2350,
  rank: '#2',
  interests: ['brain', 'party', 'memory', 'speed'],
  bio: 'متحمس للألعاب الذهنية والتحديات! 🧠🎮',
  favoriteCategory: 'Brain Games',
  hasCompletedOnboarding: false,
  hasCompletedProfileSetup: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: MOCK_USER,
      token: 'demo-token-12345',
      isAuthenticated: true,
      selectedInterests: ['brain', 'party', 'memory', 'speed'],
      pendingEmailForOtp: null,

      login: (userData, token = 'demo-token-12345') => {
        const currentUser = get().user || MOCK_USER
        set({
          user: { ...currentUser, ...userData },
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
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
        const currentUser = get().user || MOCK_USER
        set({
          user: { ...currentUser, ...profileData },
        })
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
