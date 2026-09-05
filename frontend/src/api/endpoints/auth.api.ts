/**
 * endpoints/auth.api.ts
 *
 * Real API integration for authentication routes:
 * Register, Login, Social Login (Google/Apple), Profile (/me), and Logout.
 */

import { httpClient } from '../httpClient'

export interface UserAuthData {
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

export interface AuthResponse {
  token: string
  refreshToken: string
  user: UserAuthData
}

export const authApi = {
  /**
   * Login or register instantly with player name only
   */
  nameLogin: async (payload: { name: string; avatar?: string }): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/name-login', payload)
    return res.data
  },

  /**
   * Register a new user with email and password
   */
  register: async (payload: {
    email: string
    username: string
    password: string
    name: string
  }): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/register', payload)
    return res.data
  },

  /**
   * Login with email or username and password
   */
  login: async (payload: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/login', payload)
    return res.data
  },

  /**
   * Social Login (Google / Apple)
   */
  socialLogin: async (payload: {
    provider: 'google' | 'apple'
    idToken: string
    user?: {
      email?: string
      name?: string
      username?: string
    }
  }): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/social', payload)
    return res.data
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async (): Promise<UserAuthData> => {
    const res = await httpClient.get<UserAuthData>('/auth/me')
    return res.data
  },

  /**
   * Logout session
   */
  logout: async (): Promise<void> => {
    try {
      await httpClient.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    }
  },
}
