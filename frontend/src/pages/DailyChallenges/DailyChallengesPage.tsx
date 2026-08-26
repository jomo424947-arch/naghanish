import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Clock, CheckCircle2, Trophy, Zap, Sparkles, ArrowRight, ArrowLeft, Play } from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const CHALLENGES = [
  {
    id: 'c1',
    title: 'اختبار الذكاء والسرعة اليومي',
    titleEn: 'Daily IQ & Speed Run',
    icon: '🧠',
    xp: 250,
    timeLeft: '6h 23m',
    done: false,
    category: 'Brain Lab',
    route: `${ROUTES.GAMES}/g1`,
  },
  {
    id: 'c2',
    title: 'تحدي ردة الفعل الخاطفة',
    titleEn: 'Sub-ms Reflex Sprint',
    icon: '⚡',
    xp: 150,
    timeLeft: '6h 23m',
    done: true,
    category: 'Reflex',
    route: `${ROUTES.GAMES}/g2`,
  },
  {
    id: 'c3',
    title: 'معادلات الحساب السريع',
    titleEn: 'Rapid Math Blitz',
    icon: '🔢',
    xp: 200,
    timeLeft: '6h 23m',
    done: false,
    category: 'Logic',
    route: `${ROUTES.GAMES}/g3`,
  },
  {
    id: 'c4',
    title: 'ألغاز مطابقة الألوان المجنونة',
    titleEn: 'Chaos Color Frenzy',
    icon: '🎨',
    xp: 180,
    timeLeft: '6h 23m',
    done: false,
    category: 'Chaos',
    route: `${ROUTES.GAMES}/g4`,
  },
]

export const DailyChallengesPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const completed = CHALLENGES.filter((c) => c.done).length

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. CHAOS / DAILY HEADER BANNER
      ───────────────────────────────────────────────────────────── */}
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
          <Clock className="w-6 h-6 text-lime-400 animate-spin-slow" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">
              {isRtl ? 'يتجدد العداد بعد' : 'RESETS IN'}
            </p>
            <p className="text-lg font-black text-lime-300 font-mono">06:23:15</p>
          </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="p-5 rounded-3xl bg-brand-card/90 border-2 border-lime-500/30 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-lime-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isRtl ? 'إنجاز التحديات اليومية' : "Today's Quest Completion"}
          </span>
          <span className="text-white font-mono">
            {completed} / {CHALLENGES.length} {isRtl ? 'مكتملة' : 'Completed'}
          </span>
        </div>
        <ProgressIndicator
          currentStep={completed}
          totalSteps={CHALLENGES.length}
          variant="bar"
        />
      </div>

      {/* Challenge Cards Grid */}
      <div className="flex flex-col gap-3.5">
        {CHALLENGES.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ${
                ch.done
                  ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                  : 'bg-brand-card/90 border-brand-cardBorder hover:border-lime-400 hover:shadow-glow-lime'
              }`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 ${
                    ch.done
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-brand-darkBg border-brand-cardBorder'
                  }`}
                >
                  {ch.done ? '✓' : ch.icon}
                </div>

                <div className="min-w-0">
                  <h4
                    className={`font-black text-base truncate ${
                      ch.done ? 'text-slate-400 line-through' : 'text-white'
                    }`}
                  >
                    {isRtl ? ch.title : ch.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-bold">
                    <span className="text-cyan-300">{ch.category}</span>
                    <span>•</span>
                    <span className="text-amber-300 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />+{ch.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              {ch.done ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRtl ? 'تم الإنجاز' : 'Completed'}</span>
                </div>
              ) : (
                <Button
                  variant="chaos"
                  size="md"
                  className="w-full sm:w-auto shrink-0"
                  onClick={() => navigate(ch.route)}
                >
                  {isRtl ? 'العب الآن ⚡' : 'Start Quest ⚡'}
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
