/**
 * SnakeGame.tsx
 *
 * Neon Snake 2.0 with Golden Apples, Speed Boosts, Wrap-around portal walls, and combo scoring.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Trophy, Zap, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface SnakeGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type Point = { x: number; y: number }
const GRID_SIZE = 18
const CELL_SIZE = 18

export const SnakeGame: React.FC<SnakeGameProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
  ])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [goldenFood, setGoldenFood] = useState<Point | null>(null)
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP')
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [hasStarted, setHasStarted] = useState(false)

  // Speed according to difficulty
  const baseSpeed = difficulty === 'Easy' ? 140 : difficulty === 'Hard' ? 90 : 115
  const [speed, setSpeed] = useState(baseSpeed)

  const directionRef = useRef(direction)
  directionRef.current = direction

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

  const restartGame = () => {
    sound.playClick()
    const initialSnake = [
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 8, y: 10 },
    ]
    setSnake(initialSnake)
    setFood(generatePoint(initialSnake))
    setGoldenFood(null)
    setDirection('UP')
    directionRef.current = 'UP'
    setScore(0)
    setMultiplier(1)
    setSpeed(baseSpeed)
    setIsGameOver(false)
    setHasStarted(true)
  }

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

        // In Easy mode: Wrap around edges! In Medium/Hard: Wall hits
        if (difficulty === 'Easy') {
          if (head.x < 0) head.x = GRID_SIZE - 1
          if (head.x >= GRID_SIZE) head.x = 0
          if (head.y < 0) head.y = GRID_SIZE - 1
          if (head.y >= GRID_SIZE) head.y = 0
        } else {
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            sound.playGameOver()
            setIsGameOver(true)
            onFinish(score * 50 + 200)
            return prevSnake
          }
        }

        // Self Collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          sound.playGameOver()
          setIsGameOver(true)
          onFinish(score * 50 + 200)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Eat Golden Food
        if (goldenFood && head.x === goldenFood.x && head.y === goldenFood.y) {
          sound.playCoin()
          setScore((s) => s + 5)
          setMultiplier((m) => m + 1)
          setGoldenFood(null)
        }
        // Eat Normal Food
        else if (head.x === food.x && head.y === food.y) {
          sound.playEat()
          setScore((s) => s + 1)
          setFood(generatePoint(newSnake))
          setSpeed((sp) => Math.max(65, sp - 2))

          // 25% chance to spawn special golden fruit
          if (Math.random() < 0.25 && !goldenFood) {
            setGoldenFood(generatePoint(newSnake))
          }
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [hasStarted, isGameOver, food, goldenFood, generatePoint, speed, score, difficulty, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-emerald-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'النقاط:' : 'SCORE:'} {score * 50}</span>
        </div>
        {multiplier > 1 && (
          <span className="flex items-center gap-1 text-amber-300 font-black animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            {multiplier}x Combo
          </span>
        )}
        <span className="text-slate-400 font-bold">
          {difficulty === 'Easy' ? (isRtl ? 'بوابات مفتوحة 🌀' : 'Portals 🌀') : (isRtl ? 'جدران قاتلة 🧱' : 'Walls 🧱')}
        </span>
      </div>

      {/* Grid Canvas Board */}
      <div
        className="relative rounded-3xl bg-slate-950 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] overflow-hidden"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:18px_18px]" />

        {/* Snake body */}
        {snake.map((segment, idx) => (
          <div
            key={idx}
            className={`absolute rounded-md transition-all ${
              idx === 0
                ? 'bg-gradient-to-r from-emerald-300 to-green-400 shadow-[0_0_15px_#34d399] z-10'
                : 'bg-emerald-500/80 shadow-[0_0_6px_#10b981]'
            }`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        ))}

        {/* Glowing Normal Food */}
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

        {/* Golden Bonus Food */}
        {goldenFood && (
          <div
            className="absolute rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_20px_#f59e0b] animate-bounce flex items-center justify-center text-[11px] z-10"
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

        {/* Start Overlay */}
        {!hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-20">
            <span className="text-4xl animate-bounce">🐍</span>
            <p className="text-base font-black text-white">{isRtl ? 'ثعبان النيون 2.0' : 'Neon Snake 2.0'}</p>
            <p className="text-xs text-slate-300">
              {isRtl ? 'التقط التفاح العادي والنجوم الذهبية وحطم الرقم القياسي!' : 'Collect apples and golden stars!'}
            </p>
            <Button variant="primary" size="sm" onClick={() => setHasStarted(true)}>
              {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Start Snake 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-20">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-rose-400">{isRtl ? 'اصطدم الثعبان!' : 'Game Over!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'النتيجة:' : 'Score:'} {score * 50}</p>
            <Button variant="primary" size="sm" onClick={restartGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      {/* Touch On-Screen Controls for Mobile */}
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
