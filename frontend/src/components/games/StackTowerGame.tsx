import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Layers } from 'lucide-react'
import { Button } from '@components/common/Button'

interface StackTowerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

interface Block {
  x: number
  y: number
  w: number
  color: string
}

const COLORS = ['#f43f5e', '#ec4899', '#a855f7', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

export const StackTowerGame: React.FC<StackTowerProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  const stateRef = useRef({
    running: false,
    tower: [] as Block[],
    currentBlockX: 0,
    currentBlockW: 140,
    currentBlockY: 260,
    direction: 1,
    speed: 3.5,
    score: 0,
  })

  const startGame = () => {
    stateRef.current = {
      running: true,
      tower: [{ x: 90, y: 280, w: 140, color: COLORS[0] }],
      currentBlockX: 0,
      currentBlockW: 140,
      currentBlockY: 260,
      direction: 1,
      speed: 3.5,
      score: 0,
    }
    setScore(0)
    setGameState('PLAYING')
  }

  const handlePlaceBlock = () => {
    if (!stateRef.current.running) {
      startGame()
      return
    }

    const s = stateRef.current
    const topBlock = s.tower[s.tower.length - 1]

    const diff = s.currentBlockX - topBlock.x
    const overhang = Math.abs(diff)

    if (overhang >= s.currentBlockW) {
      // Missed completely!
      s.running = false
      setGameState('GAMEOVER')
      onFinish(s.score * 80 + 150)
      return
    }

    // Trim width
    let newW = s.currentBlockW - overhang
    let newX = diff > 0 ? s.currentBlockX : topBlock.x

    if (overhang < 4) {
      // Perfect placement!
      newW = s.currentBlockW
      newX = topBlock.x
      s.score += 2
    } else {
      s.score += 1
    }

    setScore(s.score)

    s.tower.push({
      x: newX,
      y: s.currentBlockY,
      w: newW,
      color: COLORS[s.tower.length % COLORS.length],
    })

    // Shift down if high up
    if (s.currentBlockY <= 100) {
      s.tower.forEach((b) => (b.y += 20))
    } else {
      s.currentBlockY -= 20
    }

    s.currentBlockW = newW
    s.currentBlockX = 0
    s.speed = Math.min(7.5, s.speed + 0.2)
  }

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      if (!s.running) return

      s.currentBlockX += s.direction * s.speed
      if (s.currentBlockX + s.currentBlockW > 320 || s.currentBlockX < 0) {
        s.direction *= -1
      }

      // Draw
      ctx.fillStyle = '#0a081a'
      ctx.fillRect(0, 0, 320, 320)

      // Draw Tower Blocks
      s.tower.forEach((b) => {
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.roundRect(b.x, b.y, b.w, 18, 3)
        ctx.fill()
      })

      // Draw Current Moving Block
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#00d2ff'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(s.currentBlockX, s.currentBlockY, s.currentBlockW, 18, 3)
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
      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder text-xs font-mono">
        <span className="text-amber-400 font-black flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          {isRtl ? 'ارتفاع البرج:' : 'HEIGHT:'} {score}
        </span>
        <span className="text-cyan-300 font-black">{score * 80} XP</span>
      </div>

      {/* Canvas */}
      <div
        onClick={handlePlaceBlock}
        className="relative rounded-2xl border-2 border-brand-purple/40 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={320} height={320} className="bg-brand-darkBg block" />

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl animate-bounce">🏗️</span>
            <p className="text-sm font-black text-white">{isRtl ? 'برج المكعبات النيون' : 'Neon Stack Tower'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'انقر لوضع المكعب فوق البرج في اللحظة المثالية وابنِ أعلى ناطحة سحاب!' : 'Tap at the exact right moment to stack blocks as high as you can!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ البناء 🚀' : 'Start Stacking 🚀'}
            </Button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'سقط المكعب!' : 'Tower Collapsed!'}</p>
            <p className="text-xs text-white font-mono">{isRtl ? 'ارتفاع البرج:' : 'Final Height:'} {score}</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'بناء جديد ⚡' : 'Try Again ⚡'}
            </Button>
          </div>
        )}
      </div>

      <Button variant="accent" size="md" fullWidth onClick={handlePlaceBlock}>
        {isRtl ? 'ثبِّت المكعب الآن (TAP)' : 'DROP BLOCK (TAP)'}
      </Button>
    </div>
  )
}
