import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Star } from 'lucide-react'
import { getGamesByWorld } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

export const IQBrainGamesSection: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const brainGames = getGamesByWorld('iqlab')

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-lg shadow-sm border border-violet-500/30">
            🧩
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'ألعاب وتحديات المنطق والحساب' : 'Brain Logic & Math Challenges'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تمارين ذهنية يومية لرفع التركيز وسرعة الاستنتاج الرياضي' : 'Neuro-agility games designed to train rapid logic & math computation'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {brainGames.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(game.route)}
            className="p-6 rounded-[2rem] bg-gradient-to-b from-[#22133E] via-brand-card to-[#120824] border border-violet-500/40 hover:border-violet-300 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all flex flex-col justify-between gap-4 group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0',
                  `bg-gradient-to-br ${game.color}`
                )}
              >
                {game.icon}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{game.stars}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-md border border-violet-500/30">
                {game.categoryAr}
              </span>
              <h4 className="text-lg font-black text-white group-hover:text-violet-300 transition-colors mt-1.5">
                {isRtl ? game.titleAr : game.title}
              </h4>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                {isRtl ? game.descAr : game.descEn}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs font-black text-cyan-300">+{game.xpReward} XP</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(game.route)
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRtl ? 'ابدأ التحدي' : 'Play Brain'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
