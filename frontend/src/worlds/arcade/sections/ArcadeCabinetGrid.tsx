import React from 'react'
import { Gamepad2 } from 'lucide-react'
import { getGamesByWorld } from '@data/games.data'
import { ArcadeCabinetCard } from '../components/ArcadeCabinetCard'
import { useThemeStore } from '@store/themeStore'

interface ArcadeCabinetGridProps {
  filterType?: string
  onPlayGame: (route: string) => void
}

export const ArcadeCabinetGrid: React.FC<ArcadeCabinetGridProps> = ({ filterType = 'all', onPlayGame }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const arcadeGames = getGamesByWorld('arcade')

  const filteredGames = arcadeGames.filter((g) => {
    if (filterType === 'new') return g.isNew
    if (filterType === 'retro') return g.category === 'Retro'
    return true
  })

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg shadow-sm border border-cyan-500/30">
            🕹️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'كابينات وألعاب الأركيد الكلاسيكية' : 'Arcade Game Cabinets'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'ألعاب وتحديات فردية تنافسية لكسر الأرقام القياسية' : 'Smash high scores on legendary neon retro machines'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <ArcadeCabinetCard key={game.id} game={game} onPlay={onPlayGame} />
        ))}
      </div>
    </section>
  )
}
