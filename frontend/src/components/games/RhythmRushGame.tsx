/**
 * RhythmRushGame.tsx
 *
 * Cyber Rhythm Rush (نبض النيون الموسيقي)
 * 4-Lane rhythm and reflexes game built with HTML5 Canvas 2D.
 * Features:
 * - 4 Neon lanes with synchronized descending rhythm notes.
 * - Millisecond-precision timing: Perfect (300pts), Great (200pts), Good (100pts), Miss (0pts + broken streak).
 * - Multi-tiered combo streaks (x2 at 10, x4 at 25, x8 at 50) with fanfare SFX.
 * - Dynamic lane beam flashes, streak fire, floating rating popups, and pulsing cyber background.
 * - Web Audio API synthesizer chimes (C4, E4, G4, C5) per lane.
 * - Keyboard (D, F, J, K) and touch tap buttons.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Zap, Sparkles, Flame } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface RhythmRushProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface RhythmNote {
  id: number
  lane: number // 0, 1, 2, 3
  y: number
  color: string
  hit: boolean
}

interface RatingPopup {
  text: string
  color: string
  y: number
  alpha: number
}

const CANVAS_WIDTH = 340
const CANVAS_HEIGHT = 420
const HIT_ZONE_Y = 350
const HIT_ZONE_H = 36
const LANE_WIDTH = CANVAS_WIDTH / 4

const LANE_COLORS = [
  '#06b6d4', // Lane 1: Cyan
  '#a855f7', // Lane 2: Purple
  '#f43f5e', // Lane 3: Pink
  '#10b981', // Lane 4: Green
]

const KEY_LABELS = ['D', 'F', 'J', 'K']

export const RhythmRushGame: React.FC<RhythmRushProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React HUD states
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [misses, setMisses] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // 60fps Game Engine Refs
  const notesRef = useRef<RhythmNote[]>([])
  const noteIdCounter = useRef<number>(0)
  const spawnTimerRef = useRef<number>(0)
  const laneFlashesRef = useRef<number[]>([0, 0, 0, 0])
  const ratingPopupsRef = useRef<RatingPopup[]>([])
  const streakRef = useRef<number>(0)
  const scoreRef = useRef<number>(0)
  const missesRef = useRef<number>(0)
  const isGameOverRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)

  // Difficulty parameters
  const noteSpeed = difficulty === 'Easy' ? 4.2 : difficulty === 'Hard' ? 6.5 : 5.2
  const spawnInterval = difficulty === 'Easy' ? 42 : difficulty === 'Hard' ? 24 : 32
  const maxMisses = 8

  // Play audio note based on lane
  const playLaneNote = (lane: number) => {
    // Distinct melodic notes per lane
    const freqs = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freqs[lane], ctx.currentTime)
        gain.gain.setValueAtTime(0.18, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.16)
      }
    } catch {
      // Fallback
    }
  }

  // Handle Note Hit on a lane
  const handleLanePress = useCallback((lane: number) => {
    if (isGameOverRef.current || !hasStarted) return

    laneFlashesRef.current[lane] = 1.0
    playLaneNote(lane)

    // Find nearest unhit note in this lane
    const unhitNotes = notesRef.current.filter((n) => n.lane === lane && !n.hit)
    if (unhitNotes.length === 0) return

    // Find note closest to HIT_ZONE_Y
    let closestNote: RhythmNote | null = null
    let minDistance = 999

    for (const note of unhitNotes) {
      const dist = Math.abs(note.y - (HIT_ZONE_Y + HIT_ZONE_H / 2))
      if (dist < minDistance) {
        minDistance = dist
        closestNote = note
      }
    }

    if (closestNote && minDistance < 65) {
      closestNote.hit = true

      // Accuracy judgment
      let rating = ''
      let ratingColor = ''
      let points = 0

      if (minDistance <= 18) {
        rating = 'PERFECT!'
        ratingColor = '#38bdf8'
        points = 300
        sound.playPerfectHit()
      } else if (minDistance <= 38) {
        rating = 'GREAT!'
        ratingColor = '#10b981'
        points = 200
        sound.playClick()
      } else {
        rating = 'GOOD'
        ratingColor = '#f59e0b'
        points = 100
        sound.playClick()
      }

      // Update streak and combo
      streakRef.current++
      setStreak(streakRef.current)

      let curMult = 1
      if (streakRef.current >= 50) {
        curMult = 8
        if (streakRef.current === 50) sound.playComboX8()
      } else if (streakRef.current >= 25) {
        curMult = 4
        if (streakRef.current === 25) sound.playComboX4()
      } else if (streakRef.current >= 10) {
        curMult = 2
        if (streakRef.current === 10) sound.playComboX2()
      }
      setMultiplier(curMult)

      scoreRef.current += points * curMult
      setScore(scoreRef.current)

      // Add popup
      ratingPopupsRef.current.push({
        text: rating,
        color: ratingColor,
        y: HIT_ZONE_Y - 20,
        alpha: 1.0,
      })
    }
  }, [hasStarted])

  // Start / Reset Game
  const resetGame = useCallback(() => {
    notesRef.current = []
    ratingPopupsRef.current = []
    laneFlashesRef.current = [0, 0, 0, 0]
    spawnTimerRef.current = 0
    scoreRef.current = 0
    streakRef.current = 0
    missesRef.current = 0
    isGameOverRef.current = false

    setScore(0)
    setStreak(0)
    setMultiplier(1)
    setMisses(0)
    setIsGameOver(false)
    setIsPlaying(true)
    setHasStarted(true)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toUpperCase()

      if (key === 'D' || key === '1') handleLanePress(0)
      else if (key === 'F' || key === '2') handleLanePress(1)
      else if (key === 'J' || key === '3') handleLanePress(2)
      else if (key === 'K' || key === '4') handleLanePress(3)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleLanePress])

  // Main 60fps Canvas Loop
  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      // 1. Note Spawner
      if (!isGameOverRef.current) {
        spawnTimerRef.current++
        if (spawnTimerRef.current >= spawnInterval) {
          spawnTimerRef.current = 0
          const lane = Math.floor(Math.random() * 4)
          notesRef.current.push({
            id: noteIdCounter.current++,
            lane,
            y: -20,
            color: LANE_COLORS[lane],
            hit: false,
          })

          // 12% chance for simultaneous double note
          if (Math.random() < 0.12) {
            const secondLane = (lane + Math.floor(Math.random() * 3) + 1) % 4
            notesRef.current.push({
              id: noteIdCounter.current++,
              lane: secondLane,
              y: -20,
              color: LANE_COLORS[secondLane],
              hit: false,
            })
          }
        }
      }

      // 2. Update Notes
      const nextNotes: RhythmNote[] = []
      for (const n of notesRef.current) {
        n.y += noteSpeed

        // Check if note passed hit zone without being hit (Miss)
        if (!n.hit && n.y > HIT_ZONE_Y + HIT_ZONE_H + 20) {
          n.hit = true
          streakRef.current = 0
          setStreak(0)
          setMultiplier(1)

          missesRef.current++
          setMisses(missesRef.current)
          sound.playMiss()

          ratingPopupsRef.current.push({
            text: 'MISS',
            color: '#f43f5e',
            y: HIT_ZONE_Y - 20,
            alpha: 1.0,
          })

          if (missesRef.current >= maxMisses) {
            isGameOverRef.current = true
            setIsGameOver(true)
            setIsPlaying(false)
            sound.playGameOver()
            onFinish(scoreRef.current)
            return
          }
        }

        if (n.y < CANVAS_HEIGHT + 30 && !n.hit) {
          nextNotes.push(n)
        }
      }
      notesRef.current = nextNotes

      // 3. Update Popups
      ratingPopupsRef.current.forEach((pop) => {
        pop.y -= 1.2
        pop.alpha -= 0.03
      })
      ratingPopupsRef.current = ratingPopupsRef.current.filter((p) => p.alpha > 0)

      // 4. Update Lane Flashes
      for (let i = 0; i < 4; i++) {
        if (laneFlashesRef.current[i] > 0) {
          laneFlashesRef.current[i] -= 0.08
          if (laneFlashesRef.current[i] < 0) laneFlashesRef.current[i] = 0
        }
      }

      // ──────────────── DRAW PHASE ────────────────
      // Clear
      ctx.fillStyle = '#060714'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw 4 Lanes
      for (let i = 0; i < 4; i++) {
        const lx = i * LANE_WIDTH

        // Lane flash beam
        if (laneFlashesRef.current[i] > 0) {
          const flashGrad = ctx.createLinearGradient(lx, 0, lx, CANVAS_HEIGHT)
          flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
          flashGrad.addColorStop(
            1,
            `${LANE_COLORS[i]}${Math.floor(laneFlashesRef.current[i] * 120).toString(16).padStart(2, '0')}`
          )
          ctx.fillStyle = flashGrad
          ctx.fillRect(lx, 0, LANE_WIDTH, CANVAS_HEIGHT)
        }

        // Lane Divider lines
        if (i > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(lx, 0)
          ctx.lineTo(lx, CANVAS_HEIGHT)
          ctx.stroke()
        }
      }

      // Draw Hit Zone
      ctx.save()
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
      ctx.fillRect(0, HIT_ZONE_Y, CANVAS_WIDTH, HIT_ZONE_H)

      // Hit Zone Border & Target Rings
      ctx.strokeStyle = streakRef.current >= 15 ? '#fbbf24' : 'rgba(56, 189, 248, 0.5)'
      ctx.lineWidth = 2
      ctx.strokeRect(0, HIT_ZONE_Y, CANVAS_WIDTH, HIT_ZONE_H)

      for (let i = 0; i < 4; i++) {
        const cx = i * LANE_WIDTH + LANE_WIDTH / 2
        const cy = HIT_ZONE_Y + HIT_ZONE_H / 2

        ctx.beginPath()
        ctx.arc(cx, cy, 14, 0, Math.PI * 2)
        ctx.strokeStyle = LANE_COLORS[i]
        ctx.lineWidth = 2
        ctx.shadowColor = LANE_COLORS[i]
        ctx.shadowBlur = 8
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      ctx.restore()

      // Draw Notes
      notesRef.current.forEach((note) => {
        const nx = note.lane * LANE_WIDTH + 8
        const nw = LANE_WIDTH - 16
        const nh = 16

        ctx.save()
        // Note Body
        ctx.fillStyle = note.color
        ctx.shadowColor = note.color
        ctx.shadowBlur = 14
        ctx.beginPath()
        ctx.roundRect(nx, note.y - nh / 2, nw, nh, 8)
        ctx.fill()
        ctx.shadowBlur = 0

        // White core reflection
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(nx + 4, note.y - 2, nw - 8, 4, 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw Rating Popups
      ratingPopupsRef.current.forEach((pop) => {
        ctx.save()
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = pop.color
        ctx.globalAlpha = pop.alpha
        ctx.shadowColor = pop.color
        ctx.shadowBlur = 10
        ctx.fillText(pop.text, CANVAS_WIDTH / 2, pop.y)
        ctx.restore()
      })

      if (!isGameOverRef.current) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [isPlaying, noteSpeed, spawnInterval, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Score */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>
        </div>

        {/* Streak & Multiplier */}
        <div className="flex items-center gap-2">
          {streak >= 10 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2 py-1 rounded-xl text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak} STREAK!</span>
            </div>
          )}
          {multiplier > 1 && (
            <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-400/60 px-2 py-1 rounded-xl text-purple-300 text-xs font-black animate-bounce">
              <Zap className="w-3.5 h-3.5" />
              <span>x{multiplier}</span>
            </div>
          )}
        </div>

        {/* Misses */}
        <div className="flex items-center gap-1 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-400">
          <span>❌</span>
          <span>
            {misses}/{maxMisses}
          </span>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full aspect-[340/420] max-h-[420px] rounded-3xl overflow-hidden border-2 border-pink-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)] bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full block touch-none"
        />

        {/* Pre-Game Start Screen */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#f43f5e] animate-bounce">
              🎵
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'نبض النيون الموسيقي' : 'Cyber Rhythm Rush'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'اضغط النوتات الساقطة على المسارات الأربعة بتوقيت مثالي وحافظ على الستريك!'
                  : 'Hit falling rhythm notes on 4 neon lanes with precise timing!'}
              </p>
            </div>
            <Button variant="glow" onClick={resetGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'ابدأ الإيقاع 🎵' : 'Start Rush 🎵'}
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl">🎵💔</div>
            <div>
              <h3 className="text-2xl font-black text-rose-400">
                {isRtl ? 'انقطع الإيقاع!' : 'SONG FINISHED'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'النتيجة النهائية:' : 'Final Score:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{score}</span>
              </p>
            </div>
            <Button variant="glow" onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tactile 4-Lane Tap Buttons for Mobile */}
      <div className="grid grid-cols-4 gap-2 w-full px-2">
        {KEY_LABELS.map((k, idx) => (
          <button
            key={idx}
            onClick={() => handleLanePress(idx)}
            disabled={!hasStarted || isGameOver}
            className="h-14 rounded-2xl border-2 active:scale-90 flex flex-col items-center justify-center font-black text-sm transition-all shadow-md active:shadow-none cursor-pointer disabled:opacity-30"
            style={{
              borderColor: LANE_COLORS[idx],
              backgroundColor: `${LANE_COLORS[idx]}18`,
              color: LANE_COLORS[idx],
            }}
          >
            <span>{k}</span>
            <Sparkles className="w-3 h-3 opacity-60" />
          </button>
        ))}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'التحكم: اضغط مفاتيح (D, F, J, K) أو انقر أزرار المسارات في التوقيت المثالي'
          : 'Controls: Press (D, F, J, K) or tap lane buttons at the exact moment'}
      </div>
    </div>
  )
}
