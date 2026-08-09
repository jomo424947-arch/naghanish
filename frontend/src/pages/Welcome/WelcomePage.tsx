import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Gamepad2, Compass, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  return (
    <AuthLayout>
      <div className="p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-2xl backdrop-blur-xl text-center flex flex-col items-center gap-6">
        {/* Animated Greeting Mascot Frame */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-brand-purple via-purple-600 to-brand-blue flex items-center justify-center text-4xl shadow-glow-blue border-4 border-brand-card">
            🎉
          </div>
          <span className="absolute -bottom-2 -right-2 rtl:-right-auto rtl:-left-2 px-3 py-1 rounded-full bg-brand-blue text-slate-950 text-xs font-black shadow-md">
            LVL 12
          </span>
        </motion.div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            {dir === 'rtl' ? `أهلاً بك، ${user?.name || 'البطل'}! 👋` : `Welcome, ${user?.name || 'Player'}! 👋`}
          </h2>
          <p className="text-sm text-muted-foreground font-medium mt-2 max-w-sm">
            {dir === 'rtl'
              ? 'مرحباً بك في عالم نغانيش! دعنا نخصص تجربتك لنقدم لك أفضل الألعاب والاختبارات الممتعة.'
              : 'Welcome to Naghanish! Let’s customize your experience to serve you the best games & quizzes.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-2 gap-3 text-right rtl:text-right text-left">
          <div className="p-4 rounded-2xl bg-brand-surface/70 border border-brand-cardBorder flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-purple/20 text-brand-purple shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">{dir === 'rtl' ? 'ألعاب ذكية' : 'Smart Games'}</h4>
              <p className="text-[10px] text-muted-foreground font-medium">{dir === 'rtl' ? 'توصيات AI' : 'AI Powered'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-surface/70 border border-brand-cardBorder flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-blue/20 text-brand-blue shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">{dir === 'rtl' ? 'غرف بارتي' : 'Party Rooms'}</h4>
              <p className="text-[10px] text-muted-foreground font-medium">{dir === 'rtl' ? 'لعب جماعي' : 'Multiplayer'}</p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate('/choose-interests')}
          rightIcon={dir === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          className="shadow-glow-blue mt-2"
        >
          {dir === 'rtl' ? 'اختر اهتماماتك 🎯' : 'Choose Your Interests 🎯'}
        </Button>
      </div>
    </AuthLayout>
  )
}
