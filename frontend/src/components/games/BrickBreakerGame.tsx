/**
 * BrickBreakerGame.tsx
 *
 * Arkanoid Brick Smasher (كسار الطوب النيوني)
 * Advanced arcade breakout engine featuring:
 * - Multi-tier bricks: Normal (1-hit), Armored (2-hits with crack textures), Golden (power-up carrier), and Explosive (AOE blast).
 * - Collectible power-up capsules: Expand Paddle, Multi-Ball (3 active balls), Laser Paddle, and Slow Ball.
 * - Angle-based reflection physics (-60° to +60° depending on paddle contact point).
 * - 3 Progressive Stages with distinct architectural formations.
 * - Particle explosions, shockwaves, ball glow trails, and Web Audio SFX.
 * - Touch dragging, mouse tracking, and keyboard arrows.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Heart, Zap, Sparkles, Layers } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface BrickBreakerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

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

const CANVAS_WIDTH = 340
const CANVAS_HEIGHT = 420

export const BrickBreakerGame: React.FC<BrickBreakerProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React HUD States
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [stage, setStage] = useState(1)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE')
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null)

  // Engine Refs (60fps)
  const paddleXRef = useRef<number>(CANVAS_WIDTH / 2 - 40)
  const paddleTargetXRef = useRef<number>(CANVAS_WIDTH / 2 - 40)
  const paddleWRef = useRef<number>(76)
  const ballsRef = useRef<Ball[]>([])
  const bricksRef = useRef<Brick[]>([])
  const capsulesRef = useRef<Capsule[]>([])
  const lasersRef = useRef<LaserShot[]>([])
  const particlesRef = useRef<Particle[]>([])
  const screenShakeRef = useRef<number>(0)
  const laserTimerRef = useRef<number>(0)
  const expandTimerRef = useRef<number>(0)
  const slowTimerRef = useRef<number>(0)
  const scoreRef = useRef<number>(0)
  const livesRef = useRef<number>(3)
  const stageRef = useRef<number>(1)
  const isRunningRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)

  // Speed multiplier based on difficulty
  const baseSpeed = difficulty === 'Easy' ? 3.4 : difficulty === 'Hard' ? 4.8 : 4.0

  // ── Stage Layout Generators ──
  const buildStage = useCallback((stageNum: number): Brick[] => {
    const bricks: Brick[] = []
    const brickW = 48
    const brickH = 15
    const pad = 6
    const offsetTop = 45
    const offsetLeft = (CANVAS_WIDTH - (5 * (brickW + pad) - pad)) / 2

    if (stageNum === 1) {
      // Stage 1: Classic Neon Wall
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
      // Stage 2: Armored & Explosive Fortress
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
    } else {
      // Stage 3: Diamond Vault with high-density power blocks
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
    }

    return bricks
  }, [])

  // Particle emission helper
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

  // Spawn Power-Up Capsule
  const spawnCapsule = useCallback((x: number, y: number) => {
    const types: ('expand' | 'multiball' | 'laser' | 'slow')[] = [
      'expand',
      'multiball',
      'laser',
      'slow',
    ]
    const chosenType = types[Math.floor(Math.random() * types.length)]
    capsulesRef.current.push({
      x,
      y,
      type: chosenType,
      vy: 1.8,
    })
  }, [])

  // Start new stage or full reset
  const launchStage = useCallback(
    (newStageNum: number, keepScore = false) => {
      stageRef.current = newStageNum
      setStage(newStageNum)

      if (!keepScore) {
        scoreRef.current = 0
        setScore(0)
        livesRef.current = 3
        setLives(3)
      }

      paddleWRef.current = 76
      paddleXRef.current = CANVAS_WIDTH / 2 - 38
      paddleTargetXRef.current = CANVAS_WIDTH / 2 - 38

      // Main initial ball
      ballsRef.current = [
        {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT - 60,
          vx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
          vy: -baseSpeed,
          radius: 5.5,
          color: '#38bdf8',
        },
      ]

      bricksRef.current = buildStage(newStageNum)
      capsulesRef.current = []
      lasersRef.current = []
      particlesRef.current = []
      laserTimerRef.current = 0
      expandTimerRef.current = 0
      slowTimerRef.current = 0
      setActivePowerUp(null)

      isRunningRef.current = true
      setGameState('PLAYING')
    },
    [baseSpeed, buildStage]
  )

  const startGame = useCallback(() => {
    sound.playClick()
    launchStage(1, false)
  }, [launchStage])

  // Mouse / Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isRunningRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width)
    const newX = relativeX - paddleWRef.current / 2
    paddleTargetXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - paddleWRef.current, newX))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunningRef.current) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        paddleTargetXRef.current = Math.max(0, paddleTargetXRef.current - 28)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        paddleTargetXRef.current = Math.min(
          CANVAS_WIDTH - paddleWRef.current,
          paddleTargetXRef.current + 28
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Main 60fps Canvas Loop ──
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      if (!isRunningRef.current) return

      // 1. Smooth paddle movement
      paddleXRef.current += (paddleTargetXRef.current - paddleXRef.current) * 0.35
      const px = paddleXRef.current
      const pw = paddleWRef.current
      const py = CANVAS_HEIGHT - 30

      // 2. Power-up Timers
      if (expandTimerRef.current > 0) {
        expandTimerRef.current--
        if (expandTimerRef.current === 0) {
          paddleWRef.current = 76
          setActivePowerUp(null)
        }
      }

      if (slowTimerRef.current > 0) {
        slowTimerRef.current--
        if (slowTimerRef.current === 0) {
          setActivePowerUp(null)
        }
      }

      if (laserTimerRef.current > 0) {
        laserTimerRef.current--
        if (laserTimerRef.current % 18 === 0) {
          // Fire twin lasers
          sound.playLaser()
          lasersRef.current.push(
            { x: px + 6, y: py - 4, vy: -7 },
            { x: px + pw - 6, y: py - 4, vy: -7 }
          )
        }
        if (laserTimerRef.current === 0) {
          setActivePowerUp(null)
        }
      }

      // 3. Screen Shake decay
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.88
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      // 4. Update Lasers
      const nextLasers: LaserShot[] = []
      for (const l of lasersRef.current) {
        l.y += l.vy
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

        if (!hit && l.y > 0) {
          nextLasers.push(l)
        }
      }
      lasersRef.current = nextLasers

      // 5. Update Falling Capsules
      const nextCapsules: Capsule[] = []
      for (const cap of capsulesRef.current) {
        cap.y += cap.vy

        // Hit paddle?
        if (cap.y >= py - 8 && cap.y <= py + 16 && cap.x >= px - 6 && cap.x <= px + pw + 6) {
          sound.playPowerUp()
          scoreRef.current += 75
          setScore(scoreRef.current)

          if (cap.type === 'expand') {
            paddleWRef.current = 110
            expandTimerRef.current = 500 // ~8.5s
            setActivePowerUp('EXPAND PADDLE')
          } else if (cap.type === 'laser') {
            laserTimerRef.current = 360 // ~6s
            setActivePowerUp('LASER PADDLE')
          } else if (cap.type === 'slow') {
            slowTimerRef.current = 450 // ~7.5s
            setActivePowerUp('SLOW BALL')
          } else if (cap.type === 'multiball') {
            // Add 2 balls
            const mainB = ballsRef.current[0] || { x: px + pw / 2, y: py - 10, vx: 2, vy: -3 }
            ballsRef.current.push(
              {
                x: mainB.x,
                y: mainB.y,
                vx: -3,
                vy: -3.2,
                radius: 5.5,
                color: '#10b981',
              },
              {
                x: mainB.x,
                y: mainB.y,
                vx: 3,
                vy: -3.2,
                radius: 5.5,
                color: '#a855f7',
              }
            )
            setActivePowerUp('MULTI-BALL')
          }
        } else if (cap.y < CANVAS_HEIGHT + 20) {
          nextCapsules.push(cap)
        }
      }
      capsulesRef.current = nextCapsules

      // 6. Update Balls & Collision
      const survivingBalls: Ball[] = []
      const speedMod = slowTimerRef.current > 0 ? 0.65 : 1.0

      for (const ball of ballsRef.current) {
        ball.x += ball.vx * speedMod
        ball.y += ball.vy * speedMod

        // Wall collisions
        if (ball.x - ball.radius <= 0) {
          ball.x = ball.radius
          ball.vx = Math.abs(ball.vx)
          sound.playBounce()
        } else if (ball.x + ball.radius >= CANVAS_WIDTH) {
          ball.x = CANVAS_WIDTH - ball.radius
          ball.vx = -Math.abs(ball.vx)
          sound.playBounce()
        }

        if (ball.y - ball.radius <= 0) {
          ball.y = ball.radius
          ball.vy = Math.abs(ball.vy)
          sound.playBounce()
        }

        // Paddle Collision (Realistic Angle Refraction)
        if (
          ball.y + ball.radius >= py &&
          ball.y - ball.radius <= py + 12 &&
          ball.x >= px - 4 &&
          ball.x <= px + pw + 4 &&
          ball.vy > 0
        ) {
          sound.playBounce()
          ball.y = py - ball.radius

          // Contact position from -1 (far left) to +1 (far right)
          const hitOffset = (ball.x - (px + pw / 2)) / (pw / 2)
          const maxBounceAngle = (60 * Math.PI) / 180 // max 60 degrees
          const bounceAngle = hitOffset * maxBounceAngle
          const currentSpeedVal = Math.hypot(ball.vx, ball.vy)

          ball.vx = currentSpeedVal * Math.sin(bounceAngle)
          ball.vy = -currentSpeedVal * Math.cos(bounceAngle)

          // Paddle hit sparks
          emitParticles(ball.x, ball.y, '#38bdf8', 6)
        }

        // Brick Collisions
        let hitBrick = false
        for (let i = 0; i < bricksRef.current.length; i++) {
          const b = bricksRef.current[i]
          if (!b.active) continue

          if (
            ball.x + ball.radius >= b.x &&
            ball.x - ball.radius <= b.x + b.w &&
            ball.y + ball.radius >= b.y &&
            ball.y - ball.radius <= b.y + b.h
          ) {
            hitBrick = true
            b.hp--

            // Determine collision side to reflect velocity
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

                // Destroy adjacent bricks
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
              // Armored brick took 1st hit
              sound.playBounce()
            }
            break
          }
        }

        // Bottom void check
        if (ball.y - ball.radius < CANVAS_HEIGHT) {
          survivingBalls.push(ball)
        }
      }

      // Check if all balls lost
      if (survivingBalls.length === 0) {
        livesRef.current--
        setLives(livesRef.current)
        sound.playExplosion()
        screenShakeRef.current = 8

        if (livesRef.current <= 0) {
          isRunningRef.current = false
          sound.playGameOver()
          setGameState('GAMEOVER')
          onFinish(scoreRef.current)
          return
        } else {
          // Re-spawn single ball on paddle
          ballsRef.current = [
            {
              x: px + pw / 2,
              y: py - 12,
              vx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
              vy: -baseSpeed,
              radius: 5.5,
              color: '#38bdf8',
            },
          ]
        }
      } else {
        ballsRef.current = survivingBalls
      }

      // 7. Check Stage Clear Victory
      const remainingBricks = bricksRef.current.filter((b) => b.active).length
      if (remainingBricks === 0) {
        sound.playWin()
        if (stageRef.current < 3) {
          // Advance to next stage!
          scoreRef.current += 250
          setScore(scoreRef.current)
          launchStage(stageRef.current + 1, true)
          return
        } else {
          // Game Victory!
          isRunningRef.current = false
          sound.playWin()
          setGameState('VICTORY')
          onFinish(scoreRef.current + 500)
          return
        }
      }

      // 8. Update Particles
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

      // Dark cyber background
      ctx.fillStyle = '#060714'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Subtle grid background lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)'
      ctx.lineWidth = 1
      for (let x = 0; x < CANVAS_WIDTH; x += 24) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }

      // Draw Bricks
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

        // Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Crack pattern on damaged armored brick
        if (b.type === 'armored' && b.hp === 1) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(b.x + 6, b.y + 3)
          ctx.lineTo(b.x + b.w / 2, b.y + b.h - 3)
          ctx.lineTo(b.x + b.w - 8, b.y + 4)
          ctx.stroke()
        }

        // Emblem on Explosive / Golden bricks
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

      // Draw Capsules
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

      // Draw Lasers
      lasersRef.current.forEach((l) => {
        ctx.save()
        ctx.fillStyle = '#f43f5e'
        ctx.shadowColor = '#f43f5e'
        ctx.shadowBlur = 8
        ctx.fillRect(l.x - 1.5, l.y, 3, 10)
        ctx.restore()
      })

      // Draw Paddle
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

      // Paddle neon core line
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px + 8, py + 6)
      ctx.lineTo(px + pw - 8, py + 6)
      ctx.stroke()
      ctx.restore()

      // Draw Balls
      ballsRef.current.forEach((b) => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = b.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0

        // Outer glow rim
        ctx.strokeStyle = b.color
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      })

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

      if (isRunningRef.current) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [gameState, baseSpeed, emitParticles, launchStage, onFinish, spawnCapsule])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Score */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>
        </div>

        {/* Stage Indicator / Active Powerup */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl text-xs font-black text-purple-300">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isRtl ? 'مرحلة' : 'Stage'} {stage}/3
            </span>
          </div>
          {activePowerUp && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2.5 py-1.5 rounded-xl text-xs font-black text-amber-300 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              <span>{activePowerUp}</span>
            </div>
          )}
        </div>

        {/* Lives */}
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

      {/* Canvas Container */}
      <div className="relative w-full aspect-[340/420] max-h-[420px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerMove={handlePointerMove}
          className="w-full h-full block cursor-ew-resize touch-none"
        />

        {/* Start Game Screen */}
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
                  ? 'حطم القوالب الصلبة والمتفجرة، واجمع كبسولات الكرات المتعددة والليزر!'
                  : 'Smash armored and explosive bricks, and collect multiballs and lasers!'}
              </p>
            </div>
            <Button variant="glow" onClick={startGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'بدء اللعبة 🕹️' : 'Start Smasher 🕹️'}
            </Button>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl animate-bounce">🏆👑</div>
            <div>
              <h3 className="text-2xl font-black text-emerald-400">
                {isRtl ? 'انتصار أسطوري!' : 'VICTORY!'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'أنهيت المراحل الثلاث بنجاح!' : 'All 3 Stages Cleared!'}
              </p>
              <p className="text-xs text-cyan-400 font-mono mt-1 font-black">
                {isRtl ? 'النقاط:' : 'Score:'} {score}
              </p>
            </div>
            <Button variant="glow" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'العب مجدداً' : 'Play Again'}</span>
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
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
            <Button variant="glow" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Try Again'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: حرك إصبعك أو الماوس يميناً ويساراً أو عبر الأسهم (← / →)'
          : 'Controls: Drag finger / mouse horizontally or use Arrow keys (← / →)'}
      </div>
    </div>
  )
}
