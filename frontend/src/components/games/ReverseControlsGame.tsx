import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@components/common/Button'

interface ReverseControlsProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

export const ReverseControlsGame: React.FC<ReverseControlsProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  const stateRef = useRef({
    running: false,
    playerX: 145,
    obstacles: [] as { x: number; y: number; w: number; h: number; speed: number }[],
    score: 0,
    frameCount: 0,
  })

  const moveLeft = () => {
    // REVERSE: Left button moves RIGHT!
    if (!stateRef.current.running) return
    stateRef.current.playerX = Math.min(290, stateRef.current.playerX + 30)
  }

  const moveRight = () => {
    // REVERSE: Right button moves LEFT!
    if (!stateRef.current.running) return
    stateRef.current.playerX = Math.max(10, stateRef.current.playerX - 30)
  }

  const startGame = () => {
    stateRef.current = {
      running: true,
      playerX: 145,
      obstacles: [],
      score: 0,
      frameCount: 0,
    }
    setScore(0)
    setGameState('PLAYING')
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        moveLeft() // Moves Right!
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        moveRight() // Moves Left!
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      if (!s.running) return

      s.frameCount++
      s.score += 1
      if (s.frameCount % 10 === 0) setScore(Math.floor(s.score / 10))

      if (s.frameCount % 25 === 0) {
        s.obstacles.push({
          x: Math.random() * 280 + 10,
          y: -20,
          w: 24,
          h: 24,
          speed: 2.8 + Math.random() * 1.5,
        })
      }

      s.obstacles.forEach((obs) => (obs.y += obs.speed))

      // Collision Check
      const pBox = { x: s.playerX, y: 270, w: 26, h: 26 }
      s.obstacles.forEach((obs) => {
        if (
          pBox.x < obs.x + obs.w &&
          pBox.x + pBox.w > obs.x &&
          pBox.y < obs.y + obs.h &&
          pBox.y + pBox.h > obs.y
        ) {
          s.running = false
          setGameState('GAMEOVER')
          onFinish(Math.floor(s.score / 10) * 10 + 200)
        }
      })

      s.obstacles = s.obstacles.filter((obs) => obs.y < 330)

      // Draw
      ctx.fillStyle = '#0f051d'
      ctx.fillRect(0, 0, 320, 320)

      // Falling Obstacles
      ctx.fillStyle = '#ef4444'
      ctx.shadowColor = '#f87171'
      ctx.shadowBlur = 8
      s.obstacles.forEach((obs) => {
        ctx.beginPath()
        ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 4)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // Player
      ctx.fillStyle = '#84cc16'
      ctx.shadowColor = '#a3e635'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(s.playerX, 270, 26, 26, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      animId = requestAnimationFrame(loop)
    }

    if (gameState === 'PLAYING') {
      animId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animId)
  }, [gameState, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Reverse Warning Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-lime-500/30 text-xs font-mono">
        <span className="text-lime-300 font-black">
          {isRtl ? 'تحذير: اليمين يسار واليسار يمين!' : 'REVERSE: LEFT IS RIGHT!'}
        </span>
        <span className="text-amber-400 font-black">{score} PTS</span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl border-2 border-lime-500/40 shadow-[0_0_25px_rgba(132,204,22,0.3)] overflow-hidden">
        <canvas ref={canvasRef} width={320} height={320} className="bg-brand-darkBg block" />

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl animate-bounce">🔄</span>
            <p className="text-sm font-black text-white">{isRtl ? 'التحكم المعكوس' : 'Reverse Controls'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'عقلك سيحترق! الضغط على السهم الأيسر يحركك يميناً، والأيمن يحركك يساراً.. تفادَ السقوط!' : 'Your brain will glitch! Left moves Right, Right moves Left!'}
            </p>
            <Button variant="chaos" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ الفوضى 🚀' : 'Start Chaos 🚀'}
            </Button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'اصطدمت! عقلك ارتبك 🤪' : 'Crashed!'}</p>
            <p className="text-xs text-white font-mono">{score} PTS</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'محاولة ثانية ⚡' : 'Try Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      {/* Touch Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          onClick={moveLeft}
          className="py-3 rounded-2xl bg-brand-card border border-lime-500/40 text-lime-300 flex items-center justify-center gap-2 active:scale-95 font-black text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isRtl ? 'يسار (يحرك يمين!)' : 'LEFT (Goes Right!)'}</span>
        </button>
        <button
          onClick={moveRight}
          className="py-3 rounded-2xl bg-brand-card border border-lime-500/40 text-lime-300 flex items-center justify-center gap-2 active:scale-95 font-black text-xs"
        >
          <span>{isRtl ? 'يمين (يحرك يسار!)' : 'RIGHT (Goes Left!)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
