import React from 'react'
import { Flame, Sparkles, Trophy } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export const DailyMadnessSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r from-[#173D20] via-brand-card to-[#091C10] border-2 border-lime-500/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center text-3xl shadow-glow shrink-0">
          🔥
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-lime-300 bg-lime-500/20 px-2 py-0.5 rounded border border-lime-500/40">
            {isRtl ? 'جنون اليوم (DAILY MADNESS)' : 'DAILY MADNESS EVENT'}
          </span>
          <h3 className="text-xl font-black text-white mt-1">
            {isRtl ? 'قاعدة اليوم: الشاشة المقلوبة والسرعة المضاعفة!' : 'Today\'s Twist: Inverted Screen & 2x Speed!'}
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {isRtl ? 'أكمل أي لعبة تحت شروط الفوضى واكسب +500 XP إضافية فوراً.' : 'Clear any game under chaotic modifiers to bag an instant +500 XP bonus.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="px-4 py-2 rounded-2xl bg-black/60 border border-lime-500/30 text-lime-300 font-mono font-black text-xs">
          STREAK: 5 DAYS 🔥
        </span>
      </div>
    </section>
  )
}
