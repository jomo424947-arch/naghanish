import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@components/layout/AuthLayout'
import { SocialLoginButton } from '@components/common/SocialLoginButton'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

import { authApi } from '@api'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { dir } = useThemeStore()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(provider)
    setErrorMsg(null)
    try {
      const authRes = await authApi.socialLogin({
        provider,
        idToken: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user: {
          name: provider === 'google' ? 'مستخدم Google' : 'مستخدم Apple',
          email: `${provider}_user_${Date.now().toString().slice(-4)}@naghanish.com`,
          username: `${provider}_player_${Date.now().toString().slice(-4)}`,
        },
      })

      login(authRes.user, authRes.token, authRes.refreshToken)
      navigate(ROUTES.WELCOME)
    } catch (err: any) {
      console.error('Login error:', err)
      setErrorMsg(
        err.response?.data?.detail ||
          (dir === 'rtl' ? 'تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر' : 'Unable to connect to server')
      )
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'مرحباً بك مجدداً! 👋' : 'Welcome Back! 👋'}
      subtitle={dir === 'rtl' ? 'سجل دخولك بنقرة واحدة لمتابعة اللعب والمنافسة' : 'Login with one click to continue playing'}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 border border-purple-500/30 text-brand-purple flex items-center justify-center mx-auto mb-3 shadow-glow text-2xl">
            🔐
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {dir === 'rtl' ? 'اختر طريقة تسجيل الدخول' : 'Choose Login Method'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {dir === 'rtl' ? 'تسجيل السريع والآمن عبر حساباتك المعتمدة' : 'Fast and secure login via verified accounts'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <SocialLoginButton
            provider="google"
            label={dir === 'rtl' ? 'المتابعة باستخدام Google' : 'Continue with Google'}
            isLoading={isLoading === 'google'}
            onClick={() => handleSocialLogin('google')}
            className="w-full py-4 text-base font-bold shadow-glow-blue"
          />
          <SocialLoginButton
            provider="apple"
            label={dir === 'rtl' ? 'المتابعة باستخدام Apple' : 'Continue with Apple'}
            isLoading={isLoading === 'apple'}
            onClick={() => handleSocialLogin('apple')}
            className="w-full py-4 text-base font-bold"
          />
        </div>

        <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-cardBorder/60 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {dir === 'rtl'
              ? 'تسجيل الدخول متاح حنياً حصرياً عبر Google و Apple لضمان أمان حسابك وتجربة سريعة'
              : 'Sign in is currently available via Google & Apple for speed and security'}
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

