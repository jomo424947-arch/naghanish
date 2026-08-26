import React from 'react'
import { Crown, Trophy, Sparkles, Award } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export interface PodiumPlayer {
  rank: 1 | 2 | 3
  name: string
  avatar: string
  xp: string
  title: string
  titleEn: string
  badge: string
}

interface PodiumDisplayProps {
  players: PodiumPlayer[]
}

export const PodiumDisplay: React.FC<PodiumDisplayProps> = ({ players }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const first = players.find((p) => p.rank === 1)
  const second = players.find((p) => p.rank === 2)
  const third = players.find((p) => p.rank === 3)

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Top 3 Visual Structure */}
      <div className="w-full max-w-2xl flex items-end justify-center gap-3 sm:gap-6 pt-10">
        {/* Rank #2 (Silver - Left) */}
        {second && (
          <div className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-slate-300 to-slate-600 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-brand-darkBg flex items-center justify-center text-3xl sm:text-4xl">
                  {second.avatar}
                </div>
              </div>
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-300 text-slate-950 shadow font-mono">
                #2
              </span>
            </div>

            <span className="text-xs sm:text-sm font-black text-white text-center truncate max-w-[120px]">
              {second.name}
            </span>
            <span className="text-[10px] font-bold text-cyan-300">{second.xp}</span>

            {/* Pillar #2 */}
            <div className="w-full h-28 sm:h-36 rounded-t-3xl bg-gradient-to-b from-slate-600/40 via-slate-800/30 to-black/60 border-t-2 border-x-2 border-slate-400/40 flex flex-col items-center justify-center p-3 shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-slate-300 font-mono">2nd</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                SILVER
              </span>
            </div>
          </div>
        )}

        {/* Rank #1 (Gold - Center / Elevated) */}
        {first && (
          <div className="flex-1 flex flex-col items-center gap-2 group -mt-6">
            <div className="relative">
              <Crown className="w-8 h-8 text-amber-400 animate-bounce absolute -top-9 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 p-1 shadow-glow-gold flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-brand-darkBg flex items-center justify-center text-4xl sm:text-5xl">
                  {first.avatar}
                </div>
              </div>
              <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-mono">
                #1
              </span>
            </div>

            <span className="text-sm sm:text-base font-black text-amber-300 text-center truncate max-w-[140px]">
              {first.name}
            </span>
            <span className="text-xs font-black text-amber-400">{first.xp}</span>

            {/* Pillar #1 */}
            <div className="w-full h-36 sm:h-48 rounded-t-3xl bg-gradient-to-b from-amber-500/30 via-yellow-600/20 to-black/70 border-t-2 border-x-2 border-amber-400/60 flex flex-col items-center justify-center p-3 shadow-glow-gold">
              <Trophy className="w-7 h-7 text-amber-400 mb-1" />
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">1st</span>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-1">
                CHAMPION 👑
              </span>
            </div>
          </div>
        )}

        {/* Rank #3 (Bronze - Right) */}
        {third && (
          <div className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-brand-darkBg flex items-center justify-center text-3xl sm:text-4xl">
                  {third.avatar}
                </div>
              </div>
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-700 text-white shadow font-mono">
                #3
              </span>
            </div>

            <span className="text-xs sm:text-sm font-black text-white text-center truncate max-w-[120px]">
              {third.name}
            </span>
            <span className="text-[10px] font-bold text-cyan-300">{third.xp}</span>

            {/* Pillar #3 */}
            <div className="w-full h-24 sm:h-32 rounded-t-3xl bg-gradient-to-b from-amber-900/40 via-amber-950/30 to-black/60 border-t-2 border-x-2 border-amber-700/40 flex flex-col items-center justify-center p-3 shadow-lg">
              <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">3rd</span>
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1">
                BRONZE
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
