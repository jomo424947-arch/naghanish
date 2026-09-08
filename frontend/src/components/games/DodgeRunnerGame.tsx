/**
 * DodgeRunnerGame.tsx
 *
 * Cyber Dodge Runner (تفادي العقبات النفاثة)
 * 3-Lane hyper-speed obstacle dodge runner built with HTML5 Canvas 2D.
 * Features:
 * - 3 Neon speed lanes with smooth hovercraft lane switching.
 * - Dynamic laser hazards: Pulsing gate barriers, falling spike pylons, and speed walls.
 * - Power-up capsules: Slow-Mo bullet time (blue-shift aura), Golden Coins, and Force Shields.
 * - Speed lines parallax, crash explosions, screen shake, and Web Audio SFX.
 * - Touch swipe, keyboard arrows / A-D, and mobile tap buttons.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Zap, Shield, ArrowLeft, ArrowRight, Gauge } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface DodgeRunnerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Obstacle {
  id: number
  lane: number // 0: Left, 1: Center, 2: Right
  y: number
  w: number
  h: number
  type: 'gate' | 'block'
  color: string
}

interface Capsule {
  id: number
  lane: number
  y: number
  type: 'slowmo' | 'shield' | 'coin'
}

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

interface SpeedLine {
  x: number
  y: number
  length: number
  speed: number
  alpha: number
}

const CANVAS_WIDTH = 340
const CANVAS_HEIGHT = 420
const LANE_WIDTH = CANVAS_WIDTH / 3
const LANE_CENTERS = [LANE_WIDTH * 0.5, LANE_WIDTH * 1.5, LANE_WIDTH * 2.5]

export const DodgeRunnerGame: React.FC<DodgeRunnerProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React HUD states
  const [distance, setDistance] = useState(0)
  const [hasShield, setHasShield] = useState(false)
  const [isSlowMo, setIsSlowMo] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // 60fps Game Engine Refs
  const currentLaneRef = useRef<number>(1) // 0, 1, 2
  const vehicleXRef = useRef<number>(LANE_CENTERS[1])
  const obstaclesRef = useRef<Obstacle[]>([])
  const capsulesRef = useRef<Capsule[]>([])
  const speedLinesRef = useRef<SpeedLine[]>([])
  const particlesRef = useRef<Particle[]>([])
  const obstacleIdCounter = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const distanceRef = useRef<number>(0)
  const shieldRef = useRef<boolean>(false)
  const slowMoTimerRef = useRef<number>(0)
  const screenShakeRef = useRef<number>(0)
  const isGameOverRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Speed and difficulty
  const baseSpeed = difficulty === 'Easy' ? 3.8 : difficulty === 'Hard' ? 6.2 : 4.8
  const spawnInterval = difficulty === 'Easy' ? 55 : difficulty === 'Hard' ? 32 : 42

  // Switch Lane
  const switchLane = useCallback((dir: 'LEFT' | 'RIGHT') => {
    if (isGameOverRef.current || !hasStarted) return
    const cur = currentLaneRef.current
    if (dir === 'LEFT' && cur > 0) {
      currentLaneRef.current = cur - 1
      sound.playSwoosh()
    } else if (dir === 'RIGHT' && cur < 2) {
      currentLaneRef.current = cur + 1
      sound.playSwoosh()
    }
  }, [hasStarted])

  // Initialize Speed Lines
  const initSpeedLines = useCallback(() => {
    speedLinesRef.current = []
    for (let i = 0; i < 30; i++) {
      speedLinesRef.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        length: Math.random() * 25 + 10,
        speed: Math.random() * 4 + 4,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }
  }, [])

  // Start / Reset Game
  const resetGame = useCallback(() => {
    initSpeedLines()
    obstaclesRef.current = []
    capsulesRef.current = []
    particlesRef.current = []
    currentLaneRef.current = 1
    vehicleXRef.current = LANE_CENTERS[1]
    distanceRef.current = 0
    shieldRef.current = false
    slowMoTimerRef.current = 0
    screenShakeRef.current = 0
    spawnTimerRef.current = 0
    isGameOverRef.current = false

    setDistance(0)
    setHasShield(false)
    setIsSlowMo(false)
    setIsGameOver(false)
    setHasStarted(true)
  }, [initSpeedLines])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault()
        switchLane('LEFT')
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault()
        switchLane('RIGHT')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [switchLane])

  // Touch / Swipe controls on canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x

    if (Math.abs(dx) > 30) {
      if (dx > 0) switchLane('RIGHT')
      else switchLane('LEFT')
    }
    touchStartRef.current = null
  }

  // Main 60fps Canvas Loop
  useEffect(() => {
    if (!hasStarted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      // 1. Smooth Vehicle X Interpolation
      const targetX = LANE_CENTERS[currentLaneRef.current]
      vehicleXRef.current += (targetX - vehicleXRef.current) * 0.32
      const vx = vehicleXRef.current
      const vy = CANVAS_HEIGHT - 65

      // 2. Slow-Mo Timer decay
      const isSlow = slowMoTimerRef.current > 0
      if (isSlow) {
        slowMoTimerRef.current--
        if (slowMoTimerRef.current === 0) setIsSlowMo(false)
      }

      // 3. Current speed (slow-mo reduces speed by 50%)
      const speedMultiplier = isSlow ? 0.5 : 1.0
      const currentScrollSpeed =
        (baseSpeed + Math.min(3.5, distanceRef.current * 0.001)) * speedMultiplier

      // 4. Update Distance
      if (!isGameOverRef.current) {
        distanceRef.current += Math.round(currentScrollSpeed * 0.5)
        setDistance(distanceRef.current)
      }

      // 5. Screen Shake decay
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.88
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      // 6. Update Speed Lines
      speedLinesRef.current.forEach((sl) => {
        sl.y += (sl.speed + currentScrollSpeed) * 0.7
        if (sl.y > CANVAS_HEIGHT) {
          sl.y = -sl.length
          sl.x = Math.random() * CANVAS_WIDTH
        }
      })

      // 7. Spawner
      if (!isGameOverRef.current) {
        spawnTimerRef.current++
        if (spawnTimerRef.current >= spawnInterval) {
          spawnTimerRef.current = 0

          // Spawn 1 or 2 obstacle lanes (always leave at least 1 lane open)
          const blockedLanes = [Math.floor(Math.random() * 3)]
          if (Math.random() < 0.35) {
            const secondLane = (blockedLanes[0] + (Math.random() > 0.5 ? 1 : 2)) % 3
            blockedLanes.push(secondLane)
          }

          blockedLanes.forEach((lane) => {
            const isGate = Math.random() > 0.5
            obstaclesRef.current.push({
              id: obstacleIdCounter.current++,
              lane,
              y: -50,
              w: LANE_WIDTH - 16,
              h: isGate ? 24 : 32,
              type: isGate ? 'gate' : 'block',
              color: isGate ? '#f43f5e' : '#a855f7',
            })
          })

          // Capsule spawn on open lane (20% chance)
          if (Math.random() < 0.22) {
            const freeLane = [0, 1, 2].find((l) => !blockedLanes.includes(l)) ?? 1
            const types: ('slowmo' | 'shield' | 'coin')[] = ['slowmo', 'shield', 'coin', 'coin']
            capsulesRef.current.push({
              id: obstacleIdCounter.current++,
              lane: freeLane,
              y: -50,
              type: types[Math.floor(Math.random() * types.length)],
            })
          }
        }
      }

      // 8. Update Obstacles & Collision
      const nextObstacles: Obstacle[] = []
      for (const obs of obstaclesRef.current) {
        obs.y += currentScrollSpeed

        // Collision check with vehicle
        const obsX = LANE_CENTERS[obs.lane]
        if (
          Math.abs(obsX - vx) < 32 &&
          obs.y + obs.h >= vy - 20 &&
          obs.y <= vy + 20
        ) {
          if (shieldRef.current) {
            // Shield absorbs hit
            shieldRef.current = false
            setHasShield(false)
            sound.playExplosion()
            screenShakeRef.current = 6
          } else {
            // Player Crash!
            isGameOverRef.current = true
            setIsGameOver(true)
            sound.playExplosion()
            sound.playGameOver()
            screenShakeRef.current = 14

            // Particle explosion
            for (let i = 0; i < 35; i++) {
              const angle = Math.random() * Math.PI * 2
              const spd = Math.random() * 5 + 1.5
              particlesRef.current.push({
                x: vx,
                y: vy,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                color: '#f43f5e',
                radius: Math.random() * 3 + 1,
                alpha: 1,
                life: 0,
                maxLife: 30,
              })
            }

            onFinish(distanceRef.current)
            return
          }
        } else if (obs.y < CANVAS_HEIGHT + 40) {
          nextObstacles.push(obs)
        }
      }
      obstaclesRef.current = nextObstacles

      // 9. Update Capsules
      const nextCapsules: Capsule[] = []
      for (const cap of capsulesRef.current) {
        cap.y += currentScrollSpeed

        const capX = LANE_CENTERS[cap.lane]
        if (
          Math.abs(capX - vx) < 28 &&
          cap.y >= vy - 22 &&
          cap.y <= vy + 22
        ) {
          if (cap.type === 'coin') {
            sound.playCoin()
            distanceRef.current += 150
          } else if (cap.type === 'shield') {
            sound.playShieldUp()
            shieldRef.current = true
            setHasShield(true)
          } else if (cap.type === 'slowmo') {
            sound.playPowerUp()
            slowMoTimerRef.current = 240 // ~4s
            setIsSlowMo(true)
          }
        } else if (cap.y < CANVAS_HEIGHT + 30) {
          nextCapsules.push(cap)
        }
      }
      capsulesRef.current = nextCapsules

      // 10. Update Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
      })
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      // ──────────────── DRAW PHASE ────────────────
      ctx.save()

      // Shake
      if (screenShakeRef.current > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShakeRef.current * 2,
          (Math.random() - 0.5) * screenShakeRef.current * 2
        )
      }

      // Background with slow-mo blue-shift
      ctx.fillStyle = isSlow ? '#020d24' : '#060714'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Speed lines
      speedLinesRef.current.forEach((sl) => {
        ctx.strokeStyle = isSlow ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sl.x, sl.y)
        ctx.lineTo(sl.x, sl.y + sl.length)
        ctx.stroke()
      })

      // Draw 3 Lane Boundaries
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(LANE_WIDTH, 0)
      ctx.lineTo(LANE_WIDTH, CANVAS_HEIGHT)
      ctx.moveTo(LANE_WIDTH * 2, 0)
      ctx.lineTo(LANE_WIDTH * 2, CANVAS_HEIGHT)
      ctx.stroke()

      // Draw Obstacles
      obstaclesRef.current.forEach((obs) => {
        const ox = LANE_CENTERS[obs.lane] - obs.w / 2
        ctx.save()

        ctx.fillStyle = obs.color
        ctx.shadowColor = obs.color
        ctx.shadowBlur = 12

        ctx.beginPath()
        ctx.roundRect(ox, obs.y, obs.w, obs.h, 6)
        ctx.fill()
        ctx.shadowBlur = 0

        // Warning striped pattern
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      })

      // Draw Capsules
      capsulesRef.current.forEach((cap) => {
        const cx = LANE_CENTERS[cap.lane]
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cap.y, 9, 0, Math.PI * 2)

        const cColor =
          cap.type === 'shield'
            ? '#06b6d4'
            : cap.type === 'slowmo'
            ? '#a855f7'
            : '#fbbf24'
        ctx.fillStyle = cColor
        ctx.shadowColor = cColor
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 8px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cap.type === 'shield' ? '🛡️' : cap.type === 'slowmo' ? '⏱️' : '★', cx, cap.y)
        ctx.restore()
      })

      // Draw Vehicle
      ctx.save()
      ctx.translate(vx, vy)

      // Shield Aura
      if (shieldRef.current) {
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 14
        ctx.stroke()
      }

      // Hovercraft Hull
      ctx.beginPath()
      ctx.moveTo(0, -20) // Nose
      ctx.lineTo(-14, 16) // Left wing
      ctx.lineTo(0, 10)
      ctx.lineTo(14, 16) // Right wing
      ctx.closePath()

      const vGrad = ctx.createLinearGradient(0, -20, 0, 16)
      vGrad.addColorStop(0, isSlow ? '#38bdf8' : '#f59e0b')
      vGrad.addColorStop(1, '#ea580c')
      ctx.fillStyle = vGrad
      ctx.shadowColor = isSlow ? '#38bdf8' : '#f59e0b'
      ctx.shadowBlur = 14
      ctx.fill()

      // Cockpit Glow
      ctx.beginPath()
      ctx.arc(0, -4, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // Thruster flame
      ctx.beginPath()
      ctx.moveTo(-4, 12)
      ctx.lineTo(0, 22 + (Math.random() * 6 - 3))
      ctx.lineTo(4, 12)
      ctx.fillStyle = '#38bdf8'
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10
      ctx.fill()

      ctx.restore()

      // Draw Particles
      particlesRef.current.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      ctx.restore() // Restore shake

      if (!isGameOverRef.current) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [hasStarted, baseSpeed, spawnInterval, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Distance */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'المسافة' : 'Distance'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{distance} m</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {hasShield && (
            <div className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/60 px-2 py-1 rounded-lg text-cyan-300 text-xs font-bold animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span>{isRtl ? 'درع' : 'SHIELD'}</span>
            </div>
          )}
          {isSlowMo && (
            <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-400/60 px-2 py-1 rounded-lg text-purple-300 text-xs font-bold animate-bounce">
              <Gauge className="w-3.5 h-3.5" />
              <span>SLOW-MO</span>
            </div>
          )}
        </div>

        {/* Speed Indicator */}
        <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>{Math.round(baseSpeed * 10)} km/h</span>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full aspect-[340/420] max-h-[420px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block cursor-ew-resize touch-none"
        />

        {/* Pre-Game Start Screen */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#f59e0b] animate-bounce">
              ⚡
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'تفادي العقبات النفاثة' : 'Cyber Dodge Runner'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'بدّل بين المسارات الثلاثة بسرعة لتفادي الحواجز، واجمع الدروع وكبسولات إبطاء الوقت!'
                  : 'Switch between 3 lanes to dodge barriers, collect shields, and trigger Slow-Mo!'}
              </p>
            </div>
            <Button variant="primary" onClick={resetGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'انطلاق نفاث ⚡' : 'Launch Runner ⚡'}
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl">💥</div>
            <div>
              <h3 className="text-2xl font-black text-rose-400">
                {isRtl ? 'اصطدام عنيف!' : 'CRASHED!'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'المسافة المقطوعة:' : 'Final Distance:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{distance} m</span>
              </p>
            </div>
            <Button variant="primary" onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'محاولة جديدة' : 'Try Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tactile 2-Way Buttons for Mobile */}
      <div className="grid grid-cols-2 gap-3 w-full px-2">
        <button
          onClick={() => switchLane('LEFT')}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 flex items-center justify-center text-amber-300 font-bold transition-all shadow-lg active:bg-amber-600 active:text-white cursor-pointer disabled:opacity-30"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => switchLane('RIGHT')}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 flex items-center justify-center text-amber-300 font-bold transition-all shadow-lg active:bg-amber-600 active:text-white cursor-pointer disabled:opacity-30"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اسحب بإصبعك يميناً/يساراً أو عبر الأسهم (← / →) أو A / D'
          : 'Controls: Swipe left/right on screen or use Arrow keys (← / →)'}
      </div>
    </div>
  )
}

