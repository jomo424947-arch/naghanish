/**
 * MinesweeperGame.tsx
 *
 * Minesweeper Cyber Hack (كاسحة الألغام السيبرانية)
 * Advanced cyber deduction engine featuring:
 * - Guaranteed First-Click Safety (no instant death on initial probe).
 * - Pro Chord-Clicking: Clicking an already-revealed number cell automatically reveals adjacent unflagged cells if flags match!
 * - Cyber Circuit Board UI with node frequencies, virus markers, and neon traces.
 * - Procedural Web Audio API sound effects for probes, flags, explosions, and hack success.
 * - Desktop right-click / touch long-press & mode toggle for fast flagging.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Flag, Trophy, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface MinesweeperProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Cell {
  r: number
  c: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

const CONFIGS = {
  Easy: { rows: 8, cols: 8, mines: 9 },
  Medium: { rows: 9, cols: 9, mines: 15 },
  Hard: { rows: 10, cols: 10, mines: 24 },
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-cyan-400',
  2: 'text-emerald-400',
  3: 'text-amber-400',
  4: 'text-purple-400',
  5: 'text-rose-400',
  6: 'text-pink-400',
  7: 'text-yellow-300',
  8: 'text-white',
}

export const MinesweeperGame: React.FC<MinesweeperProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const config = CONFIGS[difficulty] || CONFIGS.Medium
  const { rows, cols, mines: totalMines } = config

  const [grid, setGrid] = useState<Cell[][]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const [flagsPlaced, setFlagsPlaced] = useState(0)
  const [firstClickDone, setFirstClickDone] = useState(false)

  const isGameOverRef = useRef(false)
  const isWonRef = useRef(false)

  // Initialize board
  const initBoard = useCallback(() => {
    const newGrid: Cell[][] = []
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = []
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        })
      }
      newGrid.push(row)
    }

    // Plant mines
    let planted = 0
    while (planted < totalMines) {
      const rr = Math.floor(Math.random() * rows)
      const rc = Math.floor(Math.random() * cols)
      if (!newGrid[rr][rc].isMine) {
        newGrid[rr][rc].isMine = true
        planted++
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                count++
              }
            }
          }
          newGrid[r][c].neighborMines = count
        }
      }
    }

    setGrid(newGrid)
    setIsGameOver(false)
    setIsWon(false)
    setFlagsPlaced(0)
    setFirstClickDone(false)
    isGameOverRef.current = false
    isWonRef.current = false
  }, [rows, cols, totalMines])

  useEffect(() => {
    initBoard()
  }, [initBoard])

  // Cascade reveal empty cells
  const revealEmptyNeighbors = (board: Cell[][], startR: number, startC: number) => {
    const queue: [number, number][] = [[startR, startC]]
    while (queue.length > 0) {
      const [r, c] = queue.shift()!
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const cell = board[nr][nc]
            if (!cell.isRevealed && !cell.isFlagged && !cell.isMine) {
              cell.isRevealed = true
              if (cell.neighborMines === 0) {
                queue.push([nr, nc])
              }
            }
          }
        }
      }
    }
  }

  // Check victory condition
  const checkVictory = (board: Cell[][]) => {
    let unrevealedSafe = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r][c]
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafe++
        }
      }
    }

    if (unrevealedSafe === 0) {
      setIsWon(true)
      isWonRef.current = true
      sound.playWin()
      const score = Math.round(totalMines * 150 * (difficulty === 'Hard' ? 2.5 : difficulty === 'Medium' ? 1.5 : 1.0))
      onFinish(score)
    }
  }

  // Pro Chord Click on already revealed cell
  const handleChordClick = (r: number, c: number) => {
    const cell = grid[r][c]
    if (!cell.isRevealed || cell.neighborMines === 0) return

    // Count adjacent flags
    let adjacentFlags = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isFlagged) {
          adjacentFlags++
        }
      }
    }

    // If flags match neighbor mines count, reveal remaining unflagged neighbors!
    if (adjacentFlags === cell.neighborMines) {
      sound.playClick()
      const newGrid = grid.map((row) => row.map((item) => ({ ...item })))
      let hitMine = false

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const adj = newGrid[nr][nc]
            if (!adj.isRevealed && !adj.isFlagged) {
              adj.isRevealed = true
              if (adj.isMine) {
                hitMine = true
              } else if (adj.neighborMines === 0) {
                revealEmptyNeighbors(newGrid, nr, nc)
              }
            }
          }
        }
      }

      if (hitMine) {
        sound.playExplosion()
        sound.playGameOver()
        setIsGameOver(true)
        isGameOverRef.current = true
        // Reveal all mines
        newGrid.forEach((row) =>
          row.forEach((item) => {
            if (item.isMine) item.isRevealed = true
          })
        )
      } else {
        checkVictory(newGrid)
      }
      setGrid(newGrid)
    }
  }

  // Flag toggle
  const toggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (isGameOver || isWon) return

    const cell = grid[r][c]
    if (cell.isRevealed) return

    sound.playShieldUp()
    const newGrid = grid.map((row) => row.map((item) => ({ ...item })))
    const target = newGrid[r][c]

    target.isFlagged = !target.isFlagged
    setGrid(newGrid)
    setFlagsPlaced((prev) => (target.isFlagged ? prev + 1 : prev - 1))
  }

  // Handle cell click (Reveal or Flag)
  const handleCellClick = (r: number, c: number) => {
    if (isGameOver || isWon) return

    const cell = grid[r][c]

    // If already revealed, perform Chord Click
    if (cell.isRevealed) {
      handleChordClick(r, c)
      return
    }

    // If in Flag mode, toggle flag
    if (flagMode) {
      toggleFlag(r, c)
      return
    }

    if (cell.isFlagged) return

    const newGrid = grid.map((row) => row.map((item) => ({ ...item })))
    const target = newGrid[r][c]

    // First-Click Safety Guarantee
    if (!firstClickDone && target.isMine) {
      target.isMine = false
      // Move mine to another unplanted cell
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          if (!newGrid[rr][cc].isMine && (rr !== r || cc !== c)) {
            newGrid[rr][cc].isMine = true
            break
          }
        }
      }
      // Recalculate numbers
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          if (!newGrid[rr][cc].isMine) {
            let count = 0
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = rr + dr
                const nc = cc + dc
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                  count++
                }
              }
            }
            newGrid[rr][cc].neighborMines = count
          }
        }
      }
    }
    setFirstClickDone(true)

    // Detonate Mine
    if (target.isMine) {
      target.isRevealed = true
      sound.playExplosion()
      sound.playGameOver()
      setIsGameOver(true)
      isGameOverRef.current = true

      // Reveal all mines
      newGrid.forEach((row) =>
        row.forEach((item) => {
          if (item.isMine) item.isRevealed = true
        })
      )
      setGrid(newGrid)
      return
    }

    // Safe cell reveal
    sound.playClick()
    target.isRevealed = true
    if (target.neighborMines === 0) {
      revealEmptyNeighbors(newGrid, r, c)
    }

    checkVictory(newGrid)
    setGrid(newGrid)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Mines Counter */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isRtl ? 'الفيروسات' : 'Threats'}
            </span>
            <span className="text-sm font-black text-rose-400 leading-none">
              {Math.max(0, totalMines - flagsPlaced)}
            </span>
          </div>
        </div>

        {/* Mode Toggle (Flag / Probe) */}
        <button
          onClick={() => {
            sound.playClick()
            setFlagMode(!flagMode)
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
            flagMode
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_#f43f5e]'
              : 'bg-brand-darkBg/90 border-brand-purple/40 text-cyan-300'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span className="text-xs font-black">
            {flagMode ? (isRtl ? 'وضع الأعلام 🚩' : 'FLAG MODE') : (isRtl ? 'وضع الكشف ⚡' : 'PROBE MODE')}
          </span>
        </button>

        {/* Reset */}
        <button
          onClick={initBoard}
          className="p-2 rounded-xl bg-brand-darkBg/90 border border-brand-purple/40 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Cyber Grid Board */}
      <div
        className="relative p-3 rounded-3xl bg-[#060714] border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center justify-center overflow-hidden"
        style={{ width: 340, height: 340 }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            width: '100%',
            height: '100%',
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const numColor = NUMBER_COLORS[cell.neighborMines] || 'text-white'

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => toggleFlag(r, c, e)}
                  className={`rounded-lg flex items-center justify-center font-black transition-all duration-100 cursor-pointer ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-rose-600 border border-rose-400 text-white shadow-[0_0_12px_#f43f5e]'
                        : 'bg-slate-900/90 border border-slate-800/80 shadow-inner'
                      : cell.isFlagged
                      ? 'bg-rose-950/40 border border-rose-500/60 shadow-[0_0_8px_#f43f5e]'
                      : 'bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/40'
                  }`}
                  style={{
                    fontSize: cols >= 10 ? 12 : 14,
                  }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborMines > 0 ? (
                      <span className={numColor}>{cell.neighborMines}</span>
                    ) : (
                      ''
                    )
                  ) : cell.isFlagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Victory Screen */}
        {isWon && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
            <div className="text-4xl animate-bounce">🛡️⚡</div>
            <h3 className="text-2xl font-black text-emerald-400">
              {isRtl ? 'تم اختراق وتأمين الشبكة!' : 'CYBER GRID SECURED!'}
            </h3>
            <p className="text-sm font-bold text-slate-200">
              {isRtl ? 'تم اكتشاف جميع التهديدات بنجاح' : 'All malicious threat nodes neutralized'}
            </p>
            <Button variant="glow" onClick={initBoard} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'تأمين شبكة أخرى' : 'Play Again'}</span>
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
            <div className="text-4xl">💥💣</div>
            <h3 className="text-2xl font-black text-rose-400">
              {isRtl ? 'انفجر الفيروس!' : 'SECURITY BREACH!'}
            </h3>
            <p className="text-sm font-bold text-slate-200">
              {isRtl ? 'تم تفجير خلية لغم مفخخة' : 'Detonated a corrupted data node'}
            </p>
            <Button variant="glow" onClick={initBoard} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Try Again'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'المس المربع لكشفه أو انقر زراً مكشوفاً (Chord) لكشف مجاوراته تلقائياً فور وضع أعلامه'
          : 'Tap to reveal, toggle Flag mode to mark, or tap a revealed number to chord-clear neighbors'}
      </div>
    </div>
  )
}
