/**
 * GravityRunnerGame.tsx
 *
 * Quantum gravity flip runner — dodge ceiling/floor lasers, collect shards.
 * Phase 2: useGameLoop, responsive stage, level-scaled speed/obstacles.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, Zap, Compass } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { useEventCallback } from '@hooks/useEventCallback'
import { sound } from '@/utils/soundManager'

const WORLD_W = 600
const WORLD_H = 320
const FLOOR_Y = 280
const CEILING_Y = 40

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

function baseSpeedFor(level: number, difficulty: string): number {
  const d = difficulty === 'Easy' ? 4.5 : difficulty === 'Hard' ? 6.2 : 5.2
  return d + (level - 1) * 0.45
}

function obstacleGapFor(level: number): { min: number; range: number } {
  const min = Math.max(28, 60 - level * 5)
  const range = Math.max(18, 45 - level * 3)
  return { min, range }
}

function distanceTarget(level: number): number {
  return 450 + level * 250
}

export const GravityRunnerGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width, height, prepareCanvas } = useResponsiveStage({
    aspectRatio: WORLD_W / WORLD_H,
    minWidth: 280,
    maxWidth: 600,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'CLEARED'>('IDLE')
  const [gravityDir, setGravityDir] = useState<'down' | 'up'>('down')

  const targetDist = distanceTarget(level)
  const finishedRef = useRef(false)
  const gameStateRef = useRef(gameState)
  gameStateRef.current = gameState

  const stateRef = useRef({
    running: false,
    x: 80,
    y: 270,
    w: 24,
    h: 30,
    vy: 0,
    gravity: 0.85,
    isGrounded: true,
    speed: 5.0,
    distance: 0,
    shardsCount: 0,
    obstacles: [] as Obstacle[],
    shards: [] as Shard[],
    trails: [] as TrailParticle[],
    shake: 0,
    nextObstacleTimer: 0,
    milestonePlayed: 0,
  })

  const finishRun = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared
        ? finalScore >= targetDist
          ? 3
          : finalScore >= targetDist * 0.6
            ? 2
            : 1
        : 0
      if (cleared) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      }
      onFinish(finalScore, { levelReached: level, stars, clearedAll: false })
    },
    [level, onFinish, onLevelComplete, targetDist]
  )

  const startGame = useCallback(
    (autoStart = true) => {
      sound.playClick()
      const speed = baseSpeedFor(level, difficulty)
      stateRef.current = {
        running: autoStart,
        x: 80,
        y: 270,
        w: 24,
        h: 30,
        vy: 0,
        gravity: 0.85,
        isGrounded: true,
        speed,
        distance: 0,
        shardsCount: 0,
        obstacles: [],
        shards: [],
        trails: [],
        shake: 0,
        nextObstacleTimer: 60,
        milestonePlayed: 0,
      }
      setScore(0)
      setDistance(0)
      setGravityDir('down')
      finishedRef.current = false
      setGameState(autoStart ? 'PLAYING' : 'IDLE')
      if (autoStart) sound.playPowerUp()
    },
    [difficulty, level]
  )

  useEffect(() => {
    startGame(false)
  }, [level, startGame])

  const invertGravity = useEventCallback(() => {
    if (gameStateRef.current === 'IDLE') {
      startGame(true)
      return
    }
    if (gameStateRef.current !== 'PLAYING' || !stateRef.current.running) return

    const s = stateRef.current
    s.gravity = -s.gravity
    s.vy = s.gravity > 0 ? 3 : -3
    setGravityDir(s.gravity > 0 ? 'down' : 'up')
    sound.playPortal()

    for (let i = 0; i < 12; i++) {
      s.trails.push({
        x: s.x + s.w / 2,
        y: s.y + s.h / 2,
        size: Math.random() * 5 + 3,
        alpha: 1,
        color: s.gravity > 0 ? '#06b6d4' : '#ec4899',
      })
    }
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        invertGravity()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [invertGravity])

  useGameLoop(
    (delta) => {
      const s = stateRef.current
      const dt = delta * 60

      if (s.running && gameStateRef.current === 'PLAYING') {
        s.distance += Math.floor(s.speed * 0.4 * dt)
        setDistance(s.distance)
        const curScore = Math.floor(s.distance * 0.5) + s.shardsCount * 50
        setScore(curScore)

        s.speed = Math.min(10 + level * 0.5, s.speed + 0.0015 * dt)

        if (s.distance > 0 && s.distance - s.milestonePlayed >= 300) {
          s.milestonePlayed = s.distance
          sound.playComboX2()
        }

        if (s.distance >= targetDist) {
          s.running = false
          setGameState('CLEARED')
          finishRun(curScore, true)
        } else {
          s.vy += s.gravity * dt
          s.y += s.vy * dt

          if (s.y + s.h >= FLOOR_Y) {
            s.y = FLOOR_Y - s.h
            s.vy = 0
            s.isGrounded = true
          } else if (s.y <= CEILING_Y) {
            s.y = CEILING_Y
            s.vy = 0
            s.isGrounded = true
          } else {
            s.isGrounded = false
          }

          s.trails.unshift({
            x: s.x,
            y: s.y + s.h / 2,
            size: Math.random() * 4 + 2,
            alpha: 0.8,
            color: s.gravity > 0 ? '#06b6d4' : '#f43f5e',
          })
          if (s.trails.length > 25) s.trails.pop()

          s.nextObstacleTimer -= dt
          if (s.nextObstacleTimer <= 0) {
            const atCeiling = Math.random() < 0.5
            const hBoost = Math.min(20, (level - 1) * 4)
            const h = Math.floor(Math.random() * 35) + 35 + hBoost
            s.obstacles.push({
              x: WORLD_W,
              w: 26,
              h: Math.min(h, FLOOR_Y - CEILING_Y - 50),
              atCeiling,
              passed: false,
            })

            if (Math.random() < 0.6) {
              s.shards.push({
                x: WORLD_W + (Math.random() * 60 + 30),
                y: atCeiling ? FLOOR_Y - 50 : CEILING_Y + 50,
                collected: false,
              })
            }

            const gap = obstacleGapFor(level)
            s.nextObstacleTimer = Math.floor(Math.random() * gap.range) + gap.min
          }

          for (let i = s.obstacles.length - 1; i >= 0; i--) {
            const ob = s.obstacles[i]
            ob.x -= s.speed * dt
            const obY = ob.atCeiling ? CEILING_Y : FLOOR_Y - ob.h

            if (
              s.x + s.w - 4 >= ob.x &&
              s.x + 4 <= ob.x + ob.w &&
              s.y + s.h - 4 >= obY &&
              s.y + 4 <= obY + ob.h
            ) {
              s.running = false
              s.shake = 16
              sound.playExplosion()
              setGameState('GAMEOVER')
              finishRun(curScore, false)
              break
            }

            if (ob.x + ob.w < -20) s.obstacles.splice(i, 1)
          }

          for (let i = s.shards.length - 1; i >= 0; i--) {
            const sh = s.shards[i]
            sh.x -= s.speed * dt

            if (!sh.collected && Math.hypot(s.x + s.w / 2 - sh.x, s.y + s.h / 2 - sh.y) < 22) {
              sh.collected = true
              s.shardsCount++
              sound.playShieldUp()
            }

            if (sh.x < -20 || sh.collected) s.shards.splice(i, 1)
          }
        }
      }

      const ctx = prepareCanvas(canvasRef.current)
      if (!ctx) return

      ctx.save()
      ctx.scale(width / WORLD_W, height / WORLD_H)
      ctx.clearRect(0, 0, WORLD_W, WORLD_H)

      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 0, WORLD_H)
      bgGrad.addColorStop(0, '#0a0d24')
      bgGrad.addColorStop(1, '#02030a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, WORLD_W, WORLD_H)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      const offset = (s.distance * 2) % 40
      for (let x = -offset; x < WORLD_W; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, CEILING_Y)
        ctx.lineTo(x, FLOOR_Y)
        ctx.stroke()
      }

      ctx.fillStyle = '#ec4899'
      ctx.shadowColor = '#ec4899'
      ctx.shadowBlur = 12
      ctx.fillRect(0, 0, WORLD_W, CEILING_Y)
      ctx.fillStyle = '#06b6d4'
      ctx.shadowColor = '#06b6d4'
      ctx.fillRect(0, FLOOR_Y, WORLD_W, WORLD_H - FLOOR_Y)
      ctx.shadowBlur = 0

      s.trails.forEach((t) => {
        ctx.fillStyle = t.color
        ctx.globalAlpha = t.alpha
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2)
        ctx.fill()
        t.alpha -= 0.04
      })
      ctx.globalAlpha = 1

      s.obstacles.forEach((ob) => {
        ctx.fillStyle = ob.atCeiling ? '#f43f5e' : '#38bdf8'
        ctx.shadowColor = ob.atCeiling ? '#f43f5e' : '#38bdf8'
        ctx.shadowBlur = 10
        ctx.beginPath()
        if (ob.atCeiling) {
          ctx.moveTo(ob.x, CEILING_Y)
          ctx.lineTo(ob.x + ob.w, CEILING_Y)
          ctx.lineTo(ob.x + ob.w / 2, CEILING_Y + ob.h)
        } else {
          ctx.moveTo(ob.x, FLOOR_Y)
          ctx.lineTo(ob.x + ob.w, FLOOR_Y)
          ctx.lineTo(ob.x + ob.w / 2, FLOOR_Y - ob.h)
        }
        ctx.closePath()
        ctx.fill()
      })
      ctx.shadowBlur = 0

      s.shards.forEach((sh) => {
        ctx.fillStyle = '#fef08a'
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(sh.x, sh.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      ctx.save()
      ctx.translate(s.x + s.w / 2, s.y + s.h / 2)
      if (s.gravity < 0) ctx.scale(1, -1)
      ctx.shadowColor = s.gravity > 0 ? '#38bdf8' : '#f43f5e'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-s.w / 2, -s.h / 2, s.w, s.h, 6)
      ctx.fill()
      ctx.fillStyle = s.gravity > 0 ? '#06b6d4' : '#ec4899'
      ctx.fillRect(-s.w / 2 + 4, -s.h / 2 + 5, s.w - 6, 6)
      ctx.restore()

      ctx.restore()
    },
    { running: !isPaused && gameState !== 'IDLE' }
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto select-none">
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Compass
            className={`w-5 h-5 transition-transform duration-300 ${
              gravityDir === 'up' ? 'rotate-180 text-pink-400' : 'text-cyan-400'
            }`}
          />
          <span className="text-xs font-mono font-bold text-gray-300">
            {isRtl ? 'الجاذبية:' : 'GRAV:'}{' '}
            {gravityDir === 'up' ? (isRtl ? 'سقف ↑' : 'CEIL ↑') : isRtl ? 'أرض ↓' : 'FLOOR ↓'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-amber-400 text-sm font-bold">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>
            {distance}/{targetDist}m
          </span>
        </div>

        <div className="text-xl font-black font-mono text-cyan-300">
          {score} <span className="text-xs text-gray-400">XP</span>
          <span className="ms-2 text-xs text-cyan-500">L{level}</span>
        </div>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-pointer active:scale-[0.99] transition-transform touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
          onClick={invertGravity}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
                <Compass className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {isRtl ? `عداء الجاذبية · مرحلة ${level}` : `Gravity Runner · Level ${level}`}
              </h3>
              <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
                {isRtl
                  ? `اعكس الجاذبية وتفادَ الليزر حتى ${targetDist}م. المراحل الأعلى أسرع وأكثر عوائق.`
                  : `Flip gravity and dodge lasers for ${targetDist}m. Higher levels = faster + denser hazards.`}
              </p>
              <Button variant="primary" size="sm" onClick={() => startGame(true)}>
                {isRtl ? 'بدء الركض' : 'Start Running'}
              </Button>
            </div>
          )}

          {gameState === 'CLEARED' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
              <span className="text-4xl mb-2">🏆</span>
              <h3 className="text-2xl font-black text-emerald-400 mb-1">
                {isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'}
              </h3>
              <p className="text-xs text-white font-mono mb-4">
                {isRtl ? 'النقاط:' : 'Score:'} {score}
              </p>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
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

              <Button
                variant="primary"
                size="sm"
                onClick={() => startGame(true)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'إعادة المحاولة' : 'Run Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <span className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl
          ? 'اضغط على الشاشة أو اضغط Space / ↑ لعكس الجاذبية'
          : 'Click / Tap screen or press Space / Up to invert gravity'}
      </span>
    </div>
  )
}
