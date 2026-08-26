import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, TrendingUp, Sparkles, Award, Flame, Shield } from 'lucide-react'
import { Card } from '@components/common/Card'
import { ModeMascot } from '@components/common/ModeVisuals'
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

const RANK_STYLES: Record<
  number,
  { bg: string; text: string; ringColor: string; height: string; icon: React.ReactNode }
> = {
  1: {
    bg: 'from-amber-400/30 via-yellow-500/20 to-amber-900/30 border-amber-400 shadow-glow-gold',
    text: 'text-amber-300',
    ringColor: 'ring-amber-400',
    height: 'pt-8 pb-6',
    icon: <Crown className="w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-md" />,
  },
  2: {
    bg: 'from-slate-300/30 via-slate-400/15 to-slate-900/30 border-slate-300 shadow-lg',
    text: 'text-slate-200',
    ringColor: 'ring-slate-300',
    height: 'pt-5 pb-5',
    icon: <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />,
  },
  3: {
    bg: 'from-amber-700/30 via-orange-800/15 to-amber-950/30 border-amber-600 shadow-lg',
    text: 'text-amber-500',
    ringColor: 'ring-amber-600',
    height: 'pt-4 pb-4',
    icon: <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />,
  },
}

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  const isRtl = dir === 'rtl'

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. CHAMPIONS BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#29200B] via-brand-card to-[#1E1135] border-2 border-amber-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <ModeMascot mode="champions" size="lg" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عالم الأبطال • PRESTIGE & LEADERBOARD' : 'CHAMPIONS WORLD • PRESTIGE'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? 'لوحة الصدارة والبطولات الأسبوعية 🏆' : 'Weekly Champions & Leaderboards 🏆'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
              {isRtl
                ? 'تنافس مع نخبة اللاعبين، اجمع أعلى نقاط XP، وتربع على عرش المتصدرين.'
                : 'Climb the competitive ranks, gain maximum XP, and claim weekly glory.'}
            </p>
          </div>
        </div>

        <div className="relative z-10 px-4 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-xs font-black text-amber-300 flex items-center gap-2 shrink-0">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'يتجدد الترتيب أسبوعياً' : 'Resets Weekly'}</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MY CURRENT RANK BADGE
      ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/60 via-brand-card to-amber-950/40 border-2 border-brand-purple/50 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-3xl shadow-glow">
            🧠
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-purple/30 text-purple-300 uppercase">
              {isRtl ? 'ترتيبك في الدوري' : 'Your League Rank'}
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              {user?.name ?? (isRtl ? 'أحمد علي' : 'Ahmed Ali')}
            </h3>
          </div>
        </div>
        <div className="text-end">
          <p className="text-3xl sm:text-4xl font-black text-gradient-primary">#2</p>
          <p className="text-xs font-black text-cyan-300">{user?.xp ?? 6250} XP</p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 3D VICTORY PODIUM (Top 3 Players)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-6">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, podiumIdx) => {
          const displayRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
          const style = RANK_STYLES[displayRank]
          const isCenter = podiumIdx === 1

          return (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, y: isCenter ? -25 : 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIdx * 0.1, duration: 0.4 }}
              className={cn(
                'flex flex-col items-center text-center gap-2.5 p-4 rounded-3xl bg-gradient-to-b border-2 transition-all relative overflow-hidden',
                style.bg,
                style.height
              )}
            >
              {isCenter && (
                <span className="absolute top-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase shadow">
                  CHAMPION
                </span>
              )}

              <div className="mt-1">{style.icon}</div>
              <div className="text-3xl sm:text-4xl drop-shadow-md">{player.avatar}</div>

              <div>
                <p className="text-xs sm:text-sm font-black text-white leading-tight">
                  {isRtl ? player.name : player.nameEn}
                </p>
                <p className={cn('text-xs font-black mt-0.5', style.text)}>
                  {player.xp.toLocaleString()} XP
                </p>
              </div>

              <span className="text-[10px] font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-md">
                {player.badge}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. FULL RANKINGS LIST
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">
          {isRtl ? 'كافة المتسابقين في الدوري' : 'All Competitors'}
        </h3>

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
                'p-4 rounded-2xl flex items-center justify-between gap-4 border-2 transition-all',
                isMe
                  ? 'bg-brand-purple/25 border-cyan-400/80 shadow-glow-blue'
                  : 'bg-brand-card/90 border-brand-cardBorder hover:border-slate-500'
              )}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={cn(
                    'w-8 text-center font-black text-base',
                    style ? style.text : 'text-slate-400'
                  )}
                >
                  {style ? style.icon : `#${player.rank}`}
                </span>

                <div className="w-11 h-11 rounded-xl bg-brand-darkBg flex items-center justify-center text-2xl border border-brand-cardBorder shrink-0">
                  {player.avatar}
                </div>

                <div>
                  <p className={cn('font-black text-sm sm:text-base', isMe ? 'text-cyan-300' : 'text-white')}>
                    {isRtl ? player.name : player.nameEn}
                    {isMe && (
                      <span className="mx-2 text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/40">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{player.badge}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm sm:text-base font-black text-white">
                  {player.xp.toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-300 font-black">XP</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
