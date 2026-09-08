/**
 * Game2048.tsx
 *
 * 2048 Cyber Deluxe (نيون 2048 ديلوكس)
 * Features:
 * - Dynamic Grid Size: 4x4 for Standard / 5x5 on Hard mode.
 * - Tactical Undo System: Step back to previous board state with remaining undo charges.
 * - Visual Merge Flare: Scale bounce and radiant glow animations on tile mergers.
 * - Procedural Web Audio API sound effects for slides, merges, 1024/2048 combos, and victory.
 * - High score persistence, touch swipe gestures, and keyboard arrows.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo2, Sparkles, Grid } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface Game2048Props {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type Board = number[][]

const TILE_COLORS: Record<number, { bg: string; text: string; shadow: string }> = {
  2: { bg: 'from-slate-800 to-slate-900', text: 'text-slate-200', shadow: 'shadow-none' },
  4: { bg: 'from-blue-900 to-indigo-950', text: 'text-cyan-300', shadow: 'shadow-none' },
  8: { bg: 'from-cyan-700 to-blue-800', text: 'text-white', shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]' },
  16: { bg: 'from-teal-600 to-emerald-700', text: 'text-white', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  32: { bg: 'from-amber-600 to-orange-700', text: 'text-white', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]' },
  64: { bg: 'from-rose-600 to-red-700', text: 'text-white', shadow: 'shadow-[0_0_18px_rgba(244,63,94,0.7)]' },
  128: { bg: 'from-fuchsia-600 to-purple-800', text: 'text-white', shadow: 'shadow-[0_0_20px_rgba(217,70,239,0.7)]' },
  256: { bg: 'from-purple-600 to-indigo-900', text: 'text-yellow-200', shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.8)]' },
  512: { bg: 'from-yellow-500 to-amber-700', text: 'text-white', shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.9)]' },
  1024: { bg: 'from-emerald-500 to-cyan-700', text: 'text-white', shadow: 'shadow-[0_0_35px_rgba(16,185,129,1)]' },
  2048: { bg: 'from-amber-400 via-pink-500 to-purple-600', text: 'text-white', shadow: 'shadow-[0_0_40px_rgba(245,158,11,1)]' },
}

export const Game2048: React.FC<Game2048Props> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const size = difficulty === 'Hard' ? 5 : 4

  const [board, setBoard] = useState<Board>(() => getInitialBoard(size))
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('naghanish_2048_best') || '0', 10)
  })
  const [undoCount, setUndoCount] = useState(3)
  const [history, setHistory] = useState<{ board: Board; score: number }[]>([])
  const [mergedCoords, setMergedCoords] = useState<Set<string>>(new Set())
  const [gameOver, setGameOver] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  function getInitialBoard(gridSize: number): Board {
    const b: Board = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))
    addRandomTile(b, gridSize)
    addRandomTile(b, gridSize)
    if (difficulty === 'Easy') {
      addRandomTile(b, gridSize)
    }
    return b
  }

  function addRandomTile(b: Board, gridSize: number): boolean {
    const emptyCells: { r: number; c: number }[] = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c })
      }
    }
    if (emptyCells.length === 0) return false
    const rand = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const isFour = difficulty === 'Hard' ? Math.random() < 0.25 : Math.random() < 0.1
    b[rand.r][rand.c] = isFour ? 4 : 2
    return true
  }

  const slideRow = (row: number[]): { newRow: number[]; gainedScore: number; mergedIndices: number[] } => {
    let arr = row.filter((val) => val !== 0)
    let gainedScore = 0
    const mergedIndices: number[] = []

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2
        gainedScore += arr[i]
        arr[i + 1] = 0
        mergedIndices.push(i)
      }
    }
    arr = arr.filter((val) => val !== 0)
    while (arr.length < size) {
      arr.push(0)
    }
    return { newRow: arr, gainedScore, mergedIndices }
  }

  const checkGameOver = (b: Board): boolean => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (b[r][c] === 0) return false
        if (c < size - 1 && b[r][c] === b[r][c + 1]) return false
        if (r < size - 1 && b[r][c] === b[r + 1][c]) return false
      }
    }
    return true
  }

  const handleUndo = () => {
    if (undoCount <= 0 || history.length === 0 || gameOver) return
    sound.playClick()
    const lastState = history[history.length - 1]
    setBoard(lastState.board)
    setScore(lastState.score)
    setHistory((prev) => prev.slice(0, prev.length - 1))
    setUndoCount((u) => u - 1)
  }

  const move = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameOver) return

      let gained = 0
      let changed = false
      let didMerge = false
      const newMerged = new Set<string>()

      let newBoard: Board = board.map((r) => [...r])

      if (dir === 'LEFT') {
        for (let r = 0; r < size; r++) {
          const { newRow, gainedScore, mergedIndices } = slideRow(newBoard[r])
          if (newRow.some((val, idx) => val !== newBoard[r][idx])) changed = true
          if (mergedIndices.length > 0) didMerge = true
          mergedIndices.forEach((c) => newMerged.add(`${r}-${c}`))
          newBoard[r] = newRow
          gained += gainedScore
        }
      } else if (dir === 'RIGHT') {
        for (let r = 0; r < size; r++) {
          const reversed = [...newBoard[r]].reverse()
          const { newRow, gainedScore, mergedIndices } = slideRow(reversed)
          const finalRow = newRow.reverse()
          if (finalRow.some((val, idx) => val !== newBoard[r][idx])) changed = true
          if (mergedIndices.length > 0) didMerge = true
          mergedIndices.forEach((revIdx) => newMerged.add(`${r}-${size - 1 - revIdx}`))
          newBoard[r] = finalRow
          gained += gainedScore
        }
      } else if (dir === 'UP') {
        for (let c = 0; c < size; c++) {
          const col = Array.from({ length: size }, (_, r) => newBoard[r][c])
          const { newRow, gainedScore, mergedIndices } = slideRow(col)
          if (newRow.some((val, idx) => val !== col[idx])) changed = true
          if (mergedIndices.length > 0) didMerge = true
          mergedIndices.forEach((r) => newMerged.add(`${r}-${c}`))
          for (let r = 0; r < size; r++) newBoard[r][c] = newRow[r]
          gained += gainedScore
        }
      } else if (dir === 'DOWN') {
        for (let c = 0; c < size; c++) {
          const col = Array.from({ length: size }, (_, r) => newBoard[r][c]).reverse()
          const { newRow, gainedScore, mergedIndices } = slideRow(col)
          const finalCol = newRow.reverse()
          if (finalCol.some((val, idx) => val !== newBoard[idx][c])) changed = true
          if (mergedIndices.length > 0) didMerge = true
          mergedIndices.forEach((revIdx) => newMerged.add(`${size - 1 - revIdx}-${c}`))
          for (let r = 0; r < size; r++) newBoard[r][c] = finalCol[r]
          gained += gainedScore
        }
      }

      if (changed) {
        // Save history snapshot for Undo
        setHistory((prev) => [...prev.slice(-4), { board: board.map((r) => [...r]), score }])

        sound.playBounce()
        if (didMerge) {
          sound.playCoin()
          setMergedCoords(newMerged)
          setTimeout(() => setMergedCoords(new Set()), 200)
        }

        addRandomTile(newBoard, size)
        const nextScore = score + gained
        setScore(nextScore)
        setBoard(newBoard)

        if (nextScore > bestScore) {
          setBestScore(nextScore)
          localStorage.setItem('naghanish_2048_best', String(nextScore))
        }

        // Win check (Reached 2048)
        if (!hasWon) {
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              if (newBoard[r][c] === 2048) {
                setHasWon(true)
                sound.playWin()
                break
              }
            }
          }
        }

        // Game Over check
        if (checkGameOver(newBoard)) {
          setGameOver(true)
          sound.playGameOver()
          onFinish(nextScore)
        }
      }
    },
    [board, score, bestScore, gameOver, hasWon, size, undoCount, history, onFinish]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault()
        move('UP')
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault()
        move('DOWN')
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault()
        move('LEFT')
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault()
        move('RIGHT')
      } else if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleUndo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move, handleUndo])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        if (deltaX > 0) move('RIGHT')
        else move('LEFT')
      } else {
        if (deltaY > 0) move('DOWN')
        else move('UP')
      }
    }
    touchStartRef.current = null
  }

  const handleRestart = () => {
    sound.playClick()
    const newB = getInitialBoard(size)
    setBoard(newB)
    setScore(0)
    setUndoCount(3)
    setHistory([])
    setGameOver(false)
    setHasWon(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Score & Best */}
        <div className="flex items-center gap-2">
          <div className="bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>

          <div className="bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {isRtl ? 'الأفضل' : 'Best'}
            </span>
            <span className="text-sm font-black text-amber-300 leading-none">{bestScore}</span>
          </div>
        </div>

        {/* Undo Button & Grid Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoCount <= 0 || history.length === 0 || gameOver}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 active:scale-95 text-purple-300 text-xs font-bold transition-all disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>
              {isRtl ? 'تراجع' : 'Undo'} ({undoCount})
            </span>
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-brand-darkBg/90 border border-brand-purple/40 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2048 Grid Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative p-3 rounded-3xl bg-slate-950/90 border-2 border-brand-purple/40 shadow-[0_0_30px_rgba(168,85,247,0.2)] touch-none grid gap-2.5 ${
          size === 5 ? 'grid-cols-5' : 'grid-cols-4'
        }`}
        style={{ width: 340, height: 340 }}
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const isMerged = mergedCoords.has(`${r}-${c}`)
            const tileStyle = TILE_COLORS[val] || {
              bg: 'bg-slate-900/60',
              text: 'text-slate-500',
              shadow: 'shadow-none',
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`rounded-2xl flex items-center justify-center font-black transition-all duration-150 relative overflow-hidden ${
                  val === 0
                    ? 'bg-brand-card/40 border border-white/5 text-transparent'
                    : `bg-gradient-to-br ${tileStyle.bg} ${tileStyle.text} ${tileStyle.shadow} border border-white/20`
                } ${isMerged ? 'scale-110 ring-2 ring-white z-10' : 'scale-100'}`}
                style={{
                  fontSize: size === 5 ? (val > 512 ? 13 : 16) : val > 512 ? 16 : 22,
                }}
              >
                {val > 0 && <span>{val}</span>}
              </div>
            )
          })
        )}

        {/* Victory Banner */}
        {hasWon && !gameOver && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 px-4 py-1 rounded-full text-xs font-black shadow-lg animate-bounce z-20">
            🎉 REACHED 2048! KEEP GOING!
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center z-30 animate-in fade-in zoom-in duration-200">
            <span className="text-4xl">🔢💥</span>
            <h3 className="text-2xl font-black text-rose-400">
              {isRtl ? 'لا توجد حركات أخرى!' : 'NO MORE MOVES'}
            </h3>
            <p className="text-sm font-bold text-slate-200">
              {isRtl ? 'النقاط:' : 'Final Score:'}{' '}
              <span className="text-cyan-400 text-lg font-black">{score}</span>
            </p>
            <Button variant="primary" onClick={handleRestart} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'العب مجدداً' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tactile D-pad for Mobile */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={() => move('UP')}
          disabled={gameOver}
          className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer disabled:opacity-30"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => move('LEFT')}
            disabled={gameOver}
            className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer disabled:opacity-30"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('RIGHT')}
            disabled={gameOver}
            className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer disabled:opacity-30"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => move('DOWN')}
          disabled={gameOver}
          className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer disabled:opacity-30"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اسحب بالأصبع في أي اتجاه أو بالأسهم (← / ↑ / → / ↓) وزر التراجع لإنقاذك'
          : 'Controls: Swipe any direction or use Arrow keys (Ctrl+Z to Undo)'}
      </div>
    </div>
  )
}

