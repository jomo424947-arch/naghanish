/**
 * AimTrainerGame.tsx
 *
 * CQB Target Reflex (قناص الأهداف السريع)
 * Precision aim trainer and reaction benchmark built with HTML5 Canvas 2D.
 * Features:
 * - 30 Rapid pop-up neon targets measuring sub-millisecond reaction times.
 * - Dynamic accuracy percentage and average reaction time (ms) tracking.
 * - Expanding hit ripples (green on hit, red on miss) and particle sparkles.
 * - Integrated Web Audio API: chime on sub-250ms hits, click on hits, buzz on misses, fanfare on victory.
 * - Touch & Mouse responsive crosshairs.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Target, Crosshair, Clock, Percent } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface AimTrainerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface TargetCircle {
  x: number
  y: number
  radius: number
  spawnTime: number
  maxDuration: number
  color: string
}

interface Ripple {
  x: number
  y: number
  radius: number
  color: string
  alpha: number
}

const TOTAL_TARGETS = 30
const CANVAS_WIDTH = 340
const CANVAS_HEIGHT = 360

export const AimTrainerGame: React.FC<AimTrainerProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React HUD states
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [avgReactionTime, setAvgReactionTime] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState(100)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE')

  // 60fps Game Engine Refs
  const targetRef = useRef<TargetCircle | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const reactionTimesRef = useRef<number[]>([])
  const hitsRef = useRef<number>(0)
  const totalClicksRef = useRef<number>(0)
  const targetsSpawnedRef = useRef<number>(0)
  const isPlayingRef = useRef<boolean>(false)
  const animFrameIdRef = useRef<number | null>(null)

  // Difficulty parameters
  const targetLife = difficulty === 'Easy' ? 2000 : difficulty === 'Hard' ? 800 : 1200
  const targetRadius = difficulty === 'Easy' ? 30 : difficulty === 'Hard' ? 18 : 24

  // Spawn Next Target
  const spawnNextTarget = useCallback(() => {
    if (targetsSpawnedRef.current >= TOTAL_TARGETS) {
      // Game Complete!
      isPlayingRef.current = false
      setGameState('FINISHED')

      const hitCount = hitsRef.current
      const totalClicks = Math.max(1, totalClicksRef.current)
      const acc = Math.round((hitCount / totalClicks) * 100)
      const times = reactionTimesRef.current
      const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 500

      // Final Score formula: Accuracy% * (1000 / avgReactionTime) * 100
      const finalScore = Math.max(100, Math.round(acc * (1000 / Math.max(150, avg)) * 20))
      sound.playWin()
      onFinish(finalScore)
      return
    }

    targetsSpawnedRef.current++
    setCurrentTargetIndex(targetsSpawnedRef.current)

    // Ensure target stays fully inside canvas bounds with padding
    const pad = targetRadius + 15
    const x = Math.floor(Math.random() * (CANVAS_WIDTH - pad * 2)) + pad
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT - pad * 2)) + pad

    const colors = ['#10b981', '#06b6d4', '#a855f7', '#f59e0b']
    targetRef.current = {
      x,
      y,
      radius: targetRadius,
      spawnTime: Date.now(),
      maxDuration: targetLife,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }, [targetLife, targetRadius, onFinish])

  // Start / Reset Game
  const startGame = useCallback(() => {
    sound.playClick()
    hitsRef.current = 0
    totalClicksRef.current = 0
    targetsSpawnedRef.current = 0
    reactionTimesRef.current = []
    ripplesRef.current = []
    targetRef.current = null

    setHits(0)
    setMisses(0)
    setAccuracy(100)
    setAvgReactionTime(null)
    setCurrentTargetIndex(0)
    setGameState('PLAYING')
    isPlayingRef.current = true

    spawnNextTarget()
  }, [spawnNextTarget])

  // Canvas Click / Tap Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPlayingRef.current || !targetRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width)
    const clickY = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height)

    totalClicksRef.current++
    const target = targetRef.current
    const dist = Math.hypot(clickX - target.x, clickY - target.y)

    if (dist <= target.radius) {
      // Hit!
      const reactionTime = Date.now() - target.spawnTime
      reactionTimesRef.current.push(reactionTime)
      hitsRef.current++
      setHits(hitsRef.current)

      // Audio feedback
      if (reactionTime < 240) sound.playPerfectHit()
      else sound.playBounce()

      // Green ripple
      ripplesRef.current.push({
        x: target.x,
        y: target.y,
        radius: target.radius,
        color: '#10b981',
        alpha: 1.0,
      })

      // Update HUD stats
      const times = reactionTimesRef.current
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      setAvgReactionTime(avg)
      setAccuracy(Math.round((hitsRef.current / totalClicksRef.current) * 100))

      // Spawn next target
      spawnNextTarget()
    } else {
      // Miss click!
      sound.playMiss()
      setMisses((m) => m + 1)
      setAccuracy(Math.round((hitsRef.current / totalClicksRef.current) * 100))

      // Red ripple at click coordinates
      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 12,
        color: '#f43f5e',
        alpha: 1.0,
      })
    }
  }

  // Main 60fps Canvas Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateAndDraw = () => {
      if (!isPlayingRef.current) return

      const now = Date.now()
      const curTarget = targetRef.current

      // Check if target timed out
      if (curTarget) {
        const elapsed = now - curTarget.spawnTime
        if (elapsed >= curTarget.maxDuration) {
          // Timed out = counts as miss
          totalClicksRef.current++
          sound.playMiss()
          setMisses((m) => m + 1)
          setAccuracy(Math.round((hitsRef.current / totalClicksRef.current) * 100))

          // Red fade ripple
          ripplesRef.current.push({
            x: curTarget.x,
            y: curTarget.y,
            radius: curTarget.radius,
            color: '#f43f5e',
            alpha: 1.0,
          })

          spawnNextTarget()
        }
      }

      // Update Ripples
      ripplesRef.current.forEach((rip) => {
        rip.radius += 2.5
        rip.alpha -= 0.05
      })
      ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0)

      // ──────────────── DRAW PHASE ────────────────
      // Dark cyber arena
      ctx.fillStyle = '#060714'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Tactical Crosshair Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)'
      ctx.lineWidth = 1
      for (let x = 0; x < CANVAS_WIDTH; x += 34) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 36) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_WIDTH, y)
        ctx.stroke()
      }

      // Draw Ripples
      ripplesRef.current.forEach((rip) => {
        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2)
        ctx.strokeStyle = rip.color
        ctx.lineWidth = 2
        ctx.globalAlpha = rip.alpha
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // Draw Active Target
      if (curTarget) {
        const elapsed = now - curTarget.spawnTime
        const timeLeftPercent = Math.max(0, 1 - elapsed / curTarget.maxDuration)

        ctx.save()
        // Outer shrinking countdown ring
        ctx.beginPath()
        ctx.arc(curTarget.x, curTarget.y, curTarget.radius + 6, 0, Math.PI * 2 * timeLeftPercent)
        ctx.strokeStyle = curTarget.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Outer glow circle
        ctx.beginPath()
        ctx.arc(curTarget.x, curTarget.y, curTarget.radius, 0, Math.PI * 2)
        ctx.fillStyle = curTarget.color
        ctx.shadowColor = curTarget.color
        ctx.shadowBlur = 16
        ctx.fill()
        ctx.shadowBlur = 0

        // White bullseye inner ring
        ctx.beginPath()
        ctx.arc(curTarget.x, curTarget.y, curTarget.radius * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        // Center dot
        ctx.beginPath()
        ctx.arc(curTarget.x, curTarget.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#f43f5e'
        ctx.fill()

        ctx.restore()
      }

      if (isPlayingRef.current) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
      }
    }

    animFrameIdRef.current = requestAnimationFrame(updateAndDraw)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [gameState, spawnNextTarget])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top Stats HUD */}
      <div className="grid grid-cols-3 gap-2 w-full px-2">
        {/* Targets Counter */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Target className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isRtl ? 'الأهداف' : 'Target'}
            </span>
            <span className="text-sm font-black text-white leading-none">
              {currentTargetIndex}/{TOTAL_TARGETS}
            </span>
          </div>
        </div>

        {/* Avg Reaction Time */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Clock className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isRtl ? 'السرعة' : 'Reaction'}
            </span>
            <span className="text-sm font-black text-amber-300 leading-none">
              {avgReactionTime !== null ? `${avgReactionTime}ms` : '--'}
            </span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Percent className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isRtl ? 'الدقة' : 'Accuracy'}
            </span>
            <span className="text-sm font-black text-emerald-400 leading-none">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full aspect-[340/360] max-h-[360px] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={handlePointerDown}
          className="w-full h-full block cursor-crosshair touch-none"
        />

        {/* Pre-Game Start Screen */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#10b981] animate-bounce">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'قناص الأهداف السريع' : 'CQB Target Reflex'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'أصب 30 هدفاً خاطفاً بأقصى سرعة ودقة لقياس استجابتك بالمللي ثانية!'
                  : 'Hit 30 pop-up targets with maximum accuracy to benchmark your reaction speed!'}
              </p>
            </div>
            <Button variant="primary" onClick={startGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'بدء الاختبار 🎯' : 'Start Reflex Test 🎯'}
            </Button>
          </div>
        )}

        {/* Finished Screen */}
        {gameState === 'FINISHED' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl animate-bounce">🏆⚡</div>
            <div>
              <h3 className="text-2xl font-black text-emerald-400">
                {isRtl ? 'اكتمل الاختبار!' : 'BENCHMARK COMPLETE'}
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-3 bg-brand-darkBg p-3 rounded-2xl border border-brand-purple/40 text-xs">
                <div>
                  <span className="text-slate-400 block">{isRtl ? 'متوسط السرعة:' : 'Avg Reaction:'}</span>
                  <span className="text-amber-300 text-base font-black">{avgReactionTime} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isRtl ? 'نسبة الدقة:' : 'Accuracy:'}</span>
                  <span className="text-emerald-400 text-base font-black">{accuracy}%</span>
                </div>
              </div>
            </div>
            <Button variant="primary" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة الاختبار' : 'Retest Reflex'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'المس أو انقر على مركز كل هدف فور ظهوره قبل نفاد حلقته الخارجية'
          : 'Tap/Click the center of each target as fast as possible before it expires'}
      </div>
    </div>
  )
}

