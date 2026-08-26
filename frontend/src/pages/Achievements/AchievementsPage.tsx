import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Lock, Star, Zap, Trophy, Sparkles, Award, ShieldCheck } from 'lucide-react'
import { Card } from '@components/common/Card'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { ModeMascot } from '@components/common/ModeVisuals'
import { useThemeStore } from '@store/themeStore'

const ACHIEVEMENTS = [
  { id: 'a1', title: 'أول انتصار ساحق', titleEn: 'First Victory', desc: 'اربح لعبتك الأولى في أي عالم', descEn: 'Win your first game in any world', icon: '🏆', xp: 50, unlocked: true, progress: 1, max: 1, tier: 'GOLD' },
  { id: 'a2', title: 'محارب الأسبوع', titleEn: 'Weekly Warrior', desc: 'أكمل 7 تحديات أسبوعية متتالية', descEn: 'Complete 7 weekly challenges', icon: '🗡️', xp: 200, unlocked: true, progress: 7, max: 7, tier: 'GOLD' },
  { id: 'a3', title: 'عقل عبقري', titleEn: 'Genius Mind', desc: 'أكمل 50 لعبة ذهنية واختبار ذكاء', descEn: 'Complete 50 brain games and quizzes', icon: '🧠', xp: 500, unlocked: false, progress: 32, max: 50, tier: 'DIAMOND' },
  { id: 'a4', title: 'سيد السرعة الخارقة', titleEn: 'Speed Master', desc: 'انهِ اختبار ردة الفعل في أقل من 250ms', descEn: 'Finish reaction test in under 250ms', icon: '⚡', xp: 150, unlocked: false, progress: 0, max: 1, tier: 'SILVER' },
  { id: 'a5', title: 'روح الشلة', titleEn: 'Crew Spirit', desc: 'العب 10 ألعاب جماعية مع الأصدقاء', descEn: 'Play 10 party room games with friends', icon: '🤝', xp: 300, unlocked: false, progress: 4, max: 10, tier: 'DIAMOND' },
  { id: 'a6', title: 'أسطورة نغانيش', titleEn: 'Naghanish Legend', desc: 'احصل على 100 انتصار في كافة الألعاب', descEn: 'Win 100 total games across worlds', icon: '👑', xp: 1000, unlocked: false, progress: 12, max: 100, tier: 'LEGEND' },
]

export const AchievementsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. ACHIEVEMENTS HEADER BANNER
      ───────────────────────────────────────────────────────────── */}
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
                ? `تم فتح ${unlocked} من أصل ${ACHIEVEMENTS.length} إنجازات. افتح المزيد لرفع مستواك.`
                : `${unlocked} of ${ACHIEVEMENTS.length} trophies unlocked. Keep playing to level up.`}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-xs font-black text-amber-300 flex items-center gap-2 shrink-0">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{Math.round((unlocked / ACHIEVEMENTS.length) * 100)}% UNLOCKED</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-5 rounded-3xl bg-brand-card/90 border border-brand-cardBorder flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-amber-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            {isRtl ? 'التقدم الإجمالي للإنجازات' : 'Overall Trophy Progression'}
          </span>
          <span className="text-white font-mono">
            {unlocked} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <ProgressIndicator
          currentStep={unlocked}
          totalSteps={ACHIEVEMENTS.length}
          variant="bar"
        />
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div
              className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-950/30 via-brand-card to-amber-900/20 border-amber-400/60 shadow-glow-gold'
                  : 'bg-brand-card/70 border-brand-cardBorder opacity-75'
              }`}
            >
              {/* Icon */}
              <div className="relative shrink-0">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-md ${
                    ach.unlocked
                      ? 'bg-gradient-to-br from-amber-400/20 to-yellow-600/20 border-amber-400 text-white'
                      : 'bg-brand-darkBg border-brand-cardBorder grayscale'
                  }`}
                >
                  {ach.icon}
                </div>
                {!ach.unlocked ? (
                  <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] shadow">
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
                    {isRtl ? ach.title : ach.titleEn}
                  </h4>
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-300 shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />+{ach.xp} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
                  {isRtl ? ach.desc : ach.descEn}
                </p>

                {!ach.unlocked && ach.max > 1 && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span>{isRtl ? 'التقدم' : 'Progress'}</span>
                      <span>
                        {ach.progress} / {ach.max}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-brand-darkBg overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-cyan-400 rounded-full"
                        style={{ width: `${(ach.progress / ach.max) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
