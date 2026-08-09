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
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  const CATEGORIES = [
    { id: 'brain', title: 'الألعاب الذهنية', titleEn: 'Brain Games', icon: <Brain className="w-7 h-7 text-brand-purple" />, color: 'purple', route: ROUTES.GAMES },
    { id: 'quizzes', title: 'الإختبارات', titleEn: 'Quizzes', icon: <Sparkles className="w-7 h-7 text-brand-blue" />, color: 'cyan', route: ROUTES.QUIZ_CENTER },
    { id: 'party', title: 'بارتي نايت', titleEn: 'Party Night', icon: <Users className="w-7 h-7 text-brand-orange" />, color: 'orange', route: ROUTES.PARTY },
    { id: 'leaderboard', title: 'لوحة الصدارة', titleEn: 'Leaderboard', icon: <Trophy className="w-7 h-7 text-brand-gold" />, color: 'yellow', route: ROUTES.LEADERBOARD },
    { id: 'achievements', title: 'الإنجازات', titleEn: 'Achievements', icon: <Gift className="w-7 h-7 text-brand-green" />, color: 'green', route: ROUTES.ACHIEVEMENTS },
    { id: 'store', title: 'المتجر', titleEn: 'Store', icon: <ShoppingBag className="w-7 h-7 text-brand-pink" />, color: 'pink', route: ROUTES.STORE },
    { id: 'ai', title: 'المساعد الذكي', titleEn: 'AI Assistant', icon: <Bot className="w-7 h-7 text-brand-blue" />, color: 'blue', route: ROUTES.HOME },
    { id: 'profile', title: 'الملف الشخصي', titleEn: 'Profile', icon: <User className="w-7 h-7 text-brand-blue" />, color: 'cyan', route: ROUTES.SETTINGS },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 pb-24">
      <SEO
        title="الرئيسية | نغنِش - منصة الألعاب والاختبارات التفاعلية"
        description="نغنِش منصتك الترفيهية للألعاب الذهنية، بارتي نايت، واختبارات الذكاء."
      />

      {/* Top Header Greeting Bar */}
      <div className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-md transition-colors duration-300">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple via-purple-600 to-brand-blue flex items-center justify-center text-2xl shadow-glow text-white shrink-0">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                {dir === 'rtl' ? `أهلاً، ${user?.name || 'أحمد'}!` : `Hi, ${user?.name || 'Ahmed'}!`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-purple/15 text-brand-purple border border-brand-purple/25">
                LVL {user?.level || 12}
              </span>
            </div>
            <div className="w-36 sm:w-48 h-2 rounded-full bg-muted mt-1.5 overflow-hidden border border-border">
              <div className="h-full w-2/3 bg-gradient-to-r from-brand-purple to-brand-blue rounded-full shadow-glow-blue" />
            </div>
            <p className="text-[10px] text-muted-foreground font-extrabold mt-1">2,450 / 3,500 XP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="p-3 rounded-2xl bg-brand-surface border border-brand-cardBorder text-foreground hover:border-brand-purple transition-colors shadow-sm"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Daily Challenge Highlight Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-brand-purple/30">
        {/* Purple gradient top strip */}
        <div className="h-2 bg-gradient-to-r from-brand-purple via-purple-500 to-brand-blue" />
        
        <div className="p-6 sm:p-8 bg-brand-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-purpleDark shadow-glow shrink-0">
              <Flame className="w-8 h-8 text-brand-gold animate-pulse" />
            </div>
            <div>
              <span style={{ color: '#FF7315' }} className="text-xs font-black uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                <Zap className="w-3.5 h-3.5" /> {dir === 'rtl' ? '✨ التحدي اليومي' : '✨ Daily Challenge'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-foreground">
                {dir === 'rtl' ? 'اختبار الذكاء والسرعة 🧠' : 'IQ & Speed Challenge 🧠'}
              </h3>
              <p className="text-xs sm:text-sm font-bold mt-1 text-muted-foreground">
                {dir === 'rtl' ? 'اختبر قدراتك الذهنية اليوم واكسب +250 XP' : 'Test your intelligence today & earn +250 XP'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.GAMES)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue font-black text-sm shadow-glow transition-all duration-200 flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer hover:shadow-glow-blue"
            style={{ color: '#FFFFFF' }}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{dir === 'rtl' ? 'ابدأ التحدي' : 'Start Now'}</span>
          </button>
        </div>
      </div>

      {/* Main Banner Ad */}
      <AdSlot variant="banner" slotId="ad-home-top" />

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
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center shadow-inner">
                {cat.icon}
              </div>
              <h4 className="text-sm font-extrabold text-foreground">
                {dir === 'rtl' ? cat.title : cat.titleEn}
              </h4>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
