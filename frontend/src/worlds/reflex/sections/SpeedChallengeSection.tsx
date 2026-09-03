import React from 'react'
import { Zap } from 'lucide-react'
import { getGamesByWorld } from '@data/games.data'
import { ReflexTestCard } from '../components/ReflexTestCard'
import { useThemeStore } from '@store/themeStore'

interface SpeedChallengeSectionProps {
  onPlayTest: (route: string) => void
}

export const SpeedChallengeSection: React.FC<SpeedChallengeSectionProps> = ({ onPlayTest }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const reflexGames = getGamesByWorld('reflex')

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center text-lg shadow-sm border border-red-500/30">
            ⚡
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'اختبارات وتحديات سرعة الاستجابة' : 'Reaction & Timing Arenas'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تحديات دقيقة تحسب أجزاء الثانية بالمللي ثانية دون مجال للخطأ' : 'Sub-millisecond precision speed challenges with zero latency'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reflexGames.map((game) => (
          <ReflexTestCard key={game.id} game={game} onPlay={onPlayTest} />
        ))}
      </div>
    </section>
  )
}
