/**
 * routes.ts
 *
 * Typed route paths constant registry for Naghanish app.
 */

export const ROUTES = {
  // Screen 1: Splash Screen
  SPLASH: '/',
  // Screen 2: Onboarding
  ONBOARDING: '/onboarding',
  // Screen 3: Login
  LOGIN: '/login',
  // Screen 4: Register
  REGISTER: '/register',
  // Screen 5: Forgot Password
  FORGOT_PASSWORD: '/forgot-password',
  // Screen 6: OTP Verification
  OTP: '/otp',
  // Screen 7: Reset Password
  RESET_PASSWORD: '/reset-password',
  // Screen 8: Welcome Screen
  WELCOME: '/welcome',
  // Screen 9: Choose Interests
  CHOOSE_INTERESTS: '/choose-interests',
  // Screen 10: Profile Setup
  PROFILE_SETUP: '/profile-setup',
  // Screen 11: Language Selection
  LANGUAGE: '/language',
  // Screen 12: Theme Selection
  THEME: '/theme',
  // Screen 13: Notification Permission
  NOTIFICATIONS_PERMISSION: '/notifications-permission',
  // Screen 14: Settings
  SETTINGS: '/settings',
  // Screen 15: About
  ABOUT: '/about',
  // Screen 16: Help
  HELP: '/help',

  // Main Platform Dashboard Routes
  HOME: '/home',
  GAMES: '/games',
  QUIZ_CENTER: '/quizzes',
  PARTY: '/party',
  LEADERBOARD: '/leaderboard',
  ACHIEVEMENTS: '/achievements',
  DAILY_CHALLENGES: '/challenges',
  STORE: '/store',
  NOTIFICATIONS: '/notifications',

  // Screen 17: 404
  NOT_FOUND: '/404',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]
