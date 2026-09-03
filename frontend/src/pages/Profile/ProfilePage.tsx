import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Zap, Brain, Star, Settings, ShieldCheck, Flame, Award, Gamepad2 } from 'lucide-react'
import { Button } from '@components/common/Button'
import { Card } from '@components/common/Card'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  const isRtl = dir === 'rtl'

  const STATS = [
    {
      label: isRtl ? 'الألعاب الملعوبة' : 'Games Played',
      value: '142',
      icon: <Gamepad2 className="w-5 h-5 text-brand-purple" />,
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
    {
      label: isRtl ? 'الانتصارات الكبرى' : 'Total Wins',
      value: '89',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    {
      label: isRtl ? 'الأوسمة والجوائز' : 'Trophies',
      value: '12',
      icon: <Award className="w-5 h-5 text-cyan-300" />,
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      label: isRtl ? 'رصيد الكوينز' : 'Total Coins',
      value: `${user?.coins ?? 2450}`,
      icon: <Zap className="w-5 h-5 text-orange-400" />,
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
    },
  ]

  const defaultInterests = ['Brain Games', 'Party Night', 'Memory', 'Speed Run', 'IQ Lab']
  const userInterests = user?.interests && user.interests.length > 0 ? user.interests : defaultInterests

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO GAMER PROFILE CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="relative p-6 sm:p-8 rounded-[2rem] bg-gradient-to-r from-purple-950/60 via-brand-card to-indigo-950/60 border-2 border-brand-purple/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with Level Badge */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-purple via-indigo-600 to-cyan-400 p-1 shadow-glow flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-brand-darkBg flex items-center justify-center text-5xl">
                🧠
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 rtl:-right-auto rtl:-left-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-xs font-black text-slate-950 shadow-glow-gold">
              LVL {user?.level ?? 12}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-start">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.name ?? (isRtl ? 'أحمد علي' : 'Ahmed Ali')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                PRO GAMER
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cyan-400 font-extrabold mt-0.5">
              @{user?.username ?? 'naghanish_pro'}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 max-w-lg leading-relaxed">
              {user?.bio ?? (isRtl ? 'متحمس لتحديات السرعة والألعاب الذهنية وتحدي الشلة! 🧠🎮' : 'Passionate gamer & brain challenge champion! 🧠🎮')}
            </p>

            {/* XP Progression Bar */}
            <div className="mt-4 w-full max-w-sm mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 mb-1.5">
                <span className="text-cyan-300">XP PROGRESS</span>
                <span className="font-mono text-white">
                  {user?.xp ?? 2450} / {user?.maxXp ?? 3500} XP
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-brand-darkBg border border-brand-cardBorder overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple via-brand-blue to-cyan-300 rounded-full shadow-glow-blue"
                  style={{ width: '70%' }}
                />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="shrink-0 self-center sm:self-start border-brand-cardBorder text-white hover:border-brand-purple"
          >
            {isRtl ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. STATS CARDS GRID
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl p-5 bg-brand-card/90 border-2 ${stat.border} flex flex-col items-center gap-2.5 text-center shadow-lg hover:scale-102 transition-all`}
          >
            <div className={`p-3 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 font-extrabold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. INTERESTS / FAVOURITE MODES
      ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-brand-card/90 border-2 border-brand-cardBorder flex flex-col gap-4">
        <p className="text-xs font-black text-slate-300 uppercase tracking-wider">
          {isRtl ? 'العوالم المفضلة والاهتمامات' : 'Favorite Worlds & Interests'}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {userInterests.map((interest) => (
            <span
              key={interest}
              className="px-4 py-2 rounded-2xl bg-brand-purple/20 text-cyan-300 border border-brand-purple/40 text-xs font-black capitalize shadow-sm"
            >
              ✨ {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
