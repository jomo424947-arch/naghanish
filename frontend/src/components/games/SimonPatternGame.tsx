import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'

interface SimonPatternProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const COLORS = [
  { id: 0, name: 'green', bg: 'bg-emerald-500', activeBg: 'bg-emerald-300 shadow-[0_0_25px_#6ee7b7]', border: 'border-emerald-400' },
  { id: 1, name: 'red', bg: 'bg-rose-500', activeBg: 'bg-rose-300 shadow-[0_0_25px_#fda4af]', border: 'border-rose-400' },
  { id: 2, name: 'yellow', bg: 'bg-amber-400', activeBg: 'bg-yellow-200 shadow-[0_0_25px_#fef08a]', border: 'border-amber-300' },
  { id: 3, name: 'blue', bg: 'bg-cyan-500', activeBg: 'bg-cyan-200 shadow-[0_0_25px_#a5f3fc]', border: 'border-cyan-400' },
]

export const SimonPatternGame: React.FC<SimonPatternProps> = ({ onFinish, isRtl }) => {
  const [sequence, setSequence] = useState<number[]>([])
  const [userStep, setUserStep] = useState(0)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [isPlayingSeq, setIsPlayingSeq] = useState(false)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [score, setScore] = useState(0)

  const startGame = () => {
    const first = Math.floor(Math.random() * 4)
    setSequence([first])
    setUserStep(0)
    setScore(0)
    setGameState('PLAYING')
    playSequence([first])
  }

  const playSequence = (seq: number[]) => {
    setIsPlayingSeq(true)
    let idx = 0
    const interval = setInterval(() => {
      if (idx < seq.length) {
        setActivePad(seq[idx])
        setTimeout(() => setActivePad(null), 380)
        idx++
      } else {
        clearInterval(interval)
        setIsPlayingSeq(false)
        setUserStep(0)
      }
    }, 600)
  }

  const handlePadClick = (colorId: number) => {
    if (isPlayingSeq || gameState !== 'PLAYING') return

    // Flash clicked pad
    setActivePad(colorId)
    setTimeout(() => setActivePad(null), 200)

    if (colorId === sequence[userStep]) {
      // Correct click
      if (userStep + 1 === sequence.length) {
        // Completed this round!
        const nextScore = (sequence.length) * 150
        setScore(nextScore)
        const nextCol = Math.floor(Math.random() * 4)
        const newSeq = [...sequence, nextCol]
        setSequence(newSeq)
        setTimeout(() => playSequence(newSeq), 800)
      } else {
        setUserStep(userStep + 1)
      }
    } else {
      // Wrong click
      setGameState('GAMEOVER')
      onFinish(score + 100)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-5 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder font-mono text-xs font-black">
        <span className="text-cyan-300 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          {isRtl ? 'النقاط:' : 'SCORE:'} {score}
        </span>
        <span className="text-purple-300">
          {isRtl ? 'الجولة:' : 'ROUND:'} {sequence.length}
        </span>
      </div>

      {/* 4 Colored Neon Pads */}
      <div className="relative p-6 rounded-full bg-brand-darkBg border-4 border-white/10 shadow-[0_0_35px_rgba(168,85,247,0.25)] flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-60 h-60">
          {COLORS.map((c) => {
            const isFlashing = activePad === c.id
            return (
              <button
                key={c.id}
                disabled={isPlayingSeq || gameState !== 'PLAYING'}
                onClick={() => handlePadClick(c.id)}
                className={`rounded-3xl border-2 transition-all duration-150 cursor-pointer active:scale-95 ${c.border} ${
                  isFlashing ? c.activeBg + ' scale-105' : c.bg + ' opacity-75 hover:opacity-100'
                }`}
              />
            )
          })}
        </div>

        {/* Center Indicator */}
        <div className="absolute w-20 h-20 rounded-full bg-brand-darkBg border-2 border-white/20 flex flex-col items-center justify-center text-center shadow-lg pointer-events-none">
          {isPlayingSeq ? (
            <span className="text-[10px] font-black text-amber-300 animate-pulse">
              {isRtl ? 'تذكّر...' : 'WATCH...'}
            </span>
          ) : (
            <span className="text-[10px] font-black text-cyan-300">
              {isRtl ? 'دورك!' : 'REPEAT!'}
            </span>
          )}
        </div>

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 rounded-full bg-black/85 flex flex-col items-center justify-center gap-3 p-6 text-center z-10">
            <span className="text-4xl animate-bounce">🧩</span>
            <p className="text-sm font-black text-white">{isRtl ? 'سيد الأنماط المتسلسلة' : 'Simon Pattern Master'}</p>
            <p className="text-[11px] text-slate-300 leading-tight">
              {isRtl ? 'احفظ ترتيب إضاءة الألوان وأعد الضغط عليها بنفس الترتيب!' : 'Watch the color sequence and repeat it accurately!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ التحدي 🚀' : 'Start Game 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 rounded-full bg-black/90 flex flex-col items-center justify-center gap-3 p-6 text-center z-10">
            <span className="text-3xl">💥</span>
            <p className="text-sm font-black text-red-400">{isRtl ? 'تسلسل خاطئ!' : 'Wrong Pattern!'}</p>
            <p className="text-xs text-white font-mono">{score} PTS</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'إعادة ⚡' : 'Retry ⚡'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
