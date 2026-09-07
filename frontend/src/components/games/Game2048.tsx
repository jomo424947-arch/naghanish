/**
 * Game2048.tsx
 *
 * Neon-themed 2048 sliding block puzzle game.
 * Supports keyboard arrows, touch swipe gestures, and difficulty variations.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

interface Game2048Props {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type Board = number[][]

const SIZE = 4

const TILE_COLORS: Record<number, { bg: string; text: string; shadow: string }> = {
  2: { bg: 'from-slate-800 to-slate-900', text: 'text-slate-200', shadow: 'shadow-none' },
  4: { bg: 'from-blue-900 to-indigo-950', text: 'text-cyan-300', shadow: 'shadow-none' },
  8: { bg: 'from-cyan-700 to-blue-800', text: 'text-white', shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]' },
  16: { bg: 'from-teal-600 to-emerald-700', text: 'text-white', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  32: { bg: 'from-amber-600 to-orange-700', text: 'text-white', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  64: { bg: 'from-rose-600 to-red-700', text: 'text-white', shadow: 'shadow-[0_0_18px_rgba(244,63,94,0.6)]' },
  128: { bg: 'from-fuchsia-600 to-purple-800', text: 'text-white', shadow: 'shadow-[0_0_20px_rgba(217,70,239,0.6)]' },
  256: { bg: 'from-purple-600 to-indigo-900', text: 'text-yellow-200', shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.7)]' },
  512: { bg: 'from-yellow-500 to-amber-700', text: 'text-white', shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.8)]' },
  1024: { bg: 'from-emerald-500 to-cyan-700', text: 'text-white', shadow: 'shadow-[0_0_35px_rgba(16,185,129,0.9)]' },
  2048: { bg: 'from-amber-400 via-pink-500 to-purple-600', text: 'text-white', shadow: 'shadow-[0_0_40px_rgba(245,158,11,1)]' },
}

export const Game2048: React.FC<Game2048Props> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const [board, setBoard] = useState<Board>(() => getInitialBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('naghanish_2048_best') || '0', 10)
  })
  const [gameOver, setGameOver] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  function getInitialBoard(): Board {
    const b: Board = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0))
    addRandomTile(b)
    addRandomTile(b)
    if (difficulty === 'Easy') {
      addRandomTile(b)
    }
    return b
  }

  function addRandomTile(b: Board): boolean {
    const emptyCells: { r: number; c: number }[] = []
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c })
      }
    }
    if (emptyCells.length === 0) return false
    const rand = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const isFour = difficulty === 'Hard' ? Math.random() < 0.3 : Math.random() < 0.1
    b[rand.r][rand.c] = isFour ? 4 : 2
    return true
  }

  const slideRow = (row: number[]): { newRow: number[]; gainedScore: number; merged: boolean } => {
    let arr = row.filter((val) => val !== 0)
    let gainedScore = 0
    let merged = false

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2
        gainedScore += arr[i]
        arr[i + 1] = 0
        merged = true
      }
    }
    arr = arr.filter((val) => val !== 0)
    while (arr.length < SIZE) {
      arr.push(0)
    }
    return { newRow: arr, gainedScore, merged }
  }

  const checkGameOver = (b: Board): boolean => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) return false
        if (c < SIZE - 1 && b[r][c] === b[r][c + 1]) return false
        if (r < SIZE - 1 && b[r][c] === b[r + 1][c]) return false
      }
    }
    return true
  }

  const move = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameOver) return

      let gained = 0
      let changed = false
      let didMerge = false

      let newBoard: Board = board.map((r) => [...r])

      if (dir === 'LEFT') {
        for (let r = 0; r < SIZE; r++) {
          const { newRow, gainedScore, merged } = slideRow(newBoard[r])
          if (newRow.some((val, idx) => val !== newBoard[r][idx])) changed = true
          if (merged) didMerge = true
          newBoard[r] = newRow
          gained += gainedScore
        }
      } else if (dir === 'RIGHT') {
        for (let r = 0; r < SIZE; r++) {
          const reversed = [...newBoard[r]].reverse()
          const { newRow, gainedScore, merged } = slideRow(reversed)
          const finalRow = newRow.reverse()
          if (finalRow.some((val, idx) => val !== newBoard[r][idx])) changed = true
          if (merged) didMerge = true
          newBoard[r] = finalRow
          gained += gainedScore
        }
      } else if (dir === 'UP') {
        for (let c = 0; c < SIZE; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]]
          const { newRow, gainedScore, merged } = slideRow(col)
          if (newRow.some((val, idx) => val !== col[idx])) changed = true
          if (merged) didMerge = true
          for (let r = 0; r < SIZE; r++) newBoard[r][c] = newRow[r]
          gained += gainedScore
        }
      } else if (dir === 'DOWN') {
        for (let c = 0; c < SIZE; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]]
          const { newRow, gainedScore, merged } = slideRow(col)
          const reversed = newRow.reverse()
          if (reversed.some((val, idx) => val !== newBoard[idx][c])) changed = true
          if (merged) didMerge = true
          for (let r = 0; r < SIZE; r++) newBoard[r][c] = reversed[r]
          gained += gainedScore
        }
      }

      if (changed) {
        if (didMerge) {
          sound.playCoin()
        } else {
          sound.playBounce()
        }

        addRandomTile(newBoard)
        const nextScore = score + gained
        setScore(nextScore)
        if (nextScore > bestScore) {
          setBestScore(nextScore)
          localStorage.setItem('naghanish_2048_best', nextScore.toString())
        }
        setBoard(newBoard)

        if (!hasWon && newBoard.some((r) => r.some((v) => v >= 2048))) {
          setHasWon(true)
          sound.playWin()
        }

        if (checkGameOver(newBoard)) {
          setGameOver(true)
          sound.playGameOver()
          onFinish(nextScore)
        }
      }
    },
    [board, gameOver, score, bestScore, hasWon, onFinish]
  )

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
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartRef.current.x
    const dy = t.clientY - touchStartRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) move('RIGHT')
        else move('LEFT')
      } else {
        if (dy > 0) move('DOWN')
        else move('UP')
      }
    }
    touchStartRef.current = null
  }

  const handleReset = () => {
    sound.playClick()
    const nb = getInitialBoard()
    setBoard(nb)
    setScore(0)
    setGameOver(false)
    setHasWon(false)
  }

  return (
    <div
      className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'النقاط' : 'SCORE'}</span>
            <span className="text-lg font-black text-cyan-400 font-mono">{score}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{isRtl ? 'أفضل رقم' : 'BEST'}</span>
            <span className="text-lg font-black text-amber-400 font-mono">{bestScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-brand-purple/20 text-brand-purple border border-brand-purple/40">
            {difficulty === 'Easy' ? (isRtl ? 'سهل' : 'Easy') : difficulty === 'Hard' ? (isRtl ? 'صعب' : 'Hard') : (isRtl ? 'متوسط' : 'Medium')}
          </span>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={isRtl ? 'إعادة اللعبة' : 'Restart'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The 2048 Grid */}
      <div className="relative p-3 rounded-3xl bg-slate-950/80 border-2 border-brand-cardBorder shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-2.5">
          {board.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const tileStyle = TILE_COLORS[val] || {
                bg: 'from-indigo-600 to-fuchsia-600',
                text: 'text-white',
                shadow: 'shadow-[0_0_30px_rgba(255,255,255,0.8)]',
              }
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center font-black transition-all duration-200 ${
                    val === 0
                      ? 'bg-white/[0.04] border border-white/[0.06]'
                      : `bg-gradient-to-br ${tileStyle.bg} ${tileStyle.text} ${tileStyle.shadow} scale-100 animate-in fade-in zoom-in-75`
                  }`}
                >
                  {val > 0 && (
                    <span className={val >= 1024 ? 'text-lg sm:text-xl' : val >= 128 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}>
                      {val}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Overlay if Won / GameOver */}
        {(gameOver || hasWon) && (
          <div className="absolute inset-0 rounded-3xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 text-center animate-in fade-in duration-300">
            <span className="text-4xl">{hasWon ? '🏆' : '💀'}</span>
            <h3 className="text-xl font-black text-white">
              {hasWon ? (isRtl ? 'وصلت لـ 2048 أسطوري!' : 'You Reached 2048!') : (isRtl ? 'انتهت المحاولات!' : 'Game Over!')}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl ? `مجموع نقاطك النهائي: ${score}` : `Your Final Score: ${score}`}
            </p>
            <div className="flex gap-2 mt-2">
              <Button variant="primary" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
                {isRtl ? 'العب من جديد' : 'Try Again'}
              </Button>
              {gameOver && (
                <Button variant="secondary" size="sm" onClick={() => onFinish(score)}>
                  {isRtl ? 'تسجيل النتيجة' : 'Submit'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* D-Pad Controller for Mobile & Touch */}
      <div className="flex flex-col items-center gap-2 mt-1">
        <button
          onClick={() => move('UP')}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-md"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => move('LEFT')}
            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('RIGHT')}
            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-md"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => move('DOWN')}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-md"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
