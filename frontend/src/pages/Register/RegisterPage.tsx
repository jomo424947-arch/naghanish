import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '@components/layout/AuthLayout'
import { SocialLoginButton } from '@components/common/SocialLoginButton'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

import { authApi } from '@api'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { dir } = useThemeStore()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSocialRegister = async (provider: 'google' | 'apple') => {
    setIsLoading(provider)
    setErrorMsg(null)
    try {
      const authRes = await authApi.socialLogin({
        provider,
        idToken: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user: {
          name: provider === 'google' ? 'لاعب جديد (Google)' : 'لاعب جديد (Apple)',
          email: `${provider}_user_${Date.now().toString().slice(-4)}@naghanish.com`,
          username: `${provider}_player_${Date.now().toString().slice(-4)}`,
        },
      })

      login(authRes.user, authRes.token, authRes.refreshToken)
      navigate(ROUTES.CHOOSE_INTERESTS)
    } catch (err: any) {
      console.error('Register error:', err)
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
      title={dir === 'rtl' ? 'إنشاء حساب جديد 🚀' : 'Create Account 🚀'}
      subtitle={dir === 'rtl' ? 'انضم إلى مجتمع نغانيش وابدأ التحدي فوراً!' : "Join Naghanish and start competing right away!"}
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center mx-auto mb-3 shadow-glow text-2xl text-white font-bold">
            🎮
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {dir === 'rtl' ? 'التسجيل بنقرة واحدة' : 'One-Click Sign Up'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {dir === 'rtl' ? 'لا حاجة لإنشاء كلمة مرور جديدة، استخدم حسابك المعتمد' : 'No need to remember passwords, use your trusted social account'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Social Register Buttons */}
        <div className="flex flex-col gap-3">
          <SocialLoginButton
            provider="google"
            label={dir === 'rtl' ? 'إنشاء حساب بـ Google' : 'Sign up with Google'}
            isLoading={isLoading === 'google'}
            onClick={() => handleSocialRegister('google')}
            className="w-full py-4 text-base font-bold shadow-glow-blue"
          />
          <SocialLoginButton
            provider="apple"
            label={dir === 'rtl' ? 'إنشاء حساب بـ Apple' : 'Sign up with Apple'}
            isLoading={isLoading === 'apple'}
            onClick={() => handleSocialRegister('apple')}
            className="w-full py-4 text-base font-bold"
          />
        </div>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          {dir === 'rtl' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
          <Link to={ROUTES.LOGIN} className="text-brand-blue font-bold hover:underline hover:text-cyan-300">
            {dir === 'rtl' ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

