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

// Main Dashboard Platform Pages
const HomePage = lazy(() => import('@pages/Home/HomePage').then((m) => ({ default: m.HomePage })))
const GamesPage = lazy(() => import('@pages/Games/GamesPage').then((m) => ({ default: m.GamesPage })))
const GameDetailsPage = lazy(() => import('@pages/GameDetails/GameDetailsPage').then((m) => ({ default: m.GameDetailsPage })))
const QuizCenterPage = lazy(() => import('@pages/QuizCenter/QuizCenterPage').then((m) => ({ default: m.QuizCenterPage })))
const QuizDetailsPage = lazy(() => import('@pages/QuizDetails/QuizDetailsPage').then((m) => ({ default: m.QuizDetailsPage })))
const PartyPage = lazy(() => import('@pages/Party/PartyPage').then((m) => ({ default: m.PartyPage })))
const CreateRoomPage = lazy(() => import('@pages/CreateRoom/CreateRoomPage').then((m) => ({ default: m.CreateRoomPage })))
const JoinRoomPage = lazy(() => import('@pages/JoinRoom/JoinRoomPage').then((m) => ({ default: m.JoinRoomPage })))
const LobbyPage = lazy(() => import('@pages/Lobby/LobbyPage').then((m) => ({ default: m.LobbyPage })))
const LeaderboardPage = lazy(() => import('@pages/Leaderboard/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })))
const AchievementsPage = lazy(() => import('@pages/Achievements/AchievementsPage').then((m) => ({ default: m.AchievementsPage })))
const DailyChallengesPage = lazy(() => import('@pages/DailyChallenges/DailyChallengesPage').then((m) => ({ default: m.DailyChallengesPage })))
const StorePage = lazy(() => import('@pages/Store/StorePage').then((m) => ({ default: m.StorePage })))
const NotificationsPage = lazy(() => import('@pages/Notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))
const FriendsPage = lazy(() => import('@pages/Friends/FriendsPage').then((m) => ({ default: m.FriendsPage })))
const ProfilePage = lazy(() => import('@pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SearchPage = lazy(() => import('@pages/Search/SearchPage').then((m) => ({ default: m.SearchPage })))

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
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.GAMES} element={<GamesPage />} />
            <Route path={`${ROUTES.GAMES}/:id`} element={<GameDetailsPage />} />
            <Route path={ROUTES.QUIZ_CENTER} element={<QuizCenterPage />} />
            <Route path={`${ROUTES.QUIZ_CENTER}/:id`} element={<QuizDetailsPage />} />
            <Route path={ROUTES.PARTY} element={<PartyPage />} />
            <Route path="/party/create" element={<CreateRoomPage />} />
            <Route path="/party/join" element={<JoinRoomPage />} />
            <Route path="/party/lobby/:id" element={<LobbyPage />} />
            <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
            <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
            <Route path={ROUTES.DAILY_CHALLENGES} element={<DailyChallengesPage />} />
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
