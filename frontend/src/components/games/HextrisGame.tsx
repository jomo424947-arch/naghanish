/**
 * HextrisGame.tsx
 *
 * Cyber Hextris (هيكستريس النيون)
 * Phase 2: useGameLoop + responsive stage; level scales spawn speed / colors;
 * soft progress via score thresholds → onLevelComplete.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, ArrowLeft, ArrowRight, ArrowDown, Trophy, Zap, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

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

interface FallingBlock {
  sector: number
  dist: number
  colorIndex: number
  speed: number
  thick: number
}

interface StackedBlock {
  colorIndex: number
}

const HEX_COLORS = [
  '#06b6d4',
  '#a855f7',
  '#f43f5e',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
]

const HEX_RADIUS = 50
const BLOCK_THICKNESS = 14
const MAX_BLOCKS_PER_SECTOR = 7
const DESIGN_W = 340
const DESIGN_H = 420
const FRAME = 60

function colorCountFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 4 : difficulty === 'Hard' ? 6 : 5
  return Math.min(6, base + Math.floor((level - 1) / 3))
}

function baseSpeedFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 1.2 : difficulty === 'Hard' ? 2.0 : 1.5
  return base * (1 + (level - 1) * 0.06)
}

/** Spawn interval in frame-equivalent units (lower = faster). */
function spawnIntervalFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 85 : difficulty === 'Hard' ? 55 : 68
  return Math.max(28, base - (level - 1) * 4)
}

function scoreThreshold(progressLevel: number): number {
  return 400 + progressLevel * 350
}

export const HextrisGame: React.FC<GameEngineProps> = ({
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
  const [combo, setCombo] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [linesCleared, setLinesCleared] = useState(0)
  const [progressLevel, setProgressLevel] = useState(level)

  const rotationRef = useRef(0)
  const targetRotationRef = useRef(0)
  const stackedBlocksRef = useRef<StackedBlock[][]>([[], [], [], [], [], []])
  const fallingBlocksRef = useRef<FallingBlock[]>([])
  const particlesRef = useRef<Particle[]>([])
  const screenShakeRef = useRef(0)
  const lineClearFlashRef = useRef(0)
  const spawnTimerRef = useRef(0)
  const scoreRef = useRef(0)
  const comboRef = useRef(1)
  const comboTimerRef = useRef(0)
  const isGameOverRef = useRef(false)
  const finishedRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const progressLevelRef = useRef(level)
  const isPausedRef = useRef(isPaused)
  isPausedRef.current = isPaused
  const widthRef = useRef(width)
  const heightRef = useRef(height)
  widthRef.current = width
  heightRef.current = height
  const levelRef = useRef(level)
  levelRef.current = level
  const difficultyRef = useRef(difficulty)
  difficultyRef.current = difficulty

  const maybeReportProgress = useCallback(() => {
    let advanced = false
    while (scoreRef.current >= scoreThreshold(progressLevelRef.current)) {
      const cleared = progressLevelRef.current
      const stars =
        comboRef.current >= 4 ? 3 : comboRef.current >= 2 ? 2 : 1
      onLevelComplete?.(cleared, stars)
      progressLevelRef.current = cleared + 1
      setProgressLevel(progressLevelRef.current)
      advanced = true
    }
    if (advanced) sound.playWin()
  }, [onLevelComplete])

  const spawnBlock = useCallback(() => {
    const lv = levelRef.current
    const diff = difficultyRef.current
    const colors = colorCountFor(lv, diff)
    const speed = baseSpeedFor(lv, diff)
    const sector = Math.floor(Math.random() * 6)
    const colorIndex = Math.floor(Math.random() * colors)
    const speedBoost = Math.min(1.8, Math.floor(scoreRef.current / 500) * 0.1)

    fallingBlocksRef.current.push({
      sector,
      dist: 220,
      colorIndex,
      speed: speed + speedBoost,
      thick: BLOCK_THICKNESS,
    })
  }, [])

  const checkMatches = useCallback(() => {
    let clearedAny = false
    const sectors = stackedBlocksRef.current

    for (let s = 0; s < 6; s++) {
      const col = sectors[s]
      if (col.length < 3) continue

      let runStart = 0
      while (runStart < col.length) {
        let runEnd = runStart + 1
        while (runEnd < col.length && col[runEnd].colorIndex === col[runStart].colorIndex) {
          runEnd++
        }
        const runLen = runEnd - runStart
        if (runLen >= 3) {
          clearedAny = true
          const matchedColor = HEX_COLORS[col[runStart].colorIndex]

          const cx = DESIGN_W / 2
          const cy = DESIGN_H / 2
          const angle = rotationRef.current + (s * Math.PI) / 3 + Math.PI / 6
          const pDist = HEX_RADIUS + runStart * BLOCK_THICKNESS + 10
          const px = cx + Math.cos(angle) * pDist
          const py = cy + Math.sin(angle) * pDist

          for (let p = 0; p < 20; p++) {
            const pAngle = Math.random() * Math.PI * 2
            const pSpeed = Math.random() * 4 + 1.5
            particlesRef.current.push({
              x: px,
              y: py,
              vx: Math.cos(pAngle) * pSpeed,
              vy: Math.sin(pAngle) * pSpeed,
              color: matchedColor,
              radius: Math.random() * 3 + 2,
              alpha: 1,
              life: 0,
              maxLife: 30,
            })
          }

          col.splice(runStart, runLen)

          const curCombo = comboRef.current
          const pointsEarned = 100 * runLen * curCombo
          scoreRef.current += pointsEarned
          setScore(scoreRef.current)
          setLinesCleared((prev) => prev + 1)

          sound.playLineClear()
          if (curCombo >= 8) sound.playComboX8()
          else if (curCombo >= 4) sound.playComboX4()
          else if (curCombo >= 2) sound.playComboX2()

          screenShakeRef.current = curCombo >= 4 ? 6 : 3
          lineClearFlashRef.current = 1.0

          comboRef.current = Math.min(8, comboRef.current * 2)
          comboTimerRef.current = 240
          setCombo(comboRef.current)

          maybeReportProgress()
        } else {
          runStart = runEnd
        }
      }
    }

    return clearedAny
  }, [maybeReportProgress])

  const rotateHexagon = useCallback((direction: 'LEFT' | 'RIGHT') => {
    if (isGameOverRef.current || isPausedRef.current) return
    sound.playSwoosh()
    const step = Math.PI / 3
    if (direction === 'LEFT') {
      targetRotationRef.current -= step
    } else {
      targetRotationRef.current += step
    }
  }, [])

  const dropFast = useCallback(() => {
    if (isGameOverRef.current || isPausedRef.current) return
    if (fallingBlocksRef.current.length === 0) return

    const currentRot = targetRotationRef.current
    let nearestIdx = 0
    let nearestDist = Infinity
    fallingBlocksRef.current.forEach((b, i) => {
      if (b.dist < nearestDist) {
        nearestDist = b.dist
        nearestIdx = i
      }
    })

    const b = fallingBlocksRef.current[nearestIdx]
    const rotatedSectorIndex = (b.sector - Math.round(currentRot / (Math.PI / 3))) % 6
    const normalizedSector = (rotatedSectorIndex + 600) % 6
    const stack = stackedBlocksRef.current[normalizedSector]
    b.dist = HEX_RADIUS + stack.length * BLOCK_THICKNESS
  }, [])

  const resetGame = useCallback(() => {
    sound.playClick()
    stackedBlocksRef.current = [[], [], [], [], [], []]
    fallingBlocksRef.current = []
    particlesRef.current = []
    rotationRef.current = 0
    targetRotationRef.current = 0
    screenShakeRef.current = 0
    lineClearFlashRef.current = 0
    spawnTimerRef.current = 0
    scoreRef.current = 0
    comboRef.current = 1
    comboTimerRef.current = 0
    isGameOverRef.current = false
    finishedRef.current = false
    progressLevelRef.current = level
    setProgressLevel(level)

    setScore(0)
    setCombo(1)
    setLinesCleared(0)
    setIsGameOver(false)
    setHasStarted(true)
  }, [level])

  const triggerGameOver = useCallback(() => {
    if (isGameOverRef.current || finishedRef.current) return
    isGameOverRef.current = true
    finishedRef.current = true
    setIsGameOver(true)
    screenShakeRef.current = 10
    sound.playGameOver()
    onFinish(scoreRef.current, {
      levelReached: progressLevelRef.current,
      stars: 0,
    })
  }, [onFinish])

  useEffect(() => {
    setHasStarted(false)
    setIsGameOver(false)
    finishedRef.current = false
    isGameOverRef.current = false
    progressLevelRef.current = level
    setProgressLevel(level)
    setScore(0)
    setCombo(1)
    setLinesCleared(0)
  }, [level])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isGameOverRef.current || isPausedRef.current) return

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        rotateHexagon('LEFT')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        rotateHexagon('RIGHT')
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === ' ') {
        e.preventDefault()
        dropFast()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, rotateHexagon, dropFast])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasStarted || isGameOverRef.current || isPausedRef.current) return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !hasStarted || isGameOverRef.current || isPausedRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (absX > 30 && absX > absY) {
      if (dx > 0) rotateHexagon('RIGHT')
      else rotateHexagon('LEFT')
    } else if (dy > 40) {
      dropFast()
    }
    touchStartRef.current = null
  }

  useGameLoop(
    (delta) => {
      const dt = delta * FRAME

      const rotDiff = targetRotationRef.current - rotationRef.current
      rotationRef.current += rotDiff * Math.min(1, 0.25 * dt)

      if (comboTimerRef.current > 0) {
        comboTimerRef.current -= dt
        if (comboTimerRef.current <= 0) {
          comboTimerRef.current = 0
          comboRef.current = 1
          setCombo(1)
        }
      }

      if (screenShakeRef.current > 0) screenShakeRef.current *= Math.pow(0.88, dt)
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      if (lineClearFlashRef.current > 0) lineClearFlashRef.current -= 0.05 * dt
      if (lineClearFlashRef.current < 0) lineClearFlashRef.current = 0

      if (!isGameOverRef.current) {
        spawnTimerRef.current += dt
        const interval = spawnIntervalFor(levelRef.current, difficultyRef.current)
        if (spawnTimerRef.current >= interval) {
          spawnTimerRef.current = 0
          spawnBlock()
        }
      }

      const survivingFalling: FallingBlock[] = []

      for (let i = 0; i < fallingBlocksRef.current.length; i++) {
        const b = fallingBlocksRef.current[i]
        b.dist -= b.speed * dt

        const snappedRot = targetRotationRef.current
        const rotatedSectorIndex = (b.sector - Math.round(snappedRot / (Math.PI / 3))) % 6
        const normalizedSector = (rotatedSectorIndex + 600) % 6

        const stack = stackedBlocksRef.current[normalizedSector]
        const landingDistance = HEX_RADIUS + stack.length * BLOCK_THICKNESS

        if (b.dist <= landingDistance) {
          stack.push({ colorIndex: b.colorIndex })
          sound.playBounce()

          if (stack.length >= MAX_BLOCKS_PER_SECTOR) {
            triggerGameOver()
            break
          }

          checkMatches()
        } else {
          survivingFalling.push(b)
        }
      }

      if (!isGameOverRef.current) {
        fallingBlocksRef.current = survivingFalling
      }

      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= Math.pow(0.96, dt)
        p.vy *= Math.pow(0.96, dt)
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

      let shakeX = 0
      let shakeY = 0
      if (screenShakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeRef.current * 2
        shakeY = (Math.random() - 0.5) * screenShakeRef.current * 2
      }
      ctx.translate(shakeX, shakeY)

      const bgGrad = ctx.createRadialGradient(
        DESIGN_W / 2,
        DESIGN_H / 2,
        20,
        DESIGN_W / 2,
        DESIGN_H / 2,
        220
      )
      bgGrad.addColorStop(0, '#0c1024')
      bgGrad.addColorStop(1, '#050711')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)

      const cx = DESIGN_W / 2
      const cy = DESIGN_H / 2

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotationRef.current)

      ctx.beginPath()
      ctx.arc(0, 0, HEX_RADIUS + MAX_BLOCKS_PER_SECTOR * BLOCK_THICKNESS, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.setLineDash([])

      for (let s = 0; s < 6; s++) {
        const angle = (s * Math.PI) / 3
        ctx.beginPath()
        ctx.moveTo(Math.cos(angle) * (HEX_RADIUS - 5), Math.sin(angle) * (HEX_RADIUS - 5))
        ctx.lineTo(Math.cos(angle) * 190, Math.sin(angle) * 190)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (let s = 0; s < 6; s++) {
        const stack = stackedBlocksRef.current[s]
        const a1 = (s * Math.PI) / 3
        const a2 = ((s + 1) * Math.PI) / 3

        for (let l = 0; l < stack.length; l++) {
          const innerR = HEX_RADIUS + l * BLOCK_THICKNESS
          const outerR = innerR + BLOCK_THICKNESS - 2
          const blockColor = HEX_COLORS[stack[l].colorIndex]

          ctx.beginPath()
          ctx.arc(0, 0, innerR, a1 + 0.03, a2 - 0.03)
          ctx.arc(0, 0, outerR, a2 - 0.03, a1 + 0.03, true)
          ctx.closePath()

          ctx.fillStyle = blockColor
          ctx.shadowColor = blockColor
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const hx = Math.cos(angle) * HEX_RADIUS
        const hy = Math.sin(angle) * HEX_RADIUS
        if (i === 0) ctx.moveTo(hx, hy)
        else ctx.lineTo(hx, hy)
      }
      ctx.closePath()

      const hexGrad = ctx.createLinearGradient(-HEX_RADIUS, -HEX_RADIUS, HEX_RADIUS, HEX_RADIUS)
      hexGrad.addColorStop(0, '#1e1b4b')
      hexGrad.addColorStop(0.5, '#0f172a')
      hexGrad.addColorStop(1, '#0284c7')
      ctx.fillStyle = hexGrad
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 16
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, 0, 14, 0, Math.PI * 2)
      ctx.fillStyle = comboRef.current > 1 ? '#fbbf24' : '#06b6d4'
      ctx.shadowColor = comboRef.current > 1 ? '#fbbf24' : '#06b6d4'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.restore()

      ctx.save()
      ctx.translate(cx, cy)

      fallingBlocksRef.current.forEach((b) => {
        const a1 = (b.sector * Math.PI) / 3
        const a2 = ((b.sector + 1) * Math.PI) / 3
        const innerR = b.dist
        const outerR = b.dist + b.thick
        const blockColor = HEX_COLORS[b.colorIndex]

        ctx.beginPath()
        ctx.arc(0, 0, innerR, a1 + 0.03, a2 - 0.03)
        ctx.arc(0, 0, outerR, a2 - 0.03, a1 + 0.03, true)
        ctx.closePath()

        ctx.fillStyle = blockColor
        ctx.shadowColor = blockColor
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1
        ctx.stroke()
      })
      ctx.restore()

      particlesRef.current.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      if (lineClearFlashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lineClearFlashRef.current * 0.35})`
        ctx.fillRect(0, 0, DESIGN_W, DESIGN_H)
      }

      ctx.restore()
    },
    { running: hasStarted && !isGameOver && !isPaused }
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

        {combo > 1 && (
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/60 px-3 py-1 rounded-xl animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-black text-amber-300">x{combo} COMBO!</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-black text-slate-300">
            L{progressLevel} · {linesCleared}
          </span>
        </div>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#050711] touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
        >
          <canvas
            ref={canvasRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
          />

          {!hasStarted && (
            <div className="absolute inset-0 bg-[#050711]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#06b6d4] animate-bounce">
                🔷
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {isRtl ? 'هيكستريس النيون' : 'Cyber Hextris'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                  {isRtl
                    ? `المستوى ${level} — دور السداسي واجمع 3+ قوالب من نفس اللون!`
                    : `Level ${level} — rotate the hex and match 3+ blocks of a color!`}
                </p>
              </div>
              <Button variant="primary" onClick={resetGame} className="px-6 py-2.5 text-sm font-black">
                {isRtl ? 'ابدأ اللعب الآن 🕹️' : 'Start Playing 🕹️'}
              </Button>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="text-4xl">💥</div>
              <div>
                <h3 className="text-2xl font-black text-rose-400">
                  {isRtl ? 'انتهت اللعبة!' : 'GAME OVER'}
                </h3>
                <p className="text-sm font-bold text-slate-200 mt-1">
                  {isRtl ? 'النتيجة النهائية:' : 'Final Score:'}{' '}
                  <span className="text-cyan-400 text-lg font-black">{score}</span>
                </p>
              </div>
              <Button variant="primary" onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'العب مجدداً' : 'Play Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full px-2">
        <button
          type="button"
          onClick={() => rotateHexagon('LEFT')}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 flex items-center justify-center text-cyan-300 font-bold transition-all shadow-lg active:bg-cyan-600 active:text-white cursor-pointer disabled:opacity-30"
          aria-label="Rotate Left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={dropFast}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 flex items-center justify-center text-amber-300 font-bold transition-all shadow-lg active:bg-amber-600 active:text-white cursor-pointer disabled:opacity-30"
          aria-label="Drop Fast"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => rotateHexagon('RIGHT')}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 flex items-center justify-center text-cyan-300 font-bold transition-all shadow-lg active:bg-cyan-600 active:text-white cursor-pointer disabled:opacity-30"
          aria-label="Rotate Right"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: أسهم الكيبورد (← / → / ↓) أو اللمس والسحب السريع'
          : 'Controls: Arrow Keys (← / → / ↓) or touch swipe on screen'}
      </div>
    </div>
  )
}
