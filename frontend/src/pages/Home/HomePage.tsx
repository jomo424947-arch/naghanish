import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  Sparkles,
  Users,
  Trophy,
  Gift,
  ShoppingBag,
  Bot,
  User,
  Zap,
  Play,
  Flame,
  Search,
  Bell,
} from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  const CATEGORIES = [
    { id: 'brain', title: 'الألعاب الذهنية', titleEn: 'Brain Games', icon: <Brain className="w-7 h-7 text-purple-300" />, color: 'purple', route: ROUTES.GAMES },
    { id: 'quizzes', title: 'الإختبارات', titleEn: 'Quizzes', icon: <Sparkles className="w-7 h-7 text-cyan-300" />, color: 'cyan', route: ROUTES.QUIZ_CENTER },
    { id: 'party', title: 'بارتي نايت', titleEn: 'Party Night', icon: <Users className="w-7 h-7 text-orange-300" />, color: 'orange', route: ROUTES.PARTY },
    { id: 'leaderboard', title: 'لوحة الصدارة', titleEn: 'Leaderboard', icon: <Trophy className="w-7 h-7 text-amber-300" />, color: 'yellow', route: ROUTES.LEADERBOARD },
    { id: 'achievements', title: 'الإنجازات', titleEn: 'Achievements', icon: <Gift className="w-7 h-7 text-emerald-300" />, color: 'green', route: ROUTES.ACHIEVEMENTS },
    { id: 'store', title: 'المتجر', titleEn: 'Store', icon: <ShoppingBag className="w-7 h-7 text-pink-300" />, color: 'pink', route: ROUTES.STORE },
    { id: 'ai', title: 'المساعد الذكي', titleEn: 'AI Assistant', icon: <Bot className="w-7 h-7 text-cyan-300" />, color: 'blue', route: ROUTES.HOME },
    { id: 'profile', title: 'الملف الشخصي', titleEn: 'Profile', icon: <User className="w-7 h-7 text-cyan-300" />, color: 'cyan', route: ROUTES.SETTINGS },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24">
      {/* Top Header Greeting Bar */}
      <div className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple via-purple-600 to-brand-blue flex items-center justify-center text-2xl shadow-glow">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">
                {dir === 'rtl' ? `أهلاً، ${user?.name || 'أحمد'}!` : `Hi, ${user?.name || 'Ahmed'}!`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-purple/30 text-purple-300 border border-purple-500/30">
                LVL {user?.level || 12}
              </span>
            </div>
            <div className="w-36 sm:w-48 h-2 rounded-full bg-brand-darkBg mt-1.5 overflow-hidden border border-white/5">
              <div className="h-full w-2/3 bg-gradient-to-r from-brand-purple to-brand-blue rounded-full shadow-glow-blue" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1">2,450 / 3,500 XP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="p-3 rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-slate-300 hover:text-white hover:border-brand-blue transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Daily Challenge Highlight Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#20153D] via-brand-card to-[#12182F] border-2 border-brand-purple/50 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-brand-purple to-indigo-700 text-white shadow-glow shrink-0">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
              <Zap className="w-3.5 h-3.5" /> {dir === 'rtl' ? 'التحدي اليومي' : 'Daily Challenge'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {dir === 'rtl' ? 'اختبار الذكاء والسرعة 🧠' : 'IQ & Speed Challenge 🧠'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              {dir === 'rtl' ? 'اختبر قدراتك الذهنية اليوم واكسب +250 XP' : 'Test your intelligence today & earn +250 XP'}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Play className="w-5 h-5 fill-current" />}
          onClick={() => navigate(ROUTES.GAMES)}
          className="shrink-0 shadow-glow-blue"
        >
          {dir === 'rtl' ? 'ابدأ التحدي' : 'Start Now'}
        </Button>
      </div>

      {/* Categories Grid matching Reference Image 3 */}
      <div>
        <SectionTitle
          title={dir === 'rtl' ? 'الأقسام الرئيسية 🎮' : 'Main Categories 🎮'}
          subtitle={dir === 'rtl' ? 'تصفح ألعاب نغانيش والتحديات' : 'Explore Naghanish games & modes'}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              variant="glowing"
              glowColor={cat.color as any}
              isInteractive={true}
              onClick={() => navigate(cat.route)}
              className="flex flex-col items-center justify-center text-center p-5 gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-darkBg/80 border border-brand-cardBorder flex items-center justify-center shadow-inner">
                {cat.icon}
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {dir === 'rtl' ? cat.title : cat.titleEn}
              </h4>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
