import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Lock } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { PasswordField } from '@components/common/PasswordField'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError(dir === 'rtl' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError(dir === 'rtl' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1000)
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {dir === 'rtl' ? 'تم تغيير كلمة المرور بنجاح! 🎉' : 'Password Reset Successful! 🎉'}
          </h2>
          <p className="text-sm text-slate-300 font-medium">
            {dir === 'rtl' ? 'يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.' : 'You can now log in using your new password.'}
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(ROUTES.LOGIN)}
            className="mt-2 shadow-glow"
          >
            {dir === 'rtl' ? 'الانتقال لتسجيل الدخول' : 'Go to Login'}
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'تعيين كلمة مرور جديدة 🔑' : 'Reset Password 🔑'}
      subtitle={dir === 'rtl' ? 'أدخل كلمة المرور الجديدة لحسابك' : 'Enter your new password below'}
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 text-center">
              {error}
            </div>
          )}

          <PasswordField
            label={dir === 'rtl' ? 'كلمة المرور الجديدة' : 'New Password'}
            placeholder="••••••••"
            showStrengthMeter={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordField
            label={dir === 'rtl' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="mt-2 shadow-glow"
          >
            {dir === 'rtl' ? 'حفظ كلمة المرور' : 'Save New Password'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
