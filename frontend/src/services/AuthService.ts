import { httpClient } from '@api/httpClient'

export interface OAuthLoginPayload {
  provider: 'google' | 'apple'
  idToken?: string
  user?: {
    name?: string
    email?: string
    username?: string
  }
}

export const AuthService = {
  async socialLogin(payload: OAuthLoginPayload) {
    try {
      const response = await httpClient.post('/auth/social', payload)
      return response.data
    } catch {
      // Fallback for demo when backend endpoint is not yet connected
      return {
        user: {
          id: 'usr_' + Date.now(),
          name: payload.user?.name || (payload.provider === 'google' ? 'مستخدم Google' : 'مستخدم Apple'),
          email: payload.user?.email || `user@${payload.provider}.com`,
          username: payload.user?.username || `${payload.provider}_player`,
          avatar: '/avatars/mascot-1.svg',
          level: 12,
          xp: 2450,
          maxXp: 3500,
          coins: 2350,
          rank: '#2',
          interests: ['brain', 'party', 'memory', 'speed'],
          hasCompletedOnboarding: true,
          hasCompletedProfileSetup: true,
        },
        token: 'jwt-access-token-demo',
      }
    }
  },

  async fetchCurrentUser() {
    try {
      const response = await httpClient.get('/auth/me')
      return response.data
    } catch {
      return null
    }
  },

  async logout() {
    try {
      await httpClient.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    }
  },
} as const

