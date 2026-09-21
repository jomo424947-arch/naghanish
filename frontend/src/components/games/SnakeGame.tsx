/**
 * SnakeGame.tsx
 *
 * Neon Snake DX — portal wrap, golden apples, turbo capsules, obstacle levels,
 * fixed-timestep loop via useGameLoop, and a responsive stage.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flame, RotateCcw, Sparkles, Trophy, Zap } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  DPad,
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type Direction,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type Point = { x: number; y: number }
type Cardinal = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  radius: number
  alpha: number
  life: number
  maxLife: number
}

const GRID_SIZE = 18

/** Wall layouts per level. Empty = classic open board. */
function wallsForLevel(level: number): Point[] {
  const walls: Point[] = []
  const add = (x: number, y: number) => {
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) walls.push({ x, y })
  }

  if (level <= 1) return walls

  if (level === 2) {
    for (let i = 4; i <= 13; i++) {
      add(i, 9)
      add(9, i)
    }
  } else if (level === 3) {
    for (let i = 2; i < GRID_SIZE - 2; i++) {
      add(i, 2)
      add(i, GRID_SIZE - 3)
      add(2, i)
      add(GRID_SIZE - 3, i)
    }
    // Leave portal gaps in the middle of each side
    ;[8, 9].forEach((g) => {
      const remove = (x: number, y: number) => {
        const idx = walls.findIndex((w) => w.x === x && w.y === y)
        if (idx >= 0) walls.splice(idx, 1)
      }
      remove(g, 2)
      remove(g, GRID_SIZE - 3)
      remove(2, g)
      remove(GRID_SIZE - 3, g)
    })
  } else if (level === 4) {
    for (let i = 3; i <= 14; i++) {
      if (i !== 8 && i !== 9) {
        add(i, 5)
        add(i, 12)
      }
    }
    for (let i = 5; i <= 12; i++) {
      add(5, i)
      add(12, i)
    }
  } else {
    // Level 5+: denser maze that scales with level
    const step = Math.max(2, 6 - Math.floor(level / 2))
    for (let y = 3; y < GRID_SIZE - 3; y += step) {
      for (let x = 3; x < GRID_SIZE - 3; x++) {
        if ((x + y) % 2 === 0 && x !== 9 && y !== 9) add(x, y)
      }
    }
  }

  return walls
}

function applesNeeded(level: number): number {
  return 4 + level * 2
}

function toCardinal(direction: Direction): Cardinal {
  return direction.toUpperCase() as Cardinal
}

export const SnakeGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width: stageWidth, prepareCanvas } = useResponsiveStage({
    aspectRatio: 1,
    minWidth: 260,
    maxWidth: 420,
  })
  const cellSize = stageWidth / GRID_SIZE

  const walls = useMemo(() => wallsForLevel(level), [level])
  const wallSet = useMemo(
    () => new Set(walls.map((w) => `${w.x},${w.y}`)),
    [walls]
  )
  const targetApples = applesNeeded(level)

  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 9 },
    { x: 9, y: 10 },
    { x: 9, y: 11 },
  ])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [goldenFood, setGoldenFood] = useState<Point | null>(null)
  const [speedBoost, setSpeedBoost] = useState<Point | null>(null)
  const [isTurbo, setIsTurbo] = useState(false)
  const [direction, setDirection] = useState<Cardinal>('UP')
  const [isGameOver, setIsGameOver] = useState(false)
  const [levelCleared, setLevelCleared] = useState(false)
  const [score, setScore] = useState(0)
  const [applesEaten, setApplesEaten] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [hasStarted, setHasStarted] = useState(false)
  const [screenShake, setScreenShake] = useState(0)
  const [portalFlash, setPortalFlash] = useState<string | null>(null)

  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const moveAccumRef = useRef(0)
  const bonusAccumRef = useRef(0)

  const baseSpeedMs = difficulty === 'Easy' ? 130 : difficulty === 'Hard' ? 85 : 105
  const [speedMs, setSpeedMs] = useState(baseSpeedMs)

  const directionRef = useRef(direction)
  directionRef.current = direction
  const isGameOverRef = useRef(false)
  const levelClearedRef = useRef(false)
  const scoreRef = useRef(score)
  scoreRef.current = score
  const applesRef = useRef(applesEaten)
  applesRef.current = applesEaten
  const foodRef = useRef(food)
  foodRef.current = food
  const goldenRef = useRef(goldenFood)
  goldenRef.current = goldenFood
  const boostRef = useRef(speedBoost)
  boostRef.current = speedBoost
  const turboRef = useRef(isTurbo)
  turboRef.current = isTurbo
  const speedRef = useRef(speedMs)
  speedRef.current = speedMs
  const multiplierRef = useRef(multiplier)
  multiplierRef.current = multiplier
  const wallSetRef = useRef(wallSet)
  wallSetRef.current = wallSet
  const wallsRef = useRef(walls)
  wallsRef.current = walls
  const targetRef = useRef(targetApples)
  targetRef.current = targetApples
  const finishedRef = useRef(false)

  const generatePoint = useCallback((currentSnake: Point[], extra: (Point | null)[] = []): Point => {
    const blocked = [
      ...currentSnake,
      ...wallsRef.current,
      ...(extra.filter(Boolean) as Point[]),
    ]
    for (let tries = 0; tries < 250; tries++) {
      const pt = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      if (!blocked.some((s) => s.x === pt.x && s.y === pt.y)) return pt
    }
    return { x: 1, y: 1 }
  }, [])

  const emitParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    const px = (x + 0.5) * cellSize
    const py = (y + 0.5) * cellSize
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = Math.random() * 3 + 1
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        radius: Math.random() * 2.5 + 1.5,
        alpha: 1,
        life: 0,
        maxLife: 24,
      })
    }
  }, [cellSize])

  const resetBoard = useCallback(
    (autoStart = true) => {
      sound.playClick()
      const initialSnake = [
        { x: 9, y: 9 },
        { x: 9, y: 10 },
        { x: 9, y: 11 },
      ]
      setSnake(initialSnake)
      setFood(generatePoint(initialSnake))
      setGoldenFood(null)
      setSpeedBoost(null)
      setIsTurbo(false)
      setDirection('UP')
      directionRef.current = 'UP'
      setScore(0)
      setApplesEaten(0)
      setMultiplier(1)
      setSpeedMs(baseSpeedMs)
      setIsGameOver(false)
      setLevelCleared(false)
      isGameOverRef.current = false
      levelClearedRef.current = false
      finishedRef.current = false
      moveAccumRef.current = 0
      bonusAccumRef.current = 0
      setHasStarted(autoStart)
    },
    [baseSpeedMs, generatePoint]
  )

  // Re-seed when the selected level changes from GameShell.
  useEffect(() => {
    resetBoard(false)
  }, [level, resetBoard])

  const setSafeDirection = useCallback((next: Cardinal) => {
    const current = directionRef.current
    if (next === 'UP' && current === 'DOWN') return
    if (next === 'DOWN' && current === 'UP') return
    if (next === 'LEFT' && current === 'RIGHT') return
    if (next === 'RIGHT' && current === 'LEFT') return
    setDirection(next)
    setHasStarted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOverRef.current || levelClearedRef.current) return
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault()
        setSafeDirection('UP')
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault()
        setSafeDirection('DOWN')
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault()
        setSafeDirection('LEFT')
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault()
        setSafeDirection('RIGHT')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSafeDirection])

  const finishLevel = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared
        ? finalScore >= targetRef.current * 150
          ? 3
          : finalScore >= targetRef.current * 80
            ? 2
            : 1
        : 0
      if (cleared) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      }
      onFinish(finalScore, { levelReached: level, stars, clearedAll: false })
    },
    [level, onFinish, onLevelComplete]
  )

  const stepMove = useCallback(() => {
    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] }
      const curDir = directionRef.current
      if (curDir === 'UP') head.y -= 1
      if (curDir === 'DOWN') head.y += 1
      if (curDir === 'LEFT') head.x -= 1
      if (curDir === 'RIGHT') head.x += 1

      let didWarp = false
      if (head.x < 0) {
        head.x = GRID_SIZE - 1
        didWarp = true
        setPortalFlash('border-l-4 border-cyan-400')
      } else if (head.x >= GRID_SIZE) {
        head.x = 0
        didWarp = true
        setPortalFlash('border-r-4 border-cyan-400')
      } else if (head.y < 0) {
        head.y = GRID_SIZE - 1
        didWarp = true
        setPortalFlash('border-t-4 border-cyan-400')
      } else if (head.y >= GRID_SIZE) {
        head.y = 0
        didWarp = true
        setPortalFlash('border-b-4 border-cyan-400')
      }

      if (didWarp) {
        sound.playPortal()
        window.setTimeout(() => setPortalFlash(null), 200)
      }

      if (wallSetRef.current.has(`${head.x},${head.y}`)) {
        sound.playGameOver()
        emitParticles(head.x, head.y, '#f43f5e', 25)
        setScreenShake(8)
        setIsGameOver(true)
        isGameOverRef.current = true
        finishLevel(scoreRef.current * 50, false)
        return prevSnake
      }

      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        sound.playGameOver()
        emitParticles(head.x, head.y, '#f43f5e', 25)
        setScreenShake(8)
        setIsGameOver(true)
        isGameOverRef.current = true
        finishLevel(scoreRef.current * 50, false)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]
      const boost = boostRef.current
      const golden = goldenRef.current
      const foodNow = foodRef.current
      const mult = multiplierRef.current

      if (boost && head.x === boost.x && head.y === boost.y) {
        sound.playComboX2()
        emitParticles(head.x, head.y, '#f43f5e', 16)
        setSpeedBoost(null)
        setIsTurbo(true)
        setMultiplier((m) => m * 2)
        window.setTimeout(() => {
          setIsTurbo(false)
          setMultiplier((m) => Math.max(1, Math.floor(m / 2)))
        }, 4000)
      }

      if (golden && head.x === golden.x && head.y === golden.y) {
        sound.playCoin()
        emitParticles(head.x, head.y, '#fbbf24', 18)
        setScore((s) => s + 3 * mult)
        setMultiplier((m) => m + 1)
        setGoldenFood(null)
        setScreenShake(4)
        setApplesEaten((n) => n + 1)
        if (newSnake.length > 4) {
          newSnake.pop()
          newSnake.pop()
        }
      } else if (head.x === foodNow.x && head.y === foodNow.y) {
        sound.playEat()
        emitParticles(head.x, head.y, '#10b981', 10)
        setScore((s) => s + 1 * mult)
        setApplesEaten((n) => {
          const next = n + 1
          if (next >= targetRef.current) {
            levelClearedRef.current = true
            setLevelCleared(true)
            finishLevel((scoreRef.current + 1 * mult) * 50, true)
          }
          return next
        })
        setFood(generatePoint(newSnake, [goldenRef.current, boostRef.current]))
        setSpeedMs((sp) => Math.max(55, sp - 1.5))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [emitParticles, finishLevel, generatePoint])

  useGameLoop(
    (delta) => {
      // Particle sim + bonus spawn share the same fixed timestep.
      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
      })
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      const ctx = prepareCanvas(particleCanvasRef.current)
      if (ctx) {
        ctx.clearRect(0, 0, stageWidth, stageWidth)
        particlesRef.current.forEach((p) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1
        })
      }

      bonusAccumRef.current += delta
      if (bonusAccumRef.current >= 15) {
        bonusAccumRef.current = 0
        setSnake((current) => {
          if (Math.random() < 0.4 && !goldenRef.current) {
            setGoldenFood(generatePoint(current, [foodRef.current, boostRef.current]))
          }
          if (Math.random() < 0.25 && !boostRef.current) {
            setSpeedBoost(generatePoint(current, [foodRef.current, goldenRef.current]))
          }
          return current
        })
      }

      const stepMs = (turboRef.current ? speedRef.current * 0.6 : speedRef.current) / 1000
      moveAccumRef.current += delta
      while (moveAccumRef.current >= stepMs) {
        moveAccumRef.current -= stepMs
        if (!isGameOverRef.current && !levelClearedRef.current) stepMove()
      }
    },
    { running: hasStarted && !isGameOver && !levelCleared && !isPaused }
  )

  useEffect(() => {
    if (screenShake > 0) {
      const timer = window.setTimeout(() => setScreenShake(0), 180)
      return () => window.clearTimeout(timer)
    }
  }, [screenShake])

  const handleDpad = (dir: Direction) => setSafeDirection(toCardinal(dir))

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-emerald-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {isRtl ? 'النقاط:' : 'SCORE:'} {score * 50}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-black">
            {applesEaten}/{targetApples}
          </span>
          {isTurbo && (
            <span className="flex items-center gap-1 text-rose-400 font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              TURBO
            </span>
          )}
          {multiplier > 1 && (
            <span className="flex items-center gap-1 text-amber-300 font-black animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              {multiplier}x
            </span>
          )}
        </div>
        <span className="text-cyan-400 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          L{level}
        </span>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className={`relative rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] overflow-hidden transition-all duration-75 touch-none [overscroll-behavior:contain] ${
            portalFlash || ''
          }`}
          style={{
            width: stageWidth,
            height: stageWidth,
            transform:
              screenShake > 0
                ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)`
                : 'none',
          }}
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)]"
            style={{ backgroundSize: `${cellSize}px ${cellSize}px` }}
          />

          {walls.map((wall, idx) => (
            <div
              key={`w-${idx}`}
              className="absolute rounded-sm bg-slate-700/90 border border-rose-500/40 shadow-[0_0_6px_rgba(244,63,94,0.35)]"
              style={{
                left: wall.x * cellSize,
                top: wall.y * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
              }}
            />
          ))}

          {snake.map((segment, idx) => {
            const progress = idx / Math.max(1, snake.length - 1)
            const isHead = idx === 0
            return (
              <div
                key={idx}
                className="absolute rounded-md"
                style={{
                  left: segment.x * cellSize,
                  top: segment.y * cellSize,
                  width: cellSize - 2,
                  height: cellSize - 2,
                  backgroundColor: isHead ? '#34d399' : progress < 0.5 ? '#06b6d4' : '#3b82f6',
                  boxShadow: isHead ? '0 0 16px #10b981' : '0 0 8px rgba(6,182,212,0.6)',
                  zIndex: snake.length - idx,
                }}
              />
            )
          })}

          <div
            className="absolute rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_15px_#f43f5e] animate-pulse flex items-center justify-center"
            style={{
              left: food.x * cellSize,
              top: food.y * cellSize,
              width: cellSize - 2,
              height: cellSize - 2,
              fontSize: Math.max(8, cellSize * 0.55),
            }}
          >
            🍎
          </div>

          {goldenFood && (
            <div
              className="absolute rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_22px_#f59e0b] animate-bounce flex items-center justify-center z-10"
              style={{
                left: goldenFood.x * cellSize,
                top: goldenFood.y * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
                fontSize: Math.max(8, cellSize * 0.55),
              }}
            >
              ⭐
            </div>
          )}

          {speedBoost && (
            <div
              className="absolute rounded-full bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 shadow-[0_0_20px_#f43f5e] animate-pulse flex items-center justify-center z-10"
              style={{
                left: speedBoost.x * cellSize,
                top: speedBoost.y * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
                fontSize: Math.max(8, cellSize * 0.55),
              }}
            >
              ⚡
            </div>
          )}

          <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none z-20" />

          {!hasStarted && !isGameOver && !levelCleared && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
              <span className="text-4xl animate-bounce">🐍</span>
              <p className="text-base font-black text-white">
                {isRtl ? `المرحلة ${level}` : `Level ${level}`}
              </p>
              <p className="text-xs text-slate-300">
                {isRtl
                  ? `كل تفاح ${targetApples} للمرور · حواجز نيونية في المراحل المتقدمة`
                  : `Eat ${targetApples} apples to clear · neon walls on later levels`}
              </p>
              <Button variant="primary" size="sm" onClick={() => resetBoard(true)}>
                {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Start Snake DX 🚀'}
              </Button>
            </div>
          )}

          {levelCleared && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
              <span className="text-4xl">🏆</span>
              <p className="text-base font-black text-emerald-400">
                {isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'}
              </p>
              <p className="text-xs text-white font-mono">
                {isRtl ? 'النتيجة:' : 'Score:'} {score * 50}
              </p>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
              <span className="text-4xl">💥</span>
              <p className="text-base font-black text-rose-400">
                {isRtl ? 'اصطدم الثعبان!' : 'Game Over!'}
              </p>
              <p className="text-xs text-white font-mono">
                {isRtl ? 'النتيجة:' : 'Score:'} {score * 50}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => resetBoard(true)}
                className="flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <DPad onDirection={handleDpad} accentClass="text-emerald-400" />
    </div>
  )
}
