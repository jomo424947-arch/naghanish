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
  async loginWithName(name: string, avatar?: string) {
    const response = await httpClient.post('/auth/name-login', { name, avatar })
    return response.data
  },

  async socialLogin(payload: OAuthLoginPayload) {
    const response = await httpClient.post('/auth/social', payload)
    return response.data
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
