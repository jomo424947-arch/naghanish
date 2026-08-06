import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, RotateCcw } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const OTPPage: React.FC = () => {
  const navigate = useNavigate()
  const { pendingEmailForOtp } = useAuthStore()
  const { dir } = useThemeStore()

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [timer, setTimer] = useState<number>(60)
  const [canResend, setCanResend] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    let interval: any = null
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    if (!canResend) return
    setTimer(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setError(dir === 'rtl' ? 'يرجى إدخال الرمز المكون من 6 أرقام' : 'Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/reset-password')
    }, 1000)
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'التحقق من الرمز 📲' : 'OTP Verification 📲'}
      subtitle={
        dir === 'rtl'
          ? `تم إرسال رمز التأكيد إلى ${pendingEmailForOtp || 'بريدك الإلكتروني'}`
          : `Verification code sent to ${pendingEmailForOtp || 'your email'}`
      }
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 border border-cyan-400/30 text-brand-blue flex items-center justify-center mx-auto shadow-glow-blue">
            <ShieldCheck className="w-7 h-7" />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 text-center">
              {error}
            </div>
          )}

          {/* 6 Digit Input Grid */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 dir-ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="shadow-glow-blue"
          >
            {dir === 'rtl' ? 'تأكيد الرمز' : 'Verify Code'}
          </Button>

          {/* Resend code timer */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{dir === 'rtl' ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
              </button>
            ) : (
              <p className="text-xs font-medium text-slate-400">
                {dir === 'rtl' ? `إعادة الإرسال خلال ${timer} ثانية` : `Resend code in ${timer}s`}
              </p>
            )}
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
