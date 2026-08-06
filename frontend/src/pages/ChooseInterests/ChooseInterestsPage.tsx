import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Users, Cpu, Layers, Zap, Palette, Smile, Heart, Award, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { InterestCard, CategoryColor } from '@components/common/InterestCard'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

interface InterestItem {
  id: string
  title: string
  titleArabic: string
  subtitle: string
  subtitleArabic: string
  icon: React.ReactNode
  color: CategoryColor
}

const INTEREST_CATEGORIES: InterestItem[] = [
  {
    id: 'brain',
    title: 'Brain Games',
    titleArabic: 'ألعاب ذهنية',
    subtitle: 'Train your brain',
    subtitleArabic: 'تحديات ذكاء',
    icon: <Brain className="w-6 h-6 text-purple-300" />,
    color: 'purple',
  },
  {
    id: 'personality',
    title: 'Personality',
    titleArabic: 'اختبارات شخصية',
    subtitle: 'Discover yourself',
    subtitleArabic: 'حلل شخصيتك',
    icon: <Sparkles className="w-6 h-6 text-cyan-300" />,
    color: 'cyan',
  },
  {
    id: 'party',
    title: 'Party Games',
    titleArabic: 'بارتي نايت',
    subtitle: 'Multiplayer fun',
    subtitleArabic: 'لعب مع الأصدقاء',
    icon: <Users className="w-6 h-6 text-orange-300" />,
    color: 'orange',
  },
  {
    id: 'logic',
    title: 'Logic Puzzles',
    titleArabic: 'تحديات المنطق',
    subtitle: 'Solve & win',
    subtitleArabic: 'ألغاز منطقية',
    icon: <Cpu className="w-6 h-6 text-amber-300" />,
    color: 'yellow',
  },
  {
    id: 'memory',
    title: 'Memory Cards',
    titleArabic: 'اختبار الذاكرة',
    subtitle: 'Match cards',
    subtitleArabic: 'قوة الملاحظة',
    icon: <Layers className="w-6 h-6 text-emerald-300" />,
    color: 'green',
  },
  {
    id: 'speed',
    title: 'Speed Reflex',
    titleArabic: 'سرعة البديهة',
    subtitle: 'Fast reactions',
    subtitleArabic: 'رد فعل سريع',
    icon: <Zap className="w-6 h-6 text-cyan-300" />,
    color: 'blue',
  },
  {
    id: 'creativity',
    title: 'Creativity',
    titleArabic: 'الابتكار والفن',
    subtitle: 'Draw & guess',
    subtitleArabic: 'إبداع ورسم',
    icon: <Palette className="w-6 h-6 text-pink-300" />,
    color: 'pink',
  },
  {
    id: 'fun',
    title: 'Fun & Trivia',
    titleArabic: 'مرح وتسلية',
    subtitle: 'Pop culture',
    subtitleArabic: 'معلومات عامة',
    icon: <Smile className="w-6 h-6 text-orange-300" />,
    color: 'orange',
  },
  {
    id: 'relationships',
    title: 'Relationships',
    titleArabic: 'العلاقات والأصدقاء',
    subtitle: 'Match test',
    subtitleArabic: 'توافق واختبارات',
    icon: <Heart className="w-6 h-6 text-pink-300" />,
    color: 'pink',
  },
  {
    id: 'achievements',
    title: 'Challenges',
    titleArabic: 'التحديات اليومية',
    subtitle: 'Daily XP',
    subtitleArabic: 'نقاط وجوائز',
    icon: <Award className="w-6 h-6 text-amber-300" />,
    color: 'yellow',
  },
]

export const ChooseInterestsPage: React.FC = () => {
  const navigate = useNavigate()
  const { selectedInterests, toggleInterest } = useAuthStore()
  const { dir } = useThemeStore()

  const count = selectedInterests.length

  const handleContinue = () => {
    navigate('/profile-setup')
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'اختر اهتماماتك 🎯' : 'Choose Your Interests 🎯'}
      subtitle={
        dir === 'rtl'
          ? 'اختر المواضيع التي تفضلها لنخصص تجربتك وألعابك'
          : "Select the topics you love, we'll personalize your experience"
      }
      showBackButton={true}
    >
      <div className="flex flex-col gap-6">
        {/* Selection Counter Bar */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-brand-card/90 border border-brand-cardBorder text-xs font-bold">
          <span className="text-slate-300">
            {dir === 'rtl' ? 'الاهتمامات المختارة:' : 'Selected Topics:'}
          </span>
          <span className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-blue border border-cyan-400/30">
            {count} / {INTEREST_CATEGORIES.length}
          </span>
        </div>

        {/* Categories 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 max-h-[420px] overflow-y-auto pr-1">
          {INTEREST_CATEGORIES.map((cat) => {
            const isSelected = selectedInterests.includes(cat.id)
            return (
              <InterestCard
                key={cat.id}
                id={cat.id}
                title={dir === 'rtl' ? cat.titleArabic : cat.title}
                subtitle={dir === 'rtl' ? cat.subtitleArabic : cat.subtitle}
                icon={cat.icon}
                color={cat.color}
                selected={isSelected}
                onClick={() => toggleInterest(cat.id)}
              />
            )
          })}
        </div>

        {/* Continue Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          disabled={count === 0}
          rightIcon={dir === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          className="shadow-glow"
        >
          {dir === 'rtl' ? 'متابعة' : 'Continue'}
        </Button>
      </div>
    </AuthLayout>
  )
}
