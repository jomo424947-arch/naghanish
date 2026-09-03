import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, CheckCircle2, Zap, Sparkles, Gift } from 'lucide-react'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { httpClient } from '@api/httpClient'

interface MissionItem {
  id: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: string
  targetCount: number
  currentCount: number
  xpReward: number
  coinsReward: number
  completed: boolean
  claimed: boolean
  expiresIn?: string
}

const DEFAULT_MISSIONS: MissionItem[] = [
  {
    id: 'm_play_3_arcade',
    titleAr: 'بطل الأركيد اليومي 🕹️',
    titleEn: 'Daily Arcade Hero 🕹️',
    descAr: 'العب 3 مباريات في كابينات عالم الأركيد.',
    descEn: 'Play 3 matches in Arcade World cabinets.',
    icon: '🕹️',
    targetCount: 3,
    currentCount: 2,
    xpReward: 350,
    coinsReward: 75,
    completed: false,
    claimed: false,
  },
  {
    id: 'm_reflex_lightning',
    titleAr: 'صاعقة ردة الفعل ⚡',
    titleEn: 'Reflex Lightning Strike ⚡',
    descAr: 'حقق 3 محاولات استجابة سريعة في حلبة السرعة.',
    descEn: 'Achieve 3 fast reaction rounds in Speed Arena.',
    icon: '⚡',
    targetCount: 3,
    currentCount: 3,
    xpReward: 400,
    coinsReward: 80,
    completed: true,
    claimed: false,
  },
  {
    id: 'm_math_rapid',
    titleAr: 'تمرين العقل الصباحي 🧮',
    titleEn: 'Morning Math Sprint 🧮',
    descAr: 'أكمل جولة حساب ذهني واحدة بنجاح.',
    descEn: 'Complete 1 mental math calculation sprint.',
    icon: '🧮',
    targetCount: 1,
    currentCount: 1,
    xpReward: 250,
    coinsReward: 50,
    completed: true,
    claimed: true,
  },
  {
    id: 'm_shilla_invite',
    titleAr: 'اجتماع الشلة 🎉',
    titleEn: 'Crew Gathering 🎉',
    descAr: 'ادخل غرفة لعب جماعي مع صديق.',
    descEn: 'Join a party room with a friend.',
    icon: '🎉',
    targetCount: 1,
    currentCount: 0,
    xpReward: 500,
    coinsReward: 100,
    completed: false,
    claimed: false,
  },
]

export const DailyChallengesPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()
  const isRtl = dir === 'rtl'

  const [missions, setMissions] = useState<MissionItem[]>(DEFAULT_MISSIONS)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [claimMsg, setClaimMsg] = useState<string | null>(null)

  useEffect(() => {
    httpClient
      .get('/missions')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setMissions(res.data)
        }
      })
      .catch(() => {})
  }, [])

  const handleClaimReward = async (m: MissionItem) => {
    setClaimingId(m.id)
    try {
      const res = await httpClient.post(`/missions/${m.id}/claim`)
      if (res.data) {
        setClaimMsg(res.data.message || (isRtl ? 'تم استلام مكافأة التحدي! 🎯' : 'Quest reward claimed! 🎯'))
        if (user) {
          updateProfile({
            xp: (user.xp || 0) + m.xpReward,
            coins: (user.coins || 100) + m.coinsReward,
          })
        }
        setMissions((prev) =>
          prev.map((item) => (item.id === m.id ? { ...item, claimed: true } : item))
        )
      }
    } catch {
      if (user) {
        updateProfile({
          xp: (user.xp || 0) + m.xpReward,
          coins: (user.coins || 100) + m.coinsReward,
        })
      }
      setMissions((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, claimed: true } : item))
      )
      setClaimMsg(isRtl ? 'تم استلام مكافأة التحدي! 🎯' : 'Quest reward claimed! 🎯')
    } finally {
      setClaimingId(null)
      setTimeout(() => setClaimMsg(null), 4000)
    }
  }

  const completedCount = missions.filter((m) => m.completed).length

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto pb-20">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#172714] via-brand-card to-[#28180E] border-2 border-lime-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <ModeMascot mode="chaos" size="lg" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/20 border border-lime-400/40 text-lime-300 text-xs font-black mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>{isRtl ? 'عالم الفوضى والتحديات اليومية' : 'DAILY CHAOS & CHALLENGES'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? 'تحديات اليوم بنقاط XP مضاعفة 🔥' : 'Daily Challenges & Bonus XP 🔥'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
              {isRtl
                ? 'أكمل مهامك اليومية قبل انتهاء العداد لتكسب نقاط الـ XP وجوائز المتجر الحصرية.'
                : 'Finish all daily quests before the timer resets to earn massive XP boosts.'}
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="relative z-10 p-4 rounded-2xl bg-black/50 border border-lime-400/40 flex items-center gap-3 shrink-0">
          <Clock className="w-6 h-6 text-lime-400" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">
              {isRtl ? 'يتجدد العداد بعد' : 'RESETS IN'}
            </p>
            <p className="text-lg font-black text-lime-300 font-mono">14:25:00</p>
          </div>
        </div>
      </div>

      {/* Claim Message Alert */}
      <AnimatePresence>
        {claimMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-lime-500/20 border-2 border-lime-400/60 text-lime-200 text-sm font-black flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-lime-400" />
            <span>{claimMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Progress */}
      <div className="p-5 rounded-3xl bg-brand-card/90 border-2 border-lime-500/30 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-lime-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isRtl ? 'إنجاز التحديات اليومية' : "Today's Quest Completion"}
          </span>
          <span className="text-white font-mono">
            {completedCount} / {missions.length} {isRtl ? 'مكتملة' : 'Completed'}
          </span>
        </div>
        <ProgressIndicator
          currentStep={completedCount}
          totalSteps={missions.length}
          variant="bar"
        />
      </div>

      {/* Challenge Cards Grid */}
      <div className="flex flex-col gap-3.5">
        {missions.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ${
                m.completed
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-brand-card/90 border-brand-cardBorder hover:border-lime-400'
              }`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 ${
                    m.completed
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-brand-darkBg border-brand-cardBorder'
                  }`}
                >
                  {m.completed ? '✓' : m.icon}
                </div>

                <div className="min-w-0">
                  <h4 className="font-black text-base text-white truncate">
                    {isRtl ? m.titleAr : m.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {isRtl ? m.descAr : m.descEn}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-amber-300 font-black flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />+{m.xpReward} XP
                    </span>
                    <span className="text-cyan-300 font-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />+{m.coinsReward} Coins
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {m.completed && !m.claimed && (
                  <Button
                    variant="gold"
                    size="md"
                    isLoading={claimingId === m.id}
                    onClick={() => handleClaimReward(m)}
                    leftIcon={<Gift className="w-4 h-4" />}
                  >
                    {isRtl ? 'استلام الجائزة 🎁' : 'Claim Reward 🎁'}
                  </Button>
                )}


                {m.completed && m.claimed && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? 'تم الاستلام ✓' : 'Claimed ✓'}</span>
                  </div>
                )}

                {!m.completed && (
                  <Button
                    variant="chaos"
                    size="md"
                    onClick={() => navigate(ROUTES.GAMES)}
                  >
                    {isRtl ? 'العب الآن ⚡' : 'Start Quest ⚡'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
