import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Play, Star } from 'lucide-react'
import { getGamesByWorld } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

export const ShillaGamesSection: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const partyGames = getGamesByWorld('shilla')

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg shadow-sm border border-cyan-500/30">
            🎮
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'ألعاب وتحديات الشلة الحصرية' : 'Exclusive Party Games'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'ألعاب مصممة خصيصاً للجلسات والتنافس الجماعي' : 'Multiplayer party games built for groups and laughs'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {partyGames.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(game.route)}
            className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-950/40 via-brand-card to-black/60 border border-cyan-500/40 hover:border-cyan-400 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all flex flex-col justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0',
                    `bg-gradient-to-br ${game.color}`
                  )}
                >
                  {game.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {game.playersCount || 'Multiplayer'}
                  </span>
                  <h4 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mt-1">
                    {isRtl ? game.titleAr : game.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-cyan-300 font-black">
                <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>{game.stars}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {isRtl ? game.descAr : game.descEn}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs font-black text-teal-400">+{game.xpReward} XP</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(game.route)
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRtl ? 'العب جماعي' : 'Play Party'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
