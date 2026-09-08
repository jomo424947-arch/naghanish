import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Zap, Compass, Flame } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface GravityRunnerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Obstacle {
  x: number
  w: number
  h: number
  atCeiling: boolean
  passed: boolean
}

interface Shard {
  x: number
  y: number
  collected: boolean
}

interface TrailParticle {
  x: number
  y: number
  size: number
  alpha: number
  color: string
}

export const GravityRunnerGame: React.FC<GravityRunnerProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [gravityDir, setGravityDir] = useState<'down' | 'up'>('down')

  const stateRef = useRef({
    running: false,
    x: 80,
    y: 240,
    w: 24,
    h: 30,
    vy: 0,
    gravity: 0.85, // positive = falls down, negative = falls up
    isGrounded: true,
    speed: 5.0,
    distance: 0,
    shardsCount: 0,
    obstacles: [] as Obstacle[],
    shards: [] as Shard[],
    trails: [] as TrailParticle[],
    shake: 0,
    nextObstacleTimer: 0,
  })

  // Start game
  const startGame = () => {
    const baseSpeed = difficulty === 'Easy' ? 4.5 : difficulty === 'Hard' ? 6.2 : 5.2
    stateRef.current = {
      running: true,
      x: 80,
      y: 270,
      w: 24,
      h: 30,
      vy: 0,
      gravity: 0.85,
      isGrounded: true,
      speed: baseSpeed,
      distance: 0,
      shardsCount: 0,
      obstacles: [],
      shards: [],
      trails: [],
      shake: 0,
      nextObstacleTimer: 60,
    }
    setScore(0)
    setDistance(0)
    setGravityDir('down')
    setGameState('PLAYING')
    soundManager.playPowerUp()
  }

  // Invert Gravity
  const invertGravity = () => {
    if (gameState === 'IDLE') {
      startGame()
      return
    }
    if (gameState === 'GAMEOVER' || !stateRef.current.running) return

    const s = stateRef.current
    s.gravity = -s.gravity
    s.vy = s.gravity > 0 ? 3 : -3
    setGravityDir(s.gravity > 0 ? 'down' : 'up')
    soundManager.playPortal()

    // Spawn burst particles
    for (let i = 0; i < 12; i++) {
      s.trails.push({
        x: s.x + s.w / 2,
        y: s.y + s.h / 2,
        size: Math.random() * 5 + 3,
        alpha: 1,
        color: s.gravity > 0 ? '#06b6d4' : '#ec4899',
      })
    }
  }

  // Keyboard space / up
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        invertGravity()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [gameState])

  // Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const floorY = 280
    const ceilingY = 40

    const loop = () => {
      const s = stateRef.current

      if (s.running) {
        // Distance & score tracking
        s.distance += Math.floor(s.speed * 0.4)
        setDistance(s.distance)
        const curScore = Math.floor(s.distance * 0.5) + s.shardsCount * 50
        setScore(curScore)

        // Speed ramp up slowly
        s.speed = Math.min(10, s.speed + 0.0015)

        // Milestone audio
        if (s.distance > 0 && s.distance % 300 < Math.floor(s.speed * 0.4)) {
          soundManager.playComboX2()
        }

        // Apply Gravity
        s.vy += s.gravity
        s.y += s.vy

        // Collision with floor
        if (s.y + s.h >= floorY) {
          s.y = floorY - s.h
          s.vy = 0
          s.isGrounded = true
        }
        // Collision with ceiling
        else if (s.y <= ceilingY) {
          s.y = ceilingY
          s.vy = 0
          s.isGrounded = true
        } else {
          s.isGrounded = false
        }

        // Player trail
        s.trails.unshift({
          x: s.x,
          y: s.y + s.h / 2,
          size: Math.random() * 4 + 2,
          alpha: 0.8,
          color: s.gravity > 0 ? '#06b6d4' : '#f43f5e',
        })
        if (s.trails.length > 25) s.trails.pop()

        // Obstacles generation
        s.nextObstacleTimer--
        if (s.nextObstacleTimer <= 0) {
          const atCeiling = Math.random() < 0.5
          const h = Math.floor(Math.random() * 35) + 35
          s.obstacles.push({
            x: 600,
            w: 26,
            h,
            atCeiling,
            passed: false,
          })

          // Spawn a floating shard near middle or opposite side
          if (Math.random() < 0.6) {
            s.shards.push({
              x: 600 + (Math.random() * 60 + 30),
              y: atCeiling ? floorY - 50 : ceilingY + 50,
              collected: false,
            })
          }

          // Randomize spacing between obstacles
          s.nextObstacleTimer = Math.floor(Math.random() * 45) + 60
        }

        // Update Obstacles & Collision Check
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const ob = s.obstacles[i]
          ob.x -= s.speed

          const obY = ob.atCeiling ? ceilingY : floorY - ob.h

          // Check hit
          if (
            s.x + s.w - 4 >= ob.x &&
            s.x + 4 <= ob.x + ob.w &&
            s.y + s.h - 4 >= obY &&
            s.y + 4 <= obY + ob.h
          ) {
            // CRASH!
            s.running = false
            s.shake = 16
            soundManager.playExplosion()
            setGameState('GAMEOVER')
            onFinish(curScore)
            break
          }

          if (ob.x + ob.w < -20) {
            s.obstacles.splice(i, 1)
          }
        }

        // Update Shards
        for (let i = s.shards.length - 1; i >= 0; i--) {
          const sh = s.shards[i]
          sh.x -= s.speed

          // Collect shard
          if (!sh.collected && Math.hypot(s.x + s.w / 2 - sh.x, s.y + s.h / 2 - sh.y) < 22) {
            sh.collected = true
            s.shardsCount++
            soundManager.playShieldUp()
          }

          if (sh.x < -20 || sh.collected) {
            s.shards.splice(i, 1)
          }
        }
      }

      // RENDER CANVAS
      ctx.save()
      ctx.clearRect(0, 0, 600, 320)

      // Screen Shake
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      // Cyber Runner Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 320)
      bgGrad.addColorStop(0, '#0a0d24')
      bgGrad.addColorStop(1, '#02030a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, 600, 320)

      // Speed Grid lines in background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      const offset = (s.distance * 2) % 40
      for (let x = -offset; x < 600; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 40)
        ctx.lineTo(x, 280)
        ctx.stroke()
      }

      // Floor & Ceiling Neon Boundaries
      // Ceiling (y = 40)
      ctx.fillStyle = '#ec4899'
      ctx.shadowColor = '#ec4899'
      ctx.shadowBlur = 12
      ctx.fillRect(0, 0, 600, 40)
      // Floor (y = 280)
      ctx.fillStyle = '#06b6d4'
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 12
      ctx.fillRect(0, 280, 600, 40)
      ctx.shadowBlur = 0

      // Draw Trail Particles
      s.trails.forEach((t) => {
        ctx.fillStyle = t.color
        ctx.globalAlpha = t.alpha
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2)
        ctx.fill()
        t.alpha -= 0.04
      })
      ctx.globalAlpha = 1

      // Draw Obstacles (Spike Lasers)
      s.obstacles.forEach((ob) => {
        const obY = ob.atCeiling ? 40 : 280 - ob.h
        ctx.fillStyle = ob.atCeiling ? '#f43f5e' : '#38bdf8'
        ctx.shadowColor = ob.atCeiling ? '#f43f5e' : '#38bdf8'
        ctx.shadowBlur = 10

        ctx.beginPath()
        if (ob.atCeiling) {
          // Pointing down from ceiling
          ctx.moveTo(ob.x, 40)
          ctx.lineTo(ob.x + ob.w, 40)
          ctx.lineTo(ob.x + ob.w / 2, 40 + ob.h)
        } else {
          // Pointing up from floor
          ctx.moveTo(ob.x, 280)
          ctx.lineTo(ob.x + ob.w, 280)
          ctx.lineTo(ob.x + ob.w / 2, 280 - ob.h)
        }
        ctx.closePath()
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // Draw Quantum Energy Shards
      s.shards.forEach((sh) => {
        ctx.fillStyle = '#fef08a'
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(sh.x, sh.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw Player Runner
      ctx.save()
      ctx.translate(s.x + s.w / 2, s.y + s.h / 2)
      // If gravity is inverted, flip upside down
      if (s.gravity < 0) ctx.scale(1, -1)

      // Cyber runner robot body
      ctx.shadowColor = s.gravity > 0 ? '#38bdf8' : '#f43f5e'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-s.w / 2, -s.h / 2, s.w, s.h, 6)
      ctx.fill()

      // Visor
      ctx.fillStyle = s.gravity > 0 ? '#06b6d4' : '#ec4899'
      ctx.fillRect(-s.w / 2 + 4, -s.h / 2 + 5, s.w - 6, 6)

      ctx.restore()

      ctx.restore()

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [difficulty, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Compass className={`w-5 h-5 transition-transform duration-300 ${gravityDir === 'up' ? 'rotate-180 text-pink-400' : 'text-cyan-400'}`} />
          <span className="text-xs font-mono font-bold text-gray-300">
            {isRtl ? 'الجاذبية:' : 'GRAV:'} {gravityDir === 'up' ? (isRtl ? 'سقف ↑' : 'CEIL ↑') : (isRtl ? 'أرض ↓' : 'FLOOR ↓')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-amber-400 text-sm font-bold">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>{distance}m</span>
        </div>

        <div className="text-xl font-black font-mono text-cyan-300">
          {score} <span className="text-xs text-gray-400">XP</span>
        </div>
      </div>

      {/* Canvas Game Area */}
      <div
        className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-pointer active:scale-[0.99] transition-transform w-full"
        onClick={invertGravity}
      >
        <canvas ref={canvasRef} width={600} height={320} className="w-full max-w-[600px] h-auto block" />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
              <Compass className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'عداء الجاذبية المعكوسة 🌀' : 'QUANTUM GRAVITY RUNNER 🌀'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
              {isRtl
                ? 'اضغط في أي مكان أو اضغط المسافة لعكس حقل الجاذبية بين السقف والأرض فوراً وتفادي العوائق الليزرية!'
                : 'Tap screen or press Space to flip gravity between ceiling and floor to dodge lasers!'}
            </p>
            <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer">
              {isRtl ? 'بدء الركض' : 'Start Running'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              {isRtl ? 'تحطم في الحقل الكمومي! 💥' : 'Quantum Crash! 💥'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl
                ? `قطعت مسافة ${distance} متراً بنجاح وسط الفوضى!`
                : `You sprinted ${distance} meters through the anomaly!`}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'المسافة' : 'Distance'}</span>
                <span className="text-xl font-black text-amber-400 font-mono">{distance}m</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'النقاط' : 'Score'}</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{score}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Run Again'}</span>
            </button>
          </div>
        )}
      </div>

      <span className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl ? 'اضغط على الشاشة أو اضغط Space / ↑ لعكس الجاذبية' : 'Click / Tap screen or press Space / Up to invert gravity'}
      </span>
    </div>
  )
}

