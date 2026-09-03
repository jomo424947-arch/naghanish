import React, { useState } from 'react'
import { Shuffle, Sparkles, Flame, Play } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

interface GiantRandomButtonProps {
  onSpin: () => void
}

export const GiantRandomButton: React.FC<GiantRandomButtonProps> = ({ onSpin }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const [isWobbling, setIsWobbling] = useState(false)

  const handleClick = () => {
    setIsWobbling(true)
    setTimeout(() => setIsWobbling(false), 600)
    onSpin()
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 rounded-[3rem] bg-gradient-to-b from-[#1E4324] via-[#102916] to-[#08150B] border-4 border-lime-500/60 shadow-[0_0_50px_rgba(132,204,22,0.35)] relative overflow-hidden text-center gap-6">
      {/* Quirky background elements */}
      <div className="absolute -top-10 -right-10 text-8xl opacity-20 pointer-events-none select-none">
        🤪
      </div>
      <div className="absolute -bottom-10 -left-10 text-8xl opacity-20 pointer-events-none select-none">
        🎲
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-lime-500/20 text-lime-300 border border-lime-500/40">
          {isRtl ? 'زر الفوضى العشوائي المطلق' : 'CHAOS RANDOM GENERATOR'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          {isRtl ? 'مش عارف تبدأ بإيه؟ سيبها على الفوضى!' : 'Unsure what to play? Let Chaos decide!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md font-medium">
          {isRtl
            ? 'اضغط الزر العملاق وسنختار لك تحدياً مجنوناً بقواعد غير متوقعة!'
            : 'Press the giant button to spin random crazy modifiers and surprise challenges!'}
        </p>
      </div>

      {/* GIANT INTERACTIVE CHAOS BUTTON */}
      <button
        onClick={handleClick}
        className={`relative z-10 px-8 sm:px-14 py-6 sm:py-8 rounded-[2.5rem] bg-gradient-to-r from-lime-400 via-emerald-400 to-yellow-400 text-slate-950 font-black text-xl sm:text-2xl shadow-[0_0_40px_rgba(132,204,22,0.6)] hover:shadow-[0_0_60px_rgba(132,204,22,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 cursor-pointer group ${
          isWobbling ? 'animate-bounce' : ''
        }`}
      >
        <span className="text-3xl sm:text-4xl group-hover:rotate-45 transition-transform">🎲</span>
        <span className="tracking-wide">
          {isRtl ? '؟ ماذا ستلعب اليوم؟ (اضغط هنا)' : 'WHAT WILL YOU PLAY? (SPIN)'}
        </span>
        <span className="text-3xl sm:text-4xl group-hover:-rotate-45 transition-transform">🤪</span>
      </button>
    </div>
  )
}
