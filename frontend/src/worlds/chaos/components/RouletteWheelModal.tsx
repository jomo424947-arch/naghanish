import React, { useState, useEffect } from 'react'
import { X, Play, Sparkles, Shuffle } from 'lucide-react'
import { getRandomGame, GameItem } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'

interface RouletteWheelModalProps {
  isOpen: boolean
  onClose: () => void
  onLaunchGame: (route: string) => void
}

export const RouletteWheelModal: React.FC<RouletteWheelModalProps> = ({ isOpen, onClose, onLaunchGame }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsSpinning(true)
      let count = 0
      const interval = setInterval(() => {
        setSelectedGame(getRandomGame())
        count++
        if (count > 15) {
          clearInterval(interval)
          setIsSpinning(false)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen || !selectedGame) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-[#1E4324] via-[#0E2414] to-[#061008] border-4 border-lime-500/60 shadow-[0_0_50px_rgba(132,204,22,0.5)] flex flex-col items-center text-center gap-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-500/20 text-lime-300 border border-lime-500/40">
            {isRtl ? 'نتيجة روليت الفوضى 🎲' : 'CHAOS ROULETTE RESULT 🎲'}
          </span>
          <h3 className="text-2xl font-black text-white">
            {isSpinning ? (isRtl ? 'جاري اختيار اللعبة المجنونة...' : 'Spinning Chaos Wheel...') : (isRtl ? 'لعبتك المختارة هي:' : 'Your Selected Challenge:')}
          </h3>
        </div>

        {/* Selected Game Card */}
        <div className={`p-6 rounded-3xl bg-black/60 border-2 border-lime-400/50 flex flex-col items-center gap-3 w-full ${isSpinning ? 'animate-pulse' : 'scale-105 transition-transform'}`}>
          <div className="text-5xl">{selectedGame.icon}</div>
          <h4 className="text-xl font-black text-lime-300">
            {isRtl ? selectedGame.titleAr : selectedGame.title}
          </h4>
          <p className="text-xs text-slate-300">
            {isRtl ? selectedGame.descAr : selectedGame.descEn}
          </p>
        </div>

        <button
          disabled={isSpinning}
          onClick={() => {
            onClose()
            onLaunchGame(selectedGame.route)
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-yellow-400 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRtl ? 'ابدأ اللعبة فوراً 🚀' : 'Launch Game Now 🚀'}</span>
        </button>
      </div>
    </div>
  )
}
