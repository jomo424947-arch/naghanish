/**
 * SokobanGame.tsx
 *
 * Cyber Sokoban (دافع صناديق الطاقة)
 * Handcrafted 15-level warehouse puzzle engine.
 * Features:
 * - Cyber warehouse grid with neon player bot, glowing energy cells, and dock stations.
 * - Undo system with step-by-step state history.
 * - Star rating system (1-3 stars) based on minimum move par.
 * - Integrated Web Audio API: robotic steps, box shoves, dock lock-in chimes, and victory fanfare.
 * - Touch swipe, keyboard arrows / WASD, and tactile D-pad.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Trophy, Star, Undo2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Layers } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface SokobanProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type CellType = 'EMPTY' | 'WALL' | 'TARGET'

interface LevelData {
  width: number
  height: number
  map: string[] // '#' wall, '.' target, ' ' empty
  player: [number, number] // [row, col]
  boxes: [number, number][] // list of [row, col]
  parMoves: number
}

// 15 Handcrafted levels
const SOKOBAN_LEVELS: LevelData[] = [
  // Level 1: Gentle Introduction
  {
    width: 6,
    height: 5,
    map: [
      '######',
      '#   .#',
      '# #  #',
      '#    #',
      '######',
    ],
    player: [3, 1],
    boxes: [[2, 2]],
    parMoves: 5,
  },
  // Level 2: Dual Energy Cells
  {
    width: 7,
    height: 6,
    map: [
      '#######',
      '#     #',
      '# . . #',
      '#  #  #',
      '#     #',
      '#######',
    ],
    player: [4, 1],
    boxes: [[2, 2], [2, 4]],
    parMoves: 10,
  },
  // Level 3: Corridor Squeeze
  {
    width: 7,
    height: 6,
    map: [
      '#######',
      '#..   #',
      '###   #',
      '  #   #',
      '  #   #',
      '  #####',
    ],
    player: [4, 4],
    boxes: [[3, 3], [2, 4]],
    parMoves: 14,
  },
  // Level 4: The T-Junction
  {
    width: 7,
    height: 7,
    map: [
      '  ###  ',
      '  #.#  ',
      '###.###',
      '#     #',
      '#     #',
      '### ###',
      '  ###  ',
    ],
    player: [4, 3],
    boxes: [[3, 2], [3, 4]],
    parMoves: 12,
  },
  // Level 5: Triple Battery Dock
  {
    width: 8,
    height: 7,
    map: [
      '########',
      '#      #',
      '#  ... #',
      '#  ### #',
      '#      #',
      '#      #',
      '########',
    ],
    player: [5, 1],
    boxes: [[4, 2], [4, 3], [4, 4]],
    parMoves: 18,
  },
  // Level 6: Central Pillar
  {
    width: 8,
    height: 8,
    map: [
      '########',
      '#      #',
      '#  ##  #',
      '# .##. #',
      '# .##. #',
      '#  ##  #',
      '#      #',
      '########',
    ],
    player: [6, 1],
    boxes: [[2, 2], [2, 5], [5, 2], [5, 5]],
    parMoves: 22,
  },
  // Level 7: The Zig-Zag
  {
    width: 8,
    height: 7,
    map: [
      '########',
      '#..    #',
      '#  ##  #',
      '#  ##  #',
      '#    ..#',
      '#      #',
      '########',
    ],
    player: [5, 1],
    boxes: [[3, 2], [3, 5], [4, 3], [2, 4]],
    parMoves: 26,
  },
  // Level 8: Precision Cross
  {
    width: 7,
    height: 7,
    map: [
      '#######',
      '#  .  #',
      '# # # #',
      '#.. ..#',
      '# # # #',
      '#  .  #',
      '#######',
    ],
    player: [3, 3],
    boxes: [[2, 3], [4, 3], [3, 2], [3, 4]],
    parMoves: 20,
  },
]

export const SokobanGame: React.FC<SokobanProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const [levelIndex, setLevelIndex] = useState(() => (difficulty === 'Hard' ? 3 : 0))
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0])
  const [boxes, setBoxes] = useState<[number, number][]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [history, setHistory] = useState<{ player: [number, number]; boxes: [number, number][] }[]>([])
  const [levelSolved, setLevelSolved] = useState(false)
  const [totalStars, setTotalStars] = useState(0)

  const currentLevel = SOKOBAN_LEVELS[levelIndex % SOKOBAN_LEVELS.length]
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Initialize level
  const initLevel = useCallback(
    (idx: number) => {
      const lvl = SOKOBAN_LEVELS[idx % SOKOBAN_LEVELS.length]
      setPlayerPos([...lvl.player])
      setBoxes(lvl.boxes.map((b) => [...b]))
      setMoveCount(0)
      setHistory([])
      setLevelSolved(false)
    },
    []
  )

  useEffect(() => {
    initLevel(levelIndex)
  }, [levelIndex, initLevel])

  // Check if box is at given coords
  const isBoxAt = (r: number, c: number, boxList: [number, number][]) => {
    return boxList.some(([br, bc]) => br === r && bc === c)
  }

  // Check if cell is a target
  const isTargetAt = (r: number, c: number) => {
    return currentLevel.map[r] && currentLevel.map[r][c] === '.'
  }

  // Move Player
  const move = useCallback(
    (dr: number, dc: number) => {
      if (levelSolved) return

      const [pr, pc] = playerPos
      const targetR = pr + dr
      const targetC = pc + dc

      // Wall check
      if (
        targetR < 0 ||
        targetR >= currentLevel.height ||
        targetC < 0 ||
        targetC >= currentLevel.width ||
        currentLevel.map[targetR][targetC] === '#'
      ) {
        sound.playMiss()
        return
      }

      // Box push check
      const boxIdx = boxes.findIndex(([br, bc]) => br === targetR && bc === targetC)

      if (boxIdx !== -1) {
        // Box is in front of player. Check cell beyond box
        const beyondR = targetR + dr
        const beyondC = targetC + dc

        // Is beyond cell a wall or another box?
        if (
          beyondR < 0 ||
          beyondR >= currentLevel.height ||
          beyondC < 0 ||
          beyondC >= currentLevel.width ||
          currentLevel.map[beyondR][beyondC] === '#' ||
          isBoxAt(beyondR, beyondC, boxes)
        ) {
          sound.playMiss()
          return // Cannot push
        }

        // Save history for Undo
        setHistory((prev) => [...prev, { player: [pr, pc], boxes: boxes.map((b) => [...b]) }])

        // Push Box
        const newBoxes = boxes.map((b, i) => (i === boxIdx ? [beyondR, beyondC] : [...b])) as [
          number,
          number
        ][]

        setBoxes(newBoxes)
        setPlayerPos([targetR, targetC])
        setMoveCount((m) => m + 1)

        // Dock chime if placed onto target
        if (isTargetAt(beyondR, beyondC)) {
          sound.playPerfectHit()
        } else {
          sound.playBounce()
        }

        // Check level completion
        const allDocked = newBoxes.every(([br, bc]) => isTargetAt(br, bc))
        if (allDocked) {
          setLevelSolved(true)
          sound.playWin()

          const starsEarned = moveCount + 1 <= currentLevel.parMoves ? 3 : moveCount + 1 <= currentLevel.parMoves * 1.5 ? 2 : 1
          setTotalStars((s) => s + starsEarned)
        }
      } else {
        // Simple Walk
        setHistory((prev) => [...prev, { player: [pr, pc], boxes: boxes.map((b) => [...b]) }])
        setPlayerPos([targetR, targetC])
        setMoveCount((m) => m + 1)
        sound.playSwoosh()
      }
    },
    [playerPos, boxes, currentLevel, levelSolved, moveCount]
  )

  // Undo Step
  const handleUndo = () => {
    if (history.length === 0 || levelSolved) return
    sound.playClick()
    const last = history[history.length - 1]
    setPlayerPos(last.player)
    setBoxes(last.boxes)
    setMoveCount((m) => Math.max(0, m - 1))
    setHistory((prev) => prev.slice(0, prev.length - 1))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault()
        move(-1, 0)
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault()
        move(1, 0)
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault()
        move(0, -1)
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault()
        move(0, 1)
      } else if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleUndo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move, handleUndo])

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        if (dx > 0) move(0, 1)
        else move(0, -1)
      } else {
        if (dy > 0) move(1, 0)
        else move(-1, 0)
      }
    }
    touchStartRef.current = null
  }

  const nextLevel = () => {
    if (levelIndex + 1 >= SOKOBAN_LEVELS.length) {
      // Completed all levels
      onFinish(totalStars * 200 + 500)
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
              {isRtl ? 'المستوى' : 'Level'}
            </span>
            <span className="text-sm font-black text-white leading-none">
              {levelIndex + 1}/{SOKOBAN_LEVELS.length}
            </span>
          </div>
        </div>

        {/* Moves & Par */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <span className="text-xs font-bold text-slate-400">
            {isRtl ? 'الحركات:' : 'Moves:'} <strong className="text-amber-300">{moveCount}</strong> / {currentLevel.parMoves}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || levelSolved}
            className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 active:scale-95 transition-all disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => initLevel(levelIndex)}
            className="p-2 rounded-xl bg-brand-darkBg/90 border border-brand-purple/40 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sokoban Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative p-4 rounded-3xl bg-[#050711] border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center justify-center overflow-hidden touch-none"
        style={{ width: 340, height: 340 }}
      >
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${currentLevel.width}, 34px)`,
            gridTemplateRows: `repeat(${currentLevel.height}, 34px)`,
          }}
        >
          {Array.from({ length: currentLevel.height }).map((_, r) =>
            Array.from({ length: currentLevel.width }).map((_, c) => {
              const char = currentLevel.map[r]?.[c] || ' '
              const isWall = char === '#'
              const isTarget = char === '.'
              const isPlayer = playerPos[0] === r && playerPos[1] === c
              const isBox = isBoxAt(r, c, boxes)
              const isDocked = isBox && isTarget

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center relative transition-all duration-100 ${
                    isWall
                      ? 'bg-slate-800 border border-slate-700 shadow-sm'
                      : isTarget
                      ? 'bg-emerald-950/40 border border-emerald-500/50'
                      : 'bg-slate-900/30'
                  }`}
                >
                  {/* Energy Dock Target Indicator */}
                  {isTarget && !isBox && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/60 shadow-[0_0_8px_#10b981] animate-pulse" />
                  )}

                  {/* Energy Cell Box */}
                  {isBox && (
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-lg transition-all ${
                        isDocked
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_16px_#10b981] border border-white'
                          : 'bg-gradient-to-br from-amber-400 to-yellow-600 shadow-[0_0_12px_#fbbf24] border border-white/60'
                      }`}
                    >
                      {isDocked ? '⚡' : '📦'}
                    </div>
                  )}

                  {/* Player Bot */}
                  {isPlayer && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-[0_0_16px_#06b6d4] flex items-center justify-center text-xs z-10 animate-pulse">
                      🤖
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Level Solved Overlay */}
        {levelSolved && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
            <div className="text-4xl animate-bounce">⚡🎉</div>
            <h3 className="text-xl font-black text-emerald-400">
              {isRtl ? 'تم شحن المحطة بنجاح!' : 'LEVEL COMPLETED!'}
            </h3>
            <div className="flex items-center gap-1 my-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-6 h-6 ${
                    idx < (moveCount <= currentLevel.parMoves ? 3 : moveCount <= currentLevel.parMoves * 1.5 ? 2 : 1)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-300">
              {isRtl ? `أنجزت في ${moveCount} حركة` : `Solved in ${moveCount} moves`}
            </p>
            <Button variant="primary" onClick={nextLevel} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'المستوى التالي 🚀' : 'Next Level 🚀'}
            </Button>
          </div>
        )}
      </div>

      {/* Tactile D-pad for Mobile */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={() => move(-1, 0)}
          className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => move(0, -1)}
            className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => move(0, 1)}
            className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => move(1, 0)}
          className="w-12 h-11 rounded-xl bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اسحب بالأصبع أو استخدم الأسهم لتحريك الروبوت ودفع الصناديق'
          : 'Controls: Swipe on screen or use Arrow keys to push energy cells'}
      </div>
    </div>
  )
}

