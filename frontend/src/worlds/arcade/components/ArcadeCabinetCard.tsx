import React from 'react'
import { Play, Star, Trophy, Sparkles } from 'lucide-react'
import { GameItem } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface ArcadeCabinetCardProps {
  game: GameItem
  onPlay: (route: string) => void
}

export const ArcadeCabinetCard: React.FC<ArcadeCabinetCardProps> = ({ game, onPlay }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div
      onClick={() => onPlay(game.route)}
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-[#130E32] via-[#0E0B25] to-[#080516] border-2 border-cyan-400/40 hover:border-cyan-300 shadow-xl hover:shadow-[0_0_35px_rgba(0,210,255,0.35)] transition-all flex flex-col justify-between gap-5 group cursor-pointer"
    >
      {/* Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #00D2FF 0px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Header: Machine Screen Title & Best Score */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-cyan-400/40 shrink-0 group-hover:scale-105 transition-transform',
              `bg-gradient-to-br ${game.color}`
            )}
          >
            {game.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                {game.categoryAr}
              </span>
              {game.isNew && (
                <span className="text-[10px] font-black text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-md border border-pink-500/30">
                  NEW
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mt-1">
              {isRtl ? game.titleAr : game.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-amber-400 font-black">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{game.stars}</span>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 text-xs text-slate-300 font-medium leading-relaxed">
        {isRtl ? game.descAr : game.descEn}
      </p>

      {/* Cabinet Score Counter Screen */}
      <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-cyan-500/30 font-mono">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{isRtl ? 'أفضل رقم:' : 'HI-SCORE:'}</span>
        </div>
        <span className="text-xs font-black text-cyan-300 tracking-wider">
          {game.bestScore || '00,000 PTS'}
        </span>
      </div>

      {/* Footer / Coin Slot Action */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs font-black text-purple-400">+{game.xpReward} XP</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlay(game.route)
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-xs shadow-glow-blue hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isRtl ? 'ابدأ اللعب (1 COIN)' : 'PLAY (1 COIN)'}</span>
        </button>
      </div>
    </div>
  )
}
