/**
 * ColorBlocksGame.tsx
 *
 * Arcade match-3 drop puzzle: colored blocks fall into columns; match 3+ of the
 * same color in a row/column/diagonal to clear them. Stages raise the clear
 * target and drop speed.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { sound } from '@/utils/soundManager'

const COLS = 6
const ROWS = 9
const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'] as const
type CellColor = (typeof COLORS)[number] | null

function targetForLevel(level: number): number {
  return 8 + level * 4
}

function dropIntervalFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 0.9 : difficulty === 'Hard' ? 0.45 : 0.65
  return Math.max(0.28, base - (level - 1) * 0.04)
}

function emptyGrid(): CellColor[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null))
}

function findMatches(grid: CellColor[][]): Set<string> {
  const matched = new Set<string>()
  const mark = (cells: Array<[number, number]>) => {
    if (cells.length >= 3) cells.forEach(([r, c]) => matched.add(`${r},${c}`))
  }

  for (let r = 0; r < ROWS; r++) {
    let run: Array<[number, number]> = []
    let color: CellColor = null
    for (let c = 0; c <= COLS; c++) {
      const value = c < COLS ? grid[r][c] : null
      if (value && value === color) run.push([r, c])
      else {
        mark(run)
        run = value ? [[r, c]] : []
        color = value
      }
    }
  }

  for (let c = 0; c < COLS; c++) {
    let run: Array<[number, number]> = []
    let color: CellColor = null
    for (let r = 0; r <= ROWS; r++) {
      const value = r < ROWS ? grid[r][c] : null
      if (value && value === color) run.push([r, c])
      else {
        mark(run)
        run = value ? [[r, c]] : []
        color = value
      }
    }
  }

  // Short diagonals
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const color = grid[r][c]
      if (!color) continue
      const diag1: Array<[number, number]> = [[r, c]]
      const diag2: Array<[number, number]> = [[r, c]]
      for (let i = 1; i < 4; i++) {
        if (r + i < ROWS && c + i < COLS && grid[r + i][c + i] === color) diag1.push([r + i, c + i])
        else break
      }
      for (let i = 1; i < 4; i++) {
        if (r + i < ROWS && c - i >= 0 && grid[r + i][c - i] === color) diag2.push([r + i, c - i])
        else break
      }
      mark(diag1)
      mark(diag2)
    }
  }

  return matched
}

function gravity(grid: CellColor[][]): CellColor[][] {
  const next = emptyGrid()
  for (let c = 0; c < COLS; c++) {
    let write = ROWS - 1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r][c]) {
        next[write][c] = grid[r][c]
        write--
      }
    }
  }
  return next
}

export const ColorBlocksGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width, height } = useResponsiveStage({
    aspectRatio: COLS / ROWS,
    minWidth: 260,
    maxWidth: 360,
  })

  const target = targetForLevel(level)
  const [grid, setGrid] = useState<CellColor[][]>(() => emptyGrid())
  const [active, setActive] = useState<{ col: number; row: number; color: CellColor } | null>(null)
  const [cleared, setCleared] = useState(0)
  const [score, setScore] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const [isCleared, setIsCleared] = useState(false)

  const dropAccum = useRef(0)
  const finishedRef = useRef(false)
  const gridRef = useRef(grid)
  gridRef.current = grid
  const activeRef = useRef(active)
  activeRef.current = active
  const clearedRef = useRef(cleared)
  clearedRef.current = cleared
  const scoreRef = useRef(score)
  scoreRef.current = score

  const cellW = width / COLS
  const cellH = height / ROWS

  const spawn = useCallback((base: CellColor[][]) => {
    const openCols = Array.from({ length: COLS }, (_, c) => c).filter((c) => base[0][c] === null)
    if (openCols.length === 0) return null
    const col = openCols[Math.floor(Math.random() * openCols.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    return { col, row: 0, color }
  }, [])

  const resolveBoard = useCallback((incoming: CellColor[][]) => {
    let working = incoming
    let gained = 0
    for (let safety = 0; safety < 8; safety++) {
      const matches = findMatches(working)
      if (matches.size === 0) break
      gained += matches.size
      const clearedGrid = working.map((row, r) =>
        row.map((cell, c) => (matches.has(`${r},${c}`) ? null : cell))
      )
      working = gravity(clearedGrid)
    }
    return { grid: working, gained }
  }, [])

  const endRun = useCallback(
    (won: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const finalScore = scoreRef.current
      const stars = won ? (finalScore > target * 40 ? 3 : finalScore > target * 20 ? 2 : 1) : 0
      if (won) {
        setIsCleared(true)
        onLevelComplete?.(level, stars)
        sound.playWin()
      } else {
        setIsOver(true)
        sound.playGameOver()
      }
      onFinish(finalScore, { levelReached: level, stars, clearedAll: false })
    },
    [level, onFinish, onLevelComplete, target]
  )

  const reset = useCallback(() => {
    sound.playClick()
    const fresh = emptyGrid()
    setGrid(fresh)
    setActive(spawn(fresh))
    setCleared(0)
    setScore(0)
    setIsOver(false)
    setIsCleared(false)
    finishedRef.current = false
    dropAccum.current = 0
    setHasStarted(true)
  }, [spawn])

  useEffect(() => {
    setHasStarted(false)
    setIsOver(false)
    setIsCleared(false)
    finishedRef.current = false
    setGrid(emptyGrid())
    setActive(null)
    setCleared(0)
    setScore(0)
  }, [level])

  const lockPiece = useCallback(() => {
    const piece = activeRef.current
    if (!piece || !piece.color) return
    const next = gridRef.current.map((row) => [...row])
    next[piece.row][piece.col] = piece.color
    const resolved = resolveBoard(next)
    setGrid(resolved.grid)
    if (resolved.gained > 0) {
      sound.playLineClear()
      setScore((s) => s + resolved.gained * 25)
      setCleared((c) => {
        const total = c + resolved.gained
        if (total >= target) endRun(true)
        return total
      })
    }
    const spawned = spawn(resolved.grid)
    if (!spawned) {
      endRun(false)
      setActive(null)
      return
    }
    // Top cell already occupied after spawn means overflow
    if (resolved.grid[0][spawned.col]) {
      endRun(false)
      setActive(null)
      return
    }
    setActive(spawned)
  }, [endRun, resolveBoard, spawn, target])

  const tryMove = useCallback((dc: number) => {
    const piece = activeRef.current
    if (!piece) return
    const nextCol = piece.col + dc
    if (nextCol < 0 || nextCol >= COLS) return
    if (gridRef.current[piece.row][nextCol]) return
    setActive({ ...piece, col: nextCol })
    sound.playMove()
  }, [])

  const softDrop = useCallback(() => {
    const piece = activeRef.current
    if (!piece) return
    const nextRow = piece.row + 1
    if (nextRow >= ROWS || gridRef.current[nextRow][piece.col]) {
      lockPiece()
      return
    }
    setActive({ ...piece, row: nextRow })
  }, [lockPiece])

  useGameLoop(
    (delta) => {
      dropAccum.current += delta
      const interval = dropIntervalFor(level, difficulty)
      while (dropAccum.current >= interval) {
        dropAccum.current -= interval
        softDrop()
      }
    },
    { running: hasStarted && !isOver && !isCleared && !isPaused }
  )

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!hasStarted || isOver || isCleared) return
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault()
        tryMove(-1)
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault()
        tryMove(1)
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault()
        softDrop()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasStarted, isOver, isCleared, tryMove, softDrop])

  const paintCells = useMemo(() => {
    const cells: Array<{ r: number; c: number; color: CellColor }> = []
    grid.forEach((row, r) =>
      row.forEach((color, c) => {
        if (color) cells.push({ r, c, color })
      })
    )
    if (active?.color) cells.push({ r: active.row, c: active.col, color: active.color })
    return cells
  }, [grid, active])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-fuchsia-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-fuchsia-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {isRtl ? 'النقاط:' : 'SCORE:'} {score}
          </span>
        </div>
        <span className="text-amber-300 font-black">
          {cleared}/{target}
        </span>
        <span className="text-cyan-300 font-bold">L{level}</span>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl bg-slate-950 border-2 border-fuchsia-500/40 shadow-[0_0_28px_rgba(217,70,239,0.25)] overflow-hidden touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
          onPointerUp={(e) => {
            if (!hasStarted || isOver || isCleared) return
            const bounds = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - bounds.left
            if (x < bounds.width / 3) tryMove(-1)
            else if (x > (bounds.width * 2) / 3) tryMove(1)
            else softDrop()
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#d946ef18_1px,transparent_1px)] [background-size:14px_14px]" />

          {paintCells.map(({ r, c, color }) => (
            <div
              key={`${r}-${c}-${color}`}
              className="absolute rounded-md border border-white/20"
              style={{
                left: c * cellW + 2,
                top: r * cellH + 2,
                width: cellW - 4,
                height: cellH - 4,
                backgroundColor: color ?? undefined,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
          ))}

          {!hasStarted && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
              <span className="text-4xl">🧩</span>
              <p className="text-base font-black text-white">
                {isRtl ? 'قوالب الألوان' : 'Color Blocks'}
              </p>
              <p className="text-xs text-slate-300">
                {isRtl
                  ? `طابق 3+ من نفس اللون · امسح ${target} قالب في المرحلة ${level}`
                  : `Match 3+ same color · clear ${target} blocks on level ${level}`}
              </p>
              <Button variant="primary" size="sm" onClick={reset}>
                {isRtl ? 'ابدأ 🚀' : 'Start 🚀'}
              </Button>
            </div>
          )}

          {(isOver || isCleared) && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center z-30">
              <span className="text-4xl">{isCleared ? '🏆' : '💥'}</span>
              <p className={`text-base font-black ${isCleared ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCleared
                  ? isRtl
                    ? 'المرحلة خلصت!'
                    : 'Level Cleared!'
                  : isRtl
                    ? 'اللوحة امتلأت!'
                    : 'Board Full!'}
              </p>
              <p className="text-xs text-white font-mono">
                {isRtl ? 'النتيجة:' : 'Score:'} {score}
              </p>
              <Button variant="primary" size="sm" onClick={reset} className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'العب تاني' : 'Play Again'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => tryMove(-1)}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-fuchsia-300 font-black text-lg active:scale-95"
        >
          ←
        </button>
        <button
          type="button"
          onClick={softDrop}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-fuchsia-300 font-black text-lg active:scale-95"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => tryMove(1)}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-fuchsia-300 font-black text-lg active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  )
}
