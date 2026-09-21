/**
 * FlowConnectGame.tsx
 *
 * Numberlink-style puzzle: connect matching colored endpoints with paths that
 * never cross. Each level is a compact handcrafted board.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useResponsiveStage, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type Cell = { color: number | null; isEndpoint: boolean }
type Point = { r: number; c: number }

interface LevelDef {
  size: number
  /** Pairs of endpoints [r1,c1,r2,c2,colorIndex] */
  pairs: Array<[number, number, number, number, number]>
}

const PALETTE = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#fb7185']

const LEVELS: LevelDef[] = [
  {
    size: 4,
    pairs: [
      [0, 0, 3, 0, 0],
      [0, 3, 3, 3, 1],
      [1, 1, 2, 2, 2],
    ],
  },
  {
    size: 5,
    pairs: [
      [0, 0, 4, 4, 0],
      [0, 4, 4, 0, 1],
      [2, 0, 2, 4, 2],
      [0, 2, 4, 2, 3],
    ],
  },
  {
    size: 5,
    pairs: [
      [0, 1, 4, 1, 0],
      [1, 0, 1, 4, 1],
      [0, 3, 3, 4, 2],
      [3, 0, 4, 3, 3],
    ],
  },
  {
    size: 6,
    pairs: [
      [0, 0, 5, 5, 0],
      [0, 5, 5, 0, 1],
      [0, 2, 5, 2, 2],
      [2, 0, 2, 5, 3],
      [1, 1, 4, 4, 4],
    ],
  },
  {
    size: 6,
    pairs: [
      [0, 0, 0, 5, 0],
      [5, 0, 5, 5, 1],
      [1, 1, 4, 4, 2],
      [1, 4, 4, 1, 3],
      [2, 0, 2, 5, 4],
    ],
  },
  {
    size: 6,
    pairs: [
      [0, 1, 5, 4, 0],
      [0, 4, 5, 1, 1],
      [1, 0, 4, 5, 2],
      [1, 5, 4, 0, 3],
      [2, 2, 3, 3, 4],
    ],
  },
  {
    size: 7,
    pairs: [
      [0, 0, 6, 6, 0],
      [0, 6, 6, 0, 1],
      [0, 3, 6, 3, 2],
      [3, 0, 3, 6, 3],
      [1, 1, 5, 5, 4],
      [1, 5, 5, 1, 5],
    ],
  },
]

function buildGrid(level: LevelDef): Cell[][] {
  const grid: Cell[][] = Array.from({ length: level.size }, () =>
    Array.from({ length: level.size }, () => ({ color: null, isEndpoint: false }))
  )
  for (const [r1, c1, r2, c2, color] of level.pairs) {
    grid[r1][c1] = { color, isEndpoint: true }
    grid[r2][c2] = { color, isEndpoint: true }
  }
  return grid
}

export const FlowConnectGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  level = 1,
  onLevelComplete,
}) => {
  const levelIndex = Math.max(0, Math.min(LEVELS.length - 1, level - 1))
  const def = LEVELS[levelIndex]
  const { containerRef, width } = useResponsiveStage({
    aspectRatio: 1,
    minWidth: 260,
    maxWidth: 420,
  })
  const cell = width / def.size

  const [grid, setGrid] = useState(() => buildGrid(def))
  const [paths, setPaths] = useState<Record<number, Point[]>>({})
  const [drawing, setDrawing] = useState<{ color: number; trail: Point[] } | null>(null)
  const [moves, setMoves] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [cleared, setCleared] = useState(false)
  const finishedRef = React.useRef(false)

  const reset = useCallback(() => {
    sound.playClick()
    setGrid(buildGrid(def))
    setPaths({})
    setDrawing(null)
    setMoves(0)
    setCleared(false)
    finishedRef.current = false
    setHasStarted(true)
  }, [def])

  useEffect(() => {
    setHasStarted(false)
    setCleared(false)
    finishedRef.current = false
    setGrid(buildGrid(def))
    setPaths({})
    setDrawing(null)
    setMoves(0)
  }, [def])

  const occupied = useMemo(() => {
    const map = new Map<string, number>()
    Object.entries(paths).forEach(([color, pts]) => {
      pts.forEach((p) => map.set(`${p.r},${p.c}`, Number(color)))
    })
    if (drawing) {
      drawing.trail.forEach((p) => map.set(`${p.r},${p.c}`, drawing.color))
    }
    return map
  }, [paths, drawing])

  const checkWin = useCallback(
    (nextPaths: Record<number, Point[]>) => {
      // Every pair connected and every non-empty? Soft win: all pairs have path linking endpoints.
      const allConnected = def.pairs.every(([, , , , color]) => {
        const path = nextPaths[color]
        if (!path || path.length < 2) return false
        const [r1, c1, r2, c2] = def.pairs.find((p) => p[4] === color)!
        const start = path[0]
        const end = path[path.length - 1]
        const links =
          (start.r === r1 && start.c === c1 && end.r === r2 && end.c === c2) ||
          (start.r === r2 && start.c === c2 && end.r === r1 && end.c === c1)
        return links
      })
      if (!allConnected) return

      // Prefer filling the board for harder levels
      const filled = nextPaths
      let cells = 0
      Object.values(filled).forEach((pts) => {
        cells += pts.length
      })
      const mustFill = def.size >= 6
      if (mustFill && cells < def.size * def.size) return

      if (finishedRef.current) return
      finishedRef.current = true
      setCleared(true)
      const score = Math.max(100, 1200 - moves * 20 + level * 50)
      const stars = moves <= def.pairs.length ? 3 : moves <= def.pairs.length * 2 ? 2 : 1
      onLevelComplete?.(level, stars)
      sound.playWin()
      onFinish(score, { levelReached: level, stars })
    },
    [def, level, moves, onFinish, onLevelComplete]
  )

  const cellFromPointer = (clientX: number, clientY: number, el: HTMLElement): Point | null => {
    const bounds = el.getBoundingClientRect()
    const x = clientX - bounds.left
    const y = clientY - bounds.top
    const c = Math.floor(x / cell)
    const r = Math.floor(y / cell)
    if (r < 0 || c < 0 || r >= def.size || c >= def.size) return null
    return { r, c }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasStarted || cleared) return
    const pt = cellFromPointer(e.clientX, e.clientY, e.currentTarget)
    if (!pt) return
    const cellData = grid[pt.r][pt.c]
    if (!cellData.isEndpoint || cellData.color === null) return

    // Clear existing path for this color
    setPaths((prev) => {
      const next = { ...prev }
      delete next[cellData.color!]
      return next
    })
    setDrawing({ color: cellData.color, trail: [pt] })
    sound.playClick()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing) return
    const pt = cellFromPointer(e.clientX, e.clientY, e.currentTarget)
    if (!pt) return

    setDrawing((current) => {
      if (!current) return current
      const last = current.trail[current.trail.length - 1]
      if (last.r === pt.r && last.c === pt.c) return current

      // Must be adjacent
      if (Math.abs(last.r - pt.r) + Math.abs(last.c - pt.c) !== 1) return current

      // Can't cross other colors (except own endpoint)
      const key = `${pt.r},${pt.c}`
      const occ = occupied.get(key)
      const target = grid[pt.r][pt.c]
      if (occ !== undefined && occ !== current.color) return current
      if (target.isEndpoint && target.color !== current.color) return current

      // Allow backtracking
      const earlier = current.trail.findIndex((p) => p.r === pt.r && p.c === pt.c)
      if (earlier >= 0) {
        return { ...current, trail: current.trail.slice(0, earlier + 1) }
      }

      return { ...current, trail: [...current.trail, pt] }
    })
  }

  const onPointerUp = () => {
    if (!drawing) return
    const trail = drawing.trail
    const color = drawing.color
    setDrawing(null)

    const end = trail[trail.length - 1]
    const endCell = grid[end.r][end.c]
    const valid =
      trail.length >= 2 && endCell.isEndpoint && endCell.color === color

    if (!valid) {
      sound.playMiss()
      return
    }

    sound.playCoin()
    setMoves((m) => m + 1)
    setPaths((prev) => {
      const next = { ...prev, [color]: trail }
      queueMicrotask(() => checkWin(next))
      return next
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-violet-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-violet-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {isRtl ? 'الوصلات:' : 'Links:'} {Object.keys(paths).length}/{def.pairs.length}
          </span>
        </div>
        <span className="text-amber-300 font-black">
          {isRtl ? 'حركات' : 'Moves'} {moves}
        </span>
        <span className="text-cyan-300 font-bold">L{level}</span>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl bg-slate-950 border-2 border-violet-500/40 shadow-[0_0_28px_rgba(139,92,246,0.25)] overflow-hidden touch-none [overscroll-behavior:contain]"
          style={{ width, height: width }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {Array.from({ length: def.size * def.size }, (_, i) => {
            const r = Math.floor(i / def.size)
            const c = i % def.size
            const cellData = grid[r][c]
            const pathColor = occupied.get(`${r},${c}`)
            const fill = cellData.isEndpoint
              ? PALETTE[cellData.color!]
              : pathColor !== undefined
                ? PALETTE[pathColor]
                : 'transparent'

            return (
              <div
                key={i}
                className="absolute rounded-md border border-white/10"
                style={{
                  left: c * cell + 3,
                  top: r * cell + 3,
                  width: cell - 6,
                  height: cell - 6,
                  backgroundColor: fill === 'transparent' ? 'rgba(255,255,255,0.03)' : fill,
                  boxShadow: cellData.isEndpoint ? `0 0 14px ${fill}` : undefined,
                  opacity: pathColor !== undefined && !cellData.isEndpoint ? 0.75 : 1,
                }}
              />
            )
          })}

          {!hasStarted && (
            <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="text-4xl">🔗</span>
              <p className="text-base font-black text-white">
                {isRtl ? 'ربط المسارات' : 'Flow Connect'}
              </p>
              <p className="text-xs text-slate-300">
                {isRtl
                  ? 'وصّل النقاط المتشابهة بمسارات من غير ما تتقاطع'
                  : 'Connect matching dots with paths that never cross'}
              </p>
              <Button variant="primary" size="sm" onClick={reset}>
                {isRtl ? 'ابدأ 🚀' : 'Start 🚀'}
              </Button>
            </div>
          )}

          {cleared && (
            <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="text-4xl">🏆</span>
              <p className="text-base font-black text-emerald-400">
                {isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'}
              </p>
              <Button variant="primary" size="sm" onClick={reset} className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'العب تاني' : 'Play Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
