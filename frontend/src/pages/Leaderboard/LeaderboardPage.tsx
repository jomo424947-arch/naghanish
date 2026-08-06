import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

const LEADERBOARD = [
  { rank: 1, name: 'علي محمد', nameEn: 'Ali Mohamed', avatar: '🏆', xp: 8420, badge: 'Grandmaster' },
  { rank: 2, name: 'أحمد علي', nameEn: 'Ahmed Ali', avatar: '🧠', xp: 6250, badge: 'Master' },
  { rank: 3, name: 'يوسف أحمد', nameEn: 'Yousef Ahmed', avatar: '⚡', xp: 5180, badge: 'Expert' },
  { rank: 4, name: 'ليلى سعيد', nameEn: 'Layla Said', avatar: '🌟', xp: 4320, badge: 'Pro' },
  { rank: 5, name: 'سارة خالد', nameEn: 'Sara Khaled', avatar: '🎯', xp: 3900, badge: 'Pro' },
  { rank: 6, name: 'محمد فاروق', nameEn: 'Mohamed Farouk', avatar: '🦅', xp: 3410, badge: 'Player' },
  { rank: 7, name: 'رنا وليد', nameEn: 'Rana Walid', avatar: '🎮', xp: 2980, badge: 'Player' },
]

const RANK_STYLES: Record<number, { bg: string; text: string; icon: React.ReactNode }> = {
  1: { bg: 'from-amber-400/30 to-amber-600/10 border-amber-400/50', text: 'text-amber-300', icon: <Crown className="w-5 h-5 text-amber-400" /> },
  2: { bg: 'from-slate-300/20 to-slate-500/10 border-slate-400/40', text: 'text-slate-200', icon: <Medal className="w-5 h-5 text-slate-300" /> },
  3: { bg: 'from-amber-700/30 to-amber-900/10 border-amber-700/40', text: 'text-amber-600', icon: <Medal className="w-5 h-5 text-amber-600" /> },
}

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'لوحة الصدارة 🏆' : 'Leaderboard 🏆'}
        subtitle={dir === 'rtl' ? 'المتنافسون الأوائل هذا الأسبوع' : 'Top competitors this week'}
        icon={<Trophy className="w-5 h-5" />}
        badgeText={dir === 'rtl' ? 'أسبوعي' : 'Weekly'}
        badgeColor="orange"
      />

      {/* My Rank Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-blue/20 border border-brand-purple/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-2xl shadow-glow">🧠</div>
          <div>
            <p className="text-xs font-bold text-slate-400">{dir === 'rtl' ? 'ترتيبك الحالي' : 'Your Current Rank'}</p>
            <h3 className="text-xl font-black text-white">{user?.name ?? 'أحمد علي'}</h3>
          </div>
        </div>
        <div className="text-right rtl:text-right text-left">
          <p className="text-3xl font-black text-gradient-primary">#2</p>
          <p className="text-xs font-bold text-brand-blue">{user?.xp ?? 6250} XP</p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, podiumIdx) => {
          const displayRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
          const style = RANK_STYLES[displayRank]
          const isCenter = podiumIdx === 1
          return (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, y: isCenter ? -20 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIdx * 0.1 }}
              className={cn(
                'flex flex-col items-center text-center gap-2 p-4 rounded-3xl bg-gradient-to-b border',
                style.bg,
                isCenter ? 'pt-6 pb-5' : 'pt-4 pb-4'
              )}
            >
              {style.icon}
              <div className="text-3xl">{player.avatar}</div>
              <p className="text-xs font-extrabold text-white leading-tight">{dir === 'rtl' ? player.name : player.nameEn}</p>
              <p className={cn('text-[11px] font-black', style.text)}>{player.xp.toLocaleString()} XP</p>
            </motion.div>
          )
        })}
      </div>

      {/* Full Rankings List */}
      <div className="flex flex-col gap-2">
        {LEADERBOARD.map((player, i) => {
          const isMe = player.rank === 2
          const style = RANK_STYLES[player.rank]
          return (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all',
                isMe
                  ? 'bg-brand-purple/20 border-brand-purple/60 shadow-glow'
                  : 'bg-brand-card border-brand-cardBorder hover:border-slate-600'
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn('w-8 text-center font-black text-sm', style ? style.text : 'text-slate-400')}>
                  {style ? style.icon : `#${player.rank}`}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-darkBg flex items-center justify-center text-xl border border-brand-cardBorder">{player.avatar}</div>
                <div>
                  <p className={cn('font-bold text-sm', isMe ? 'text-brand-blue' : 'text-white')}>
                    {dir === 'rtl' ? player.name : player.nameEn}
                    {isMe && <span className="ml-2 rtl:ml-0 rtl:mr-2 text-[10px] bg-brand-blue/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">YOU</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{player.badge}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-sm font-black text-white">{player.xp.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold">XP</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
