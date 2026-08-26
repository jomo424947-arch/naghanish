import React from 'react'
import { Swords, Trophy, Clock, Play } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export const TournamentSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="p-6 rounded-[2.5rem] bg-gradient-to-r from-[#2B1B04] via-brand-card to-[#19082C] border-2 border-amber-500/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-glow-gold shrink-0">
          🏆
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
            {isRtl ? 'البطولة الكبرى الأسبوعية' : 'WEEKLY GRAND CUP'}
          </span>
          <h3 className="text-xl font-black text-white mt-1">
            {isRtl ? 'كأس أبطال نغنِش الماسي 2026' : 'Naghanish Diamond Champions Cup'}
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {isRtl ? 'جائزة المركز الأول: 10,000 كوينز + وسام التاج الذهبي الدائم' : 'Grand Prize: 10,000 Coins + Permanent Gold Crown Badge'}
          </p>
        </div>
      </div>

      <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-glow-gold hover:scale-105 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
        <Swords className="w-4 h-4" />
        <span>{isRtl ? 'التسجيل في البطولة (متاح الآن)' : 'Register for Cup'}</span>
      </button>
    </section>
  )
}
