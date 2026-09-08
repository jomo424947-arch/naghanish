/**
 * HextrisGame.tsx
 *
 * Cyber Hextris (هيكستريس النيون)
 * Fast-paced hexagonal puzzle game built with HTML5 Canvas 2D.
 * Features:
 * - Central 6-sided hexagon rotating with keyboard arrows, touch swipe, or tactile on-screen controls.
 * - Falling neon polygon segments descending towards the 6 faces.
 * - Match 3+ blocks of identical color on the same sector to trigger mega line clears and combos.
 * - Dynamic combo system (x1, x2, x4, x8) with screen shake, particle bursts, and glowing neon trails.
 * - Web Audio API procedural sound effects.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, ArrowLeft, ArrowRight, ArrowDown, Trophy, Zap, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@utils/soundManager'

export interface HextrisGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
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

interface FallingBlock {
  sector: number // 0 to 5
  dist: number // distance from center (px)
  colorIndex: number
  speed: number
  thick: number
}

// Stacked block on a sector
interface StackedBlock {
  colorIndex: number
}

const HEX_COLORS = [
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#f43f5e', // Pink/Rose
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
]

const HEX_RADIUS = 50 // Base hexagon radius
const BLOCK_THICKNESS = 14
const MAX_BLOCKS_PER_SECTOR = 7 // If stacked blocks reach this, game over
const CANVAS_WIDTH = 340
const CANVAS_HEIGHT = 420

export const HextrisGame: React.FC<HextrisGameProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React states
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [linesCleared, setLinesCleared] = useState(0)

  // Game Engine State (Refs for 60fps loop)
  const rotationRef = useRef<number>(0) // in radians
  const targetRotationRef = useRef<number>(0)
  const stackedBlocksRef = useRef<StackedBlock[][]>([[], [], [], [], [], []]) // 6 sectors
  const fallingBlocksRef = useRef<FallingBlock[]>([])
  const particlesRef = useRef<Particle[]>([])
  const screenShakeRef = useRef<number>(0)
  const lineClearFlashRef = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const scoreRef = useRef<number>(0)
  const comboRef = useRef<number>(1)
  const comboTimerRef = useRef<number>(0)
  const isGameOverRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Difficulty settings
  const colorCount = difficulty === 'Easy' ? 4 : difficulty === 'Hard' ? 6 : 5
  const baseSpeed = difficulty === 'Easy' ? 1.2 : difficulty === 'Hard' ? 2.0 : 1.5
  const spawnInterval = difficulty === 'Easy' ? 85 : difficulty === 'Hard' ? 55 : 68

  // Helper to spawn a new block from outer boundary
  const spawnBlock = useCallback(() => {
    const sector = Math.floor(Math.random() * 6)
    const colorIndex = Math.floor(Math.random() * colorCount)
    // Speed increases slightly as score grows
    const speedBoost = Math.min(1.8, Math.floor(scoreRef.current / 500) * 0.1)

    fallingBlocksRef.current.push({
      sector,
      dist: 220, // Spawn beyond canvas viewport
      colorIndex,
      speed: baseSpeed + speedBoost,
      thick: BLOCK_THICKNESS,
    })
  }, [baseSpeed, colorCount])

  // Clear matched blocks
  const checkMatches = useCallback(() => {
    let clearedAny = false
    const sectors = stackedBlocksRef.current

    for (let s = 0; s < 6; s++) {
      const col = sectors[s]
      if (col.length < 3) continue

      // Look for 3+ consecutive same colors
      let runStart = 0
      while (runStart < col.length) {
        let runEnd = runStart + 1
        while (runEnd < col.length && col[runEnd].colorIndex === col[runStart].colorIndex) {
          runEnd++
        }
        const runLen = runEnd - runStart
        if (runLen >= 3) {
          // Matched!
          clearedAny = true
          const matchedColor = HEX_COLORS[col[runStart].colorIndex]

          // Particle burst
          const cx = CANVAS_WIDTH / 2
          const cy = CANVAS_HEIGHT / 2
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

          // Remove blocks from column
          col.splice(runStart, runLen)

          // Score and combo update
          const curCombo = comboRef.current
          const pointsEarned = 100 * runLen * curCombo
          scoreRef.current += pointsEarned
          setScore(scoreRef.current)
          setLinesCleared((prev) => prev + 1)

          // Sound & Combo escalation
          sound.playLineClear()
          if (curCombo >= 8) sound.playComboX8()
          else if (curCombo >= 4) sound.playComboX4()
          else if (curCombo >= 2) sound.playComboX2()

          // Screen shake & flash
          screenShakeRef.current = curCombo >= 4 ? 6 : 3
          lineClearFlashRef.current = 1.0

          // Advance combo multiplier
          comboRef.current = Math.min(8, comboRef.current * 2)
          comboTimerRef.current = 240 // ~4 seconds before combo resets
          setCombo(comboRef.current)
        } else {
          runStart = runEnd
        }
      }
    }

    return clearedAny
  }, [])

  // Rotate hexagon by steps (1 step = PI/3 = 60 degrees)
  const rotateHexagon = useCallback((direction: 'LEFT' | 'RIGHT') => {
    if (isGameOverRef.current) return
    sound.playSwoosh()
    const step = Math.PI / 3
    if (direction === 'LEFT') {
      targetRotationRef.current -= step
    } else {
      targetRotationRef.current += step
    }
  }, [])

  // Drop fastest current falling block
  const dropFast = useCallback(() => {
    if (isGameOverRef.current) return
    fallingBlocksRef.current.forEach((b) => {
      b.dist = Math.max(HEX_RADIUS + 5, b.dist - 20)
    })
  }, [])

  // Start / Reset Game
  const resetGame = useCallback(() => {
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

    setScore(0)
    setCombo(1)
    setLinesCleared(0)
    setIsGameOver(false)
    setHasStarted(true)
  }, [])

  // End Game
  const triggerGameOver = useCallback(() => {
    if (isGameOverRef.current) return
    isGameOverRef.current = true
    setIsGameOver(true)
    screenShakeRef.current = 10
    sound.playGameOver()
    onFinish(scoreRef.current)
  }, [onFinish])

  // ── Keyboard Controls ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isGameOverRef.current) return

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

  // ── Touch / Swipe Controls on Canvas ──
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasStarted || isGameOverRef.current) return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !hasStarted || isGameOverRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (absX > 30 && absX > absY) {
      // Horizontal swipe
      if (dx > 0) rotateHexagon('RIGHT')
      else rotateHexagon('LEFT')
    } else if (dy > 40) {
      // Down swipe
      dropFast()
    }
    touchStartRef.current = null
  }

  // ── Main Canvas 60fps Loop ──
  useEffect(() => {
    if (!hasStarted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      // 1. Smooth rotation interpolation
      const diff = targetRotationRef.current - rotationRef.current
      rotationRef.current += diff * 0.25

      // 2. Combo decay
      if (comboTimerRef.current > 0) {
        comboTimerRef.current--
        if (comboTimerRef.current === 0) {
          comboRef.current = 1
          setCombo(1)
        }
      }

      // 3. Screen shake & flash decay
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.88
      if (screenShakeRef.current < 0.2) screenShakeRef.current = 0

      if (lineClearFlashRef.current > 0) lineClearFlashRef.current -= 0.05
      if (lineClearFlashRef.current < 0) lineClearFlashRef.current = 0

      // 4. Block Spawner
      if (!isGameOverRef.current) {
        spawnTimerRef.current++
        if (spawnTimerRef.current >= spawnInterval) {
          spawnTimerRef.current = 0
          spawnBlock()
        }
      }

      // 5. Update Falling Blocks
      const currentRot = rotationRef.current
      const survivingFalling: FallingBlock[] = []

      for (let i = 0; i < fallingBlocksRef.current.length; i++) {
        const b = fallingBlocksRef.current[i]
        b.dist -= b.speed

        // Calculate landing sector accounting for current hex rotation
        // Relative sector is (b.sector - Math.round(currentRot / (Math.PI/3))) % 6
        const rotatedSectorIndex =
          (b.sector - Math.round(currentRot / (Math.PI / 3))) % 6
        const normalizedSector = (rotatedSectorIndex + 600) % 6

        const stack = stackedBlocksRef.current[normalizedSector]
        const stackHeight = stack.length
        const landingDistance = HEX_RADIUS + stackHeight * BLOCK_THICKNESS

        if (b.dist <= landingDistance) {
          // Block has landed!
          stack.push({ colorIndex: b.colorIndex })
          sound.playBounce()

          // Check if overflow (Game Over)
          if (stack.length >= MAX_BLOCKS_PER_SECTOR) {
            triggerGameOver()
            break
          }

          // Check for line clears
          checkMatches()
        } else {
          survivingFalling.push(b)
        }
      }

      if (!isGameOverRef.current) {
        fallingBlocksRef.current = survivingFalling
      }

      // 6. Update Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.life++
        p.alpha = Math.max(0, 1 - p.life / p.maxLife)
      })
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)

      // ──────────────── DRAW PHASE ────────────────
      ctx.save()

      // Screen Shake offset
      let shakeX = 0
      let shakeY = 0
      if (screenShakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeRef.current * 2
        shakeY = (Math.random() - 0.5) * screenShakeRef.current * 2
      }
      ctx.translate(shakeX, shakeY)

      // Clear with dark cyber gradient
      const bgGrad = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        20,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        220
      )
      bgGrad.addColorStop(0, '#0c1024')
      bgGrad.addColorStop(1, '#050711')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Background Sector Guides (subtle neon lines)
      const cx = CANVAS_WIDTH / 2
      const cy = CANVAS_HEIGHT / 2

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(currentRot)

      // Outer Danger Ring
      ctx.beginPath()
      ctx.arc(0, 0, HEX_RADIUS + MAX_BLOCKS_PER_SECTOR * BLOCK_THICKNESS, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.setLineDash([])

      // 6 sector dividers
      for (let s = 0; s < 6; s++) {
        const angle = (s * Math.PI) / 3
        ctx.beginPath()
        ctx.moveTo(Math.cos(angle) * (HEX_RADIUS - 5), Math.sin(angle) * (HEX_RADIUS - 5))
        ctx.lineTo(Math.cos(angle) * 190, Math.sin(angle) * 190)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw Stacked Blocks on Hexagon
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

          // Inner highlight border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw Central Hexagon Core
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const hx = Math.cos(angle) * HEX_RADIUS
        const hy = Math.sin(angle) * HEX_RADIUS
        if (i === 0) ctx.moveTo(hx, hy)
        else ctx.lineTo(hx, hy)
      }
      ctx.closePath()

      // Hexagon Core Fill
      const hexGrad = ctx.createLinearGradient(-HEX_RADIUS, -HEX_RADIUS, HEX_RADIUS, HEX_RADIUS)
      hexGrad.addColorStop(0, '#1e1b4b')
      hexGrad.addColorStop(0.5, '#0f172a')
      hexGrad.addColorStop(1, '#0284c7')
      ctx.fillStyle = hexGrad
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 16
      ctx.fill()
      ctx.shadowBlur = 0

      // Hexagon Core Border
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.stroke()

      // Center glowing emblem
      ctx.beginPath()
      ctx.arc(0, 0, 14, 0, Math.PI * 2)
      ctx.fillStyle = comboRef.current > 1 ? '#fbbf24' : '#06b6d4'
      ctx.shadowColor = comboRef.current > 1 ? '#fbbf24' : '#06b6d4'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.restore() // Restore center rotation

      // 7. Draw Falling Blocks (drawn in world coordinates)
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

        // Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1
        ctx.stroke()
      })
      ctx.restore()

      // 8. Draw Particles
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

      // 9. Line Clear White Flash
      if (lineClearFlashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lineClearFlashRef.current * 0.35})`
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }

      ctx.restore() // Restore shake

      if (!isGameOverRef.current) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [hasStarted, spawnInterval, spawnBlock, checkMatches, triggerGameOver])

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

        {/* Combo Multiplier */}
        {combo > 1 && (
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/60 px-3 py-1 rounded-xl animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-black text-amber-300">x{combo} COMBO!</span>
          </div>
        )}

        {/* Cleared lines */}
        <div className="flex items-center gap-1.5 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-black text-slate-300">{linesCleared}</span>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full aspect-[340/420] max-h-[420px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#050711]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Pre-Game Start Screen */}
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
                  ? 'دور السداسي النيوني واجمع 3 قوالب أو أكثر من نفس اللون لتفجيرها!'
                  : 'Rotate the central hexagon to match 3+ blocks of identical color!'}
              </p>
            </div>
            <Button variant="glow" onClick={resetGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'ابدأ اللعب الآن 🕹️' : 'Start Playing 🕹️'}
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
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
            <Button variant="glow" onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'العب مجدداً' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tactile On-Screen Controls for Mobile / Convenience */}
      <div className="grid grid-cols-3 gap-3 w-full px-2">
        <button
          onClick={() => rotateHexagon('LEFT')}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 flex items-center justify-center text-cyan-300 font-bold transition-all shadow-lg active:bg-cyan-600 active:text-white cursor-pointer disabled:opacity-30"
          aria-label="Rotate Left"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={dropFast}
          disabled={!hasStarted || isGameOver}
          className="h-14 rounded-2xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 flex items-center justify-center text-amber-300 font-bold transition-all shadow-lg active:bg-amber-600 active:text-white cursor-pointer disabled:opacity-30"
          aria-label="Drop Fast"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
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
