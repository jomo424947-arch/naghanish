import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Trophy, Users, Zap, Check } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const NotificationPermissionPage: React.FC = () => {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuthStore()
  const { setNotificationsEnabled, dir } = useThemeStore()

  const handleEnable = () => {
    setNotificationsEnabled(true)
    completeOnboarding()
    navigate(ROUTES.HOME)
  }

  const handleSkip = () => {
    setNotificationsEnabled(false)
    completeOnboarding()
    navigate(ROUTES.HOME)
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'التنبيهات والإشعارات 🔔' : 'Stay Updated 🔔'}
      subtitle={dir === 'rtl' ? 'لا تفوّت التحديات اليومية ودعوات الأصدقاء في غرف اللعب!' : 'Never miss daily challenges, rewards and party invites!'}
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6">
        {/* Animated Bell Mascot Frame */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue flex items-center justify-center text-white shadow-glow-blue border-4 border-brand-card"
        >
          <Bell className="w-12 h-12 text-cyan-300" />
        </motion.div>

        {/* Benefits List */}
        <div className="w-full flex flex-col gap-3">
          <div className="p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-right rtl:text-right text-left">
              <h4 className="text-xs font-bold text-white">
                {dir === 'rtl' ? 'التحديات اليومية' : 'Daily Challenges'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {dir === 'rtl' ? 'تنبيهات فورية عند تجديد التحديات واكتساب XP' : 'Instant notifications for new daily rewards'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right rtl:text-right text-left">
              <h4 className="text-xs font-bold text-white">
                {dir === 'rtl' ? 'دعوات بارتي نايت' : 'Party Room Invites'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {dir === 'rtl' ? 'إشعارات عند دعوة أصدقائك لك للانضمام للغرف' : 'Get notified when friends invite you to play'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-right rtl:text-right text-left">
              <h4 className="text-xs font-bold text-white">
                {dir === 'rtl' ? 'لائحة المتصدرين' : 'Leaderboard Updates'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {dir === 'rtl' ? 'إشعار عند تجاوز أحد المنافسين لترتيبك' : 'Alerts when players beat your high scores'}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 mt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleEnable}
            leftIcon={<Check className="w-5 h-5" />}
            className="shadow-glow"
          >
            {dir === 'rtl' ? 'تفعيل الإشعارات 🔔' : 'Enable Notifications 🔔'}
          </Button>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors py-2"
          >
            {dir === 'rtl' ? 'ليس الآن' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
