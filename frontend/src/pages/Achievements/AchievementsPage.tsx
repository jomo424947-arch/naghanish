import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Zap, Trophy, Sparkles, Award, CheckCircle2, Gift } from 'lucide-react'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { httpClient } from '@api/httpClient'

interface AchievementItem {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: string
  category: string
  tier: string
  xpReward: number
  coinsReward: number
  progress: number
  maxProgress: number
  unlocked: boolean
  claimed: boolean
}

export const AchievementsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()
  const isRtl = dir === 'rtl'

  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [claimMessage, setClaimMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch live achievements from backend
    httpClient
      .get('/achievements')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAchievements(res.data)
        }
      })
      .catch(() => {
        setAchievements([])
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleClaim = async (ach: AchievementItem) => {
    setClaimingId(ach.id)
    try {
      const res = await httpClient.post(`/achievements/${ach.id}/claim`)
      if (res.data) {
        setClaimMessage(res.data.message || (isRtl ? 'تم استلام الجائزة بنجاح! 🎉' : 'Reward claimed! 🎉'))
        if (user) {
          updateProfile({
            xp: (user.xp || 0) + ach.xpReward,
            coins: (user.coins || 100) + ach.coinsReward,
          })
        }
        setAchievements((prev) =>
          prev.map((a) => (a.id === ach.id ? { ...a, claimed: true } : a))
        )
      }
    } catch {
      // Local claim fallback
      if (user) {
        updateProfile({
          xp: (user.xp || 0) + ach.xpReward,
          coins: (user.coins || 100) + ach.coinsReward,
        })
      }
      setAchievements((prev) =>
        prev.map((a) => (a.id === ach.id ? { ...a, claimed: true } : a))
      )
      setClaimMessage(isRtl ? 'تم استلام الجائزة بنجاح! 🎉' : 'Reward claimed! 🎉')
    } finally {
      setClaimingId(null)
      setTimeout(() => setClaimMessage(null), 4000)
    }
  }

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  )

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const percentage = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto pb-20">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#291B0B] via-brand-card to-[#1E1135] border-2 border-amber-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-glow-gold text-slate-950 shrink-0">
            🎖️
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              {isRtl ? 'الإنجازات والجوائز • TROPHY ROOM' : 'ACHIEVEMENTS • TROPHY ROOM'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {isRtl ? 'خزانة الجوائز والأوسمة 🏅' : 'Achievements & Trophy Room 🏅'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1">
              {isRtl
                ? `تم فتح ${unlockedCount} من أصل ${totalCount} إنجازات. افتح المزيد لرفع مستواك وجمع العملات.`
                : `${unlockedCount} of ${totalCount} trophies unlocked. Keep playing to level up.`}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-xs font-black text-amber-300 flex items-center gap-2 shrink-0 font-mono">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{percentage}% {isRtl ? 'مكتمل' : 'UNLOCKED'}</span>
        </div>
      </div>

      {/* Claim Message Alert */}
      <AnimatePresence>
        {claimMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 text-emerald-200 text-sm font-black flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{claimMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Progress Bar */}
      <div className="p-5 rounded-3xl bg-brand-card/90 border border-brand-cardBorder flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-amber-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            {isRtl ? 'التقدم الإجمالي للإنجازات' : 'Overall Trophy Progression'}
          </span>
          <span className="text-white font-mono">
            {unlockedCount} / {totalCount}
          </span>
        </div>
        <ProgressIndicator currentStep={unlockedCount} totalSteps={totalCount} variant="bar" />
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {[
          { id: 'all', labelAr: 'الكل 🌌', labelEn: 'All' },
          { id: 'games', labelAr: 'الألعاب 🎮', labelEn: 'Games' },
          { id: 'arcade', labelAr: 'الأركيد 🕹️', labelEn: 'Arcade' },
          { id: 'reflex', labelAr: 'ردة الفعل ⚡', labelEn: 'Reflex' },
          { id: 'iqlab', labelAr: 'مختبر الذكاء 🧠', labelEn: 'IQ Lab' },
          { id: 'party', labelAr: 'الشلة 🎉', labelEn: 'Party' },
          { id: 'champions', labelAr: 'الأبطال 🏆', labelEn: 'Champions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedCategory === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-glow-gold'
                : 'bg-brand-card text-slate-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* 4. Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredAchievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-950/30 via-brand-card to-amber-900/20 border-amber-400/60 shadow-glow-gold'
                  : 'bg-brand-card/70 border-brand-cardBorder opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-md ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-amber-400/20 to-yellow-600/20 border-amber-400 text-white'
                        : 'bg-brand-darkBg border-brand-cardBorder grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>
                  {!ach.unlocked ? (
                    <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-slate-400" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[9px] shadow">
                      ✓
                    </div>
                  )}
                </div>

                {/* Text info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`font-black text-sm truncate ${
                        ach.unlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {isRtl ? ach.titleAr : ach.titleEn}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                    {isRtl ? ach.descAr : ach.descEn}
                  </p>

                  {/* Progress Bar if not unlocked */}
                  {!ach.unlocked && ach.maxProgress > 1 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>{isRtl ? 'التقدم' : 'Progress'}</span>
                        <span>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brand-darkBg overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-brand-purple to-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reward & Claim Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-black text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />+{ach.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1 font-black text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />+{ach.coinsReward} Coins
                  </span>
                </div>

                {ach.unlocked && !ach.claimed && (
                  <Button
                    variant="gold"
                    size="sm"
                    isLoading={claimingId === ach.id}
                    onClick={() => handleClaim(ach)}
                    leftIcon={<Gift className="w-3.5 h-3.5" />}
                  >
                    {isRtl ? 'استلام الجائزة 🎁' : 'Claim 🎁'}
                  </Button>
                )}


                {ach.claimed && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/30">
                    {isRtl ? 'تم الاستلام ✓' : 'Claimed ✓'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
