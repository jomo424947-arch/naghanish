import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import { LoadingSpinner } from '@components/common/LoadingSpinner'

// Lazy-loaded Pages (All 17 Required Screens + Dashboard)
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

// Main Dashboard Page
const HomePage = lazy(() => import('@pages/Home/HomePage').then((m) => ({ default: m.HomePage })))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen text="Loading Naghanish..." />}>
        <Routes>
          {/* Screen 1: Splash Screen */}
          <Route path={ROUTES.SPLASH} element={<SplashPage />} />

          {/* Screen 2: Onboarding */}
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />

          {/* Screen 3: Login */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Screen 4: Register */}
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Screen 5: Forgot Password */}
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

          {/* Screen 6: OTP Verification */}
          <Route path={ROUTES.OTP} element={<OTPPage />} />

          {/* Screen 7: Reset Password */}
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

          {/* Screen 8: Welcome Screen */}
          <Route path={ROUTES.WELCOME} element={<WelcomePage />} />

          {/* Screen 9: Choose Interests */}
          <Route path={ROUTES.CHOOSE_INTERESTS} element={<ChooseInterestsPage />} />

          {/* Screen 10: Profile Setup */}
          <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetupPage />} />

          {/* Screen 11: Language Selection */}
          <Route path={ROUTES.LANGUAGE} element={<LanguagePage />} />

          {/* Screen 12: Theme Selection */}
          <Route path={ROUTES.THEME} element={<ThemePage />} />

          {/* Screen 13: Notification Permission */}
          <Route path={ROUTES.NOTIFICATIONS_PERMISSION} element={<NotificationPermissionPage />} />

          {/* Screen 14: Settings */}
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

          {/* Screen 15: About */}
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />

          {/* Screen 16: Help */}
          <Route path={ROUTES.HELP} element={<HelpPage />} />

          {/* Main Dashboard */}
          <Route path={ROUTES.HOME} element={<HomePage />} />

          {/* Screen 17: 404 */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
