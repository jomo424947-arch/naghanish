/**
 * BrickBreakerGame.tsx
 *
 * Arkanoid Brick Smasher (كسار الطوب النيوني)
 * Phase 2: useGameLoop + responsive stage + level-scaled stages (1–10).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Heart, Zap, Layers } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type BrickType = 'normal' | 'armored' | 'golden' | 'explosive'

interface Brick {
  x: number
  y: number
  w: number
  h: number
  type: BrickType
  hp: number
  color: string
  active: boolean
}

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface Capsule {
  x: number
  y: number
  type: 'expand' | 'multiball' | 'laser' | 'slow'
  vy: number
}

interface LaserShot {
  x: number
  y: number
  vy: number
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

const DESIGN_W = 340
const DESIGN_H = 420
const MAX_STAGE = 10
/** Convert fixed-timestep seconds back to the original ~60fps frame units. */
const FRAME = 60

function buildStage(stageNum: number): Brick[] {
  const bricks: Brick[] = []
  const brickW = 48
  const brickH = 15
  const pad = 6
  const offsetTop = 45
  const offsetLeft = (DESIGN_W - (5 * (brickW + pad) - pad)) / 2

  if (stageNum === 1) {
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981']
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        const isGold = r === 0 && c === 2
        bricks.push({
          x: offsetLeft + c * (brickW + pad),
          y: offsetTop + r * (brickH + pad),
          w: brickW,
          h: brickH,
          type: isGold ? 'golden' : 'normal',
          hp: 1,
          color: isGold ? '#fbbf24' : colors[r % colors.length],
          active: true,
        })
      }
    }
  } else if (stageNum === 2) {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        let bType: BrickType = 'normal'
        let hp = 1
        let color = '#06b6d4'

        if (r === 2 && (c === 1 || c === 3)) {
          bType = 'explosive'
          color = '#f97316'
        } else if (r === 1 || r === 3) {
          bType = 'armored'
          hp = 2
          color = '#94a3b8'
        } else if (r === 0 && (c === 0 || c === 4)) {
          bType = 'golden'
          color = '#fbbf24'
        }

        bricks.push({
          x: offsetLeft + c * (brickW + pad),
          y: offsetTop + r * (brickH + pad),
          w: brickW,
          h: brickH,
          type: bType,
          hp,
          color,
          active: true,
        })
      }
    }
  } else if (stageNum === 3) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        const isCorner = (r === 0 || r === 5) && (c === 0 || c === 4)
        if (isCorner) continue

        const isExplosive = r === 3 && c === 2
        const isGolden = (r === 1 && c === 2) || (r === 4 && c === 2)
        const isArmored = r % 2 === 0

        bricks.push({
          x: offsetLeft + c * (brickW + pad),
          y: offsetTop + r * (brickH + pad),
          w: brickW,
          h: brickH,
          type: isExplosive ? 'explosive' : isGolden ? 'golden' : isArmored ? 'armored' : 'normal',
          hp: isArmored ? 2 : 1,
          color: isExplosive ? '#f43f5e' : isGolden ? '#fbbf24' : isArmored ? '#a855f7' : '#10b981',
          active: true,
        })
      }
    }
  } else {
    // Stages 4–10: denser vaults that scale with stage number
    const rows = Math.min(8, 5 + Math.floor((stageNum - 3) / 2))
    const cols = stageNum >= 8 ? 6 : 5
    const bw = cols === 6 ? 40 : brickW
    const left = (DESIGN_W - (cols * (bw + pad) - pad)) / 2
    const palette = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981', '#f97316', '#3b82f6']

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Occasional gaps so later stages stay fair
        if (stageNum >= 6 && r > 0 && c > 0 && c < cols - 1 && (r + c) % (11 - Math.min(stageNum, 10)) === 0) {
          continue
        }

        let bType: BrickType = 'normal'
        let hp = 1
        let color = palette[(r + c + stageNum) % palette.length]

        if ((r + c) % 7 === 0 || (stageNum >= 7 && r === Math.floor(rows / 2) && c === Math.floor(cols / 2))) {
          bType = 'explosive'
          color = '#f97316'
        } else if (r % 2 === 0 || stageNum >= 5) {
          const armoredBias = 0.25 + stageNum * 0.04
          if (Math.sin(r * 3 + c * 5 + stageNum) > 1 - armoredBias * 2) {
            bType = 'armored'
            hp = stageNum >= 9 ? 3 : 2
            color = '#94a3b8'
          }
        }
        if ((r === 0 && (c === 0 || c === cols - 1)) || (r === 1 && c === Math.floor(cols / 2))) {
          bType = 'golden'
          hp = 1
          color = '#fbbf24'
        }

        bricks.push({
          x: left + c * (bw + pad),
          y: offsetTop + r * (brickH + pad),
          w: bw,
          h: brickH,
          type: bType,
          hp,
          color,
          active: true,
        })
      }
    }
  }

  return bricks
}

export const BrickBreakerGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width, height, prepareCanvas } = useResponsiveStage({
    aspectRatio: DESIGN_W / DESIGN_H,
    minWidth: 260,
    maxWidth: 420,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [stage, setStage] = useState(1)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE')
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null)

  const paddleXRef = useRef(DESIGN_W / 2 - 40)
  const paddleTargetXRef = useRef(DESIGN_W / 2 - 40)
  const paddleWRef = useRef(76)
  const ballsRef = useRef<Ball[]>([])
  const bricksRef = useRef<Brick[]>([])
  const capsulesRef = useRef<Capsule[]>([])
  const lasersRef = useRef<LaserShot[]>([])
  const particlesRef = useRef<Particle[]>([])
  const screenShakeRef = useRef(0)
  const laserTimerRef = useRef(0)
  const expandTimerRef = useRef(0)
  const slowTimerRef = useRef(0)
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const stageRef = useRef(1)
  const finishedRef = useRef(false)
  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused
  const widthRef = useRef(width)
  const heightRef = useRef(height)
  widthRef.current = width
  heightRef.current = height

  const baseSpeed = difficulty === 'Easy' ? 3.4 : difficulty === 'Hard' ? 4.8 : 4.0
  // Slight speed bump on higher selected levels
  const levelSpeed = baseSpeed * (1 + Math.min(level - 1, 9) * 0.03)

  const emitParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = Math.random() * 3.5 + 1.2
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        radius: Math.random() * 2.5 + 1.5,
        alpha: 1,
        life: 0,
        maxLife: 25,
      })
    }
  }, [])

  const spawnCapsule = useCallback((x: number, y: number) => {
    const types: Capsule['type'][] = ['expand', 'multiball', 'laser', 'slow']
    const chosenType = types[Math.floor(Math.random() * types.length)]
    capsulesRef.current.push({ x, y, type: chosenType, vy: 1.8 })
  }, [])

  const launchStage = useCallback(
    (newStageNum: number, keepScore = false) => {
      const clamped = Math.min(MAX_STAGE, Math.max(1, newStageNum))
      stageRef.current = clamped
      setStage(clamped)
      finishedRef.current = false

      if (!keepScore) {
        scoreRef.current = 0
        setScore(0)
        livesRef.current = 3
        setLives(3)
      }

      paddleWRef.current = 76
      paddleXRef.current = DESIGN_W / 2 - 38
      paddleTargetXRef.current = DESIGN_W / 2 - 38

      ballsRef.current = [
        {
          x: DESIGN_W / 2,
          y: DESIGN_H - 60,
          vx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
          vy: -levelSpeed,
          radius: 5.5,
          color: '#38bdf8',
        },
      ]

      bricksRef.current = buildStage(clamped)
      capsulesRef.current = []
      lasersRef.current = []
      particlesRef.current = []
      laserTimerRef.current = 0
      expandTimerRef.current = 0
      slowTimerRef.current = 0
      setActivePowerUp(null)
      setGameState('PLAYING')
    },
    [levelSpeed]
  )

  const startGame = useCallback(() => {
    sound.playClick()
    launchStage(Math.min(MAX_STAGE, Math.max(1, level)), false)
  }, [launchStage, level])

  // Re-seed idle overlay when GameShell changes the selected level
  useEffect(() => {
    if (gameState === 'IDLE') {
      setStage(Math.min(MAX_STAGE, Math.max(1, level)))
    }
  }, [level, gameState])

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING' || isPausedRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) * (DESIGN_W / rect.width)
    const newX = relativeX - paddleWRef.current / 2
    paddleTargetXRef.current = Math.max(0, Math.min(DESIGN_W - paddleWRef.current, newX))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || isPausedRef.current) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        paddleTargetXRef.current = Math.max(0, paddleTargetXRef.current - 28)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        paddleTargetXRef.current = Math.min(
          DESIGN_W - paddleWRef.current,
          paddleTargetXRef.current + 28
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  useGameLoop(
    (delta) => {
      const dt = delta * FRAME

      paddleXRef.current += (paddleTargetXRef.current - paddleXRef.current) * Math.min(1, 0.35 * dt)
      const px = paddleXRef.current
      const pw = paddleWRef.current
      const py = DESIGN_H - 30

      if (expandTimerRef.current > 0) {
        expandTimerRef.current -= dt
        if (expandTimerRef.current <= 0) {
          expandTimerRef.current = 0
          paddleWRef.current = 76
          paddleXRef.current = Math.max(0, Math.min(DESIGN_W - 76, paddleXRef.current))
          paddleTargetXRef.current = Math.max(0, Math.min(DESIGN_W - 76, paddleTargetXRef.current))
          setActivePowerUp(null)
        }
      }

      if (slowTimerRef.current > 0) {
        slowTimerRef.current -= dt
        if (slowTimerRef.current <= 0) {
          slowTimerRef.current = 0
          setActivePowerUp(null)
        }
      }

      if (laserTimerRef.current > 0) {
        const prev = laserTimerRef.current
        laserTimerRef.current -= dt
        if (Math.floor(prev / 18) !== Math.floor(laserTimerRef.current / 18) && laserTimerRef.current > 0) {
          sound.playLaser()
          lasersRef.current.push(
            { x: px + 6, y: py - 4, vy: -7 },
            { x: px + pw - 6, y: py - 4, vy: -7 }
          )
        }
        if (laserTimerRef.current <= 0) {
          laserTimerRef.current = 0
          setActivePowerUp(null)
        }
      }

      if (screenShakeRef.current > 0) screenShakeRef.current *= Math.pow(0.88, dt)
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      const nextLasers: LaserShot[] = []
      for (const l of lasersRef.current) {
        l.y += l.vy * dt
        let hit = false

        for (const b of bricksRef.current) {
          if (b.active && l.x >= b.x && l.x <= b.x + b.w && l.y >= b.y && l.y <= b.y + b.h) {
            b.hp--
            hit = true
            emitParticles(b.x + b.w / 2, b.y + b.h / 2, b.color, 8)
            if (b.hp <= 0) {
              b.active = false
              scoreRef.current += b.type === 'explosive' ? 100 : 25
              setScore(scoreRef.current)
              sound.playExplosion()
            }
            break
          }
        }

        if (!hit && l.y > 0) nextLasers.push(l)
      }
      lasersRef.current = nextLasers

      const nextCapsules: Capsule[] = []
      for (const cap of capsulesRef.current) {
        cap.y += cap.vy * dt

        if (cap.y >= py - 8 && cap.y <= py + 16 && cap.x >= px - 6 && cap.x <= px + pw + 6) {
          sound.playPowerUp()
          scoreRef.current += 75
          setScore(scoreRef.current)

          if (cap.type === 'expand') {
            paddleWRef.current = 110
            expandTimerRef.current = 500
            setActivePowerUp('EXPAND PADDLE')
          } else if (cap.type === 'laser') {
            laserTimerRef.current = 360
            setActivePowerUp('LASER PADDLE')
          } else if (cap.type === 'slow') {
            slowTimerRef.current = 450
            setActivePowerUp('SLOW BALL')
          } else if (cap.type === 'multiball') {
            const mainB = ballsRef.current[0] || { x: px + pw / 2, y: py - 10, vx: 2, vy: -3 }
            ballsRef.current.push(
              { x: mainB.x, y: mainB.y, vx: -3, vy: -3.2, radius: 5.5, color: '#10b981' },
              { x: mainB.x, y: mainB.y, vx: 3, vy: -3.2, radius: 5.5, color: '#a855f7' }
            )
            setActivePowerUp('MULTI-BALL')
          }
        } else if (cap.y < DESIGN_H + 20) {
          nextCapsules.push(cap)
        }
      }
      capsulesRef.current = nextCapsules

      const survivingBalls: Ball[] = []
      const speedMod = slowTimerRef.current > 0 ? 0.65 : 1.0

      for (const ball of ballsRef.current) {
        ball.x += ball.vx * speedMod * dt
        ball.y += ball.vy * speedMod * dt

        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius
          ball.vx = Math.abs(ball.vx)
          sound.playBounce()
        } else if (ball.x + ball.radius >= DESIGN_W) {
          ball.x = DESIGN_W - ball.radius
          ball.vx = -Math.abs(ball.vx)
          sound.playBounce()
        }

        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius
          ball.vy = Math.abs(ball.vy)
          sound.playBounce()
        }

        if (
          ball.y + ball.radius >= py &&
          ball.y - ball.radius <= py + 12 &&
          ball.x >= px - 4 &&
          ball.x <= px + pw + 4 &&
          ball.vy > 0
        ) {
          sound.playBounce()
          ball.y = py - ball.radius

          const hitOffset = (ball.x - (px + pw / 2)) / (pw / 2)
          const maxBounceAngle = (60 * Math.PI) / 180
          const bounceAngle = hitOffset * maxBounceAngle
          const currentSpeedVal = Math.hypot(ball.vx, ball.vy)

          ball.vx = currentSpeedVal * Math.sin(bounceAngle)
          ball.vy = -currentSpeedVal * Math.cos(bounceAngle)
          emitParticles(ball.x, ball.y, '#38bdf8', 6)
        }

        for (let i = 0; i < bricksRef.current.length; i++) {
          const b = bricksRef.current[i]
          if (!b.active) continue

          if (
            ball.x + ball.radius >= b.x &&
            ball.x - ball.radius <= b.x + b.w &&
            ball.y + ball.radius >= b.y &&
            ball.y - ball.radius <= b.y + b.h
          ) {
            b.hp--

            const overlapLeft = ball.x + ball.radius - b.x
            const overlapRight = b.x + b.w - (ball.x - ball.radius)
            const overlapTop = ball.y + ball.radius - b.y
            const overlapBottom = b.y + b.h - (ball.y - ball.radius)
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              ball.vx = -ball.vx
            } else {
              ball.vy = -ball.vy
            }

            emitParticles(ball.x, ball.y, b.color, 10)

            if (b.hp <= 0) {
              b.active = false
              sound.playBounce()

              if (b.type === 'explosive') {
                sound.playExplosion()
                screenShakeRef.current = 8
                emitParticles(b.x + b.w / 2, b.y + b.h / 2, '#f43f5e', 24)

                bricksRef.current.forEach((adj) => {
                  if (adj.active && Math.hypot(adj.x - b.x, adj.y - b.y) < 70) {
                    adj.active = false
                    scoreRef.current += 30
                    emitParticles(adj.x + adj.w / 2, adj.y + adj.h / 2, adj.color, 8)
                  }
                })
                scoreRef.current += 100
              } else if (b.type === 'golden') {
                spawnCapsule(b.x + b.w / 2, b.y + b.h)
                scoreRef.current += 50
              } else if (b.type === 'armored') {
                scoreRef.current += 25
              } else {
                scoreRef.current += 10
              }

              setScore(scoreRef.current)
            } else {
              sound.playBounce()
            }
            break
          }
        }

        if (ball.y - ball.radius < DESIGN_H) {
          survivingBalls.push(ball)
        }
      }

      if (survivingBalls.length === 0) {
        livesRef.current--
        setLives(livesRef.current)
        sound.playExplosion()
        screenShakeRef.current = 8

        if (livesRef.current <= 0) {
          if (!finishedRef.current) {
            finishedRef.current = true
            sound.playGameOver()
            setGameState('GAMEOVER')
            onFinish(scoreRef.current, { levelReached: stageRef.current, stars: 0 })
          }
        } else {
          ballsRef.current = [
            {
              x: px + pw / 2,
              y: py - 12,
              vx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
              vy: -levelSpeed,
              radius: 5.5,
              color: '#38bdf8',
            },
          ]
        }
      } else {
        ballsRef.current = survivingBalls
      }

      const remainingBricks = bricksRef.current.filter((b) => b.active).length
      if (remainingBricks === 0 && !finishedRef.current) {
        sound.playWin()
        scoreRef.current += 250
        setScore(scoreRef.current)

        const clearedStage = stageRef.current
        const stars = livesRef.current >= 3 ? 3 : livesRef.current === 2 ? 2 : 1
        onLevelComplete?.(clearedStage, stars)

        if (clearedStage < MAX_STAGE) {
          launchStage(clearedStage + 1, true)
        } else {
          finishedRef.current = true
          scoreRef.current += 500
          setScore(scoreRef.current)
          sound.playWin()
          setGameState('VICTORY')
          onFinish(scoreRef.current, {
            levelReached: MAX_STAGE,
            stars: 3,
            clearedAll: true,
          })
        }
      }

      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life += dt
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
      })
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      // ── Draw ──
      const ctx = prepareCanvas(canvasRef.current)
      if (!ctx) return

      const sx = widthRef.current / DESIGN_W
      const sy = heightRef.current / DESIGN_H
      ctx.save()
      ctx.scale(sx, sy)

      if (screenShakeRef.current > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShakeRef.current * 2,
          (Math.random() - 0.5) * screenShakeRef.current * 2
        )
      }

      ctx.fillStyle = '#060714'
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)'
      ctx.lineWidth = 1
      for (let x = 0; x < DESIGN_W; x += 24) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, DESIGN_H)
        ctx.stroke()
      }

      bricksRef.current.forEach((b) => {
        if (!b.active) return
        ctx.save()
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = b.type === 'golden' ? 14 : 8
        ctx.beginPath()
        ctx.roundRect(b.x, b.y, b.w, b.h, 3)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()

        if (b.type === 'armored' && b.hp <= 1) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(b.x + 6, b.y + 3)
          ctx.lineTo(b.x + b.w / 2, b.y + b.h - 3)
          ctx.lineTo(b.x + b.w - 8, b.y + 4)
          ctx.stroke()
        }

        if (b.type === 'explosive') {
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 9px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('💥', b.x + b.w / 2, b.y + b.h / 2)
        } else if (b.type === 'golden') {
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 9px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('★', b.x + b.w / 2, b.y + b.h / 2)
        }
        ctx.restore()
      })

      capsulesRef.current.forEach((cap) => {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(cap.x - 8, cap.y - 5, 16, 10, 4)
        const cColor =
          cap.type === 'expand'
            ? '#38bdf8'
            : cap.type === 'multiball'
              ? '#10b981'
              : cap.type === 'laser'
                ? '#f43f5e'
                : '#fbbf24'
        ctx.fillStyle = cColor
        ctx.shadowColor = cColor
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 7px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cap.type[0].toUpperCase(), cap.x, cap.y)
        ctx.restore()
      })

      lasersRef.current.forEach((l) => {
        ctx.save()
        ctx.fillStyle = '#f43f5e'
        ctx.shadowColor = '#f43f5e'
        ctx.shadowBlur = 8
        ctx.fillRect(l.x - 1.5, l.y, 3, 10)
        ctx.restore()
      })

      ctx.save()
      const padGrad = ctx.createLinearGradient(px, py, px + pw, py + 12)
      padGrad.addColorStop(0, '#38bdf8')
      padGrad.addColorStop(1, '#6366f1')
      ctx.fillStyle = padGrad
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.roundRect(px, py, pw, 12, 6)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px + 8, py + 6)
      ctx.lineTo(px + pw - 8, py + 6)
      ctx.stroke()
      ctx.restore()

      ballsRef.current.forEach((b) => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = b.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = b.color
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      })

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
    { running: gameState === 'PLAYING' && !isPaused }
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl text-xs font-black text-purple-300">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isRtl ? 'مرحلة' : 'Stage'} {stage}/{MAX_STAGE}
            </span>
          </div>
          {activePowerUp && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2.5 py-1.5 rounded-xl text-xs font-black text-amber-300 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              <span>{activePowerUp}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-4 h-4 transition-colors ${
                idx < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#060714] touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
        >
          <canvas
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            className="w-full h-full block cursor-ew-resize touch-none"
          />

          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#06b6d4] animate-bounce">
                🧱
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {isRtl ? 'كسار الطوب النيوني' : 'Arkanoid Brick Smasher'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  {isRtl
                    ? `المرحلة ${Math.min(MAX_STAGE, Math.max(1, level))} — حطم القوالب واجمع كبسولات القوة!`
                    : `Stage ${Math.min(MAX_STAGE, Math.max(1, level))} — smash bricks and grab power-ups!`}
                </p>
              </div>
              <Button variant="primary" onClick={startGame} className="px-6 py-2.5 text-sm font-black">
                {isRtl ? 'بدء اللعبة 🕹️' : 'Start Smasher 🕹️'}
              </Button>
            </div>
          )}

          {gameState === 'VICTORY' && (
            <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="text-4xl animate-bounce">🏆👑</div>
              <div>
                <h3 className="text-2xl font-black text-emerald-400">
                  {isRtl ? 'انتصار أسطوري!' : 'VICTORY!'}
                </h3>
                <p className="text-sm font-bold text-slate-200 mt-1">
                  {isRtl ? `أنهيت كل المراحل (${MAX_STAGE})!` : `All ${MAX_STAGE} Stages Cleared!`}
                </p>
                <p className="text-xs text-cyan-400 font-mono mt-1 font-black">
                  {isRtl ? 'النقاط:' : 'Score:'} {score}
                </p>
              </div>
              <Button variant="primary" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'العب مجدداً' : 'Play Again'}</span>
              </Button>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="text-4xl">💥</div>
              <div>
                <h3 className="text-2xl font-black text-rose-400">
                  {isRtl ? 'خسرت كل الكرات!' : 'GAME OVER'}
                </h3>
                <p className="text-sm font-bold text-slate-200 mt-1">
                  {isRtl ? 'النتيجة:' : 'Final Score:'}{' '}
                  <span className="text-cyan-400 text-lg font-black">{score}</span>
                </p>
              </div>
              <Button variant="primary" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'إعادة المحاولة' : 'Try Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: حرك إصبعك أو الماوس يميناً ويساراً أو عبر الأسهم (← / →)'
          : 'Controls: Drag finger / mouse horizontally or use Arrow keys (← / →)'}
      </div>
    </div>
  )
}
