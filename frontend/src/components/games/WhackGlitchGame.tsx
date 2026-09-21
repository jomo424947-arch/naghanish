/**
 * WhackGlitchGame.tsx
 *
 * Chaos whack-a-mole: slap glowing glitches before they vanish. Occasional
 * fake "trap" tiles reverse scoring if hit.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameLoop, useGameShell, useResponsiveStage, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

interface Hole {
  id: number
  active: boolean
  isTrap: boolean
  ttl: number
}

function holesForLevel(level: number): number {
  return Math.min(12, 6 + Math.floor(level / 2))
}

function targetHits(level: number): number {
  return 8 + level * 3
}

function spawnInterval(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 0.9 : difficulty === 'Hard' ? 0.45 : 0.65
  return Math.max(0.28, base - (level - 1) * 0.03)
}

export const WhackGlitchGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const holeCount = holesForLevel(level)
  const target = targetHits(level)
  const cols = holeCount <= 6 ? 3 : holeCount <= 9 ? 3 : 4

  const { containerRef, width } = useResponsiveStage({
    aspectRatio: cols / Math.ceil(holeCount / cols),
    minWidth: 280,
    maxWidth: 420,
  })

  const [holes, setHoles] = useState<Hole[]>(() =>
    Array.from({ length: holeCount }, (_, id) => ({ id, active: false, isTrap: false, ttl: 0 }))
  )
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  const spawnAccum = useRef(0)
  const timeAccum = useRef(0)
  const finishedRef = useRef(false)
  const hitsRef = useRef(0)
  const scoreRef = useRef(0)

  const endRun = useCallback(
    (won: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      setIsCleared(won)
      setIsOver(!won)
      const finalScore = scoreRef.current
      const stars = won ? (finalScore > target * 60 ? 3 : 2) : finalScore > 100 ? 1 : 0
      if (won) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      } else sound.playGameOver()
      onFinish(finalScore, { levelReached: level, stars })
    },
    [level, onFinish, onLevelComplete, target]
  )

  const reset = useCallback(() => {
    sound.playClick()
    setHoles(Array.from({ length: holeCount }, (_, id) => ({ id, active: false, isTrap: false, ttl: 0 })))
    setScore(0)
    setHits(0)
    hitsRef.current = 0
    scoreRef.current = 0
    setTimeLeft(30)
    setIsOver(false)
    setIsCleared(false)
    finishedRef.current = false
    spawnAccum.current = 0
    timeAccum.current = 0
    setHasStarted(true)
  }, [holeCount])

  useEffect(() => {
    setHasStarted(false)
    setIsOver(false)
    setIsCleared(false)
    finishedRef.current = false
    setHoles(Array.from({ length: holeCount }, (_, id) => ({ id, active: false, isTrap: false, ttl: 0 })))
    setScore(0)
    setHits(0)
    setTimeLeft(30)
  }, [holeCount, level])

  useGameLoop(
    (delta) => {
      timeAccum.current += delta
      if (timeAccum.current >= 1) {
        timeAccum.current -= 1
        setTimeLeft((t) => {
          if (t <= 1) {
            endRun(hitsRef.current >= target)
            return 0
          }
          return t - 1
        })
      }

      spawnAccum.current += delta
      const interval = spawnInterval(level, difficulty)
      if (spawnAccum.current >= interval) {
        spawnAccum.current = 0
        setHoles((prev) => {
          const next = prev.map((h) => ({ ...h }))
          const inactive = next.filter((h) => !h.active)
          if (inactive.length === 0) return next
          const pick = inactive[Math.floor(Math.random() * inactive.length)]
          pick.active = true
          pick.isTrap = Math.random() < 0.18 + level * 0.02
          pick.ttl = difficulty === 'Hard' ? 0.7 : difficulty === 'Easy' ? 1.3 : 1.0
          return next
        })
      }

      setHoles((prev) =>
        prev.map((h) => {
          if (!h.active) return h
          const ttl = h.ttl - delta
          if (ttl <= 0) return { ...h, active: false, ttl: 0, isTrap: false }
          return { ...h, ttl }
        })
      )
    },
    { running: hasStarted && !isOver && !isCleared && !isPaused }
  )

  const whack = (id: number) => {
    setHoles((prev) => {
      const hole = prev.find((h) => h.id === id)
      if (!hole?.active) return prev

      if (hole.isTrap) {
        sound.playMiss()
        scoreRef.current = Math.max(0, scoreRef.current - 40)
        setScore(scoreRef.current)
      } else {
        sound.playBrickSmash()
        scoreRef.current += 50
        setScore(scoreRef.current)
        hitsRef.current += 1
        setHits(hitsRef.current)
        if (hitsRef.current >= target) {
          queueMicrotask(() => endRun(true))
        }
      }

      return prev.map((h) =>
        h.id === id ? { ...h, active: false, ttl: 0, isTrap: false } : h
      )
    })
  }

  const rows = Math.ceil(holeCount / cols)

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-lime-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-lime-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {isRtl ? 'النقاط:' : 'SCORE:'} {score}
          </span>
        </div>
        <span className="text-amber-300 font-black">
          {hits}/{target}
        </span>
        <span className="text-rose-300 font-bold">{timeLeft}s</span>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl bg-slate-950 border-2 border-lime-500/40 shadow-[0_0_28px_rgba(132,204,22,0.25)] overflow-hidden touch-none p-3"
          style={{ width, height: width * (rows / cols) }}
        >
          <div
            className="grid h-full w-full gap-2"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {holes.map((hole) => (
              <button
                key={hole.id}
                type="button"
                onPointerDown={() => whack(hole.id)}
                className={`rounded-2xl border-2 flex items-center justify-center text-2xl transition-transform active:scale-95 ${
                  hole.active
                    ? hole.isTrap
                      ? 'bg-rose-600/80 border-rose-300 shadow-[0_0_18px_#f43f5e] animate-pulse'
                      : 'bg-lime-500/80 border-lime-300 shadow-[0_0_18px_#84cc16] animate-bounce'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {hole.active ? (hole.isTrap ? '💀' : '👾') : '🕳️'}
              </button>
            ))}
          </div>

          {!hasStarted && (
            <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="text-4xl">👾</span>
              <p className="text-base font-black text-white">
                {isRtl ? 'اضرب الغليتش' : 'Whack-a-Glitch'}
              </p>
              <p className="text-xs text-slate-300">
                {isRtl
                  ? `اضرب ${target} غليتش · متضغطش على الجماجم`
                  : `Whack ${target} glitches · avoid skull traps`}
              </p>
              <Button variant="primary" size="sm" onClick={reset}>
                {isRtl ? 'ابدأ الفوضى 🚀' : 'Start Chaos 🚀'}
              </Button>
            </div>
          )}

          {(isOver || isCleared) && (
            <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="text-4xl">{isCleared ? '🏆' : '💥'}</span>
              <p className={`text-base font-black ${isCleared ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCleared
                  ? isRtl
                    ? 'فوضى مرتبة!'
                    : 'Chaos Contained!'
                  : isRtl
                    ? 'الوقت خلص!'
                    : 'Time Up!'}
              </p>
              <Button variant="primary" size="sm" onClick={reset} className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'العب تاني' : 'Play Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
