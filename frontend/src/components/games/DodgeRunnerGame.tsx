/**
 * DodgeRunnerGame.tsx
 *
 * Cyber Dodge Runner (تفادي العقبات النفاثة)
 * 3-Lane hyper-speed obstacle dodge runner built with HTML5 Canvas 2D.
 * Phase 2: useGameLoop + responsive stage + level-scaled spawn/speed.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { RotateCcw, Trophy, Zap, Shield, ArrowLeft, ArrowRight, Gauge, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

interface Obstacle {
  id: number
  lane: number
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

const DESIGN_W = 340
const DESIGN_H = 420
const LANE_WIDTH = DESIGN_W / 3
const LANE_CENTERS = [LANE_WIDTH * 0.5, LANE_WIDTH * 1.5, LANE_WIDTH * 2.5]
const FPS = 60

function targetDistance(level: number): number {
  return 800 + level * 400
}

export const DodgeRunnerGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width: stageWidth, height: stageHeight, prepareCanvas } =
    useResponsiveStage({
      aspectRatio: DESIGN_W / DESIGN_H,
      minWidth: 260,
      maxWidth: 420,
    })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const goalDistance = useMemo(() => targetDistance(level), [level])

  const [distance, setDistance] = useState(0)
  const [hasShield, setHasShield] = useState(false)
  const [isSlowMo, setIsSlowMo] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [levelCleared, setLevelCleared] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const currentLaneRef = useRef(1)
  const vehicleXRef = useRef(LANE_CENTERS[1])
  const obstaclesRef = useRef<Obstacle[]>([])
  const capsulesRef = useRef<Capsule[]>([])
  const speedLinesRef = useRef<SpeedLine[]>([])
  const particlesRef = useRef<Particle[]>([])
  const obstacleIdCounter = useRef(0)
  const spawnAccumRef = useRef(0)
  const distanceRef = useRef(0)
  const shieldRef = useRef(false)
  const slowMoTimerRef = useRef(0)
  const screenShakeRef = useRef(0)
  const isGameOverRef = useRef(false)
  const levelClearedRef = useRef(false)
  const finishedRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const stageSizeRef = useRef({ w: stageWidth, h: stageHeight })
  stageSizeRef.current = { w: stageWidth, h: stageHeight }

  const levelMul = 1 + (level - 1) * 0.1
  const baseSpeed =
    (difficulty === 'Easy' ? 3.8 : difficulty === 'Hard' ? 6.2 : 4.8) * levelMul
  const spawnIntervalSec =
    ((difficulty === 'Easy' ? 55 : difficulty === 'Hard' ? 32 : 42) / FPS) /
    (1 + (level - 1) * 0.08)

  const baseSpeedRef = useRef(baseSpeed)
  baseSpeedRef.current = baseSpeed
  const spawnIntervalRef = useRef(spawnIntervalSec)
  spawnIntervalRef.current = spawnIntervalSec
  const goalRef = useRef(goalDistance)
  goalRef.current = goalDistance
  const levelRef = useRef(level)
  levelRef.current = level

  const switchLane = useCallback(
    (dir: 'LEFT' | 'RIGHT') => {
      if (isGameOverRef.current || levelClearedRef.current || !hasStarted) return
      const cur = currentLaneRef.current
      if (dir === 'LEFT' && cur > 0) {
        currentLaneRef.current = cur - 1
        sound.playSwoosh()
      } else if (dir === 'RIGHT' && cur < 2) {
        currentLaneRef.current = cur + 1
        sound.playSwoosh()
      }
    },
    [hasStarted]
  )

  const initSpeedLines = useCallback(() => {
    speedLinesRef.current = []
    for (let i = 0; i < 30; i++) {
      speedLinesRef.current.push({
        x: Math.random() * DESIGN_W,
        y: Math.random() * DESIGN_H,
        length: Math.random() * 25 + 10,
        speed: Math.random() * 4 + 4,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }
  }, [])

  const finishRun = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared
        ? finalScore >= goalRef.current * 1.25
          ? 3
          : finalScore >= goalRef.current
            ? 2
            : 1
        : 0
      if (cleared) {
        onLevelComplete?.(levelRef.current, stars)
        sound.playWin()
      }
      onFinish(finalScore, { levelReached: levelRef.current, stars, clearedAll: false })
    },
    [onFinish, onLevelComplete]
  )

  const resetGame = useCallback(
    (autoStart = true) => {
      sound.playClick()
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
      spawnAccumRef.current = 0
      isGameOverRef.current = false
      levelClearedRef.current = false
      finishedRef.current = false

      setDistance(0)
      setHasShield(false)
      setIsSlowMo(false)
      setIsGameOver(false)
      setLevelCleared(false)
      setHasStarted(autoStart)
    },
    [initSpeedLines]
  )

  useEffect(() => {
    resetGame(false)
  }, [level, resetGame])

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

  useGameLoop(
    (delta) => {
      const dt = delta * FPS

      const targetX = LANE_CENTERS[currentLaneRef.current]
      vehicleXRef.current += (targetX - vehicleXRef.current) * Math.min(1, 0.32 * dt)
      const vx = vehicleXRef.current
      const vy = DESIGN_H - 65

      const isSlow = slowMoTimerRef.current > 0
      if (isSlow) {
        slowMoTimerRef.current -= delta
        if (slowMoTimerRef.current <= 0) {
          slowMoTimerRef.current = 0
          setIsSlowMo(false)
        }
      }

      const speedMultiplier = isSlow ? 0.5 : 1.0
      const currentScrollSpeed =
        (baseSpeedRef.current + Math.min(3.5, distanceRef.current * 0.001)) * speedMultiplier

      if (!isGameOverRef.current && !levelClearedRef.current) {
        distanceRef.current += Math.round(currentScrollSpeed * 0.5 * dt)
        setDistance(distanceRef.current)

        if (distanceRef.current >= goalRef.current) {
          levelClearedRef.current = true
          setLevelCleared(true)
          finishRun(distanceRef.current, true)
          return
        }
      }

      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= Math.pow(0.88, dt)
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0
      }

      speedLinesRef.current.forEach((sl) => {
        sl.y += (sl.speed + currentScrollSpeed) * 0.7 * dt
        if (sl.y > DESIGN_H) {
          sl.y = -sl.length
          sl.x = Math.random() * DESIGN_W
        }
      })

      if (!isGameOverRef.current && !levelClearedRef.current) {
        spawnAccumRef.current += delta
        if (spawnAccumRef.current >= spawnIntervalRef.current) {
          spawnAccumRef.current = 0

          const blockedLanes = [Math.floor(Math.random() * 3)]
          // Higher levels more often block two lanes
          const doubleChance = Math.min(0.55, 0.35 + (levelRef.current - 1) * 0.04)
          if (Math.random() < doubleChance) {
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

      const nextObstacles: Obstacle[] = []
      for (const obs of obstaclesRef.current) {
        obs.y += currentScrollSpeed * dt

        const obsX = LANE_CENTERS[obs.lane]
        if (Math.abs(obsX - vx) < 32 && obs.y + obs.h >= vy - 20 && obs.y <= vy + 20) {
          if (shieldRef.current) {
            shieldRef.current = false
            setHasShield(false)
            sound.playExplosion()
            screenShakeRef.current = 6
          } else {
            isGameOverRef.current = true
            setIsGameOver(true)
            sound.playExplosion()
            sound.playGameOver()
            screenShakeRef.current = 14

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

            finishRun(distanceRef.current, false)
          }
        } else if (obs.y < DESIGN_H + 40) {
          nextObstacles.push(obs)
        }
      }
      obstaclesRef.current = nextObstacles

      const nextCapsules: Capsule[] = []
      for (const cap of capsulesRef.current) {
        cap.y += currentScrollSpeed * dt

        const capX = LANE_CENTERS[cap.lane]
        if (Math.abs(capX - vx) < 28 && cap.y >= vy - 22 && cap.y <= vy + 22) {
          if (cap.type === 'coin') {
            sound.playCoin()
            distanceRef.current += 150
          } else if (cap.type === 'shield') {
            sound.playShieldUp()
            shieldRef.current = true
            setHasShield(true)
          } else if (cap.type === 'slowmo') {
            sound.playPowerUp()
            slowMoTimerRef.current = 4
            setIsSlowMo(true)
          }
        } else if (cap.y < DESIGN_H + 30) {
          nextCapsules.push(cap)
        }
      }
      capsulesRef.current = nextCapsules

      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life += dt
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
      })
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      const ctx = prepareCanvas(canvasRef.current)
      if (!ctx) return

      const { w: sw, h: sh } = stageSizeRef.current
      ctx.scale(sw / DESIGN_W, sh / DESIGN_H)

      ctx.save()
      if (screenShakeRef.current > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShakeRef.current * 2,
          (Math.random() - 0.5) * screenShakeRef.current * 2
        )
      }

      ctx.fillStyle = isSlow ? '#020d24' : '#060714'
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

      speedLinesRef.current.forEach((sl) => {
        ctx.strokeStyle = isSlow ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sl.x, sl.y)
        ctx.lineTo(sl.x, sl.y + sl.length)
        ctx.stroke()
      })

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(LANE_WIDTH, 0)
      ctx.lineTo(LANE_WIDTH, DESIGN_H)
      ctx.moveTo(LANE_WIDTH * 2, 0)
      ctx.lineTo(LANE_WIDTH * 2, DESIGN_H)
      ctx.stroke()

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
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      })

      capsulesRef.current.forEach((cap) => {
        const cx = LANE_CENTERS[cap.lane]
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cap.y, 9, 0, Math.PI * 2)
        const cColor =
          cap.type === 'shield' ? '#06b6d4' : cap.type === 'slowmo' ? '#a855f7' : '#fbbf24'
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

      ctx.save()
      ctx.translate(vx, vy)
      if (shieldRef.current) {
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 14
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(0, -20)
      ctx.lineTo(-14, 16)
      ctx.lineTo(0, 10)
      ctx.lineTo(14, 16)
      ctx.closePath()
      const vGrad = ctx.createLinearGradient(0, -20, 0, 16)
      vGrad.addColorStop(0, isSlow ? '#38bdf8' : '#f59e0b')
      vGrad.addColorStop(1, '#ea580c')
      ctx.fillStyle = vGrad
      ctx.shadowColor = isSlow ? '#38bdf8' : '#f59e0b'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, -4, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-4, 12)
      ctx.lineTo(0, 22 + (Math.random() * 6 - 3))
      ctx.lineTo(4, 12)
      ctx.fillStyle = '#38bdf8'
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.restore()

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

      ctx.restore()
    },
    { running: hasStarted && !isGameOver && !levelCleared && !isPaused }
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'المسافة' : 'Distance'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{distance} m</span>
          </div>
        </div>

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
          <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            L{level}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>{Math.round(baseSpeed * 10)} km/h</span>
        </div>
      </div>

      <div className="w-full text-center text-[10px] font-mono text-amber-300/80">
        {isRtl ? 'الهدف:' : 'Goal:'} {Math.min(distance, goalDistance)}/{goalDistance} m
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] bg-[#060714] touch-none [overscroll-behavior:contain]"
          style={{ width: stageWidth, height: stageHeight }}
        >
          <canvas
            ref={canvasRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full block cursor-ew-resize touch-none"
          />

          {!hasStarted && !isGameOver && !levelCleared && (
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
                    ? `المرحلة ${level} · اوصل ${goalDistance}م. بدّل المسارات لتفادي الحواجز!`
                    : `Level ${level} · reach ${goalDistance}m. Switch lanes to dodge barriers!`}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => resetGame(true)}
                className="px-6 py-2.5 text-sm font-black"
              >
                {isRtl ? 'انطلاق نفاث ⚡' : 'Launch Runner ⚡'}
              </Button>
            </div>
          )}

          {levelCleared && (
            <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="text-4xl">🏆</div>
              <h3 className="text-2xl font-black text-emerald-400">
                {isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'}
              </h3>
              <p className="text-sm font-bold text-slate-200">
                {isRtl ? 'المسافة:' : 'Distance:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{distance} m</span>
              </p>
            </div>
          )}

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
              <Button
                variant="primary"
                onClick={() => resetGame(true)}
                className="flex items-center gap-2 px-6 py-2.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'محاولة جديدة' : 'Try Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full px-2">
        <button
          type="button"
          onClick={() => switchLane('LEFT')}
          disabled={!hasStarted || isGameOver || levelCleared}
          className="h-14 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 flex items-center justify-center text-amber-300 font-bold transition-all shadow-lg active:bg-amber-600 active:text-white cursor-pointer disabled:opacity-30"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => switchLane('RIGHT')}
          disabled={!hasStarted || isGameOver || levelCleared}
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
