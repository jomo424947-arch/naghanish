/**
 * FlappyHeroGame.tsx
 *
 * Flappy Hero arcade game with neon physics.
 * Tap or Spacebar to flap, dodge neon pipes, collect coins.
 */

import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, ArrowUp } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface FlappyHeroProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Pipe {
  x: number
  topH: number
  bottomY: number
  passed: boolean
}

export const FlappyHeroGame: React.FC<FlappyHeroProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  // Gap and speed configured by difficulty
  const gapSize = difficulty === 'Easy' ? 95 : difficulty === 'Hard' ? 68 : 80
  const gameSpeed = difficulty === 'Easy' ? 2.2 : difficulty === 'Hard' ? 3.4 : 2.8

  const stateRef = useRef({
    running: false,
    birdY: 140,
    birdVY: 0,
    gravity: 0.38,
    jumpStrength: -6.8,
    pipes: [] as Pipe[],
    score: 0,
    frameCount: 0,
  })

  const flap = () => {
    if (!stateRef.current.running) {
      startGame()
      return
    }
    sound.playJump()
    stateRef.current.birdVY = stateRef.current.jumpStrength
  }

  const startGame = () => {
    sound.playClick()
    stateRef.current = {
      running: true,
      birdY: 140,
      birdVY: -4,
      gravity: 0.38,
      jumpStrength: -6.8,
      pipes: [
        {
          x: 320,
          topH: 80,
          bottomY: 80 + gapSize,
          passed: false,
        },
      ],
      score: 0,
      frameCount: 0,
    }
    setScore(0)
    setGameState('PLAYING')
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

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

      // Physics
      s.birdVY += s.gravity
      s.birdY += s.birdVY

      // Floor and Ceiling hit
      if (s.birdY > 295 || s.birdY < 5) {
        s.running = false
        sound.playGameOver()
        setGameState('GAMEOVER')
        onFinish(s.score * 50 + 100)
        return
      }

      // Spawn pipes every 90 frames
      if (s.frameCount % 85 === 0) {
        const topH = Math.floor(Math.random() * (290 - gapSize - 60)) + 30
        s.pipes.push({
          x: 320,
          topH,
          bottomY: topH + gapSize,
          passed: false,
        })
      }

      // Move & filter pipes
      s.pipes.forEach((p) => {
        p.x -= gameSpeed

        // Pass check
        if (!p.passed && p.x + 36 < 60) {
          p.passed = true
          s.score += 1
          setScore(s.score)
          sound.playCoin()
        }

        // Collision check (Bird box: x=60, y=birdY, w=20, h=20)
        const birdX = 60
        const birdY = s.birdY
        const birdR = 10

        // Pipe collision
        if (birdX + birdR > p.x && birdX - birdR < p.x + 36) {
          if (birdY - birdR < p.topH || birdY + birdR > p.bottomY) {
            s.running = false
            sound.playGameOver()
            setGameState('GAMEOVER')
            onFinish(s.score * 50 + 100)
          }
        }
      })

      s.pipes = s.pipes.filter((p) => p.x > -50)

      // ── Draw ──
      ctx.fillStyle = '#070514'
      ctx.fillRect(0, 0, 320, 310)

      // Background stars / grid
      ctx.strokeStyle = '#ffffff08'
      ctx.lineWidth = 1
      for (let x = 0; x < 320; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 310)
        ctx.stroke()
      }

      // Draw Pipes (Cyber Neon Columns)
      s.pipes.forEach((p) => {
        // Top Pipe
        const gradTop = ctx.createLinearGradient(p.x, 0, p.x + 36, 0)
        gradTop.addColorStop(0, '#06b6d4')
        gradTop.addColorStop(1, '#3b82f6')
        ctx.fillStyle = gradTop
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 8
        ctx.fillRect(p.x, 0, 36, p.topH)

        // Bottom Pipe
        ctx.fillRect(p.x, p.bottomY, 36, 310 - p.bottomY)
        ctx.shadowBlur = 0
      })

      // Draw Bird (Neon Hero Orb)
      ctx.fillStyle = '#fbbf24'
      ctx.shadowColor = '#f59e0b'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(60, s.birdY, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Eye
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(63, s.birdY - 3, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(64, s.birdY - 3, 1.5, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(loop)
    }

    if (gameState === 'PLAYING') {
      animId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animId)
  }, [gameState, gapSize, gameSpeed, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/60 border border-brand-cardBorder text-xs font-mono font-black">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'الحواجز:' : 'SCORE:'} {score}</span>
        </div>
        <span className="text-cyan-300">
          {difficulty === 'Easy' ? '🌟 سهل' : difficulty === 'Hard' ? '🔥 مستحيل' : '⚡ عادي'}
        </span>
      </div>

      {/* Game Canvas */}
      <div
        onClick={flap}
        className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer active:scale-[0.99] transition-transform"
      >
        <canvas ref={canvasRef} width={320} height={310} className="block w-[320px] h-[310px]" />

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6">
            <span className="text-4xl animate-bounce">🚀</span>
            <h4 className="text-lg font-black text-white">
              {isRtl ? 'انقر أو اضغط مسطرة للرفرفة' : 'Tap or Space to Flap'}
            </h4>
            <Button variant="primary" size="sm">
              {isRtl ? 'انقر هنا للبدء' : 'Tap to Start'}
            </Button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6">
            <span className="text-4xl">💥</span>
            <h4 className="text-lg font-black text-white">{isRtl ? 'اصطدمت!' : 'Crashed!'}</h4>
            <p className="text-xs text-slate-300">
              {isRtl ? `تجاوزت ${score} حاجز` : `Cleared ${score} pipes`}
            </p>
            <Button variant="primary" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
              {isRtl ? 'إعادة المحاولة' : 'Play Again'}
            </Button>
          </div>
        )}
      </div>

      <button
        onClick={flap}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow transition-all cursor-pointer"
      >
        <ArrowUp className="w-5 h-5" />
        <span>{isRtl ? 'رفرفة (قفز) 🚀' : 'FLAP / JUMP 🚀'}</span>
      </button>
    </div>
  )
}
