import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@utils/soundManager'

interface SnakeGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

type Point = { x: number; y: number }
const GRID_SIZE = 18
const CELL_SIZE = 18

export const SnakeGame: React.FC<SnakeGameProps> = ({ onFinish, isRtl }) => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 8, y: 9 },
    { x: 8, y: 10 },
  ])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP')
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(130)
  const [hasStarted, setHasStarted] = useState(false)

  const directionRef = useRef(direction)
  directionRef.current = direction

  const generateFood = useCallback((): Point => {
    const x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
    const y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
    return { x, y }
  }, [])

  const restartGame = () => {
    setSnake([
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 8, y: 10 },
    ])
    setFood(generateFood())
    setDirection('UP')
    directionRef.current = 'UP'
    setScore(0)
    setSpeed(130)
    setIsGameOver(false)
    setHasStarted(true)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && directionRef.current !== 'DOWN') {
        setDirection('UP')
        setHasStarted(true)
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && directionRef.current !== 'UP') {
        setDirection('DOWN')
        setHasStarted(true)
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && directionRef.current !== 'RIGHT') {
        setDirection('LEFT')
        setHasStarted(true)
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && directionRef.current !== 'LEFT') {
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
        const head = { ...prevSnake[0] }
        const curDir = directionRef.current

        if (curDir === 'UP') head.y -= 1
        if (curDir === 'DOWN') head.y += 1
        if (curDir === 'LEFT') head.x -= 1
        if (curDir === 'RIGHT') head.x += 1

        // Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          sound.playGameOver()
          setIsGameOver(true)
          onFinish(score * 50 + 200)
          return prevSnake
        }

        // Self Collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          sound.playGameOver()
          setIsGameOver(true)
          onFinish(score * 50 + 200)
          return prevSnake
        }

        // Eat Food
        const newSnake = [head, ...prevSnake]
        if (head.x === food.x && head.y === food.y) {
          sound.playEat()
          setScore((s) => s + 1)
          setFood(generateFood())
          setSpeed((sp) => Math.max(70, sp - 3))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [hasStarted, isGameOver, food, generateFood, speed, score, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-emerald-500/30 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'النقاط:' : 'SCORE:'} {score * 50}</span>
        </div>
        <span className="text-slate-400 font-bold">{isRtl ? 'الطعام المأكول:' : 'EATEN:'} {score}</span>
      </div>

      {/* Grid Canvas Board */}
      <div
        className="relative rounded-2xl bg-brand-darkBg border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)] overflow-hidden"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Snake body */}
        {snake.map((segment, idx) => (
          <div
            key={idx}
            className={`absolute rounded-sm transition-all ${
              idx === 0
                ? 'bg-gradient-to-r from-emerald-300 to-green-400 shadow-[0_0_10px_#34d399] z-10'
                : 'bg-emerald-500/90 shadow-[0_0_5px_#10b981]'
            }`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />
        ))}

        {/* Glowing Food */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_12px_#f43f5e] animate-pulse flex items-center justify-center text-[10px]"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 1,
            height: CELL_SIZE - 1,
          }}
        >
          🍎
        </div>

        {/* Start Overlay */}
        {!hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 p-4 text-center z-20">
            <span className="text-4xl animate-bounce">🐍</span>
            <p className="text-sm font-black text-white">{isRtl ? 'ثعبان النيون المضيء' : 'Neon Snake'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'استخدم الأسهم لتوجيه الثعبان واجمع أكبر قدر من التفاح النيوني!' : 'Use arrow keys or touch buttons to collect food!'}
            </p>
            <Button variant="primary" size="sm" onClick={() => setHasStarted(true)}>
              {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Start Snake 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center z-20">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'انتهت اللعبة!' : 'Game Over!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'النتيجة النهائية:' : 'Final Score:'} {score * 50}</p>
            <Button variant="gold" size="sm" onClick={restartGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      {/* Touch On-Screen Controls for Mobile/Tablet */}
      <div className="flex flex-col items-center gap-1.5 pt-2">
        <button
          onClick={() => {
            if (directionRef.current !== 'DOWN') setDirection('UP')
            setHasStarted(true)
          }}
          className="w-12 h-12 rounded-xl bg-brand-card border border-emerald-500/40 text-emerald-400 flex items-center justify-center active:scale-95 shadow"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (directionRef.current !== 'RIGHT') setDirection('LEFT')
              setHasStarted(true)
            }}
            className="w-12 h-12 rounded-xl bg-brand-card border border-emerald-500/40 text-emerald-400 flex items-center justify-center active:scale-95 shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (directionRef.current !== 'UP') setDirection('DOWN')
              setHasStarted(true)
            }}
            className="w-12 h-12 rounded-xl bg-brand-card border border-emerald-500/40 text-emerald-400 flex items-center justify-center active:scale-95 shadow"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (directionRef.current !== 'LEFT') setDirection('RIGHT')
              setHasStarted(true)
            }}
            className="w-12 h-12 rounded-xl bg-brand-card border border-emerald-500/40 text-emerald-400 flex items-center justify-center active:scale-95 shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
