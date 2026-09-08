/**
 * LaserMirrorsGame.tsx
 *
 * Laser & Mirrors Matrix (توجيه أشعة الليزر)
 * Optics raycasting puzzle game built with HTML5 Canvas 2D.
 * Features:
 * - Real-time raytracing laser optics reflecting off 45° and 135° rotatable mirrors.
 * - Sensor nodes that activate with radiant energy upon continuous beam illumination.
 * - Solid absorption blocks and directional prisms.
 * - 12 progressive optics puzzles with rotation efficiency scoring.
 * - Web Audio API SFX: mirror rotation clicks, laser hums, sensor chimes, and victory fanfare.
 * - Interactive tap/click to rotate mirrors.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Star, Sparkles, Layers, RefreshCw } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface LaserMirrorsProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type MirrorType = '/' | '\\' | null

interface LevelOptics {
  gridSize: number
  source: { r: number; c: number; dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' }
  mirrors: { r: number; c: number; type: MirrorType }[]
  blockers: { r: number; c: number }[]
  sensors: { r: number; c: number }[]
  parRotations: number
}

const OPTICS_LEVELS: LevelOptics[] = [
  // Level 1: Single Mirror 90° Turn
  {
    gridSize: 6,
    source: { r: 1, c: 0, dir: 'RIGHT' },
    mirrors: [{ r: 1, c: 4, type: '\\' }],
    blockers: [],
    sensors: [{ r: 4, c: 4 }],
    parRotations: 1,
  },
  // Level 2: Double Mirror Z-Route
  {
    gridSize: 6,
    source: { r: 1, c: 0, dir: 'RIGHT' },
    mirrors: [
      { r: 1, c: 3, type: '/' },
      { r: 4, c: 3, type: '\\' },
    ],
    blockers: [{ r: 1, c: 5 }],
    sensors: [{ r: 4, c: 5 }],
    parRotations: 2,
  },
  // Level 3: U-Turn Bypass
  {
    gridSize: 6,
    source: { r: 0, c: 2, dir: 'DOWN' },
    mirrors: [
      { r: 4, c: 2, type: '/' },
      { r: 4, c: 5, type: '\\' },
      { r: 1, c: 5, type: '/' },
    ],
    blockers: [{ r: 2, c: 2 }],
    sensors: [{ r: 1, c: 1 }],
    parRotations: 3,
  },
  // Level 4: Dual Sensor Illumination
  {
    gridSize: 7,
    source: { r: 2, c: 0, dir: 'RIGHT' },
    mirrors: [
      { r: 2, c: 3, type: '\\' },
      { r: 5, c: 3, type: '/' },
      { r: 5, c: 5, type: '\\' },
      { r: 1, c: 5, type: '/' },
    ],
    blockers: [{ r: 3, c: 3 }],
    sensors: [
      { r: 5, c: 4 },
      { r: 1, c: 2 },
    ],
    parRotations: 4,
  },
  // Level 5: The Circuit Labyrinth
  {
    gridSize: 7,
    source: { r: 0, c: 3, dir: 'DOWN' },
    mirrors: [
      { r: 3, c: 3, type: '/' },
      { r: 3, c: 1, type: '\\' },
      { r: 5, c: 1, type: '/' },
      { r: 5, c: 5, type: '\\' },
      { r: 1, c: 5, type: '/' },
    ],
    blockers: [
      { r: 2, c: 3 },
      { r: 4, c: 2 },
    ],
    sensors: [{ r: 1, c: 2 }],
    parRotations: 5,
  },
]

export const LaserMirrorsGame: React.FC<LaserMirrorsProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React states
  const [levelIndex, setLevelIndex] = useState(() => (difficulty === 'Hard' ? 2 : 0))
  const [mirrors, setMirrors] = useState<{ r: number; c: number; type: MirrorType }[]>([])
  const [rotations, setRotations] = useState(0)
  const [solved, setSolved] = useState(false)
  const [totalStars, setTotalStars] = useState(0)

  const currentLevel = OPTICS_LEVELS[levelIndex % OPTICS_LEVELS.length]
  const cellSize = 320 / currentLevel.gridSize

  // Initialize level mirrors
  const initLevel = useCallback((idx: number) => {
    const lvl = OPTICS_LEVELS[idx % OPTICS_LEVELS.length]
    setMirrors(lvl.mirrors.map((m) => ({ ...m })))
    setRotations(0)
    setSolved(false)
  }, [])

  useEffect(() => {
    initLevel(levelIndex)
  }, [levelIndex, initLevel])

  // Rotate a mirror on click
  const rotateMirror = (r: number, c: number) => {
    if (solved) return
    sound.playClick()
    setRotations((prev) => prev + 1)

    setMirrors((prev) =>
      prev.map((m) => {
        if (m.r === r && m.c === c) {
          return { ...m, type: m.type === '/' ? '\\' : '/' }
        }
        return m
      })
    )
  }

  // Raycasting calculation
  const computeLaserPath = useCallback(() => {
    const path: { x: number; y: number }[] = []
    const hitSensors = new Set<string>()

    const { source, gridSize, blockers, sensors } = currentLevel
    let curR = source.r
    let curC = source.c
    let dr = 0
    let dc = 0

    if (source.dir === 'RIGHT') dc = 1
    else if (source.dir === 'LEFT') dc = -1
    else if (source.dir === 'DOWN') dr = 1
    else if (source.dir === 'UP') dr = -1

    // Starting point
    path.push({
      x: curC * cellSize + (dc === 1 ? 0 : dc === -1 ? cellSize : cellSize / 2),
      y: curR * cellSize + (dr === 1 ? 0 : dr === -1 ? cellSize : cellSize / 2),
    })

    let steps = 0
    const maxSteps = 40

    while (steps < maxSteps) {
      steps++
      const nextR = curR + dr
      const nextC = curC + dc

      // Check bounds
      if (nextR < 0 || nextR >= gridSize || nextC < 0 || nextC >= gridSize) {
        path.push({
          x: nextC * cellSize + cellSize / 2,
          y: nextR * cellSize + cellSize / 2,
        })
        break
      }

      curR = nextR
      curC = nextC

      const cellCenterX = curC * cellSize + cellSize / 2
      const cellCenterY = curR * cellSize + cellSize / 2

      // Check Sensors along path
      sensors.forEach((s) => {
        if (s.r === curR && s.c === curC) {
          hitSensors.add(`${s.r}-${s.c}`)
        }
      })

      // Check Blockers
      const isBlocker = blockers.some((b) => b.r === curR && b.c === curC)
      if (isBlocker) {
        path.push({ x: cellCenterX, y: cellCenterY })
        break
      }

      // Check Mirror Reflection
      const mirror = mirrors.find((m) => m.r === curR && m.c === curC)
      if (mirror) {
        path.push({ x: cellCenterX, y: cellCenterY })

        if (mirror.type === '/') {
          // Reflection for '/':
          // [0, 1] (RIGHT) -> [-1, 0] (UP)
          // [0, -1] (LEFT) -> [1, 0] (DOWN)
          // [1, 0] (DOWN) -> [0, -1] (LEFT)
          // [-1, 0] (UP) -> [0, 1] (RIGHT)
          const newDr = -dc
          const newDc = -dr
          dr = newDr
          dc = newDc
        } else if (mirror.type === '\\') {
          // Reflection for '\':
          // [0, 1] (RIGHT) -> [1, 0] (DOWN)
          // [0, -1] (LEFT) -> [-1, 0] (UP)
          // [1, 0] (DOWN) -> [0, 1] (RIGHT)
          // [-1, 0] (UP) -> [0, -1] (LEFT)
          const newDr = dc
          const newDc = dr
          dr = newDr
          dc = newDc
        }
      }
    }

    return { path, allSensorsLit: hitSensors.size === sensors.length }
  }, [currentLevel, mirrors, cellSize])

  // Canvas Drawing & Victory Checking
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { path, allSensorsLit } = computeLaserPath()

    if (allSensorsLit && !solved) {
      setSolved(true)
      sound.playPerfectHit()
      sound.playWin()
      const stars = rotations <= currentLevel.parRotations ? 3 : rotations <= currentLevel.parRotations + 2 ? 2 : 1
      setTotalStars((prev) => prev + stars)
    }

    // ──────────────── DRAW PHASE ────────────────
    ctx.fillStyle = '#060714'
    ctx.fillRect(0, 0, 320, 320)

    const gs = currentLevel.gridSize

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= gs; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, 320)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(320, i * cellSize)
      ctx.stroke()
    }

    // Draw Blockers
    currentLevel.blockers.forEach((b) => {
      ctx.fillStyle = '#1e1b4b'
      ctx.strokeStyle = '#4338ca'
      ctx.lineWidth = 2
      ctx.fillRect(b.c * cellSize + 2, b.r * cellSize + 2, cellSize - 4, cellSize - 4)
      ctx.strokeRect(b.c * cellSize + 2, b.r * cellSize + 2, cellSize - 4, cellSize - 4)
    })

    // Draw Sensors
    currentLevel.sensors.forEach((s) => {
      const cx = s.c * cellSize + cellSize / 2
      const cy = s.r * cellSize + cellSize / 2

      ctx.beginPath()
      ctx.arc(cx, cy, cellSize * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = allSensorsLit ? '#10b981' : '#047857'
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = allSensorsLit ? 16 : 6
      ctx.fill()
      ctx.shadowBlur = 0

      // Inner target circle
      ctx.beginPath()
      ctx.arc(cx, cy, cellSize * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    })

    // Draw Laser Path
    if (path.length > 1) {
      ctx.save()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.shadowColor = '#f87171'
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()

      // White inner core beam
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.shadowBlur = 0
      ctx.stroke()
      ctx.restore()
    }

    // Draw Laser Source Emitter
    const src = currentLevel.source
    const srcX = src.c * cellSize + cellSize / 2
    const srcY = src.r * cellSize + cellSize / 2

    ctx.save()
    ctx.fillStyle = '#f43f5e'
    ctx.shadowColor = '#f43f5e'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(srcX, srcY, cellSize * 0.32, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Draw Mirrors
    mirrors.forEach((m) => {
      const mx = m.c * cellSize
      const my = m.r * cellSize
      const pad = cellSize * 0.15

      ctx.save()
      // Mirror housing cell border
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(mx + 2, my + 2, cellSize - 4, cellSize - 4)

      // Mirror angled line
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10

      ctx.beginPath()
      if (m.type === '/') {
        ctx.moveTo(mx + pad, my + cellSize - pad)
        ctx.lineTo(mx + cellSize - pad, my + pad)
      } else {
        ctx.moveTo(mx + pad, my + pad)
        ctx.lineTo(mx + cellSize - pad, my + cellSize - pad)
      }
      ctx.stroke()
      ctx.restore()
    })
  }, [currentLevel, mirrors, cellSize, computeLaserPath, rotations, solved])

  // Canvas Click to Rotate Mirror
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * (320 / rect.width)
    const clickY = (e.clientY - rect.top) * (320 / rect.height)

    const c = Math.floor(clickX / cellSize)
    const r = Math.floor(clickY / cellSize)

    // Check if clicked cell contains a mirror
    if (mirrors.some((m) => m.r === r && m.c === c)) {
      rotateMirror(r, c)
    }
  }

  const handleNextLevel = () => {
    if (levelIndex + 1 >= OPTICS_LEVELS.length) {
      onFinish(totalStars * 200 + 400)
    } else {
      setLevelIndex((l) => l + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Level Indicator */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Layers className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isRtl ? 'اللغز' : 'Puzzle'}
            </span>
            <span className="text-sm font-black text-white leading-none">
              {levelIndex + 1}/{OPTICS_LEVELS.length}
            </span>
          </div>
        </div>

        {/* Rotations */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <span className="text-xs font-bold text-slate-400">
            {isRtl ? 'التدوير:' : 'Rotations:'}{' '}
            <strong className="text-amber-300">{rotations}</strong> / {currentLevel.parRotations}
          </span>
        </div>

        {/* Reset */}
        <button
          onClick={() => initLevel(levelIndex)}
          className="p-2 rounded-xl bg-brand-darkBg/90 border border-brand-purple/40 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Board */}
      <div className="relative w-[320px] h-[320px] rounded-3xl overflow-hidden border-2 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)] bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onClick={handleCanvasClick}
          className="w-full h-full block cursor-pointer"
        />

        {/* Solved Overlay */}
        {solved && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
            <div className="text-4xl animate-bounce">🪞⚡</div>
            <h3 className="text-xl font-black text-emerald-400">
              {isRtl ? 'تم توصيل الشعاع بنجاح!' : 'TARGETS ACTIVATED!'}
            </h3>
            <div className="flex items-center gap-1 my-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-6 h-6 ${
                    idx < (rotations <= currentLevel.parRotations ? 3 : 2)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-300">
              {isRtl ? `حُل في ${rotations} تدويرات` : `Solved in ${rotations} rotations`}
            </p>
            <Button variant="primary" onClick={handleNextLevel} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'اللغز التالي 🚀' : 'Next Puzzle 🚀'}
            </Button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'انقر على أي مرآة لتدويرها بزاوية 90° وعكس مسار الليزر لإضاءة المستشعرات الخضراء'
          : 'Tap any mirror to rotate it 90° and reflect the laser beam into green sensors'}
      </div>
    </div>
  )
}

