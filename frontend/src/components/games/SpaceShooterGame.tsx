import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Heart } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface SpaceShooterProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

interface Bullet {
  x: number
  y: number
}

interface Enemy {
  x: number
  y: number
  w: number
  h: number
  speed: number
}

export const SpaceShooterGame: React.FC<SpaceShooterProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  const stateRef = useRef({
    running: false,
    shipX: 145,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    score: 0,
    lives: 3,
    frameCount: 0,
  })

  const startGame = () => {
    stateRef.current = {
      running: true,
      shipX: 145,
      bullets: [],
      enemies: [
        { x: 50, y: 20, w: 24, h: 20, speed: 1.5 },
        { x: 150, y: 10, w: 24, h: 20, speed: 1.2 },
        { x: 230, y: 30, w: 24, h: 20, speed: 1.6 },
      ],
      score: 0,
      lives: 3,
      frameCount: 0,
    }
    setScore(0)
    setLives(3)
    setGameState('PLAYING')
  }

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const relX = clientX - rect.left
    stateRef.current.shipX = Math.max(10, Math.min(280, relX - 15))
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

      s.frameCount++

      // Fire bullet every 12 frames
      if (s.frameCount % 12 === 0) {
        s.bullets.push({ x: s.shipX + 13, y: 270 })
        sound.playLaser()
      }

      // Spawn enemy every 45 frames
      if (s.frameCount % 45 === 0) {
        s.enemies.push({
          x: Math.random() * 270 + 10,
          y: -25,
          w: 24,
          h: 20,
          speed: 1.2 + Math.random() * 1.5,
        })
      }

      // Move Bullets
      s.bullets.forEach((b) => (b.y -= 7))
      s.bullets = s.bullets.filter((b) => b.y > -10)

      // Move Enemies
      s.enemies.forEach((en) => (en.y += en.speed))

      // Check bullet collisions
      s.enemies = s.enemies.filter((en) => {
        let hit = false
        s.bullets.forEach((b) => {
          if (b.x > en.x && b.x < en.x + en.w && b.y > en.y && b.y < en.y + en.h) {
            hit = true
            b.y = -100 // remove bullet
          }
        })
        if (hit) {
          s.score += 50
          setScore(s.score)
          sound.playBrickSmash()
          return false
        }
        return true
      })

      // Check bottom breach
      s.enemies.forEach((en) => {
        if (en.y > 310) {
          s.lives -= 1
          setLives(s.lives)
          en.y = -100
          if (s.lives <= 0) {
            s.running = false
            sound.playGameOver()
            setGameState('GAMEOVER')
            onFinish(s.score + 200)
          } else {
            sound.playTick()
          }
        }
      })
      s.enemies = s.enemies.filter((en) => en.y < 310 && en.y > -50)

      // Draw Screen
      ctx.fillStyle = '#060614'
      ctx.fillRect(0, 0, 320, 320)

      // Stars
      ctx.fillStyle = '#ffffff50'
      for (let i = 0; i < 20; i++) {
        const sy = (i * 31 + s.frameCount * 2) % 320
        const sx = (i * 47) % 320
        ctx.fillRect(sx, sy, 1.5, 1.5)
      }

      // Draw Bullets (Cyan Lasers)
      ctx.fillStyle = '#00d2ff'
      ctx.shadowColor = '#00d2ff'
      ctx.shadowBlur = 8
      s.bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, 4, 10)
      })
      ctx.shadowBlur = 0

      // Draw Enemies (Invaders)
      s.enemies.forEach((en) => {
        ctx.fillStyle = '#ef4444'
        ctx.shadowColor = '#ef4444'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(en.x + en.w / 2, en.y + en.h / 2, en.w / 2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // Draw Spaceship (Purple Jet)
      ctx.fillStyle = '#a855f7'
      ctx.shadowColor = '#c084fc'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(s.shipX + 15, 270)
      ctx.lineTo(s.shipX + 30, 295)
      ctx.lineTo(s.shipX, 295)
      ctx.closePath()
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
        <span className="text-cyan-300 font-black flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          {isRtl ? 'النقاط:' : 'SCORE:'} {score}
        </span>
        <div className="flex items-center gap-1 text-rose-400">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} className="w-4 h-4 fill-rose-500" />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl border-2 border-brand-purple/40 shadow-[0_0_25px_rgba(168,85,247,0.3)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="bg-brand-darkBg block cursor-ew-resize touch-none"
        />

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl animate-bounce">🚀</span>
            <p className="text-sm font-black text-white">{isRtl ? 'صائد الفضائيين' : 'Space Invader Shooter'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'حرّك المركبة يميناً ويساراً وأطلق الليزر لتدمير الأعداء الساقطين!' : 'Move your ship left & right to blast falling invaders!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'انطلق 🚀' : 'Launch Ship 🚀'}
            </Button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">💥</span>
            <p className="text-base font-black text-red-400">{isRtl ? 'تدمرت المركبة!' : 'Ship Destroyed!'}</p>
            <p className="text-xs text-white font-mono">{score} PTS</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'إعادة الإطلاق ⚡' : 'Relaunch ⚡'}
            </Button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-medium">
        {isRtl ? '💡 حرّك إصبعك أو الماوس يميناً ويساراً للتصويب الآلي.' : '💡 Drag finger or mouse horizontally to steer and auto-fire.'}
      </p>
    </div>
  )
}

