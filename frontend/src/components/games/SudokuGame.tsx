/**
 * SudokuGame.tsx
 *
 * Interactive Neon Sudoku puzzle game.
 * Features 9x9 grid, difficulty modes, duplicate highlighting, note taking, and error limits.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Trophy, CheckCircle, AlertTriangle, Eraser, Lightbulb } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface SudokuGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type Grid = number[][]

// Pre-tested balanced boards for instant loading
const SAMPLE_BOARDS = {
  Easy: {
    initial: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
  Medium: {
    initial: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    solution: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9],
    ],
  },
  Hard: {
    initial: [
      [0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 3],
      [0, 7, 4, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 2],
      [0, 8, 0, 0, 4, 0, 0, 1, 0],
      [6, 0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 7, 8, 0],
      [5, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 0],
    ],
    solution: [
      [1, 2, 6, 4, 3, 7, 9, 5, 8],
      [8, 9, 5, 6, 2, 1, 4, 7, 3],
      [3, 7, 4, 9, 8, 5, 1, 2, 6],
      [4, 5, 7, 1, 9, 3, 8, 6, 2],
      [9, 8, 3, 2, 4, 6, 5, 1, 7],
      [6, 1, 2, 5, 7, 8, 3, 9, 4],
      [2, 6, 9, 3, 1, 4, 7, 8, 5],
      [5, 4, 8, 7, 6, 9, 2, 3, 1],
      [7, 3, 1, 8, 5, 2, 6, 4, 9],
    ],
  },
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const dataset = SAMPLE_BOARDS[difficulty] || SAMPLE_BOARDS.Medium

  const [initialGrid] = useState<Grid>(() => dataset.initial.map((r) => [...r]))
  const [grid, setGrid] = useState<Grid>(() => dataset.initial.map((r) => [...r]))
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [maxMistakes] = useState(3)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(3)

  const solution = dataset.solution

  // Handle number input
  const handleInputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isGameOver || isCompleted) return
      const { r, c } = selectedCell

      // Cannot modify initial given numbers
      if (initialGrid[r][c] !== 0) return

      if (num === 0) {
        // Erase
        sound.playClick()
        const next = grid.map((row) => [...row])
        next[r][c] = 0
        setGrid(next)
        return
      }

      if (solution[r][c] === num) {
        sound.playCoin()
        const next = grid.map((row) => [...row])
        next[r][c] = num
        setGrid(next)

        // Check if fully solved
        const isSolved = next.every((row, rIdx) => row.every((val, cIdx) => val === solution[rIdx][cIdx]))
        if (isSolved) {
          setIsCompleted(true)
          sound.playWin()
          const finalScore = 1000 - mistakes * 150 + (difficulty === 'Hard' ? 500 : difficulty === 'Medium' ? 250 : 100)
          onFinish(Math.max(200, finalScore))
        }
      } else {
        // Mistake!
        sound.playGameOver()
        const nm = mistakes + 1
        setMistakes(nm)
        if (nm >= maxMistakes) {
          setIsGameOver(true)
          onFinish(100)
        }
      }
    },
    [selectedCell, isGameOver, isCompleted, initialGrid, grid, solution, mistakes, maxMistakes, difficulty, onFinish]
  )

  // Use hint
  const handleUseHint = () => {
    if (hintsLeft <= 0 || !selectedCell || isGameOver || isCompleted) return
    const { r, c } = selectedCell
    if (grid[r][c] === solution[r][c]) return

    sound.playWin()
    const next = grid.map((row) => [...row])
    next[r][c] = solution[r][c]
    setGrid(next)
    setHintsLeft((h) => h - 1)
  }

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        handleInputNumber(num)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleInputNumber(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleInputNumber])

  const selectedValue = selectedCell ? grid[selectedCell.r][selectedCell.c] : null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-black/60 border border-brand-cardBorder">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-300">
            {isRtl ? 'الأخطاء:' : 'Mistakes:'}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <span key={i} className={i < mistakes ? 'text-rose-500' : 'text-slate-600'}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseHint}
            disabled={hintsLeft <= 0}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              hintsLeft > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/5 text-slate-500 border-white/10 opacity-50 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{isRtl ? `تلميح (${hintsLeft})` : `Hint (${hintsLeft})`}</span>
          </button>
        </div>
      </div>

      {/* The 9x9 Sudoku Grid */}
      <div className="p-2 rounded-3xl bg-slate-950/90 border-2 border-brand-cardBorder shadow-2xl">
        <div className="grid grid-cols-9 gap-0.5 sm:gap-1 bg-slate-800/60 p-1 rounded-2xl">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isInitial = initialGrid[r][c] !== 0
              const isSelected = selectedCell?.r === r && selectedCell?.c === c
              const isSameRowOrCol = selectedCell && (selectedCell.r === r || selectedCell.c === c)
              const isSameValue = selectedValue && selectedValue !== 0 && val === selectedValue

              // Thick borders for 3x3 blocks
              const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-cyan-500/40' : ''
              const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-cyan-500/40' : ''

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => {
                    sound.playClick()
                    setSelectedCell({ r, c })
                  }}
                  className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center font-black rounded-lg text-sm sm:text-base transition-all cursor-pointer ${borderRight} ${borderBottom} ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_#06b6d4]'
                      : isSameValue
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      : isSameRowOrCol
                      ? 'bg-white/[0.08] text-white'
                      : 'bg-black/40 hover:bg-white/10 text-slate-200'
                  } ${isInitial ? 'font-black text-white' : 'font-bold text-cyan-400'}`}
                >
                  {val !== 0 ? val : ''}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Number Pad 1-9 & Eraser */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-xs mt-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleInputNumber(num)}
            className="h-11 rounded-2xl bg-white/5 hover:bg-cyan-500/20 active:bg-cyan-500 active:text-black border border-white/10 hover:border-cyan-400/50 text-white font-black text-lg flex items-center justify-center transition-all cursor-pointer shadow-md"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleInputNumber(0)}
          className="h-11 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center transition-all cursor-pointer shadow-md"
          title={isRtl ? 'مسح' : 'Erase'}
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      {/* Completion or Game Over Modals */}
      {(isCompleted || isGameOver) && (
        <div className="mt-2 p-4 rounded-2xl bg-black/90 border border-white/20 flex flex-col items-center gap-2 text-center">
          <span className="text-3xl">{isCompleted ? '🎉' : '❌'}</span>
          <h4 className="font-black text-white text-base">
            {isCompleted ? (isRtl ? 'أحسنت! لغز كامل بدون أخطاء قاتلة' : 'Great Job! Puzzle Solved') : (isRtl ? 'استنفدت محاولات الأخطاء' : 'Game Over - Too Many Mistakes')}
          </h4>
        </div>
      )}
    </div>
  )
}
