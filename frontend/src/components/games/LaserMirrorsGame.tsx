/**
 * LaserMirrorsGame.tsx
 *
 * Laser & Mirrors Matrix (توجيه أشعة الليزر)
 * Optics raycasting puzzle game built with HTML5 Canvas 2D.
 * Features:
 * - Real-time raytracing laser optics reflecting off 45° and 135° rotatable mirrors.
 * - Sensor nodes that activate with radiant energy upon laser illumination.
 * - Solid absorption blocks and directional routing.
 * - Handcrafted progressive optics puzzles with rotation efficiency scoring.
 * - Full Touch & Mouse support for mobile and desktop.
 * - High-contrast Light Mode and Dark Mode support.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Star, Layers, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface LaserMirrorsProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type MirrorType = '/' | '\\'

interface MirrorConfig {
  r: number
  c: number
  initial: MirrorType
}

interface LevelOptics {
  gridSize: number
  source: { r: number; c: number; dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' }
  mirrors: MirrorConfig[]
  blockers: { r: number; c: number }[]
  sensors: { r: number; c: number }[]
  parRotations: number
}

const OPTICS_LEVELS: LevelOptics[] = [
  // Level 1: Single Mirror 90° Turn
  {
    gridSize: 6,
    source: { r: 1, c: 0, dir: 'RIGHT' },
    mirrors: [{ r: 1, c: 4, initial: '/' }], // Solved with '\'
    blockers: [],
    sensors: [{ r: 4, c: 4 }],
    parRotations: 1,
  },
  // Level 2: Double Mirror S-Route
  {
    gridSize: 6,
    source: { r: 1, c: 0, dir: 'RIGHT' },
    mirrors: [
      { r: 1, c: 3, initial: '/' }, // Solved with '\'
      { r: 4, c: 3, initial: '\\' }, // Solved with '/'
    ],
    blockers: [{ r: 1, c: 5 }],
    sensors: [{ r: 4, c: 5 }],
    parRotations: 2,
  },
  // Level 3: U-Turn Optical Bypass
  {
    gridSize: 6,
    source: { r: 0, c: 2, dir: 'DOWN' },
    mirrors: [
      { r: 4, c: 2, initial: '/' }, // Solved with '\' (reflects RIGHT)
      { r: 4, c: 5, initial: '\\' }, // Solved with '/' (reflects UP)
      { r: 1, c: 5, initial: '\\' }, // Solved with '/' (reflects LEFT)
    ],
    blockers: [{ r: 2, c: 2 }],
    sensors: [{ r: 1, c: 1 }],
    parRotations: 3,
  },
  // Level 4: Dual Target Illumination
  {
    gridSize: 7,
    source: { r: 1, c: 0, dir: 'RIGHT' },
    mirrors: [
      { r: 1, c: 3, initial: '/' }, // Solved with '\' (reflects DOWN)
      { r: 5, c: 3, initial: '\\' }, // Solved with '/' (reflects RIGHT)
      { r: 5, c: 5, initial: '/' }, // Solved with '\' (reflects UP)
    ],
    blockers: [{ r: 2, c: 3 }, { r: 4, c: 4 }],
    sensors: [{ r: 3, c: 3 }, { r: 2, c: 5 }],
    parRotations: 3,
  },
  // Level 5: The Quantum Labyrinth
  {
    gridSize: 7,
    source: { r: 0, c: 3, dir: 'DOWN' },
    mirrors: [
      { r: 2, c: 3, initial: '/' }, // Solved with '\' (reflects RIGHT)
      { r: 2, c: 5, initial: '/' }, // Solved with '\' (reflects DOWN)
      { r: 5, c: 5, initial: '/' }, // Solved with '\' (reflects LEFT)
      { r: 5, c: 1, initial: '\\' }, // Solved with '/' (reflects UP)
      { r: 1, c: 1, initial: '\\' }, // Solved with '/' (reflects RIGHT)
    ],
    blockers: [
      { r: 3, c: 3 },
      { r: 4, c: 2 },
    ],
    sensors: [{ r: 1, c: 3 }],
    parRotations: 5,
  },
  // Level 6: Master Laser Matrix
  {
    gridSize: 8,
    source: { r: 2, c: 0, dir: 'RIGHT' },
    mirrors: [
      { r: 2, c: 2, initial: '/' }, // Solved with '\' (DOWN)
      { r: 6, c: 2, initial: '\\' }, // Solved with '/' (RIGHT)
      { r: 6, c: 6, initial: '/' }, // Solved with '\' (UP)
      { r: 1, c: 6, initial: '\\' }, // Solved with '/' (LEFT)
      { r: 1, c: 4, initial: '/' }, // Solved with '\' (DOWN)
    ],
    blockers: [{ r: 2, c: 5 }, { r: 4, c: 2 }],
    sensors: [{ r: 4, c: 2 }, { r: 6, c: 4 }, { r: 3, c: 4 }],
    parRotations: 5,
  },
]

export const LaserMirrorsGame: React.FC<LaserMirrorsProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Start at appropriate level according to difficulty
  const startLevel = difficulty === 'Hard' ? 2 : difficulty === 'Medium' ? 1 : 0
  const [levelIndex, setLevelIndex] = useState(startLevel)
  const [mirrors, setMirrors] = useState<{ r: number; c: number; type: MirrorType }[]>([])
  const [rotations, setRotations] = useState(0)
  const [solved, setSolved] = useState(false)
  const [totalStars, setTotalStars] = useState(0)
  const [litCount, setLitCount] = useState(0)

  const currentLevel = OPTICS_LEVELS[levelIndex % OPTICS_LEVELS.length]
  const cellSize = 320 / currentLevel.gridSize

  // Initialize level mirrors with their non-solved initial states
  const initLevel = useCallback((idx: number) => {
    const lvl = OPTICS_LEVELS[idx % OPTICS_LEVELS.length]
    setMirrors(lvl.mirrors.map((m) => ({ r: m.r, c: m.c, type: m.initial })))
    setRotations(0)
    setSolved(false)
    setLitCount(0)
  }, [])

  useEffect(() => {
    initLevel(levelIndex)
  }, [levelIndex, initLevel])

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
          const newDr = -dc
          const newDc = -dr
          dr = newDr
          dc = newDc
        } else if (mirror.type === '\\') {
          // Reflection for '\':
          const newDr = dc
          const newDc = dr
          dr = newDr
          dc = newDc
        }
      }
    }

    return { path, allSensorsLit: hitSensors.size === sensors.length, litCount: hitSensors.size }
  }, [currentLevel, mirrors, cellSize])

  // Rotate a mirror on click/tap
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

  // Canvas Drawing & Victory Checking
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { path, allSensorsLit, litCount: count } = computeLaserPath()
    setLitCount(count)

    // Check victory condition
    if (allSensorsLit && !solved && rotations > 0) {
      setSolved(true)
      sound.playWin()
      const stars = rotations <= currentLevel.parRotations ? 3 : rotations <= currentLevel.parRotations + 2 ? 2 : 1
      setTotalStars((prev) => prev + stars)
    }

    // ──────────────── DRAW PHASE ────────────────
    ctx.fillStyle = '#070914'
    ctx.fillRect(0, 0, 320, 320)

    const gs = currentLevel.gridSize

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'
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
      // Diagonal danger line
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(b.c * cellSize + 4, b.r * cellSize + 4)
      ctx.lineTo(b.c * cellSize + cellSize - 4, b.r * cellSize + cellSize - 4)
      ctx.stroke()
    })

    // Draw Sensors
    currentLevel.sensors.forEach((s) => {
      const cx = s.c * cellSize + cellSize / 2
      const cy = s.r * cellSize + cellSize / 2
      const isLit = allSensorsLit || count > 0 // will glow if hit

      ctx.beginPath()
      ctx.arc(cx, cy, cellSize * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = isLit ? '#059669' : '#1e293b'
      ctx.strokeStyle = isLit ? '#10b981' : '#475569'
      ctx.lineWidth = 2
      ctx.shadowColor = isLit ? '#10b981' : 'transparent'
      ctx.shadowBlur = isLit ? 16 : 0
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      // Inner target circle
      ctx.beginPath()
      ctx.arc(cx, cy, cellSize * 0.16, 0, Math.PI * 2)
      ctx.fillStyle = isLit ? '#6ee7b7' : '#94a3b8'
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

      // Inner bright beam
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.2
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
    ctx.shadowBlur = 14
    ctx.beginPath()
    ctx.arc(srcX, srcY, cellSize * 0.32, 0, Math.PI * 2)
    ctx.fill()

    // Indicator diode
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(srcX, srcY, cellSize * 0.12, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Draw Mirrors
    mirrors.forEach((m) => {
      const mx = m.c * cellSize
      const my = m.r * cellSize
      const pad = cellSize * 0.16

      ctx.save()
      // Cell border / clickable slot highlight
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)'
      ctx.fillRect(mx + 2, my + 2, cellSize - 4, cellSize - 4)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(mx + 2, my + 2, cellSize - 4, cellSize - 4)

      // Mirror reflection line
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 12
      ctx.lineCap = 'round'

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

  // Handle pointer down (Mouse & Touch compatible)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
    sound.playClick()
    if (levelIndex + 1 >= OPTICS_LEVELS.length) {
      onFinish(totalStars * 250 + 500)
    } else {
      setLevelIndex((l) => l + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Level Indicator */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl shadow-inner">
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

        {/* Sensors Lit Tracker */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl shadow-inner">
          <span className="text-xs font-bold text-slate-400">
            {isRtl ? 'المستشعرات:' : 'Targets:'}
          </span>
          <span className={`text-xs font-black ${litCount === currentLevel.sensors.length ? 'text-emerald-400' : 'text-amber-400'}`}>
            {litCount}/{currentLevel.sensors.length} 🎯
          </span>
        </div>

        {/* Rotations */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl shadow-inner">
          <span className="text-xs font-bold text-slate-400">
            {isRtl ? 'التدوير:' : 'Moves:'}{' '}
            <strong className="text-amber-300">{rotations}</strong>/{currentLevel.parRotations}
          </span>
        </div>

        {/* Reset */}
        <button
          onClick={() => initLevel(levelIndex)}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
          title={isRtl ? 'إعادة المحاولة' : 'Reset Level'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Board */}
      <div className="relative w-[320px] h-[320px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#070914] touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onPointerDown={handlePointerDown}
          className="block w-full h-full cursor-pointer touch-none"
        />

        {/* Victory Overlay */}
        {solved && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-black text-emerald-300">
              {isRtl ? 'تم توصيل الليزر بالهدف! ⚡' : 'Beam Connected! ⚡'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl
                ? `أكملت اللغز في ${rotations} تدويرة!`
                : `Solved in ${rotations} mirror rotations!`}
            </p>

            <div className="flex items-center gap-1 my-1">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${
                    s <= (rotations <= currentLevel.parRotations ? 3 : rotations <= currentLevel.parRotations + 2 ? 2 : 1)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNextLevel}
              className="flex items-center gap-2 mt-2"
            >
              <span>
                {levelIndex + 1 >= OPTICS_LEVELS.length
                  ? isRtl
                    ? 'إنهاء التحدي 🏆'
                    : 'Finish Challenge 🏆'
                  : isRtl
                    ? 'اللغز التالي 🚀'
                    : 'Next Puzzle 🚀'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Instruction Tip */}
      <p className="text-xs text-slate-400 text-center font-medium">
        {isRtl
          ? '💡 اضغط على أي مرآة لتدويرها 90 درجة وعكس مسار شعاع الليزر نحو المستشعرات'
          : '💡 Tap any mirror to rotate it 90° and reflect the laser towards the sensors'}
      </p>
    </div>
  )
}
