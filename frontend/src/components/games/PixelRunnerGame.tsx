import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, ArrowUp } from 'lucide-react'
import { Button } from '@components/common/Button'

interface PixelRunnerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

export const PixelRunnerGame: React.FC<PixelRunnerProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  const stateRef = useRef({
    running: false,
    playerY: 180,
    playerVY: 0,
    isGrounded: true,
    score: 0,
    speed: 5,
    obstacles: [] as { x: number; w: number; h: number; type: string }[],
    frameCount: 0,
  })

  const jump = () => {
    if (!stateRef.current.running) {
      startGame()
      return
    }
    if (stateRef.current.isGrounded) {
      stateRef.current.playerVY = -11
      stateRef.current.isGrounded = false
    }
  }

  const startGame = () => {
    stateRef.current = {
      running: true,
      playerY: 180,
      playerVY: 0,
      isGrounded: true,
      score: 0,
      speed: 5,
      obstacles: [{ x: 400, w: 22, h: 32, type: 'spike' }],
      frameCount: 0,
    }
    setScore(0)
    setGameState('PLAYING')
  }

  // Keyboard Space listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
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
      if (s.frameCount % 5 === 0) {
        setScore(Math.floor(s.score / 5))
      }

      // Physics
      s.playerVY += 0.65 // Gravity
      s.playerY += s.playerVY

      // Ground collision
      if (s.playerY >= 180) {
        s.playerY = 180
        s.playerVY = 0
        s.isGrounded = true
      }

      // Spawn obstacles
      if (s.frameCount % 90 === 0) {
        s.obstacles.push({
          x: 350 + Math.random() * 50,
          w: 20 + Math.random() * 10,
          h: 28 + Math.random() * 14,
          type: 'spike',
        })
        s.speed = Math.min(10, s.speed + 0.15)
      }

      // Move & filter obstacles
      s.obstacles.forEach((obs) => {
        obs.x -= s.speed
      })
      s.obstacles = s.obstacles.filter((obs) => obs.x > -50)

      // Draw
      ctx.fillStyle = '#0a081a'
      ctx.fillRect(0, 0, 340, 240)

      // Stars in background
      ctx.fillStyle = '#ffffff40'
      for (let i = 0; i < 15; i++) {
        const sx = ((i * 37 + s.frameCount * 0.5) % 340)
        const sy = (i * 19) % 120
        ctx.fillRect(sx, sy, 2, 2)
      }

      // Ground Line
      ctx.strokeStyle = '#00d2ff'
      ctx.lineWidth = 3
      ctx.shadowColor = '#00d2ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(0, 206)
      ctx.lineTo(340, 206)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw Player (Neon Runner Mascot)
      ctx.fillStyle = '#a855f7'
      ctx.shadowColor = '#c084fc'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(40, s.playerY - 26, 26, 26, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      // Player eyes & visor
      ctx.fillStyle = '#00d2ff'
      ctx.fillRect(52, s.playerY - 20, 10, 6)

      // Draw Obstacles (Neon Spikes)
      s.obstacles.forEach((obs) => {
        ctx.fillStyle = '#ef4444'
        ctx.shadowColor = '#f87171'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(obs.x, 206)
        ctx.lineTo(obs.x + obs.w / 2, 206 - obs.h)
        ctx.lineTo(obs.x + obs.w, 206)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0

        // Collision Check
        const playerBox = { x: 44, y: s.playerY - 24, w: 20, h: 24 }
        const obsBox = { x: obs.x + 4, y: 206 - obs.h, w: obs.w - 8, h: obs.h }

        if (
          playerBox.x < obsBox.x + obsBox.w &&
          playerBox.x + playerBox.w > obsBox.x &&
          playerBox.y < obsBox.y + obsBox.h &&
          playerBox.y + playerBox.h > obsBox.y
        ) {
          s.running = false
          setGameState('GAMEOVER')
          onFinish(Math.floor(s.score / 5) * 5 + 150)
        }
      })

      animId = requestAnimationFrame(loop)
    }

    if (gameState === 'PLAYING') {
      animId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animId)
  }, [gameState, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-purple-500/30 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'المسافة:' : 'DISTANCE:'} {score}m</span>
        </div>
        <span className="text-amber-400 font-bold">{isRtl ? 'السرعة: x' : 'SPEED: x'}{Math.round(stateRef.current.speed * 10) / 10}</span>
      </div>

      {/* Canvas */}
      <div
        onClick={jump}
        className="relative rounded-2xl border-2 border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={340} height={240} className="bg-brand-darkBg block" />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl animate-bounce">👾</span>
            <p className="text-sm font-black text-white">{isRtl ? 'عدّاء البكسل النيوني' : 'Pixel Neon Runner'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'اضغط بالمسطرة (Space) أو انقر على الشاشة للقفز فوق العقبات!' : 'Press Space or tap the screen to jump over obstacles!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ الركض 🚀' : 'Start Running 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'اصطدمت بالعقبة!' : 'Crashed!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'المسافة المحققة:' : 'Distance Reached:'} {score}m</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'محاولة جديدة ⚡' : 'Try Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      {/* Touch Jump Button for mobile */}
      <button
        onClick={jump}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-purple to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow active:scale-98"
      >
        <ArrowUp className="w-5 h-5" />
        <span>{isRtl ? 'اقفز الآن (SPACE / TAP)' : 'JUMP (SPACE / TAP)'}</span>
      </button>
    </div>
  )
}
