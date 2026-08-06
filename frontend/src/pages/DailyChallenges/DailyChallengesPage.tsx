import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, CheckCircle2, Trophy, Zap } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { useThemeStore } from '@store/themeStore'

const CHALLENGES = [
  { id: 'c1', title: 'اختبار الذكاء اليومي', titleEn: 'Daily IQ Test', icon: '🧠', xp: 250, timeLeft: '6h 23m', done: false, category: 'Brain' },
  { id: 'c2', title: 'تحدي الذاكرة السريع', titleEn: 'Memory Speed Run', icon: '⚡', xp: 150, timeLeft: '6h 23m', done: true, category: 'Memory' },
  { id: 'c3', title: 'معادلات رياضية', titleEn: 'Math Equations', icon: '🔢', xp: 200, timeLeft: '6h 23m', done: false, category: 'Logic' },
  { id: 'c4', title: 'ألغاز الألوان', titleEn: 'Color Puzzles', icon: '🎨', xp: 180, timeLeft: '6h 23m', done: false, category: 'Speed' },
]

export const DailyChallengesPage: React.FC = () => {
  const { dir } = useThemeStore()
  const completed = CHALLENGES.filter(c => c.done).length

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'التحديات اليومية 🔥' : 'Daily Challenges 🔥'}
        subtitle={dir === 'rtl' ? 'أكمل التحديات اليومية واكسب نقاط XP' : 'Complete daily challenges to earn XP bonus'}
        icon={<Flame className="w-5 h-5 text-orange-400" />}
        badgeText={dir === 'rtl' ? 'يتجدد كل 24 ساعة' : 'Resets every 24h'}
        badgeColor="orange"
      />

      {/* Daily Progress */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-900/20 via-brand-card to-amber-900/10 border border-orange-500/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-orange-300">{dir === 'rtl' ? 'إنجاز اليوم' : "Today's Progress"}</span>
          <span className="text-sm font-black text-white">{completed}/{CHALLENGES.length}</span>
        </div>
        <ProgressIndicator currentStep={completed} totalSteps={CHALLENGES.length} variant="bar" />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span>{dir === 'rtl' ? 'يتجدد في:' : 'Resets in:'}</span>
          <span className="text-orange-300 font-black">06:23:15</span>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="flex flex-col gap-3">
        {CHALLENGES.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card
              variant={ch.done ? 'default' : 'glowing'}
              glowColor="orange"
              padding="sm"
              className={`flex items-center gap-4 ${ch.done ? 'opacity-60' : ''}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                ch.done ? 'bg-emerald-900/20 border-emerald-500/40' : 'bg-brand-darkBg border-brand-cardBorder'
              }`}>
                {ch.done ? '✅' : ch.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`font-extrabold text-sm ${ch.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {dir === 'rtl' ? ch.title : ch.titleEn}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-500 font-medium">{ch.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3" />+{ch.xp} XP
                  </span>
                </div>
              </div>

              {ch.done ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <Button variant="accent" size="sm">
                  {dir === 'rtl' ? 'ابدأ' : 'Start'}
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
