import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Clock, Zap } from 'lucide-react'
import { Button } from '@components/common/Button'

interface PerfectSecondProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

export const PerfectSecondGame: React.FC<PerfectSecondProps> = ({ onFinish, isRtl }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [targetTime] = useState(2.0) // Stop at 2.000s
  const [result, setResult] = useState<{ diff: number; grade: string; score: number } | null>(null)

  const startTimeRef = useRef(0)
  const animFrameRef = useRef(0)

  const startStopwatch = () => {
    setIsRunning(true)
    setResult(null)
    startTimeRef.current = performance.now()

    const tick = () => {
      const now = performance.now()
      const diffSec = (now - startTimeRef.current) / 1000
      setElapsed(diffSec)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
  }

  const stopStopwatch = () => {
    if (!isRunning) return
    cancelAnimationFrame(animFrameRef.current)
    setIsRunning(false)

    const finalSec = (performance.now() - startTimeRef.current) / 1000
    setElapsed(finalSec)

    const diff = Math.abs(finalSec - targetTime)
    let grade = 'عادي 😐'
    let xp = 150

    if (diff < 0.02) {
      grade = 'أسطوري خارق! GODLIKE 👑'
      xp = 1000
    } else if (diff < 0.05) {
      grade = 'توقيت مثالي! PERFECT ⚡'
      xp = 700
    } else if (diff < 0.15) {
      grade = 'دقة عالية جداً! GREAT 🎯'
      xp = 400
    } else if (diff < 0.3) {
      grade = 'جيد جداً! GOOD 👍'
      xp = 250
    }

    setResult({ diff: Math.round(diff * 1000), grade, score: xp })
    onFinish(xp)
  }

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto text-center">
      {/* Target Goal Banner */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
        <Clock className="w-4 h-4 text-amber-400" />
        <span>{isRtl ? 'الهدف: أوقف العداد عند 2.000 ثانية بالضبط!' : 'Target: Stop at exactly 2.000s!'}</span>
      </div>

      {/* Big Stopwatch Display */}
      <div className="p-8 rounded-3xl bg-brand-darkBg border-4 border-cyan-500/40 shadow-[0_0_35px_rgba(0,210,255,0.25)] flex flex-col items-center justify-center w-64 h-64">
        <span className="text-5xl font-black text-cyan-300 font-mono tracking-wider drop-shadow-md">
          {elapsed.toFixed(3)}
        </span>
        <span className="text-xs font-black text-slate-400 mt-2 uppercase">{isRtl ? 'ثانية' : 'SECONDS'}</span>
      </div>

      {/* Result Card */}
      {result && (
        <div className="p-4 rounded-2xl bg-brand-card border-2 border-amber-400 shadow-glow-gold flex flex-col items-center gap-1 w-full animate-bounce-short">
          <span className="text-base font-black text-white">{result.grade}</span>
          <p className="text-xs text-slate-300">
            {isRtl ? `الفارق عن الهدف: ${result.diff} مللي ثانية` : `Deviation: ${result.diff} ms`}
          </p>
          <span className="text-xs font-black text-amber-300 mt-1">+{result.score} XP</span>
        </div>
      )}

      {/* Actions */}
      {!isRunning ? (
        <Button variant="primary" size="lg" fullWidth onClick={startStopwatch}>
          {result ? (isRtl ? 'محاولة ثانية ⚡' : 'Try Again ⚡') : (isRtl ? 'ابدأ العداد 🚀' : 'Start Timer 🚀')}
        </Button>
      ) : (
        <Button
          variant="chaos"
          size="lg"
          fullWidth
          onClick={stopStopwatch}
          className="animate-pulse shadow-[0_0_30px_#f43f5e]"
        >
          {isRtl ? 'قِف الآن! (STOP)' : 'STOP NOW!'}
        </Button>
      )}
    </div>
  )
}

