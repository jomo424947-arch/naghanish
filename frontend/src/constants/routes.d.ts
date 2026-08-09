/**
 * routes.ts
 *
 * Typed route paths constant registry for Naghanish app.
 */
export declare const ROUTES: {
    readonly SPLASH: "/";
    readonly ONBOARDING: "/onboarding";
    readonly LOGIN: "/login";
    readonly REGISTER: "/register";
    readonly FORGOT_PASSWORD: "/forgot-password";
    readonly OTP: "/otp";
    readonly RESET_PASSWORD: "/reset-password";
    readonly WELCOME: "/welcome";
    readonly CHOOSE_INTERESTS: "/choose-interests";
    readonly PROFILE_SETUP: "/profile-setup";
    readonly LANGUAGE: "/language";
    readonly THEME: "/theme";
    readonly NOTIFICATIONS_PERMISSION: "/notifications-permission";
    readonly SETTINGS: "/settings";
    readonly ABOUT: "/about";
    readonly HELP: "/help";
    readonly HOME: "/home";
    readonly GAMES: "/games";
    readonly QUIZ_CENTER: "/quizzes";
    readonly PARTY: "/party";
    readonly CREATE_ROOM: "/party/create";
    readonly JOIN_ROOM: "/party/join";
    readonly LOBBY: "/party/lobby";
    readonly LEADERBOARD: "/leaderboard";
    readonly ACHIEVEMENTS: "/achievements";
    readonly DAILY_CHALLENGES: "/challenges";
    readonly STORE: "/store";
    readonly NOTIFICATIONS: "/notifications";
    readonly FRIENDS: "/friends";
    readonly PROFILE: "/profile";
    readonly SEARCH: "/search";
    readonly NOT_FOUND: "/404";
    readonly SERVER_ERROR: "/500";
};
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
