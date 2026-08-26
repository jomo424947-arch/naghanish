import React from 'react'
import { Trophy, Zap, Crown } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

const TOP_SCORES = [
  { rank: 1, game: 'Memory Cards Master 🃏', player: 'CyberGamer99', score: '14 moves (World Record)', xp: '+500 XP' },
  { rank: 2, game: 'Retro Pixel Runner 👾', player: 'NeonKnight', score: '9,450 pts', xp: '+350 XP' },
  { rank: 3, game: 'Neon Color Rush 🎨', player: 'FastFingers', score: '1,840 pts', xp: '+250 XP' },
]

export const HighScoresSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-4 p-6 rounded-[2rem] bg-gradient-to-br from-[#120B2C] via-brand-card to-[#070A1E] border-2 border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'لوحة الشرف: أعلى الأرقام القياسية (HIGH SCORES)' : 'ARCADE HALL OF FAME: HIGH SCORES'}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOP_SCORES.map((s) => (
          <div
            key={s.rank}
            className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 flex items-center justify-between gap-3 font-mono"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                s.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-glow-gold' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                #{s.rank}
              </span>
              <div>
                <span className="text-xs font-black text-white block truncate">{s.game}</span>
                <span className="text-[11px] text-slate-400">{s.player}</span>
              </div>
            </div>
            <div className="text-end">
              <span className="text-xs font-black text-cyan-300 block">{s.score}</span>
              <span className="text-[10px] text-purple-400">{s.xp}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
