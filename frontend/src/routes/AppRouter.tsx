/**
 * AppRouter.tsx
 *
 * Naghanish Application Router mapping all Auth, Hub, 6 Gaming Worlds, and catalog routes.
 */

import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import { LoadingSpinner } from '@components/common/LoadingSpinner'
import { DashboardLayout } from '@layouts/DashboardLayout/DashboardLayout'

// Onboarding & Auth Pages
const SplashPage = lazy(() => import('@pages/Splash/SplashPage').then((m) => ({ default: m.SplashPage })))
const OnboardingPage = lazy(() => import('@pages/Onboarding/OnboardingPage').then((m) => ({ default: m.OnboardingPage })))
const LoginPage = lazy(() => import('@pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@pages/Register/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@pages/ForgotPassword/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))
const OTPPage = lazy(() => import('@pages/OTP/OTPPage').then((m) => ({ default: m.OTPPage })))
const ResetPasswordPage = lazy(() => import('@pages/ResetPassword/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })))
const WelcomePage = lazy(() => import('@pages/Welcome/WelcomePage').then((m) => ({ default: m.WelcomePage })))
const ChooseInterestsPage = lazy(() => import('@pages/ChooseInterests/ChooseInterestsPage').then((m) => ({ default: m.ChooseInterestsPage })))
const ProfileSetupPage = lazy(() => import('@pages/ProfileSetup/ProfileSetupPage').then((m) => ({ default: m.ProfileSetupPage })))
const LanguagePage = lazy(() => import('@pages/Language/LanguagePage').then((m) => ({ default: m.LanguagePage })))
const ThemePage = lazy(() => import('@pages/Theme/ThemePage').then((m) => ({ default: m.ThemePage })))
const NotificationPermissionPage = lazy(() => import('@pages/NotificationPermission/NotificationPermissionPage').then((m) => ({ default: m.NotificationPermissionPage })))
const SettingsPage = lazy(() => import('@pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const AboutPage = lazy(() => import('@pages/About/AboutPage').then((m) => ({ default: m.AboutPage })))
const HelpPage = lazy(() => import('@pages/Help/HelpPage').then((m) => ({ default: m.HelpPage })))
const NotFoundPage = lazy(() => import('@pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const ServerErrorPage = lazy(() => import('@pages/ServerError/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage })))

// Hub & Catalog Pages
const HomePage = lazy(() => import('@pages/Home/HomePage').then((m) => ({ default: m.HomePage })))
const GamesPage = lazy(() => import('@pages/Games/GamesPage').then((m) => ({ default: m.GamesPage })))
const GameDetailsPage = lazy(() => import('@pages/GameDetails/GameDetailsPage').then((m) => ({ default: m.GameDetailsPage })))
const QuizCenterPage = lazy(() => import('@pages/QuizCenter/QuizCenterPage').then((m) => ({ default: m.QuizCenterPage })))
const QuizDetailsPage = lazy(() => import('@pages/QuizDetails/QuizDetailsPage').then((m) => ({ default: m.QuizDetailsPage })))
const CreateRoomPage = lazy(() => import('@pages/CreateRoom/CreateRoomPage').then((m) => ({ default: m.CreateRoomPage })))
const JoinRoomPage = lazy(() => import('@pages/JoinRoom/JoinRoomPage').then((m) => ({ default: m.JoinRoomPage })))
const LobbyPage = lazy(() => import('@pages/Lobby/LobbyPage').then((m) => ({ default: m.LobbyPage })))
const AchievementsPage = lazy(() => import('@pages/Achievements/AchievementsPage').then((m) => ({ default: m.AchievementsPage })))
const StorePage = lazy(() => import('@pages/Store/StorePage').then((m) => ({ default: m.StorePage })))
const NotificationsPage = lazy(() => import('@pages/Notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))
const FriendsPage = lazy(() => import('@pages/Friends/FriendsPage').then((m) => ({ default: m.FriendsPage })))
const ProfilePage = lazy(() => import('@pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SearchPage = lazy(() => import('@pages/Search/SearchPage').then((m) => ({ default: m.SearchPage })))

// ── 6 INDEPENDENT GAMING WORLDS ──
const ShillaWorldPage = lazy(() => import('../worlds/shilla/ShillaPage').then((m) => ({ default: m.ShillaPage })))
const ArcadeWorldPage = lazy(() => import('../worlds/arcade/ArcadePage').then((m) => ({ default: m.ArcadePage })))
const IQLabWorldPage = lazy(() => import('../worlds/iq-lab/IQLabPage').then((m) => ({ default: m.IQLabPage })))
const ReflexWorldPage = lazy(() => import('../worlds/reflex/ReflexPage').then((m) => ({ default: m.ReflexPage })))
const ChampionsWorldPage = lazy(() => import('../worlds/champions/ChampionsPage').then((m) => ({ default: m.ChampionsPage })))
const ChaosWorldPage = lazy(() => import('../worlds/chaos/ChaosPage').then((m) => ({ default: m.ChaosPage })))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen text="جاري تحميل نغنِش..." />}>
        <Routes>
          {/* Auth & Setup Routes */}
          <Route path={ROUTES.SPLASH} element={<SplashPage />} />
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.OTP} element={<OTPPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.WELCOME} element={<WelcomePage />} />
          <Route path={ROUTES.CHOOSE_INTERESTS} element={<ChooseInterestsPage />} />
          <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetupPage />} />
          <Route path={ROUTES.LANGUAGE} element={<LanguagePage />} />
          <Route path={ROUTES.THEME} element={<ThemePage />} />
          <Route path={ROUTES.NOTIFICATIONS_PERMISSION} element={<NotificationPermissionPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.HELP} element={<HelpPage />} />
          <Route path="/500" element={<ServerErrorPage />} />

          {/* Main Dashboard Layout Wrapped Routes */}
          <Route element={<DashboardLayout />}>
            {/* 1. Hub & Catalog */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.GAMES} element={<GamesPage />} />
            <Route path={`${ROUTES.GAMES}/:id`} element={<GameDetailsPage />} />
            <Route path={ROUTES.QUIZ_CENTER} element={<QuizCenterPage />} />
            <Route path={`${ROUTES.QUIZ_CENTER}/:id`} element={<QuizDetailsPage />} />

            {/* 2. The 6 Gaming Worlds (Supports both /world/ and /worlds/ routes) */}
            <Route path={ROUTES.WORLD_SHILLA} element={<ShillaWorldPage />} />
            <Route path={ROUTES.WORLD_ARCADE} element={<ArcadeWorldPage />} />
            <Route path={ROUTES.WORLD_IQ_LAB} element={<IQLabWorldPage />} />
            <Route path={ROUTES.WORLD_REFLEX} element={<ReflexWorldPage />} />
            <Route path={ROUTES.WORLD_CHAMPIONS} element={<ChampionsWorldPage />} />
            <Route path={ROUTES.WORLD_CHAOS} element={<ChaosWorldPage />} />

            {/* Plural route aliases for /worlds/* */}
            <Route path="/worlds/shilla" element={<ShillaWorldPage />} />
            <Route path="/worlds/arcade" element={<ArcadeWorldPage />} />
            <Route path="/worlds/iq-lab" element={<IQLabWorldPage />} />
            <Route path="/worlds/reflex" element={<ReflexWorldPage />} />
            <Route path="/worlds/champions" element={<ChampionsWorldPage />} />
            <Route path="/worlds/chaos" element={<ChaosWorldPage />} />

            {/* Route Aliases for backwards compatibility */}
            <Route path={ROUTES.PARTY} element={<ShillaWorldPage />} />
            <Route path="/party/create" element={<CreateRoomPage />} />
            <Route path="/party/join" element={<JoinRoomPage />} />
            <Route path="/party/lobby/:id" element={<LobbyPage />} />
            <Route path={ROUTES.LEADERBOARD} element={<ChampionsWorldPage />} />
            <Route path={ROUTES.DAILY_CHALLENGES} element={<ChaosWorldPage />} />

            {/* General App Shell Pages (Neutral) */}
            <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
            <Route path={ROUTES.STORE} element={<StorePage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
