/**
 * routes.ts
 *
 * Typed route paths constant registry for Naghanish app.
 */
export const ROUTES = {
    // Auth & Onboarding Screens
    SPLASH: '/',
    ONBOARDING: '/onboarding',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    OTP: '/otp',
    RESET_PASSWORD: '/reset-password',
    WELCOME: '/welcome',
    CHOOSE_INTERESTS: '/choose-interests',
    PROFILE_SETUP: '/profile-setup',
    LANGUAGE: '/language',
    THEME: '/theme',
    NOTIFICATIONS_PERMISSION: '/notifications-permission',
    SETTINGS: '/settings',
    ABOUT: '/about',
    HELP: '/help',
    // Main Platform Dashboard Routes
    HOME: '/home',
    GAMES: '/games',
    QUIZ_CENTER: '/quizzes',
    PARTY: '/party',
    CREATE_ROOM: '/party/create',
    JOIN_ROOM: '/party/join',
    LOBBY: '/party/lobby',
    LEADERBOARD: '/leaderboard',
    ACHIEVEMENTS: '/achievements',
    DAILY_CHALLENGES: '/challenges',
    STORE: '/store',
    NOTIFICATIONS: '/notifications',
    FRIENDS: '/friends',
    PROFILE: '/profile',
    SEARCH: '/search',
    // 404 & Error
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
};
