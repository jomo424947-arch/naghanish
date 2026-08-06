import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { TextField } from '@components/common/TextField'
import { PasswordField } from '@components/common/PasswordField'
import { Button } from '@components/common/Button'
import { SocialLoginButton } from '@components/common/SocialLoginButton'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { dir } = useThemeStore()

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!emailOrUsername || !password) {
      setError(dir === 'rtl' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      login({
        email: emailOrUsername.includes('@') ? emailOrUsername : 'user@example.com',
        username: emailOrUsername,
      })
      setIsLoading(false)
      navigate(ROUTES.WELCOME)
    }, 1000)
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'مرحباً بك مجدداً! 👋' : 'Welcome Back! 👋'}
      subtitle={dir === 'rtl' ? 'سجل دخولك لمتابعة اللعب والمنافسة' : 'Login to continue your gaming journey'}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 text-center animate-fadeIn">
              {error}
            </div>
          )}

          <TextField
            label={dir === 'rtl' ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
            placeholder={dir === 'rtl' ? 'أدخل بريدك أو اسمك' : 'enter email or username'}
            leftIcon={<User className="w-4 h-4" />}
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />

          <PasswordField
            label={dir === 'rtl' ? 'كلمة المرور' : 'Password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-end text-xs font-semibold">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-brand-blue hover:underline hover:text-cyan-300 transition-colors"
            >
              {dir === 'rtl' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="mt-2 shadow-glow"
          >
            {dir === 'rtl' ? 'تسجيل الدخول' : 'Login'}
          </Button>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-brand-cardBorder" />
            <span className="absolute px-3 bg-brand-card text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {dir === 'rtl' ? 'أو المتابعة بواسطة' : 'or continue with'}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex items-center gap-3">
            <SocialLoginButton provider="google" onClick={() => navigate(ROUTES.WELCOME)} />
            <SocialLoginButton provider="apple" onClick={() => navigate(ROUTES.WELCOME)} />
          </div>

          {/* Register Link */}
          <p className="text-center text-xs font-semibold text-slate-400 mt-4">
            {dir === 'rtl' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
            <Link to={ROUTES.REGISTER} className="text-brand-blue font-bold hover:underline hover:text-cyan-300">
              {dir === 'rtl' ? 'إنشاء حساب جديد' : 'Register'}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
