import React from 'react'
import { Trophy, Zap, Award } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export interface LeaderboardPlayerItem {
  rank: number
  name: string
  avatar: string
  level: number
  xp: string
  wins: number
  badge: string
}

interface LeaderboardRowProps {
  player: LeaderboardPlayerItem
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ player }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/40 hover:bg-black/60 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <span className="w-7 sm:w-8 text-center font-mono font-black text-sm text-slate-400">
          #{player.rank}
        </span>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xl shrink-0">
          {player.avatar}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-black text-white truncate">{player.name}</h5>
            <span className="hidden sm:inline-flex text-[9px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
              {player.badge}
            </span>
          </div>
          <span className="text-[10px] font-black text-cyan-400">LVL {player.level}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 font-mono">
        <div className="text-end">
          <span className="text-xs sm:text-sm font-black text-amber-400 block">{player.xp}</span>
          <span className="text-[10px] text-slate-400">{player.wins} {isRtl ? 'انتصار' : 'Wins'}</span>
        </div>
      </div>
    </div>
  )
}
