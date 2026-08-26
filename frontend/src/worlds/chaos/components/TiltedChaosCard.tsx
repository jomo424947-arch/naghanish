import React from 'react'
import { Play, Sparkles, Flame } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export interface ChaosChallengeItem {
  id: string
  title: string
  titleEn: string
  modifier: string
  modifierEn: string
  xp: string
  tilt: 'left' | 'right' | 'none'
  icon: string
}

interface TiltedChaosCardProps {
  challenge: ChaosChallengeItem
  onPlay: () => void
}

export const TiltedChaosCard: React.FC<TiltedChaosCardProps> = ({ challenge, onPlay }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const tiltClass =
    challenge.tilt === 'left'
      ? '-rotate-1 hover:rotate-0'
      : challenge.tilt === 'right'
      ? 'rotate-1 hover:rotate-0'
      : 'hover:-rotate-1'

  return (
    <div
      onClick={onPlay}
      className={`p-6 rounded-[2rem] bg-gradient-to-br from-[#1B3E22] via-[#0E2414] to-[#061008] border-2 border-lime-500/40 hover:border-lime-400 shadow-xl hover:shadow-[0_0_30px_rgba(132,204,22,0.3)] transition-all transform ${tiltClass} flex flex-col justify-between gap-4 group cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-lime-500/20 text-lime-400 border border-lime-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {challenge.icon}
        </div>
        <span className="text-[10px] font-black text-slate-950 bg-lime-400 px-2 py-0.5 rounded-full font-mono">
          {challenge.xp}
        </span>
      </div>

      <div>
        <h4 className="text-base font-black text-white group-hover:text-lime-300 transition-colors">
          {isRtl ? challenge.title : challenge.titleEn}
        </h4>
        <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-lime-300 font-bold flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{isRtl ? challenge.modifier : challenge.modifierEn}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPlay()
        }}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>{isRtl ? 'اقبل التحدي المجنون' : 'Accept Challenge'}</span>
      </button>
    </div>
  )
}
