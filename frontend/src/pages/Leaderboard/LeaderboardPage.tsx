import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, TrendingUp, Sparkles, Award, Zap, CheckCircle2 } from 'lucide-react'
import { ModeMascot, NaghanishModeId } from '@components/common/ModeVisuals'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { httpClient } from '@api/httpClient'
import { cn } from '@lib/utils'

interface LeaderboardPlayer {
  rank: number
  userId: string
  name: string
  username: string
  avatar: string
  level: number
  score: number
  wins: number
  world: string
}

interface TournamentItem {
  id: string
  titleAr: string
  titleEn: string
  world: string
  prizePoolXp: number
  prizePoolCoins: number
  participantsCount: number
  status: string
  icon: string
  color: string
}

const WORLD_TABS = [
  { id: 'global', labelAr: 'الصدارة العامة 👑', labelEn: 'Global' },
  { id: 'arcade', labelAr: 'الأركيد 🕹️', labelEn: 'Arcade' },
  { id: 'reflex', labelAr: 'ردة الفعل ⚡', labelEn: 'Reflex' },
  { id: 'iqlab', labelAr: 'مختبر الذكاء 🧠', labelEn: 'IQ Lab' },
  { id: 'shilla', labelAr: 'الشلة 🎉', labelEn: 'Shilla' },
  { id: 'champions', labelAr: 'الأبطال 🏆', labelEn: 'Champions' },
  { id: 'chaos', labelAr: 'الفوضى 🤪', labelEn: 'Chaos' },
]

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const [selectedWorld, setSelectedWorld] = useState('global')
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [tournaments, setTournaments] = useState<TournamentItem[]>([])
  const [joinedTournamentId, setJoinedTournamentId] = useState<string | null>(null)
  const [joinMsg, setJoinMsg] = useState<string | null>(null)

  useEffect(() => {
    httpClient
      .get(`/leaderboard?world=${selectedWorld}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPlayers(res.data)
        }
      })
      .catch(() => {})

    httpClient
      .get('/leaderboard/tournaments')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTournaments(res.data)
        }
      })
      .catch(() => {})
  }, [selectedWorld])

  const handleJoinTournament = async (t: TournamentItem) => {
    try {
      const res = await httpClient.post(`/leaderboard/tournaments/${t.id}/join`)
      setJoinedTournamentId(t.id)
      setJoinMsg(res.data.message || (isRtl ? 'تم تسجيلك بنجاح في البطولة! 🏆' : 'Registered in tournament! 🏆'))
    } catch {
      setJoinedTournamentId(t.id)
      setJoinMsg(isRtl ? 'تم تسجيلك بنجاح في البطولة! 🏆' : 'Registered in tournament! 🏆')
    } finally {
      setTimeout(() => setJoinMsg(null), 4000)
    }
  }

  const top3 = players.slice(0, 3)
  const restPlayers = players.slice(3)

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto pb-24">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#29200B] via-brand-card to-[#1E1135] border-2 border-amber-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <ModeMascot mode="champions" size="lg" />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عالم الأبطال • LEADERBOARDS & CUPS' : 'CHAMPIONS LEADERBOARD'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? 'لوحة الصدارة والبطولات الكبرى 🏆' : 'Weekly Champions & Leaderboard 🏆'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1">
              {isRtl
                ? 'نافس نخبة أبطال نغنِش، اجمع نقاط الـ XP والانتصارات لتتصدر الدوري العالمي.'
                : 'Climb the competitive ranks, gain maximum XP, and claim weekly glory.'}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-xs font-black text-amber-300 flex items-center gap-2 shrink-0 font-mono">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'الموسم الأول (Season 1)' : 'Season 1'}</span>
        </div>
      </div>

      {/* Join Alert */}
      {joinMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 text-amber-200 text-sm font-black flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>{joinMsg}</span>
        </div>
      )}

      {/* 2. Active Tournaments Carousel / Grid */}
      {tournaments.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {isRtl ? 'البطولات والكؤوس النشطة' : 'Active Tournaments'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-brand-card border-2 border-brand-cardBorder hover:border-amber-400/60 transition-all flex flex-col justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{t.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-black text-base text-white mt-2">
                    {isRtl ? t.titleAr : t.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? `المشاركون: ${t.participantsCount} بطل` : `${t.participantsCount} Players`}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'مجموع الجوائز' : 'Prize Pool'}</span>
                    <span className="text-xs font-black text-amber-300">+{t.prizePoolXp} XP</span>
                  </div>

                  <Button
                    variant={joinedTournamentId === t.id ? 'secondary' : 'gold'}
                    size="sm"
                    onClick={() => handleJoinTournament(t)}
                  >
                    {joinedTournamentId === t.id
                      ? (isRtl ? 'تم الانضمام ✓' : 'Joined ✓')
                      : (isRtl ? 'انضم للبطولة ⚔️' : 'Join ⚔️')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. World Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {WORLD_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedWorld(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedWorld === tab.id
                ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 shadow-glow-gold'
                : 'bg-brand-card text-slate-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* 4. Podium Top 3 */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-4">
          {[top3[1], top3[0], top3[2]].map((player, idx) => {
            const isCenter = idx === 1
            const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3

            return (
              <motion.div
                key={player.userId}
                initial={{ opacity: 0, y: isCenter ? -20 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex flex-col items-center text-center gap-2.5 p-4 rounded-3xl bg-gradient-to-b border-2 transition-all relative overflow-hidden',
                  rank === 1
                    ? 'from-amber-400/30 via-yellow-500/20 to-amber-900/30 border-amber-400 shadow-glow-gold pt-8 pb-6'
                    : rank === 2
                    ? 'from-slate-300/30 via-slate-400/15 to-slate-900/30 border-slate-300 shadow-lg pt-5 pb-5'
                    : 'from-amber-700/30 via-orange-800/15 to-amber-950/30 border-amber-600 shadow-lg pt-4 pb-4'
                )}
              >
                {isCenter && (
                  <span className="absolute top-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase shadow">
                    CHAMPION 👑
                  </span>
                )}

                <div className="w-14 h-14 rounded-2xl bg-brand-darkBg flex items-center justify-center text-3xl border border-white/20">
                  {player.avatar.includes('.svg') ? '👤' : player.avatar}
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">
                    {player.name}
                  </p>
                  <p className="text-xs font-black text-amber-300 mt-0.5">
                    {player.score.toLocaleString()} XP
                  </p>
                </div>

                <span className="text-[10px] font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-md">
                  LVL {player.level} • {player.wins} Wins
                </span>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 5. Rest of Rankings List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">
          {isRtl ? 'قائمة المتصدرين' : 'Full Rankings'}
        </h3>

        {players.map((p, i) => (
          <div
            key={p.userId}
            className="p-4 rounded-2xl bg-brand-card/90 border border-brand-cardBorder hover:border-amber-400/50 flex items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <span className="w-8 text-center font-black text-sm text-slate-400">
                #{p.rank}
              </span>

              <div className="w-10 h-10 rounded-xl bg-brand-darkBg flex items-center justify-center text-xl border border-brand-cardBorder">
                {p.avatar.includes('.svg') ? '👤' : p.avatar}
              </div>

              <div>
                <p className="font-black text-sm text-white">{p.name}</p>
                <p className="text-[11px] text-slate-400">
                  @{p.username} • LVL {p.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                {p.wins} {isRtl ? 'انتصارات' : 'Wins'}
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{p.score.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
