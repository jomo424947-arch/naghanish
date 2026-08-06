import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit3, Trophy, Zap, Brain, Star, Settings } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
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

  const STATS = [
    { label: dir === 'rtl' ? 'الألعاب' : 'Games', value: '142', icon: <Brain className="w-4 h-4 text-purple-300" /> },
    { label: dir === 'rtl' ? 'الانتصارات' : 'Wins', value: '89', icon: <Trophy className="w-4 h-4 text-amber-300" /> },
    { label: dir === 'rtl' ? 'الإنجازات' : 'Awards', value: '12', icon: <Star className="w-4 h-4 text-cyan-300" /> },
    { label: dir === 'rtl' ? 'الكوينز' : 'Coins', value: `${user?.coins ?? 2350}`, icon: <Zap className="w-4 h-4 text-amber-400" /> },
  ]

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Hero Profile Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-card via-[#1A1A36] to-[#12182F] border border-brand-cardBorder overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-4xl shadow-glow border-4 border-brand-card">
              🧠
            </div>
            <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 px-2 py-0.5 rounded-full bg-brand-orange text-[10px] font-black text-white shadow">
              LVL {user?.level ?? 12}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-right rtl:sm:text-right sm:text-left">
            <h2 className="text-2xl font-black text-white">{user?.name ?? 'أحمد علي'}</h2>
            <p className="text-sm text-brand-blue font-bold">@{user?.username ?? 'ahmed_naghanish'}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.bio ?? 'متحمس للألعاب الذهنية والتحديات! 🧠🎮'}</p>

            {/* XP Bar */}
            <div className="mt-4 w-full max-w-xs mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                <span>XP</span>
                <span className="text-brand-blue">{user?.xp ?? 2450} / {user?.maxXp ?? 3500}</span>
              </div>
              <ProgressIndicator currentStep={user?.xp ?? 2450} totalSteps={user?.maxXp ?? 3500} variant="bar" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="shrink-0 self-start"
          >
            {dir === 'rtl' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <Card key={stat.label} variant="default" className="flex flex-col items-center gap-2 py-5 text-center">
            <div className="p-2.5 rounded-xl bg-brand-darkBg border border-brand-cardBorder">{stat.icon}</div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-bold">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Interests Tags */}
      {user?.interests && user.interests.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {dir === 'rtl' ? 'الاهتمامات' : 'Interests'}
          </p>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(interest => (
              <span key={interest} className="px-3 py-1.5 rounded-xl bg-brand-purple/20 text-purple-300 border border-purple-500/30 text-xs font-bold capitalize">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
