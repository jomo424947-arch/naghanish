/**
 * httpClient.ts
 *
 * Axios instance with base configuration.
 * Attach interceptors for auth tokens, error handling, and retries here.
 */

import axios from 'axios'
import { ENV } from '@config/env'

export const httpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ───────────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config) => {
    // TODO: Attach Authorization header from auth store
    // const token = useAuthStore.getState().accessToken
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ──────────────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401 (token refresh), 403, 500 globally
    return Promise.reject(error)
  },
)
