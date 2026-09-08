/**
 * NeonInvadersGame.tsx
 *
 * Neon Space Invaders (صائد الفضاء النيوني)
 * High-octane retro arcade shooter built with HTML5 Canvas 2D.
 * Features:
 * - Alien swarms with procedural formation movement and animated frames.
 * - Player spaceship with Spread Shot, Shield aura, Rapid Fire, and Mega Laser power-ups.
 * - Massive Cyber Boss fights with dynamic HP bar, multi-bullet barrages, and explosive FX.
 * - Starfield parallax background, bullet glow trails, particle bursts, and screen shake.
 * - Web Audio API SFX: laser, explosion, power-up, shield-up, boss alert, game over.
 * - Desktop keyboard, mouse follow, and mobile touch tracking controls.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Shield, Zap, Sparkles, Heart, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@utils/soundManager'

export interface NeonInvadersGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
  alpha: number
}

interface Bullet {
  x: number
  y: number
  vx: number
  vy: number
  isPlayer: boolean
  isMega?: boolean
  color: string
}

interface Enemy {
  x: number
  y: number
  type: number // 0: Top, 1: Mid, 2: Bottom
  alive: boolean
  color: string
}

interface PowerUp {
  x: number
  y: number
  type: 'spread' | 'shield' | 'rapid' | 'laser'
  vy: number
}

interface Boss {
  x: number
  y: number
  width: number
  height: number
  hp: number
  maxHp: number
  vx: number
  alive: boolean
  shootTimer: number
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
const ENEMY_ROWS = 4
const ENEMY_COLS = 7
const ENEMY_WIDTH = 22
const ENEMY_HEIGHT = 16

export const NeonInvadersGame: React.FC<NeonInvadersGameProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React states
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [hasShield, setHasShield] = useState(false)
  const [activeWeapon, setActiveWeapon] = useState<'normal' | 'spread' | 'rapid'>('normal')
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [bossActive, setBossActive] = useState(false)

  // 60fps Game Engine Refs
  const playerXRef = useRef<number>(CANVAS_WIDTH / 2)
  const playerTargetXRef = useRef<number>(CANVAS_WIDTH / 2)
  const livesRef = useRef<number>(3)
  const scoreRef = useRef<number>(0)
  const enemiesRef = useRef<Enemy[]>([])
  const enemyDirRef = useRef<number>(1)
  const enemyStepTimerRef = useRef<number>(0)
  const bulletsRef = useRef<Bullet[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const bossRef = useRef<Boss | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const screenShakeRef = useRef<number>(0)
  const shieldRef = useRef<boolean>(false)
  const weaponTypeRef = useRef<'normal' | 'spread' | 'rapid'>('normal')
  const weaponTimerRef = useRef<number>(0)
  const shootCooldownRef = useRef<number>(0)
  const killsCountRef = useRef<number>(0)
  const nextBossScoreRef = useRef<number>(1000)
  const isGameOverRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)

  // Difficulty multipliers
  const enemyBulletRate = difficulty === 'Easy' ? 0.008 : difficulty === 'Hard' ? 0.025 : 0.015
  const enemySpeedBase = difficulty === 'Easy' ? 0.8 : difficulty === 'Hard' ? 1.4 : 1.0

  // Initialize Starfield
  const initStars = useCallback(() => {
    starsRef.current = []
    for (let i = 0; i < 45; i++) {
      starsRef.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
      })
    }
  }, [])

  // Spawn Enemy Grid
  const spawnEnemies = useCallback(() => {
    const enemies: Enemy[] = []
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981']

    const startX = 26
    const startY = 50
    const gapX = 40
    const gapY = 26

    for (let r = 0; r < ENEMY_ROWS; r++) {
      for (let c = 0; c < ENEMY_COLS; c++) {
        enemies.push({
          x: startX + c * gapX,
          y: startY + r * gapY,
          type: r,
          alive: true,
          color: colors[r % colors.length],
        })
      }
    }
    enemiesRef.current = enemies
  }, [])

  // Spawn Boss
  const spawnBoss = useCallback(() => {
    sound.playBossAlert()
    bossRef.current = {
      x: CANVAS_WIDTH / 2 - 40,
      y: 45,
      width: 80,
      height: 35,
      hp: 12,
      maxHp: 12,
      vx: 2,
      alive: true,
      shootTimer: 0,
    }
    setBossActive(true)
    screenShakeRef.current = 6
  }, [])

  // Spawn Power-Up
  const spawnPowerUp = useCallback((x: number, y: number) => {
    const types: ('spread' | 'shield' | 'rapid' | 'laser')[] = [
      'spread',
      'shield',
      'rapid',
      'laser',
    ]
    const chosenType = types[Math.floor(Math.random() * types.length)]
    powerUpsRef.current.push({
      x,
      y,
      type: chosenType,
      vy: 1.8,
    })
  }, [])

  // Player Fire
  const firePlayerBullet = useCallback(() => {
    if (isGameOverRef.current) return
    const px = playerXRef.current
    const py = CANVAS_HEIGHT - 35
    sound.playLaser()

    const wType = weaponTypeRef.current

    if (wType === 'spread') {
      bulletsRef.current.push(
        { x: px, y: py, vx: 0, vy: -7, isPlayer: true, color: '#06b6d4' },
        { x: px - 6, y: py, vx: -1.8, vy: -6.5, isPlayer: true, color: '#06b6d4' },
        { x: px + 6, y: py, vx: 1.8, vy: -6.5, isPlayer: true, color: '#06b6d4' }
      )
    } else {
      bulletsRef.current.push({
        x: px,
        y: py,
        vx: 0,
        vy: wType === 'rapid' ? -9 : -7,
        isPlayer: true,
        color: '#38bdf8',
      })
    }
  }, [])

  // Start / Reset Game
  const resetGame = useCallback(() => {
    initStars()
    spawnEnemies()
    bossRef.current = null
    bulletsRef.current = []
    powerUpsRef.current = []
    particlesRef.current = []
    playerXRef.current = CANVAS_WIDTH / 2
    playerTargetXRef.current = CANVAS_WIDTH / 2
    livesRef.current = 3
    scoreRef.current = 0
    shieldRef.current = false
    weaponTypeRef.current = 'normal'
    weaponTimerRef.current = 0
    shootCooldownRef.current = 0
    killsCountRef.current = 0
    nextBossScoreRef.current = 1000
    isGameOverRef.current = false

    setLives(3)
    setScore(0)
    setHasShield(false)
    setActiveWeapon('normal')
    setBossActive(false)
    setIsGameOver(false)
    setHasStarted(true)
  }, [initStars, spawnEnemies])

  // End Game
  const triggerGameOver = useCallback(() => {
    if (isGameOverRef.current) return
    isGameOverRef.current = true
    setIsGameOver(true)
    screenShakeRef.current = 10
    sound.playGameOver()
    onFinish(scoreRef.current)
  }, [onFinish])

  // Hit Player
  const hitPlayer = useCallback(() => {
    if (shieldRef.current) {
      // Shield absorbs hit
      shieldRef.current = false
      setHasShield(false)
      sound.playExplosion()
      screenShakeRef.current = 4
      return
    }

    livesRef.current--
    setLives(livesRef.current)
    sound.playExplosion()
    screenShakeRef.current = 8

    // Death particle burst
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = Math.random() * 4 + 1
      particlesRef.current.push({
        x: playerXRef.current,
        y: CANVAS_HEIGHT - 35,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: '#f43f5e',
        radius: Math.random() * 3 + 1,
        alpha: 1,
        life: 0,
        maxLife: 30,
      })
    }

    if (livesRef.current <= 0) {
      triggerGameOver()
    }
  }, [triggerGameOver])

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isGameOverRef.current) return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerTargetXRef.current = Math.max(20, playerTargetXRef.current - 22)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerTargetXRef.current = Math.min(CANVAS_WIDTH - 20, playerTargetXRef.current + 22)
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        if (shootCooldownRef.current <= 0) {
          firePlayerBullet()
          shootCooldownRef.current = weaponTypeRef.current === 'rapid' ? 8 : 16
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, firePlayerBullet])

  // Touch / Mouse Tracking on Canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasStarted || isGameOverRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const scale = CANVAS_WIDTH / rect.width
    const targetX = clientX * scale
    playerTargetXRef.current = Math.max(20, Math.min(CANVAS_WIDTH - 20, targetX))
  }

  // ── Main 60fps Canvas Loop ──
  useEffect(() => {
    if (!hasStarted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      // 1. Smooth player movement
      playerXRef.current += (playerTargetXRef.current - playerXRef.current) * 0.3

      // 2. Auto-fire cooldown
      if (shootCooldownRef.current > 0) shootCooldownRef.current--
      else {
        // Continuous auto-fire
        firePlayerBullet()
        shootCooldownRef.current = weaponTypeRef.current === 'rapid' ? 9 : 18
      }

      // 3. Weapon Power-up timer
      if (weaponTimerRef.current > 0) {
        weaponTimerRef.current--
        if (weaponTimerRef.current === 0) {
          weaponTypeRef.current = 'normal'
          setActiveWeapon('normal')
        }
      }

      // 4. Screen Shake decay
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.9
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      // 5. Update Stars Parallax
      starsRef.current.forEach((s) => {
        s.y += s.speed
        if (s.y > CANVAS_HEIGHT) {
          s.y = 0
          s.x = Math.random() * CANVAS_WIDTH
        }
      })

      // 6. Update Alien Fleet Movement
      const livingEnemies = enemiesRef.current.filter((e) => e.alive)

      if (livingEnemies.length === 0 && !bossRef.current) {
        // Check if time for Boss or next wave
        if (scoreRef.current >= nextBossScoreRef.current) {
          spawnBoss()
          nextBossScoreRef.current += 1500
        } else {
          spawnEnemies()
        }
      } else if (livingEnemies.length > 0) {
        enemyStepTimerRef.current++
        // Faster as enemies decrease
        const stepRate = Math.max(12, Math.floor(livingEnemies.length * 1.2))

        if (enemyStepTimerRef.current >= stepRate) {
          enemyStepTimerRef.current = 0

          let hitWall = false
          for (const e of livingEnemies) {
            if (
              (e.x + enemyDirRef.current * 14 > CANVAS_WIDTH - 25 && enemyDirRef.current > 0) ||
              (e.x + enemyDirRef.current * 14 < 25 && enemyDirRef.current < 0)
            ) {
              hitWall = true
              break
            }
          }

          if (hitWall) {
            enemyDirRef.current *= -1
            livingEnemies.forEach((e) => {
              e.y += 12
              if (e.y >= CANVAS_HEIGHT - 60) {
                triggerGameOver()
              }
            })
          } else {
            livingEnemies.forEach((e) => {
              e.x += enemyDirRef.current * 10 * enemySpeedBase
            })
          }
        }

        // Alien Random Shooting
        livingEnemies.forEach((e) => {
          if (Math.random() < enemyBulletRate) {
            bulletsRef.current.push({
              x: e.x + ENEMY_WIDTH / 2,
              y: e.y + ENEMY_HEIGHT,
              vx: (Math.random() - 0.5) * 0.8,
              vy: 3.5,
              isPlayer: false,
              color: '#f43f5e',
            })
          }
        })
      }

      // 7. Update Boss
      const currentBoss = bossRef.current
      if (currentBoss && currentBoss.alive) {
        currentBoss.x += currentBoss.vx
        if (
          (currentBoss.x > CANVAS_WIDTH - currentBoss.width - 15 && currentBoss.vx > 0) ||
          (currentBoss.x < 15 && currentBoss.vx < 0)
        ) {
          currentBoss.vx *= -1
        }

        currentBoss.shootTimer++
        if (currentBoss.shootTimer >= 45) {
          currentBoss.shootTimer = 0
          // Triple spread bullet
          bulletsRef.current.push(
            {
              x: currentBoss.x + currentBoss.width / 2,
              y: currentBoss.y + currentBoss.height,
              vx: 0,
              vy: 4,
              isPlayer: false,
              color: '#fbbf24',
            },
            {
              x: currentBoss.x + currentBoss.width / 2 - 15,
              y: currentBoss.y + currentBoss.height,
              vx: -1.5,
              vy: 3.6,
              isPlayer: false,
              color: '#fbbf24',
            },
            {
              x: currentBoss.x + currentBoss.width / 2 + 15,
              y: currentBoss.y + currentBoss.height,
              vx: 1.5,
              vy: 3.6,
              isPlayer: false,
              color: '#fbbf24',
            }
          )
        }
      }

      // 8. Update Bullets
      const nextBullets: Bullet[] = []
      const px = playerXRef.current
      const py = CANVAS_HEIGHT - 35

      for (const b of bulletsRef.current) {
        b.x += b.vx
        b.y += b.vy

        // Out of bounds check
        if (b.y < -10 || b.y > CANVAS_HEIGHT + 10 || b.x < 0 || b.x > CANVAS_WIDTH) {
          continue
        }

        let bulletHit = false

        if (b.isPlayer) {
          // Check collision with Boss
          if (currentBoss && currentBoss.alive) {
            if (
              b.x >= currentBoss.x &&
              b.x <= currentBoss.x + currentBoss.width &&
              b.y >= currentBoss.y &&
              b.y <= currentBoss.y + currentBoss.height
            ) {
              bulletHit = true
              currentBoss.hp--
              sound.playBounce()

              // Sparks
              for (let i = 0; i < 4; i++) {
                particlesRef.current.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#38bdf8',
                  radius: 2,
                  alpha: 1,
                  life: 0,
                  maxLife: 15,
                })
              }

              if (currentBoss.hp <= 0) {
                currentBoss.alive = false
                bossRef.current = null
                setBossActive(false)
                scoreRef.current += 500
                setScore(scoreRef.current)
                sound.playWin()
                screenShakeRef.current = 12

                // Huge explosion
                for (let i = 0; i < 40; i++) {
                  const angle = Math.random() * Math.PI * 2
                  const spd = Math.random() * 6 + 1
                  particlesRef.current.push({
                    x: currentBoss.x + currentBoss.width / 2,
                    y: currentBoss.y + currentBoss.height / 2,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    color: '#fbbf24',
                    radius: Math.random() * 4 + 2,
                    alpha: 1,
                    life: 0,
                    maxLife: 40,
                  })
                }
              }
            }
          }

          // Check collision with regular Enemies
          if (!bulletHit) {
            for (const e of livingEnemies) {
              if (
                e.alive &&
                b.x >= e.x &&
                b.x <= e.x + ENEMY_WIDTH &&
                b.y >= e.y &&
                b.y <= e.y + ENEMY_HEIGHT
              ) {
                e.alive = false
                bulletHit = true
                sound.playExplosion()

                // Particle explosion
                for (let i = 0; i < 12; i++) {
                  const angle = Math.random() * Math.PI * 2
                  const spd = Math.random() * 3 + 1
                  particlesRef.current.push({
                    x: e.x + ENEMY_WIDTH / 2,
                    y: e.y + ENEMY_HEIGHT / 2,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    color: e.color,
                    radius: Math.random() * 3 + 1,
                    alpha: 1,
                    life: 0,
                    maxLife: 20,
                  })
                }

                // Add score
                scoreRef.current += 25
                setScore(scoreRef.current)

                // Power up drop logic every 10 kills
                killsCountRef.current++
                if (killsCountRef.current % 10 === 0) {
                  spawnPowerUp(e.x + ENEMY_WIDTH / 2, e.y + ENEMY_HEIGHT)
                }
                break
              }
            }
          }
        } else {
          // Enemy bullet hits player
          const dist = Math.hypot(b.x - px, b.y - py)
          if (dist < 18) {
            bulletHit = true
            hitPlayer()
          }
        }

        if (!bulletHit) {
          nextBullets.push(b)
        }
      }

      bulletsRef.current = nextBullets

      // 9. Update Power-ups
      const nextPowerUps: PowerUp[] = []
      for (const p of powerUpsRef.current) {
        p.y += p.vy

        // Hit player check
        const dist = Math.hypot(p.x - px, p.y - py)
        if (dist < 24) {
          sound.playPowerUp()
          scoreRef.current += 100
          setScore(scoreRef.current)

          if (p.type === 'shield') {
            shieldRef.current = true
            setHasShield(true)
            sound.playShieldUp()
          } else if (p.type === 'spread') {
            weaponTypeRef.current = 'spread'
            weaponTimerRef.current = 450 // ~7.5s
            setActiveWeapon('spread')
          } else if (p.type === 'rapid') {
            weaponTypeRef.current = 'rapid'
            weaponTimerRef.current = 450
            setActiveWeapon('rapid')
          } else if (p.type === 'laser') {
            // Instant vertical screen sweep
            screenShakeRef.current = 8
            sound.playLaser()
            livingEnemies.forEach((e) => {
              if (Math.abs(e.x + ENEMY_WIDTH / 2 - px) < 45) {
                e.alive = false
                scoreRef.current += 25
              }
            })
            setScore(scoreRef.current)
          }
        } else if (p.y < CANVAS_HEIGHT + 20) {
          nextPowerUps.push(p)
        }
      }
      powerUpsRef.current = nextPowerUps

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

      // Background
      ctx.fillStyle = '#050711'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Stars
      starsRef.current.forEach((s) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(186, 230, 253, ${s.alpha})`
        ctx.fill()
      })

      // Draw Enemies
      livingEnemies.forEach((e) => {
        ctx.save()
        ctx.fillStyle = e.color
        ctx.shadowColor = e.color
        ctx.shadowBlur = 8

        // Draw Invader Shape
        const ex = e.x
        const ey = e.y
        ctx.beginPath()
        ctx.roundRect(ex + 4, ey, ENEMY_WIDTH - 8, ENEMY_HEIGHT - 4, 3)
        ctx.fill()

        // Antennae / legs
        ctx.fillRect(ex + 1, ey + 4, 3, ENEMY_HEIGHT - 6)
        ctx.fillRect(ex + ENEMY_WIDTH - 4, ey + 4, 3, ENEMY_HEIGHT - 6)

        // Eyes
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(ex + 6, ey + 4, 3, 3)
        ctx.fillRect(ex + ENEMY_WIDTH - 9, ey + 4, 3, 3)

        ctx.restore()
      })

      // Draw Boss
      if (currentBoss && currentBoss.alive) {
        ctx.save()
        ctx.translate(currentBoss.x, currentBoss.y)

        // Boss Body
        const bossGrad = ctx.createLinearGradient(0, 0, currentBoss.width, currentBoss.height)
        bossGrad.addColorStop(0, '#f43f5e')
        bossGrad.addColorStop(1, '#a855f7')
        ctx.fillStyle = bossGrad
        ctx.shadowColor = '#f43f5e'
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.roundRect(0, 0, currentBoss.width, currentBoss.height, 8)
        ctx.fill()

        // Boss Eye
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(currentBoss.width / 2, currentBoss.height / 2, 7, 0, Math.PI * 2)
        ctx.fill()

        // HP Bar
        const hpPercent = Math.max(0, currentBoss.hp / currentBoss.maxHp)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, -10, currentBoss.width, 5)
        ctx.fillStyle = hpPercent > 0.5 ? '#10b981' : hpPercent > 0.25 ? '#f59e0b' : '#f43f5e'
        ctx.fillRect(0, -10, currentBoss.width * hpPercent, 5)

        ctx.restore()
      }

      // Draw Power-ups
      powerUpsRef.current.forEach((p) => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        const pColor =
          p.type === 'shield'
            ? '#06b6d4'
            : p.type === 'spread'
            ? '#a855f7'
            : p.type === 'rapid'
            ? '#f59e0b'
            : '#ef4444'
        ctx.fillStyle = pColor
        ctx.shadowColor = pColor
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.type[0].toUpperCase(), p.x, p.y)
        ctx.restore()
      })

      // Draw Bullets
      bulletsRef.current.forEach((b) => {
        ctx.save()
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.isPlayer ? 3 : 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw Player Spaceship
      ctx.save()
      ctx.translate(px, py)

      // Shield Aura
      if (shieldRef.current) {
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 12
        ctx.stroke()
      }

      // Ship Triangular Body
      ctx.beginPath()
      ctx.moveTo(0, -16) // Nose
      ctx.lineTo(-14, 12) // Left wing
      ctx.lineTo(0, 7) // Engine indent
      ctx.lineTo(14, 12) // Right wing
      ctx.closePath()

      const shipGrad = ctx.createLinearGradient(0, -16, 0, 12)
      shipGrad.addColorStop(0, '#38bdf8')
      shipGrad.addColorStop(1, '#1d4ed8')
      ctx.fillStyle = shipGrad
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 14
      ctx.fill()

      // Engine Thruster Flame
      ctx.beginPath()
      ctx.moveTo(-5, 8)
      ctx.lineTo(0, 18 + (Math.random() * 4 - 2))
      ctx.lineTo(5, 8)
      ctx.fillStyle = '#f59e0b'
      ctx.shadowColor = '#f59e0b'
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
  }, [hasStarted, enemyBulletRate, enemySpeedBase, firePlayerBullet, hitPlayer, spawnBoss, spawnEnemies, spawnPowerUp, triggerGameOver])

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

        {/* Weapon / Shield Indicator */}
        <div className="flex items-center gap-2">
          {hasShield && (
            <div className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/60 px-2 py-1 rounded-lg text-cyan-300 text-xs font-bold animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span>DRC</span>
            </div>
          )}
          {activeWeapon !== 'normal' && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2 py-1 rounded-lg text-amber-300 text-xs font-bold animate-bounce">
              <Zap className="w-3.5 h-3.5" />
              <span>{activeWeapon.toUpperCase()}</span>
            </div>
          )}
          {bossActive && (
            <div className="flex items-center gap-1 bg-rose-500/20 border border-rose-500 px-2 py-1 rounded-lg text-rose-400 text-xs font-black animate-pulse">
              <span>⚠️ BOSS</span>
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
      <div className="relative w-full aspect-[340/420] max-h-[420px] rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.25)] bg-[#050711]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerMove={handlePointerMove}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* Start Game Screen */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-[#050711]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#6366f1] animate-bounce">
              👾
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'صائد الفضاء النيوني' : 'Neon Space Invaders'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'حرك سفينتك باللمس أو الأسهم واقضِ على أسراب الفضائيين والزعيم العملاق!'
                  : 'Move ship with touch or arrow keys to blast alien swarms and the giant Boss!'}
              </p>
            </div>
            <Button variant="glow" onClick={resetGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'انطلاق للمجرة 🚀' : 'Launch Ship 🚀'}
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl">🚀💥</div>
            <div>
              <h3 className="text-2xl font-black text-rose-400">
                {isRtl ? 'تحطمت السفينة!' : 'MISSION FAILED'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'النقاط المكتسبة:' : 'Final Score:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{score}</span>
              </p>
            </div>
            <Button variant="glow" onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة الإطلاق' : 'Restart Mission'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اسحب بإصبعك/الماوس للتوجيه (الإطلاق تلقائي) أو بالأسهم + المسافة'
          : 'Controls: Drag finger / mouse to aim (auto-fire) or Arrow keys + Space'}
      </div>
    </div>
  )
}
