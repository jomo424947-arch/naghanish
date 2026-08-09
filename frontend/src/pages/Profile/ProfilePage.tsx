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
    {
      label: dir === 'rtl' ? 'الألعاب' : 'Games',
      value: '142',
      icon: <Brain className="w-5 h-5 text-brand-purple" />,
      badgeBg: 'bg-brand-purple/10 border-brand-purple/25',
    },
    {
      label: dir === 'rtl' ? 'الانتصارات' : 'Wins',
      value: '89',
      icon: <Trophy className="w-5 h-5 text-brand-gold" />,
      badgeBg: 'bg-brand-gold/10 border-brand-gold/25',
    },
    {
      label: dir === 'rtl' ? 'الإنجازات' : 'Awards',
      value: '12',
      icon: <Star className="w-5 h-5 text-brand-blue" />,
      badgeBg: 'bg-brand-blue/10 border-brand-blue/25',
    },
    {
      label: dir === 'rtl' ? 'الكوينز' : 'Coins',
      value: `${user?.coins ?? 2350}`,
      icon: <Zap className="w-5 h-5 text-brand-orange" />,
      badgeBg: 'bg-brand-orange/10 border-brand-orange/25',
    },
  ]

  const defaultInterests = ['Brain Games', 'Party Night', 'Memory', 'Speed', 'Relationships']
  const userInterests = user?.interests && user.interests.length > 0 ? user.interests : defaultInterests

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Hero Profile Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-lg overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-4xl shadow-glow border-4 border-brand-card text-white">
              🧠
            </div>
            <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 px-2.5 py-0.5 rounded-full bg-brand-orange text-[10px] font-black text-white shadow">
              LVL {user?.level ?? 12}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-right rtl:sm:text-right sm:text-left">
            <h2 className="text-2xl font-black text-foreground">{user?.name ?? 'مستخدم Google'}</h2>
            <p className="text-sm text-brand-blue font-extrabold">@{user?.username ?? 'google_player'}</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">{user?.bio ?? 'متحمس للألعاب الذهنية والتحديات! 🧠🎮'}</p>

            {/* XP Bar */}
            <div className="mt-4 w-full max-w-xs mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-muted-foreground mb-1.5">
                <span>XP</span>
                <span className="text-brand-purple">{user?.xp ?? 2450} / {user?.maxXp ?? 3500}</span>
              </div>
              <ProgressIndicator currentStep={user?.xp ?? 2450} totalSteps={user?.maxXp ?? 3500} variant="bar" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="shrink-0 self-start border-brand-cardBorder text-foreground hover:bg-brand-surface"
          >
            {dir === 'rtl' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map(stat => (
          <Card key={stat.label} variant="default" className="flex flex-col items-center gap-3 py-6 text-center shadow-sm">
            <div className={`p-3 rounded-2xl border flex items-center justify-center shadow-sm ${stat.badgeBg}`}>
              {stat.icon}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-extrabold">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Interests Tags */}
      <div>
        <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">
          {dir === 'rtl' ? 'الاهتمامات' : 'Interests'}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {userInterests.map(interest => (
            <span
              key={interest}
              className="px-4 py-2 rounded-2xl bg-brand-purple/10 text-brand-purple border border-brand-purple/25 text-xs font-black capitalize shadow-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
