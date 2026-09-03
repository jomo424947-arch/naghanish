import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Heart } from 'lucide-react'
import { Button } from '@components/common/Button'

interface BrickBreakerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

interface Brick {
  x: number
  y: number
  w: number
  h: number
  color: string
  active: boolean
}

export const BrickBreakerGame: React.FC<BrickBreakerProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE')

  const stateRef = useRef({
    paddleX: 130,
    paddleW: 75,
    paddleH: 10,
    ballX: 160,
    ballY: 260,
    ballDX: 3,
    ballDY: -3,
    ballR: 6,
    score: 0,
    lives: 3,
    bricks: [] as Brick[],
    running: false,
  })

  const initBricks = () => {
    const rows = 4
    const cols = 6
    const brickW = 46
    const brickH = 14
    const padding = 6
    const offsetTop = 35
    const offsetLeft = 10
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981']

    const bricks: Brick[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: c * (brickW + padding) + offsetLeft,
          y: r * (brickH + padding) + offsetTop,
          w: brickW,
          h: brickH,
          color: colors[r % colors.length],
          active: true,
        })
      }
    }
    return bricks
  }

  const startGame = () => {
    stateRef.current.paddleX = 125
    stateRef.current.ballX = 160
    stateRef.current.ballY = 250
    stateRef.current.ballDX = (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random())
    stateRef.current.ballDY = -3.5
    stateRef.current.score = 0
    stateRef.current.lives = 3
    stateRef.current.bricks = initBricks()
    stateRef.current.running = true

    setScore(0)
    setLives(3)
    setGameState('PLAYING')
  }

  // Mouse / Touch Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const newX = relativeX - stateRef.current.paddleW / 2
    stateRef.current.paddleX = Math.max(0, Math.min(320 - stateRef.current.paddleW, newX))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !e.touches[0]) return
    const rect = canvas.getBoundingClientRect()
    const relativeX = e.touches[0].clientX - rect.left
    const newX = relativeX - stateRef.current.paddleW / 2
    stateRef.current.paddleX = Math.max(0, Math.min(320 - stateRef.current.paddleW, newX))
  }

  useEffect(() => {
    let animationFrameId: number

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      if (!stateRef.current.running) return

      const s = stateRef.current

      // Clear
      ctx.fillStyle = '#0a091e'
      ctx.fillRect(0, 0, 320, 320)

      // Draw Bricks
      let activeCount = 0
      s.bricks.forEach((b) => {
        if (!b.active) return
        activeCount++
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 8
        ctx.fillRect(b.x, b.y, b.w, b.h)
        ctx.shadowBlur = 0
      })

      if (activeCount === 0) {
        s.running = false
        setGameState('VICTORY')
        onFinish(s.score + 500)
        return
      }

      // Draw Paddle
      ctx.fillStyle = '#00d2ff'
      ctx.shadowColor = '#00d2ff'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(s.paddleX, 300, s.paddleW, s.paddleH, 5)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw Ball
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Move Ball
      s.ballX += s.ballDX
      s.ballY += s.ballDY

      // Wall bounce
      if (s.ballX + s.ballR > 320 || s.ballX - s.ballR < 0) {
        s.ballDX = -s.ballDX
      }
      if (s.ballY - s.ballR < 0) {
        s.ballDY = -s.ballDY
      }

      // Paddle bounce
      if (
        s.ballY + s.ballR >= 300 &&
        s.ballY - s.ballR <= 310 &&
        s.ballX >= s.paddleX &&
        s.ballX <= s.paddleX + s.paddleW
      ) {
        s.ballDY = -Math.abs(s.ballDY)
        // Adjust angle based on where it hit
        const hitPoint = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2)
        s.ballDX = hitPoint * 4.2
      }

      // Bottom death
      if (s.ballY + s.ballR > 320) {
        s.lives -= 1
        setLives(s.lives)
        if (s.lives <= 0) {
          s.running = false
          setGameState('GAMEOVER')
          onFinish(s.score + 100)
          return
        } else {
          s.ballX = 160
          s.ballY = 240
          s.ballDY = -3.5
          s.ballDX = (Math.random() > 0.5 ? 1 : -1) * 3
        }
      }

      // Brick collisions
      s.bricks.forEach((b) => {
        if (!b.active) return
        if (
          s.ballX + s.ballR > b.x &&
          s.ballX - s.ballR < b.x + b.w &&
          s.ballY + s.ballR > b.y &&
          s.ballY - s.ballR < b.y + b.h
        ) {
          b.active = false
          s.ballDY = -s.ballDY
          s.score += 50
          setScore(s.score)
        }
      })

      animationFrameId = requestAnimationFrame(loop)
    }

    if (gameState === 'PLAYING') {
      animationFrameId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-cyan-500/30 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-amber-400 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'النقاط:' : 'SCORE:'} {score}</span>
        </div>
        <div className="flex items-center gap-1 text-rose-400">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} className="w-4 h-4 fill-rose-500" />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,210,255,0.3)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="bg-brand-darkBg block cursor-ew-resize touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🧱</span>
            <p className="text-sm font-black text-white">{isRtl ? 'كسّار الآجر النيوني' : 'Neon Brick Breaker'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'حرك المضرب يميناً ويساراً لترتد الكرة وتكسر جميع المكعبات المضيئة!' : 'Move the paddle to bounce the ball and smash all bricks!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ اللعب 🚀' : 'Start Game 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">💔</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'خسرت المحاولات!' : 'Out of Lives!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'نقاطك:' : 'Final Score:'} {score}</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'إعادة المحاولة ⚡' : 'Retry ⚡'}
            </Button>
          </div>
        )}

        {/* Victory */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-base font-black text-amber-300">{isRtl ? 'انتصار كاسح! مسحت كل الآجر 🎉' : 'Victory! Cleared all bricks! 🎉'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'النقاط:' : 'Score:'} {score + 500}</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'العب مرة أخرى ⚡' : 'Play Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-medium">
        {isRtl ? '💡 اسحب إصبعك أو الفأرة على اللوحة لتحريك المضرب يميناً ويساراً.' : '💡 Drag with finger or mouse to control the paddle.'}
      </p>
    </div>
  )
}
