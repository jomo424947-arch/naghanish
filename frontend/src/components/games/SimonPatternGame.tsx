/**
 * SimonPatternGame.tsx
 *
 * Cyber Simon Memory Matrix (ذاكرة النيون المتسلسلة)
 * Classic 4-pad sequence recall with Web Audio synthesizer notes,
 * progressive speed scaling, streak scoring, and complete cleanup on unmount.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface SimonPatternProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

const PADS = [
  { id: 0, name: 'green', freq: 330, bg: 'bg-emerald-500', activeBg: 'bg-emerald-300 shadow-[0_0_35px_#6ee7b7] brightness-125', border: 'border-emerald-400' },
  { id: 1, name: 'red', freq: 440, bg: 'bg-rose-500', activeBg: 'bg-rose-300 shadow-[0_0_35px_#fda4af] brightness-125', border: 'border-rose-400' },
  { id: 2, name: 'yellow', freq: 554, bg: 'bg-amber-400', activeBg: 'bg-yellow-200 shadow-[0_0_35px_#fef08a] brightness-125', border: 'border-amber-300' },
  { id: 3, name: 'blue', freq: 659, bg: 'bg-cyan-500', activeBg: 'bg-cyan-200 shadow-[0_0_35px_#a5f3fc] brightness-125', border: 'border-cyan-400' },
]

export const SimonPatternGame: React.FC<SimonPatternProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const [sequence, setSequence] = useState<number[]>([])
  const [userStep, setUserStep] = useState(0)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [isPlayingSeq, setIsPlayingSeq] = useState(false)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [score, setScore] = useState(0)

  const timeoutsRef = useRef<number[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current = []
  }, [])

  // Web Audio musical synth tone for each pad
  const playTone = useCallback((freq: number, durationMs = 280) => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + durationMs / 1000)
    } catch {
      // Audio not supported or blocked by policy
    }
  }, [])

  const flashPad = useCallback((padId: number, durationMs = 280) => {
    setActivePad(padId)
    playTone(PADS[padId].freq, durationMs)

    const tid = window.setTimeout(() => {
      setActivePad(null)
    }, durationMs)
    timeoutsRef.current.push(tid)
  }, [playTone])

  const playSequence = useCallback((seq: number[], roundIdx: number) => {
    setIsPlayingSeq(true)
    clearAllTimeouts()

    // Faster playback on higher rounds and difficulty
    const diffFactor = difficulty === 'Easy' ? 1.2 : difficulty === 'Hard' ? 0.8 : 1.0
    const speed = Math.max(260, Math.floor((600 - roundIdx * 25) * diffFactor))
    const flashLen = Math.floor(speed * 0.65)

    seq.forEach((padId, i) => {
      const tid = window.setTimeout(() => {
        flashPad(padId, flashLen)
        if (i === seq.length - 1) {
          const endTid = window.setTimeout(() => {
            setIsPlayingSeq(false)
            setUserStep(0)
          }, flashLen + 150)
          timeoutsRef.current.push(endTid)
        }
      }, (i + 1) * speed)
      timeoutsRef.current.push(tid)
    })
  }, [clearAllTimeouts, difficulty, flashPad])

  const startGame = () => {
    clearAllTimeouts()
    sound.playClick()
    const first = Math.floor(Math.random() * 4)
    const initSeq = [first]
    setSequence(initSeq)
    setUserStep(0)
    setScore(0)
    setGameState('PLAYING')
    playSequence(initSeq, 1)
  }

  const handlePadClick = (colorId: number) => {
    if (isPlayingSeq || gameState !== 'PLAYING') return

    flashPad(colorId, 200)

    if (colorId === sequence[userStep]) {
      // Correct step
      if (userStep + 1 === sequence.length) {
        // Round cleared!
        const nextScore = sequence.length * 150
        setScore(nextScore)
        sound.playCoin()

        const nextCol = Math.floor(Math.random() * 4)
        const newSeq = [...sequence, nextCol]
        setSequence(newSeq)

        const tid = window.setTimeout(() => {
          playSequence(newSeq, newSeq.length)
        }, 750)
        timeoutsRef.current.push(tid)
      } else {
        setUserStep(userStep + 1)
      }
    } else {
      // Wrong step!
      clearAllTimeouts()
      sound.playGameOver()
      setGameState('GAMEOVER')
      onFinish(score + 100)
    }
  }

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [clearAllTimeouts])

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto select-none">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700/80 font-mono text-xs font-black shadow-md">
        <span className="text-cyan-300 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          {isRtl ? 'النقاط:' : 'SCORE:'} {score}
        </span>
        <span className="text-purple-300 font-bold">
          {isRtl ? 'الجولة:' : 'ROUND:'} {sequence.length}
        </span>
      </div>

      {/* 4 Colored Neon Pads */}
      <div className="relative p-6 rounded-full bg-slate-950 border-4 border-slate-800 shadow-[0_0_35px_rgba(168,85,247,0.25)] flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-60 h-60">
          {PADS.map((c) => {
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
        <div className="absolute w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center text-center shadow-xl pointer-events-none">
          {isPlayingSeq ? (
            <span className="text-xs font-black text-cyan-400 animate-pulse">
              {isRtl ? 'احفظ النمط' : 'WATCH'}
            </span>
          ) : gameState === 'PLAYING' ? (
            <span className="text-xs font-black text-emerald-400">
              {isRtl ? 'كرر الآن!' : 'YOUR TURN'}
            </span>
          ) : (
            <span className="text-xs font-black text-slate-400">SIMON</span>
          )}
        </div>
      </div>

      {/* States & Controls */}
      {gameState === 'IDLE' && (
        <Button variant="primary" size="md" onClick={startGame}>
          {isRtl ? 'ابدأ تذكر النمط 🧠' : 'Start Memory Game 🧠'}
        </Button>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="p-5 rounded-3xl bg-slate-950 border-2 border-rose-500 shadow-glow flex flex-col items-center gap-2 w-full animate-bounce-short text-center">
          <span className="text-4xl">💥</span>
          <h4 className="text-base font-black text-rose-400">
            {isRtl ? 'انقطع التسلسل!' : 'Pattern Broken!'}
          </h4>
          <p className="text-xs text-slate-300">
            {isRtl
              ? `وصلت للجولة ${sequence.length} وجمعت ${score} نقطة.`
              : `Reached round ${sequence.length} with ${score} PTS.`}
          </p>
          <Button variant="primary" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}
