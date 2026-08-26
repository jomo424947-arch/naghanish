import React from 'react'
import { Play, Zap, Flame, Clock } from 'lucide-react'
import { GameItem } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface ReflexTestCardProps {
  game: GameItem
  onPlay: (route: string) => void
}

export const ReflexTestCard: React.FC<ReflexTestCardProps> = ({ game, onPlay }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div
      onClick={() => onPlay(game.route)}
      className="p-6 rounded-[2rem] bg-gradient-to-br from-[#2D0B0B] via-[#1C0606] to-[#0D0303] border-2 border-red-500/40 hover:border-red-400 shadow-xl hover:shadow-[0_0_35px_rgba(239,68,68,0.35)] transition-all flex flex-col justify-between gap-5 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-red-500/40 shrink-0 group-hover:scale-110 transition-transform',
              `bg-gradient-to-br ${game.color}`
            )}
          >
            {game.icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-red-300 bg-red-500/20 px-2 py-0.5 rounded-md border border-red-500/30">
              {game.categoryAr}
            </span>
            <h3 className="text-lg font-black text-white group-hover:text-red-300 transition-colors mt-1">
              {isRtl ? game.titleAr : game.title}
            </h3>
          </div>
        </div>

        <span className="text-xs font-black text-amber-400 font-mono">
          {game.bestScore || '0.22s'}
        </span>
      </div>

      <p className="text-xs text-slate-300 font-medium leading-relaxed">
        {isRtl ? game.descAr : game.descEn}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs font-black text-orange-400">+{game.xpReward} XP</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay(game.route)
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRtl ? 'اختبر سرعتك ⚡' : 'Test Speed ⚡'}</span>
        </button>
      </div>
    </div>
  )
}
