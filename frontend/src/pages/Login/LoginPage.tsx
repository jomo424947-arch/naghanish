import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { authApi } from '@api'

const AVATARS = ['🧠', '⚡', '🎮', '👑', '🚀', '🎯', '🔥', '🃏']

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const [playerName, setPlayerName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🧠')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleNameLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = playerName.trim()
    if (!trimmed || trimmed.length < 2) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسم يحتوي على حرفين على الأقل' : 'Please enter a name with at least 2 characters')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)
    try {
      const authRes = await authApi.nameLogin({
        name: trimmed,
        avatar: selectedAvatar,
      })

      login(authRes.user, authRes.token, authRes.refreshToken)
      navigate(ROUTES.WELCOME)
    } catch (err: any) {
      console.error('Name login error:', err)
      setErrorMsg(
        err.response?.data?.detail ||
          (isRtl ? 'تعذر تسجيل الدخول بالاسم، يرجى المحاولة مرة أخرى' : 'Failed to sign in. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title={isRtl ? 'أهلاً بك في نغنِش! 🎮' : 'Welcome to Naghanish! 🎮'}
      subtitle={isRtl ? 'ادخل اسمك فقط وابدأ اللعب والتنافس فوراً بدون كلمات مرور' : 'Enter your name to jump into the action instantly'}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-glow text-3xl">
            {selectedAvatar}
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {isRtl ? 'الدخول السريع بالاسم' : 'Instant Name Login'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isRtl ? 'اختر شخصيتك واكتب اسمك المفضل في ساحة الألعاب' : 'Pick your mascot and enter your player nickname'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleNameLogin} className="flex flex-col gap-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 text-center">
              {isRtl ? 'اختر رمزك المفضل:' : 'Choose Avatar:'}
            </label>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-brand-purple border-2 border-white shadow-glow scale-110'
                      : 'bg-brand-surface border border-brand-cardBorder/60 hover:border-brand-purple/50 opacity-80'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isRtl ? 'اسم اللاعب أو اللقب' : 'Player Name / Nickname'}
            </label>
            <Input
              type="text"
              placeholder={isRtl ? 'مثال: فهد، سارة، النمر المقنع...' : 'e.g., Alex, Shadow_Ninja...'}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={isLoading}
              leftIcon={<User className="w-4 h-4" />}
              required
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            className="w-full py-4 text-base font-extrabold shadow-glow"
          >
            {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Start Playing Now 🚀'}
          </Button>
        </form>

        <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-cardBorder/60 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isRtl
              ? '✨ حسابك يُحفظ تلقائياً باسمك، وستتمكن من حفظ نقاطك وتحدي أصدقائك في أي وقت.'
              : '✨ Your progression and scores will be saved automatically with your name.'}
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
