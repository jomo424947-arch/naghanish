import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { DashboardLayout } from '@layouts/DashboardLayout/DashboardLayout';
// Onboarding & Auth Pages
const SplashPage = lazy(() => import('@pages/Splash/SplashPage').then((m) => ({ default: m.SplashPage })));
const OnboardingPage = lazy(() => import('@pages/Onboarding/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const LoginPage = lazy(() => import('@pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@pages/Register/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@pages/ForgotPassword/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const OTPPage = lazy(() => import('@pages/OTP/OTPPage').then((m) => ({ default: m.OTPPage })));
const ResetPasswordPage = lazy(() => import('@pages/ResetPassword/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const WelcomePage = lazy(() => import('@pages/Welcome/WelcomePage').then((m) => ({ default: m.WelcomePage })));
const ChooseInterestsPage = lazy(() => import('@pages/ChooseInterests/ChooseInterestsPage').then((m) => ({ default: m.ChooseInterestsPage })));
const ProfileSetupPage = lazy(() => import('@pages/ProfileSetup/ProfileSetupPage').then((m) => ({ default: m.ProfileSetupPage })));
const LanguagePage = lazy(() => import('@pages/Language/LanguagePage').then((m) => ({ default: m.LanguagePage })));
const ThemePage = lazy(() => import('@pages/Theme/ThemePage').then((m) => ({ default: m.ThemePage })));
const NotificationPermissionPage = lazy(() => import('@pages/NotificationPermission/NotificationPermissionPage').then((m) => ({ default: m.NotificationPermissionPage })));
const SettingsPage = lazy(() => import('@pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AboutPage = lazy(() => import('@pages/About/AboutPage').then((m) => ({ default: m.AboutPage })));
const HelpPage = lazy(() => import('@pages/Help/HelpPage').then((m) => ({ default: m.HelpPage })));
const NotFoundPage = lazy(() => import('@pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import('@pages/ServerError/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage })));
// Main Dashboard Platform Pages
const HomePage = lazy(() => import('@pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const GamesPage = lazy(() => import('@pages/Games/GamesPage').then((m) => ({ default: m.GamesPage })));
const GameDetailsPage = lazy(() => import('@pages/GameDetails/GameDetailsPage').then((m) => ({ default: m.GameDetailsPage })));
const QuizCenterPage = lazy(() => import('@pages/QuizCenter/QuizCenterPage').then((m) => ({ default: m.QuizCenterPage })));
const QuizDetailsPage = lazy(() => import('@pages/QuizDetails/QuizDetailsPage').then((m) => ({ default: m.QuizDetailsPage })));
const PartyPage = lazy(() => import('@pages/Party/PartyPage').then((m) => ({ default: m.PartyPage })));
const CreateRoomPage = lazy(() => import('@pages/CreateRoom/CreateRoomPage').then((m) => ({ default: m.CreateRoomPage })));
const JoinRoomPage = lazy(() => import('@pages/JoinRoom/JoinRoomPage').then((m) => ({ default: m.JoinRoomPage })));
const LobbyPage = lazy(() => import('@pages/Lobby/LobbyPage').then((m) => ({ default: m.LobbyPage })));
const LeaderboardPage = lazy(() => import('@pages/Leaderboard/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })));
const AchievementsPage = lazy(() => import('@pages/Achievements/AchievementsPage').then((m) => ({ default: m.AchievementsPage })));
const DailyChallengesPage = lazy(() => import('@pages/DailyChallenges/DailyChallengesPage').then((m) => ({ default: m.DailyChallengesPage })));
const StorePage = lazy(() => import('@pages/Store/StorePage').then((m) => ({ default: m.StorePage })));
const NotificationsPage = lazy(() => import('@pages/Notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const FriendsPage = lazy(() => import('@pages/Friends/FriendsPage').then((m) => ({ default: m.FriendsPage })));
const ProfilePage = lazy(() => import('@pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SearchPage = lazy(() => import('@pages/Search/SearchPage').then((m) => ({ default: m.SearchPage })));
export function AppRouter() {
    return (_jsx(BrowserRouter, { children: _jsx(Suspense, { fallback: _jsx(LoadingSpinner, { fullScreen: true, text: "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0646\u063A\u0646\u0650\u0634..." }), children: _jsxs(Routes, { children: [_jsx(Route, { path: ROUTES.SPLASH, element: _jsx(SplashPage, {}) }), _jsx(Route, { path: ROUTES.ONBOARDING, element: _jsx(OnboardingPage, {}) }), _jsx(Route, { path: ROUTES.LOGIN, element: _jsx(LoginPage, {}) }), _jsx(Route, { path: ROUTES.REGISTER, element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: ROUTES.FORGOT_PASSWORD, element: _jsx(ForgotPasswordPage, {}) }), _jsx(Route, { path: ROUTES.OTP, element: _jsx(OTPPage, {}) }), _jsx(Route, { path: ROUTES.RESET_PASSWORD, element: _jsx(ResetPasswordPage, {}) }), _jsx(Route, { path: ROUTES.WELCOME, element: _jsx(WelcomePage, {}) }), _jsx(Route, { path: ROUTES.CHOOSE_INTERESTS, element: _jsx(ChooseInterestsPage, {}) }), _jsx(Route, { path: ROUTES.PROFILE_SETUP, element: _jsx(ProfileSetupPage, {}) }), _jsx(Route, { path: ROUTES.LANGUAGE, element: _jsx(LanguagePage, {}) }), _jsx(Route, { path: ROUTES.THEME, element: _jsx(ThemePage, {}) }), _jsx(Route, { path: ROUTES.NOTIFICATIONS_PERMISSION, element: _jsx(NotificationPermissionPage, {}) }), _jsx(Route, { path: ROUTES.SETTINGS, element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: ROUTES.ABOUT, element: _jsx(AboutPage, {}) }), _jsx(Route, { path: ROUTES.HELP, element: _jsx(HelpPage, {}) }), _jsx(Route, { path: "/500", element: _jsx(ServerErrorPage, {}) }), _jsxs(Route, { element: _jsx(DashboardLayout, {}), children: [_jsx(Route, { path: ROUTES.HOME, element: _jsx(HomePage, {}) }), _jsx(Route, { path: ROUTES.GAMES, element: _jsx(GamesPage, {}) }), _jsx(Route, { path: `${ROUTES.GAMES}/:id`, element: _jsx(GameDetailsPage, {}) }), _jsx(Route, { path: ROUTES.QUIZ_CENTER, element: _jsx(QuizCenterPage, {}) }), _jsx(Route, { path: `${ROUTES.QUIZ_CENTER}/:id`, element: _jsx(QuizDetailsPage, {}) }), _jsx(Route, { path: ROUTES.PARTY, element: _jsx(PartyPage, {}) }), _jsx(Route, { path: "/party/create", element: _jsx(CreateRoomPage, {}) }), _jsx(Route, { path: "/party/join", element: _jsx(JoinRoomPage, {}) }), _jsx(Route, { path: "/party/lobby/:id", element: _jsx(LobbyPage, {}) }), _jsx(Route, { path: ROUTES.LEADERBOARD, element: _jsx(LeaderboardPage, {}) }), _jsx(Route, { path: ROUTES.ACHIEVEMENTS, element: _jsx(AchievementsPage, {}) }), _jsx(Route, { path: ROUTES.DAILY_CHALLENGES, element: _jsx(DailyChallengesPage, {}) }), _jsx(Route, { path: ROUTES.STORE, element: _jsx(StorePage, {}) }), _jsx(Route, { path: ROUTES.NOTIFICATIONS, element: _jsx(NotificationsPage, {}) }), _jsx(Route, { path: "/friends", element: _jsx(FriendsPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchPage, {}) })] }), _jsx(Route, { path: ROUTES.NOT_FOUND, element: _jsx(NotFoundPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) }));
}
