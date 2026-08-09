import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '@components/layout/AuthLayout'
import { SocialLoginButton } from '@components/common/SocialLoginButton'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { dir } = useThemeStore()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSocialRegister = (provider: 'google' | 'apple') => {
    setIsLoading(provider)
    setTimeout(() => {
      login({
        name: provider === 'google' ? 'لاعب جديد (Google)' : 'لاعب جديد (Apple)',
        email: provider === 'google' ? 'new_user@gmail.com' : 'new_user@apple.com',
        username: provider === 'google' ? 'new_google_player' : 'new_apple_player',
      })
      setIsLoading(null)
      navigate(ROUTES.CHOOSE_INTERESTS)
    }, 800)
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

