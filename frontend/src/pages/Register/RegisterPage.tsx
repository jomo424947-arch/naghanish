import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { TextField } from '@components/common/TextField'
import { PasswordField } from '@components/common/PasswordField'
import { Checkbox } from '@components/common/Checkbox'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, setPendingEmail } = useAuthStore()
  const { dir } = useThemeStore()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !username || !password || !confirmPassword) {
      setError(dir === 'rtl' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError(dir === 'rtl' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }

    if (!agreeTerms) {
      setError(dir === 'rtl' ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the Terms & Conditions')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setPendingEmail(email)
      login({
        name: fullName,
        email,
        username,
      })
      setIsLoading(false)
      navigate('/otp') // Navigate to OTP verification page
    }, 1000)
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'إنشاء حساب جديد 🚀' : 'Create Account 🚀'}
      subtitle={dir === 'rtl' ? 'انضم إلى مجتمع نغانيش وابدأ التحدي!' : "Let's get you started with Naghanish!"}
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 text-center animate-fadeIn">
              {error}
            </div>
          )}

          <TextField
            label={dir === 'rtl' ? 'الاسم الكامل' : 'Full Name'}
            placeholder={dir === 'rtl' ? 'أدخل اسمك الثلاثي' : 'John Doe'}
            leftIcon={<User className="w-4 h-4" />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextField
            label={dir === 'rtl' ? 'البريد الإلكتروني' : 'Email Address'}
            type="email"
            placeholder="example@mail.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label={dir === 'rtl' ? 'اسم المستخدم' : 'Username'}
            placeholder="username"
            leftIcon={<User className="w-4 h-4" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <PasswordField
            label={dir === 'rtl' ? 'كلمة المرور' : 'Password'}
            placeholder="••••••••"
            showStrengthMeter={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordField
            label={dir === 'rtl' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="my-1">
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              label={
                <span>
                  {dir === 'rtl' ? 'أوافق على ' : 'I agree to the '}
                  <a href="#" className="text-brand-blue font-bold hover:underline">
                    {dir === 'rtl' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </a>
                </span>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="mt-2 shadow-glow"
          >
            {dir === 'rtl' ? 'إنشاء الحساب' : 'Register'}
          </Button>

          <p className="text-center text-xs font-semibold text-slate-400 mt-4">
            {dir === 'rtl' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
            <Link to={ROUTES.LOGIN} className="text-brand-blue font-bold hover:underline hover:text-cyan-300">
              {dir === 'rtl' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
