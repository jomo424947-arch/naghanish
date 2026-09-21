/**
 * NeonInvadersGame.tsx
 *
 * Neon Space Invaders (صائد الفضاء النيوني)
 * High-octane retro arcade shooter built with HTML5 Canvas 2D.
 * Phase 2: useGameLoop + responsive stage + level-scaled waves.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { RotateCcw, Shield, Zap, Heart, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

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
  type: number
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

const DESIGN_W = 340
const DESIGN_H = 420
const ENEMY_WIDTH = 22
const ENEMY_HEIGHT = 16
/** Scale per-frame legacy speeds to per-second. */
const FPS = 60

function waveTarget(level: number): number {
  return 2 + level
}

function enemyGrid(level: number): { rows: number; cols: number } {
  return {
    rows: Math.min(6, 3 + Math.floor((level - 1) / 2)),
    cols: Math.min(9, 6 + Math.floor((level - 1) / 2)),
  }
}

export const NeonInvadersGame: React.FC<GameEngineProps> = ({
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
  const targetWaves = useMemo(() => waveTarget(level), [level])
  const grid = useMemo(() => enemyGrid(level), [level])

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [hasShield, setHasShield] = useState(false)
  const [activeWeapon, setActiveWeapon] = useState<'normal' | 'spread' | 'rapid'>('normal')
  const [isGameOver, setIsGameOver] = useState(false)
  const [levelCleared, setLevelCleared] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [bossActive, setBossActive] = useState(false)
  const [wavesCleared, setWavesCleared] = useState(0)

  const playerXRef = useRef(DESIGN_W / 2)
  const playerTargetXRef = useRef(DESIGN_W / 2)
  const livesRef = useRef(3)
  const scoreRef = useRef(0)
  const enemiesRef = useRef<Enemy[]>([])
  const enemyDirRef = useRef(1)
  const enemyStepAccumRef = useRef(0)
  const bulletsRef = useRef<Bullet[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const bossRef = useRef<Boss | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const screenShakeRef = useRef(0)
  const shieldRef = useRef(false)
  const weaponTypeRef = useRef<'normal' | 'spread' | 'rapid'>('normal')
  const weaponTimerRef = useRef(0)
  const shootCooldownRef = useRef(0)
  const killsCountRef = useRef(0)
  const nextBossScoreRef = useRef(1000)
  const isGameOverRef = useRef(false)
  const levelClearedRef = useRef(false)
  const finishedRef = useRef(false)
  const wavesClearedRef = useRef(0)
  const stageSizeRef = useRef({ w: stageWidth, h: stageHeight })
  stageSizeRef.current = { w: stageWidth, h: stageHeight }

  const levelMul = 1 + (level - 1) * 0.12
  const enemyBulletRate =
    (difficulty === 'Easy' ? 0.008 : difficulty === 'Hard' ? 0.025 : 0.015) * levelMul
  const enemySpeedBase =
    (difficulty === 'Easy' ? 0.8 : difficulty === 'Hard' ? 1.4 : 1.0) * levelMul
  const bossHp = 10 + level * 2

  const enemyBulletRateRef = useRef(enemyBulletRate)
  enemyBulletRateRef.current = enemyBulletRate
  const enemySpeedBaseRef = useRef(enemySpeedBase)
  enemySpeedBaseRef.current = enemySpeedBase
  const bossHpRef = useRef(bossHp)
  bossHpRef.current = bossHp
  const targetWavesRef = useRef(targetWaves)
  targetWavesRef.current = targetWaves
  const gridRef = useRef(grid)
  gridRef.current = grid
  const levelRef = useRef(level)
  levelRef.current = level

  const initStars = useCallback(() => {
    starsRef.current = []
    for (let i = 0; i < 45; i++) {
      starsRef.current.push({
        x: Math.random() * DESIGN_W,
        y: Math.random() * DESIGN_H,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
      })
    }
  }, [])

  const spawnEnemies = useCallback(() => {
    const enemies: Enemy[] = []
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981']
    const { rows, cols } = gridRef.current
    const gapX = Math.min(40, (DESIGN_W - 52) / Math.max(1, cols - 1 || 1))
    const gapY = 26
    const startX = (DESIGN_W - (cols - 1) * gapX - ENEMY_WIDTH) / 2
    const startY = 50

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
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
    enemyDirRef.current = 1
    enemyStepAccumRef.current = 0
  }, [])

  const spawnBoss = useCallback(() => {
    sound.playBossAlert()
    const hp = bossHpRef.current
    bossRef.current = {
      x: DESIGN_W / 2 - 40,
      y: 45,
      width: 80,
      height: 35,
      hp,
      maxHp: hp,
      vx: 2 * (1 + (levelRef.current - 1) * 0.08),
      alive: true,
      shootTimer: 0,
    }
    setBossActive(true)
    screenShakeRef.current = 6
  }, [])

  const spawnPowerUp = useCallback((x: number, y: number) => {
    const types: ('spread' | 'shield' | 'rapid' | 'laser')[] = [
      'spread',
      'shield',
      'rapid',
      'laser',
    ]
    powerUpsRef.current.push({
      x,
      y,
      type: types[Math.floor(Math.random() * types.length)],
      vy: 1.8,
    })
  }, [])

  const firePlayerBullet = useCallback(() => {
    if (isGameOverRef.current || levelClearedRef.current) return
    const px = playerXRef.current
    const py = DESIGN_H - 35
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

  const finishRun = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared
        ? finalScore >= 2000
          ? 3
          : finalScore >= 1000
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
      initStars()
      spawnEnemies()
      bossRef.current = null
      bulletsRef.current = []
      powerUpsRef.current = []
      particlesRef.current = []
      playerXRef.current = DESIGN_W / 2
      playerTargetXRef.current = DESIGN_W / 2
      livesRef.current = 3
      scoreRef.current = 0
      shieldRef.current = false
      weaponTypeRef.current = 'normal'
      weaponTimerRef.current = 0
      shootCooldownRef.current = 0
      killsCountRef.current = 0
      nextBossScoreRef.current = 1000
      wavesClearedRef.current = 0
      isGameOverRef.current = false
      levelClearedRef.current = false
      finishedRef.current = false

      setLives(3)
      setScore(0)
      setHasShield(false)
      setActiveWeapon('normal')
      setBossActive(false)
      setIsGameOver(false)
      setLevelCleared(false)
      setWavesCleared(0)
      setHasStarted(autoStart)
    },
    [initStars, spawnEnemies]
  )

  useEffect(() => {
    resetGame(false)
  }, [level, resetGame])

  const triggerGameOver = useCallback(() => {
    if (isGameOverRef.current || levelClearedRef.current) return
    isGameOverRef.current = true
    setIsGameOver(true)
    screenShakeRef.current = 10
    sound.playGameOver()
    finishRun(scoreRef.current, false)
  }, [finishRun])

  const clearWaveMilestone = useCallback(() => {
    wavesClearedRef.current += 1
    setWavesCleared(wavesClearedRef.current)
    if (wavesClearedRef.current >= targetWavesRef.current) {
      levelClearedRef.current = true
      setLevelCleared(true)
      finishRun(scoreRef.current, true)
      return true
    }
    return false
  }, [finishRun])

  const hitPlayer = useCallback(() => {
    if (shieldRef.current) {
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

    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = Math.random() * 4 + 1
      particlesRef.current.push({
        x: playerXRef.current,
        y: DESIGN_H - 35,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isGameOverRef.current || levelClearedRef.current) return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerTargetXRef.current = Math.max(20, playerTargetXRef.current - 22)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerTargetXRef.current = Math.min(DESIGN_W - 20, playerTargetXRef.current + 22)
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        if (shootCooldownRef.current <= 0) {
          firePlayerBullet()
          shootCooldownRef.current = weaponTypeRef.current === 'rapid' ? 8 / FPS : 16 / FPS
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, firePlayerBullet])

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasStarted || isGameOverRef.current || levelClearedRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const scale = DESIGN_W / rect.width
    const targetX = clientX * scale
    playerTargetXRef.current = Math.max(20, Math.min(DESIGN_W - 20, targetX))
  }

  useGameLoop(
    (delta) => {
      const dt = delta * FPS

      playerXRef.current += (playerTargetXRef.current - playerXRef.current) * Math.min(1, 0.3 * dt)

      if (shootCooldownRef.current > 0) {
        shootCooldownRef.current -= delta
      } else {
        firePlayerBullet()
        shootCooldownRef.current = weaponTypeRef.current === 'rapid' ? 9 / FPS : 18 / FPS
      }

      if (weaponTimerRef.current > 0) {
        weaponTimerRef.current -= delta
        if (weaponTimerRef.current <= 0) {
          weaponTimerRef.current = 0
          weaponTypeRef.current = 'normal'
          setActiveWeapon('normal')
        }
      }

      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= Math.pow(0.9, dt)
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0
      }

      starsRef.current.forEach((s) => {
        s.y += s.speed * dt
        if (s.y > DESIGN_H) {
          s.y = 0
          s.x = Math.random() * DESIGN_W
        }
      })

      const livingEnemies = enemiesRef.current.filter((e) => e.alive)

      if (livingEnemies.length === 0 && !bossRef.current) {
        if (scoreRef.current >= nextBossScoreRef.current) {
          spawnBoss()
          nextBossScoreRef.current += 1500
        } else if (!clearWaveMilestone()) {
          spawnEnemies()
        }
      } else if (livingEnemies.length > 0) {
        const stepRateSec = Math.max(12, Math.floor(livingEnemies.length * 1.2)) / FPS
        enemyStepAccumRef.current += delta
        if (enemyStepAccumRef.current >= stepRateSec) {
          enemyStepAccumRef.current = 0
          const speed = enemySpeedBaseRef.current

          let hitWall = false
          for (const e of livingEnemies) {
            if (
              (e.x + enemyDirRef.current * 14 > DESIGN_W - 25 && enemyDirRef.current > 0) ||
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
              if (e.y >= DESIGN_H - 60) triggerGameOver()
            })
          } else {
            livingEnemies.forEach((e) => {
              e.x += enemyDirRef.current * 10 * speed
            })
          }
        }

        const columns = new Map<number, Enemy>()
        livingEnemies.forEach((e) => {
          const col = Math.round(e.x)
          const existing = columns.get(col)
          if (!existing || e.y > existing.y) columns.set(col, e)
        })
        columns.forEach((e) => {
          if (Math.random() < enemyBulletRateRef.current * dt) {
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

      const currentBoss = bossRef.current
      if (currentBoss && currentBoss.alive) {
        currentBoss.x += currentBoss.vx * dt
        if (
          (currentBoss.x > DESIGN_W - currentBoss.width - 15 && currentBoss.vx > 0) ||
          (currentBoss.x < 15 && currentBoss.vx < 0)
        ) {
          currentBoss.vx *= -1
        }

        currentBoss.shootTimer += delta
        if (currentBoss.shootTimer >= 45 / FPS) {
          currentBoss.shootTimer = 0
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

      const nextBullets: Bullet[] = []
      const px = playerXRef.current
      const py = DESIGN_H - 35

      for (const b of bulletsRef.current) {
        b.x += b.vx * dt
        b.y += b.vy * dt

        if (b.y < -10 || b.y > DESIGN_H + 10 || b.x < 0 || b.x > DESIGN_W) continue

        let bulletHit = false

        if (b.isPlayer) {
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

                if (!clearWaveMilestone()) {
                  spawnEnemies()
                }
              }
            }
          }

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

                scoreRef.current += 25
                setScore(scoreRef.current)

                killsCountRef.current++
                if (killsCountRef.current % 10 === 0) {
                  spawnPowerUp(e.x + ENEMY_WIDTH / 2, e.y + ENEMY_HEIGHT)
                }
                break
              }
            }
          }
        } else {
          const dist = Math.hypot(b.x - px, b.y - py)
          if (dist < 18) {
            bulletHit = true
            hitPlayer()
          }
        }

        if (!bulletHit) nextBullets.push(b)
      }

      bulletsRef.current = nextBullets

      const nextPowerUps: PowerUp[] = []
      for (const p of powerUpsRef.current) {
        p.y += p.vy * dt
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
            weaponTimerRef.current = 7.5
            setActiveWeapon('spread')
          } else if (p.type === 'rapid') {
            weaponTypeRef.current = 'rapid'
            weaponTimerRef.current = 7.5
            setActiveWeapon('rapid')
          } else if (p.type === 'laser') {
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
        } else if (p.y < DESIGN_H + 20) {
          nextPowerUps.push(p)
        }
      }
      powerUpsRef.current = nextPowerUps

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
      // prepareCanvas draws in CSS pixels; scale design units → stage size
      ctx.scale(sw / DESIGN_W, sh / DESIGN_H)

      ctx.save()
      if (screenShakeRef.current > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShakeRef.current * 2,
          (Math.random() - 0.5) * screenShakeRef.current * 2
        )
      }

      ctx.fillStyle = '#050711'
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

      starsRef.current.forEach((s) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(186, 230, 253, ${s.alpha})`
        ctx.fill()
      })

      livingEnemies.forEach((e) => {
        ctx.save()
        ctx.fillStyle = e.color
        ctx.shadowColor = e.color
        ctx.shadowBlur = 8
        const ex = e.x
        const ey = e.y
        ctx.beginPath()
        ctx.roundRect(ex + 4, ey, ENEMY_WIDTH - 8, ENEMY_HEIGHT - 4, 3)
        ctx.fill()
        ctx.fillRect(ex + 1, ey + 4, 3, ENEMY_HEIGHT - 6)
        ctx.fillRect(ex + ENEMY_WIDTH - 4, ey + 4, 3, ENEMY_HEIGHT - 6)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(ex + 6, ey + 4, 3, 3)
        ctx.fillRect(ex + ENEMY_WIDTH - 9, ey + 4, 3, 3)
        ctx.restore()
      })

      if (currentBoss && currentBoss.alive) {
        ctx.save()
        ctx.translate(currentBoss.x, currentBoss.y)
        const bossGrad = ctx.createLinearGradient(0, 0, currentBoss.width, currentBoss.height)
        bossGrad.addColorStop(0, '#f43f5e')
        bossGrad.addColorStop(1, '#a855f7')
        ctx.fillStyle = bossGrad
        ctx.shadowColor = '#f43f5e'
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.roundRect(0, 0, currentBoss.width, currentBoss.height, 8)
        ctx.fill()
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(currentBoss.width / 2, currentBoss.height / 2, 7, 0, Math.PI * 2)
        ctx.fill()
        const hpPercent = Math.max(0, currentBoss.hp / currentBoss.maxHp)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, -10, currentBoss.width, 5)
        ctx.fillStyle = hpPercent > 0.5 ? '#10b981' : hpPercent > 0.25 ? '#f59e0b' : '#f43f5e'
        ctx.fillRect(0, -10, currentBoss.width * hpPercent, 5)
        ctx.restore()
      }

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

      ctx.save()
      ctx.translate(px, py)
      if (shieldRef.current) {
        ctx.beginPath()
        ctx.arc(0, 0, 24, 0, Math.PI * 2)
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 12
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(0, -16)
      ctx.lineTo(-14, 12)
      ctx.lineTo(0, 7)
      ctx.lineTo(14, 12)
      ctx.closePath()
      const shipGrad = ctx.createLinearGradient(0, -16, 0, 12)
      shipGrad.addColorStop(0, '#38bdf8')
      shipGrad.addColorStop(1, '#1d4ed8')
      ctx.fillStyle = shipGrad
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-5, 8)
      ctx.lineTo(0, 18 + (Math.random() * 4 - 2))
      ctx.lineTo(5, 8)
      ctx.fillStyle = '#f59e0b'
      ctx.shadowColor = '#f59e0b'
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
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasShield && (
            <div className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/60 px-2 py-1 rounded-lg text-cyan-300 text-xs font-bold animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span>{isRtl ? 'درع' : 'SHIELD'}</span>
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
          <span className="text-cyan-400 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            L{level}
          </span>
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

      <div className="w-full text-center text-[10px] font-mono text-indigo-300/80">
        {isRtl ? 'الموجات:' : 'Waves:'} {wavesCleared}/{targetWaves}
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.25)] bg-[#050711] touch-none [overscroll-behavior:contain]"
          style={{ width: stageWidth, height: stageHeight }}
        >
          <canvas
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            className="w-full h-full block cursor-crosshair touch-none"
          />

          {!hasStarted && !isGameOver && !levelCleared && (
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
                    ? `المرحلة ${level} · امسح ${targetWaves} موجات. حرك سفينتك باللمس أو الأسهم!`
                    : `Level ${level} · clear ${targetWaves} waves. Touch or arrows to move!`}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => resetGame(true)}
                className="px-6 py-2.5 text-sm font-black"
              >
                {isRtl ? 'انطلاق للمجرة 🚀' : 'Launch Ship 🚀'}
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
                {isRtl ? 'النقاط:' : 'Score:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{score}</span>
              </p>
            </div>
          )}

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
              <Button
                variant="primary"
                onClick={() => resetGame(true)}
                className="flex items-center gap-2 px-6 py-2.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'إعادة الإطلاق' : 'Restart Mission'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اسحب بإصبعك/الماوس للتوجيه (الإطلاق تلقائي) أو بالأسهم + المسافة'
          : 'Controls: Drag finger / mouse to aim (auto-fire) or Arrow keys + Space'}
      </div>
    </div>
  )
}
