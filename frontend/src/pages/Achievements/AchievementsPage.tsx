import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Lock, Star, Zap } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { useThemeStore } from '@store/themeStore'

const ACHIEVEMENTS = [
  { id: 'a1', title: 'أول انتصار', titleEn: 'First Win', desc: 'اربح لعبتك الأولى', descEn: 'Win your first game', icon: '🏆', xp: 50, unlocked: true, progress: 1, max: 1 },
  { id: 'a2', title: 'تحدي الأسبوع', titleEn: 'Weekly Warrior', desc: 'أكمل 7 تحديات أسبوعية', descEn: 'Complete 7 weekly challenges', icon: '🗡️', xp: 200, unlocked: true, progress: 7, max: 7 },
  { id: 'a3', title: 'عقل حاد', titleEn: 'Sharp Mind', desc: 'أكمل 50 لعبة ذهنية', descEn: 'Complete 50 brain games', icon: '🧠', xp: 500, unlocked: false, progress: 32, max: 50 },
  { id: 'a4', title: 'ملك الساعة', titleEn: 'Speed King', desc: 'انهِ لعبة في أقل من 30 ثانية', descEn: 'Finish a game in under 30s', icon: '⚡', xp: 150, unlocked: false, progress: 0, max: 1 },
  { id: 'a5', title: 'روح الفريق', titleEn: 'Team Spirit', desc: 'العب 10 ألعاب جماعية', descEn: 'Play 10 party room games', icon: '🤝', xp: 300, unlocked: false, progress: 4, max: 10 },
  { id: 'a6', title: 'نجم نغانيش', titleEn: 'Naghanish Star', desc: 'احصل على 100 انتصار', descEn: 'Win 100 total games', icon: '⭐', xp: 1000, unlocked: false, progress: 12, max: 100 },
]

export const AchievementsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'الإنجازات 🏅' : 'Achievements 🏅'}
        subtitle={dir === 'rtl' ? `${unlocked} من ${ACHIEVEMENTS.length} إنجازات مفتوحة` : `${unlocked} of ${ACHIEVEMENTS.length} achievements unlocked`}
        icon={<Gift className="w-5 h-5" />}
        badgeColor="orange"
      />

      {/* Overall Progress Bar */}
      <ProgressIndicator
        currentStep={unlocked}
        totalSteps={ACHIEVEMENTS.length}
        variant="bar"
        showLabels
      />

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              variant={ach.unlocked ? 'glowing' : 'default'}
              glowColor="orange"
              className={`flex items-center gap-4 p-5 ${!ach.unlocked ? 'opacity-70' : ''}`}
            >
              {/* Icon with lock overlay if not unlocked */}
              <div className="relative shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-md ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-amber-500/40'
                    : 'bg-brand-darkBg border-brand-cardBorder grayscale'
                }`}>
                  {ach.icon}
                </div>
                {!ach.unlocked && (
                  <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-5 h-5 rounded-full bg-brand-cardBorder flex items-center justify-center">
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                {ach.unlocked && (
                  <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-extrabold text-sm ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {dir === 'rtl' ? ach.title : ach.titleEn}
                  </h4>
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-300 shrink-0">
                    <Zap className="w-3 h-3 text-amber-400" />+{ach.xp} XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {dir === 'rtl' ? ach.desc : ach.descEn}
                </p>
                {!ach.unlocked && ach.max > 1 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>{dir === 'rtl' ? 'التقدم' : 'Progress'}</span>
                      <span>{ach.progress}/{ach.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-brand-darkBg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full"
                        style={{ width: `${(ach.progress / ach.max) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
