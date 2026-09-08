/**
 * SnakeGame.tsx
 *
 * Neon Snake DX (ثعبان النيون المتطور)
 * Upgraded retro snake engine featuring:
 * - Dynamic Neon Gradient Tail (emerald head -> cyan body -> deep blue tail) with shadow blur.
 * - Dimensional Portal Wrap-around Walls with edge warp flashes and playPortal() SFX.
 * - Rare Golden Apples (x3 points + shrinks snake body by 2 segments + golden particle bursts).
 * - Speed Boost Capsules (turbo speed + double multiplier for 4 seconds).
 * - Multi-layered Particle Explosion FX & Screen Shake.
 * - Full Touch Swipe + Tactile D-pad controls for mobile and keyboard.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Trophy, Zap, Sparkles, Flame } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface SnakeGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type Point = { x: number; y: number }

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
const CELL_SIZE = 18

export const SnakeGame: React.FC<SnakeGameProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 9 },
    { x: 9, y: 10 },
    { x: 9, y: 11 },
  ])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [goldenFood, setGoldenFood] = useState<Point | null>(null)
  const [speedBoost, setSpeedBoost] = useState<Point | null>(null)
  const [isTurbo, setIsTurbo] = useState(false)
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP')
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [hasStarted, setHasStarted] = useState(false)
  const [screenShake, setScreenShake] = useState(0)
  const [portalFlash, setPortalFlash] = useState<string | null>(null)

  // Particles canvas ref
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Speed according to difficulty
  const baseSpeed = difficulty === 'Easy' ? 130 : difficulty === 'Hard' ? 85 : 105
  const [speed, setSpeed] = useState(baseSpeed)

  const directionRef = useRef(direction)
  directionRef.current = direction
  const isGameOverRef = useRef(false)
  const scoreRef = useRef(score)
  scoreRef.current = score
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const generatePoint = useCallback((currentSnake: Point[]): Point => {
    let pt: Point
    while (true) {
      pt = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      if (!currentSnake.some((s) => s.x === pt.x && s.y === pt.y)) break
    }
    return pt
  }, [])

  // Particle emission helper
  const emitParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    const px = x * CELL_SIZE + CELL_SIZE / 2
    const py = y * CELL_SIZE + CELL_SIZE / 2
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
  }, [])

  const restartGame = useCallback(() => {
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
    setMultiplier(1)
    setSpeed(baseSpeed)
    setIsGameOver(false)
    isGameOverRef.current = false
    setHasStarted(true)
  }, [baseSpeed, generatePoint])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && directionRef.current !== 'DOWN') {
        e.preventDefault()
        setDirection('UP')
        setHasStarted(true)
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && directionRef.current !== 'UP') {
        e.preventDefault()
        setDirection('DOWN')
        setHasStarted(true)
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && directionRef.current !== 'RIGHT') {
        e.preventDefault()
        setDirection('LEFT')
        setHasStarted(true)
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && directionRef.current !== 'LEFT') {
        e.preventDefault()
        setDirection('RIGHT')
        setHasStarted(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Touch / Swipe controls on board
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (Math.max(absX, absY) > 25) {
      setHasStarted(true)
      if (absX > absY) {
        if (dx > 0 && directionRef.current !== 'LEFT') setDirection('RIGHT')
        else if (dx < 0 && directionRef.current !== 'RIGHT') setDirection('LEFT')
      } else {
        if (dy > 0 && directionRef.current !== 'UP') setDirection('DOWN')
        else if (dy < 0 && directionRef.current !== 'DOWN') setDirection('UP')
      }
    }
    touchStartRef.current = null
  }

  // Periodic Golden Fruit and Speed Booster Spawner
  useEffect(() => {
    if (!hasStarted || isGameOver) return

    const bonusInterval = setInterval(() => {
      if (Math.random() < 0.4 && !goldenFood) {
        setGoldenFood(generatePoint(snake))
      }
      if (Math.random() < 0.25 && !speedBoost) {
        setSpeedBoost(generatePoint(snake))
      }
    }, 15000)

    return () => clearInterval(bonusInterval)
  }, [hasStarted, isGameOver, goldenFood, speedBoost, snake, generatePoint])

  // Game Loop
  useEffect(() => {
    if (!hasStarted || isGameOver) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        let head = { ...prevSnake[0] }
        const curDir = directionRef.current

        if (curDir === 'UP') head.y -= 1
        if (curDir === 'DOWN') head.y += 1
        if (curDir === 'LEFT') head.x -= 1
        if (curDir === 'RIGHT') head.x += 1

        // Wrap around portal walls (DX feature)
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
          setTimeout(() => setPortalFlash(null), 200)
        }

        // Self Collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          sound.playGameOver()
          emitParticles(head.x, head.y, '#f43f5e', 25)
          setScreenShake(8)
          setIsGameOver(true)
          isGameOverRef.current = true
          onFinish(scoreRef.current * 50 + 250)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Eat Speed Booster Capsule
        if (speedBoost && head.x === speedBoost.x && head.y === speedBoost.y) {
          sound.playComboX2()
          emitParticles(head.x, head.y, '#f43f5e', 16)
          setSpeedBoost(null)
          setIsTurbo(true)
          setMultiplier((m) => m + 1)
          setTimeout(() => setIsTurbo(false), 4000)
        }

        // Eat Golden Apple
        if (goldenFood && head.x === goldenFood.x && head.y === goldenFood.y) {
          sound.playCoin()
          emitParticles(head.x, head.y, '#fbbf24', 18)
          setScore((s) => s + 3 * multiplier)
          setMultiplier((m) => m + 1)
          setGoldenFood(null)
          setScreenShake(4)
          // Golden apple shrinks tail slightly as a bonus
          if (newSnake.length > 4) {
            newSnake.pop()
            newSnake.pop()
          }
        }
        // Eat Normal Apple
        else if (head.x === food.x && head.y === food.y) {
          sound.playEat()
          emitParticles(head.x, head.y, '#10b981', 10)
          setScore((s) => s + 1 * multiplier)
          setFood(generatePoint(newSnake))
          setSpeed((sp) => Math.max(55, sp - 1.5))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const currentSpeed = isTurbo ? Math.floor(speed * 0.6) : speed
    const interval = setInterval(moveSnake, currentSpeed)
    return () => clearInterval(interval)
  }, [hasStarted, isGameOver, food, goldenFood, speedBoost, generatePoint, speed, isTurbo, multiplier, emitParticles, onFinish])

  // Particle Canvas Render Loop
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const renderParticles = () => {
      ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)

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

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)
      animId = requestAnimationFrame(renderParticles)
    }

    animId = requestAnimationFrame(renderParticles)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Shake decay
  useEffect(() => {
    if (screenShake > 0) {
      const timer = setTimeout(() => setScreenShake(0), 180)
      return () => clearTimeout(timer)
    }
  }, [screenShake])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-emerald-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'النقاط:' : 'SCORE:'} {score * 50}</span>
        </div>

        {/* Turbo / Multiplier */}
        <div className="flex items-center gap-2">
          {isTurbo && (
            <span className="flex items-center gap-1 text-rose-400 font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              TURBO!
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
          {isRtl ? 'بوابات أبعاد' : 'Portal DX'}
        </span>
      </div>

      {/* Grid Canvas Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] overflow-hidden transition-all duration-75 ${
          portalFlash || ''
        }`}
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          transform: screenShake > 0 ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)` : 'none',
        }}
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:18px_18px]" />

        {/* Snake body with dynamic gradient tail */}
        {snake.map((segment, idx) => {
          // Color progression from emerald -> cyan -> blue
          const progress = idx / Math.max(1, snake.length - 1)
          const isHead = idx === 0
          return (
            <div
              key={idx}
              className="absolute rounded-md transition-all duration-75"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: isHead
                  ? '#34d399'
                  : progress < 0.5
                  ? '#06b6d4'
                  : '#3b82f6',
                boxShadow: isHead
                  ? '0 0 16px #10b981'
                  : '0 0 8px rgba(6,182,212,0.6)',
                zIndex: snake.length - idx,
              }}
            />
          )
        })}

        {/* Glowing Normal Apple */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_15px_#f43f5e] animate-pulse flex items-center justify-center text-[10px]"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
          }}
        >
          🍎
        </div>

        {/* Rare Golden Apple */}
        {goldenFood && (
          <div
            className="absolute rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_22px_#f59e0b] animate-bounce flex items-center justify-center text-[11px] z-10"
            style={{
              left: goldenFood.x * CELL_SIZE,
              top: goldenFood.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          >
            ⭐
          </div>
        )}

        {/* Speed Booster Capsule */}
        {speedBoost && (
          <div
            className="absolute rounded-full bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 shadow-[0_0_20px_#f43f5e] animate-pulse flex items-center justify-center text-[10px] z-10"
            style={{
              left: speedBoost.x * CELL_SIZE,
              top: speedBoost.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          >
            ⚡
          </div>
        )}

        {/* Particle Canvas Overlay */}
        <canvas
          ref={particleCanvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="absolute inset-0 pointer-events-none z-20"
        />

        {/* Start Overlay */}
        {!hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
            <span className="text-4xl animate-bounce">🐍</span>
            <p className="text-base font-black text-white">{isRtl ? 'ثعبان النيون DX' : 'Neon Snake DX'}</p>
            <p className="text-xs text-slate-300">
              {isRtl
                ? 'بوابات أبعاد تلتف حول الجدران، تفاح ذهبي نادر، وكبسولات سرعة خارقة!'
                : 'Portal walls, rare golden apples, and turbo speed boosters!'}
            </p>
            <Button variant="glow" size="sm" onClick={() => setHasStarted(true)}>
              {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Start Snake DX 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-rose-400">{isRtl ? 'اصطدم الثعبان!' : 'Game Over!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'النتيجة:' : 'Score:'} {score * 50}</p>
            <Button variant="glow" size="sm" onClick={restartGame} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tactile On-Screen Controls for Mobile */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={() => {
            if (directionRef.current !== 'DOWN') setDirection('UP')
            setHasStarted(true)
          }}
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              if (directionRef.current !== 'RIGHT') setDirection('LEFT')
              setHasStarted(true)
            }}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (directionRef.current !== 'LEFT') setDirection('RIGHT')
              setHasStarted(true)
            }}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => {
            if (directionRef.current !== 'UP') setDirection('DOWN')
            setHasStarted(true)
          }}
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
