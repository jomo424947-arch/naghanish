/**
 * MinesweeperGame.tsx
 *
 * Modern Neon Minesweeper game.
 * Features customizable grid, flag placement mode, reveal cascade, and sound effects.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Flag, Bomb, Trophy, ShieldAlert } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface MinesweeperProps {
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
  Easy: { rows: 8, cols: 8, mines: 8 },
  Medium: { rows: 9, cols: 9, mines: 14 },
  Hard: { rows: 10, cols: 10, mines: 22 },
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

export const MinesweeperGame: React.FC<MinesweeperProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const config = CONFIGS[difficulty] || CONFIGS.Medium
  const { rows, cols, mines: totalMines } = config

  const [grid, setGrid] = useState<Cell[][]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const [flagsPlaced, setFlagsPlaced] = useState(0)

  // Initialize board
  const initBoard = useCallback(() => {
    let newGrid: Cell[][] = []
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

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    if (isGameOver || isWon) return
    const cell = grid[r][c]
    if (cell.isRevealed) return

    if (flagMode) {
      // Toggle flag
      sound.playTick()
      const next = grid.map((row) => row.map((cl) => ({ ...cl })))
      const willFlag = !cell.isFlagged
      next[r][c].isFlagged = willFlag
      setGrid(next)
      setFlagsPlaced((p) => (willFlag ? p + 1 : p - 1))
      return
    }

    if (cell.isFlagged) return

    if (cell.isMine) {
      // Boom!
      sound.playGameOver()
      const next = grid.map((row) =>
        row.map((cl) => ({
          ...cl,
          isRevealed: cl.isMine ? true : cl.isRevealed,
        }))
      )
      setGrid(next)
      setIsGameOver(true)
      onFinish(150)
      return
    }

    // Safe click
    sound.playBounce()
    const next = grid.map((row) => row.map((cl) => ({ ...cl })))
    next[r][c].isRevealed = true

    if (cell.neighborMines === 0) {
      revealEmptyNeighbors(next, r, c)
    }

    // Check Win condition (all non-mine cells revealed)
    let nonMinesUnrevealed = 0
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!next[i][j].isMine && !next[i][j].isRevealed) {
          nonMinesUnrevealed++
        }
      }
    }

    setGrid(next)

    if (nonMinesUnrevealed === 0) {
      sound.playWin()
      setIsWon(true)
      const baseScore = difficulty === 'Hard' ? 1200 : difficulty === 'Medium' ? 800 : 500
      onFinish(baseScore)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Status Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-black/60 border border-brand-cardBorder">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-rose-400 font-mono font-black text-sm">
            <Bomb className="w-4 h-4" />
            <span>{Math.max(0, totalMines - flagsPlaced)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Flag Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick()
              setFlagMode(!flagMode)
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              flagMode
                ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_#f43f5e]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Flag className="w-3.5 h-3.5 fill-current" />
            <span>{flagMode ? (isRtl ? 'وضع الأعلام 🚩' : 'Flag Mode 🚩') : (isRtl ? 'وضع الكشف ⛏️' : 'Dig Mode ⛏️')}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick()
              initBoard()
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={isRtl ? 'إعادة' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Minesweeper Grid */}
      <div className="p-2 rounded-3xl bg-slate-950/90 border-2 border-brand-cardBorder shadow-2xl">
        <div
          className="grid gap-1 bg-black/60 p-1 rounded-2xl"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all cursor-pointer ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-rose-600 text-white shadow-[0_0_15px_#f43f5e]'
                        : 'bg-slate-900 border border-white/5 shadow-inner'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 hover:border-cyan-400/40 shadow-sm active:scale-95'
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborMines > 0 ? (
                      <span className={NUMBER_COLORS[cell.neighborMines] || 'text-white'}>
                        {cell.neighborMines}
                      </span>
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
      </div>

      {/* Result message */}
      {(isGameOver || isWon) && (
        <div className="p-3 rounded-2xl bg-black/80 border border-white/15 text-center flex flex-col items-center gap-2">
          <span className="text-3xl">{isWon ? '🏆' : '💥'}</span>
          <h4 className="text-white font-black text-sm">
            {isWon
              ? (isRtl ? 'كفووو! تم تطهير جميع الألغام بنجاح!' : 'Victory! All Mines Cleared!')
              : (isRtl ? 'انفجر اللغم! حظ أوفر في المرة القادمة' : 'Boom! Better luck next time')}
          </h4>
        </div>
      )}
    </div>
  )
}
