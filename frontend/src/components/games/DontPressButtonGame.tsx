/**
 * DontPressButtonGame.tsx
 *
 * Chaos Reverse Psychology Reflex Challenge (تحدي الزر الممنوع)
 * Fast-paced mental deception game:
 * - Dynamic commands flash with conflicting psychological cues (Stroop & reverse psychology).
 * - "PRESS NOW!" vs "DO NOT TOUCH!" with changing button colors and timers.
 * - Multi-tiered combo streaks, lives system, and progressive speed per round.
 * - Works with tap/mouse and Spacebar.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface DontPressButtonProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type CommandType = 'PRESS' | 'DONT_PRESS' | 'DOUBLE_TAP'

interface RoundCommand {
  type: CommandType
  textAr: string
  textEn: string
  color: 'red' | 'green' | 'amber' | 'purple'
  durationMs: number
}

const COMMAND_TEMPLATES: Array<{
  type: CommandType
  textAr: string
  textEn: string
  color: 'red' | 'green' | 'amber' | 'purple'
}> = [
  { type: 'DONT_PRESS', textAr: 'إياك أن تضغط! 🛑', textEn: "DO NOT PRESS! 🛑", color: 'red' },
  { type: 'PRESS', textAr: 'اضغط الآن بسرعة! ⚡', textEn: 'PRESS QUICKLY! ⚡', color: 'green' },
  { type: 'DONT_PRESS', textAr: 'توقف! لا تلمسني! ⚠️', textEn: "STOP! DON'T TOUCH! ⚠️", color: 'red' },
  { type: 'PRESS', textAr: 'المس الزر فوراً! 🚀', textEn: 'TAP BUTTON NOW! 🚀', color: 'green' },
  { type: 'DONT_PRESS', textAr: 'خدعة! لا تضغط! 😈', textEn: "TRICK! DON'T PRESS! 😈", color: 'amber' },
  { type: 'DOUBLE_TAP', textAr: 'اضغط مرتين بسرعة! 💥', textEn: 'DOUBLE TAP FAST! 💥', color: 'purple' },
]

export const DontPressButtonGame: React.FC<DontPressButtonProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const maxRounds = difficulty === 'Easy' ? 6 : difficulty === 'Hard' ? 10 : 8
  const baseTime = difficulty === 'Easy' ? 2400 : difficulty === 'Hard' ? 1400 : 1800

  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE')
  const [round, setRound] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [command, setCommand] = useState<RoundCommand | null>(null)
  const [tapsInRound, setTapsInRound] = useState(0)
  const [progressWidth, setProgressWidth] = useState(100)

  const roundTimerRef = useRef<number | null>(null)
  const progressIntervalRef = useRef<number | null>(null)
  const stateRef = useRef({
    gameState: 'IDLE',
    taps: 0,
    round: 0,
    lives: 3,
    score: 0,
    streak: 0,
    currentCommand: null as RoundCommand | null,
  })

  // Synchronize state ref
  stateRef.current.gameState = gameState
  stateRef.current.taps = tapsInRound
  stateRef.current.round = round
  stateRef.current.lives = lives
  stateRef.current.score = score
  stateRef.current.streak = streak
  stateRef.current.currentCommand = command

  const clearTimers = useCallback(() => {
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }, [])

  const finishGame = useCallback((won: boolean, finalScore: number) => {
    clearTimers()
    setGameState(won ? 'VICTORY' : 'GAMEOVER')
    if (won) {
      sound.playWin()
    } else {
      sound.playGameOver()
    }
    onFinish(finalScore)
  }, [clearTimers, onFinish])

  const startRoundRef = useRef<(roundIdx: number) => void>(() => {})

  const evaluateRoundOutcome = useCallback(() => {
    const cmd = stateRef.current.currentCommand
    if (!cmd) return

    let success = false
    const taps = stateRef.current.taps

    if (cmd.type === 'DONT_PRESS') {
      success = taps === 0
    } else if (cmd.type === 'PRESS') {
      success = taps === 1
    } else if (cmd.type === 'DOUBLE_TAP') {
      success = taps >= 2
    }

    if (success) {
      sound.playCoin()
      const newStreak = stateRef.current.streak + 1
      const bonus = 100 + newStreak * 40
      const newScore = stateRef.current.score + bonus
      setScore(newScore)
      setStreak(newStreak)

      const nextRound = stateRef.current.round + 1
      if (nextRound >= maxRounds) {
        finishGame(true, newScore + 300)
      } else {
        setRound(nextRound)
        startRoundRef.current(nextRound)
      }
    } else {
      sound.playExplosion()
      const newLives = stateRef.current.lives - 1
      setLives(newLives)
      setStreak(0)

      if (newLives <= 0) {
        finishGame(false, stateRef.current.score)
      } else {
        const nextRound = stateRef.current.round + 1
        if (nextRound >= maxRounds) {
          finishGame(true, stateRef.current.score)
        } else {
          setRound(nextRound)
          startRoundRef.current(nextRound)
        }
      }
    }
  }, [finishGame, maxRounds])

  const startRound = useCallback((roundIdx: number) => {
    clearTimers()
    setTapsInRound(0)
    setProgressWidth(100)

    // Select random template and scale duration with round
    const template = COMMAND_TEMPLATES[Math.floor(Math.random() * COMMAND_TEMPLATES.length)]
    const duration = Math.max(900, baseTime - roundIdx * 100)

    const nextCmd: RoundCommand = {
      ...template,
      durationMs: duration,
    }

    setCommand(nextCmd)
    stateRef.current.currentCommand = nextCmd
    stateRef.current.taps = 0

    // Progress bar animation
    const startTime = performance.now()
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const rem = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgressWidth(rem)
    }, 25)

    // End of round evaluation
    roundTimerRef.current = window.setTimeout(() => {
      evaluateRoundOutcome()
    }, duration)
  }, [baseTime, clearTimers, evaluateRoundOutcome])

  startRoundRef.current = startRound

  const handlePress = () => {
    if (gameState !== 'PLAYING' || !command) return
    sound.playClick()
    const nextTaps = tapsInRound + 1
    setTapsInRound(nextTaps)
    stateRef.current.taps = nextTaps

    // Early resolution for DONT_PRESS: immediately failed if touched
    if (command.type === 'DONT_PRESS') {
      clearTimers()
      evaluateRoundOutcome()
      return
    }

    // Early resolution for PRESS: immediately succeeded if tapped once
    if (command.type === 'PRESS') {
      clearTimers()
      evaluateRoundOutcome()
      return
    }

    // Early resolution for DOUBLE_TAP: immediately succeeded once 2 taps reached
    if (command.type === 'DOUBLE_TAP' && nextTaps >= 2) {
      clearTimers()
      evaluateRoundOutcome()
      return
    }
  }

  const startGame = () => {
    sound.playClick()
    setScore(0)
    setStreak(0)
    setLives(3)
    setRound(0)
    setTapsInRound(0)
    setGameState('PLAYING')
    startRound(0)
  }

  // Keyboard shortcut (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handlePress()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const buttonGradients = {
    red: 'from-rose-500 via-red-600 to-rose-900 border-red-800 shadow-[0_15px_35px_rgba(244,63,94,0.4)]',
    green: 'from-emerald-400 via-green-500 to-emerald-900 border-emerald-700 shadow-[0_15px_35px_rgba(16,185,129,0.4)]',
    amber: 'from-amber-400 via-yellow-500 to-amber-900 border-amber-700 shadow-[0_15px_35px_rgba(245,158,11,0.4)]',
    purple: 'from-purple-500 via-violet-600 to-purple-900 border-purple-800 shadow-[0_15px_35px_rgba(168,85,247,0.4)]',
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto text-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950 border border-brand-cardBorder shadow-md">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-base transition-all ${i < lives ? 'text-rose-500 scale-100' : 'text-slate-600 opacity-40 scale-90'}`}>
              ❤️
            </span>
          ))}
        </div>

        {streak > 1 && (
          <div className="flex items-center gap-1 text-xs font-black text-amber-400 font-mono animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak}x COMBO</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">
            {round + 1}/{maxRounds}
          </span>
          <span className="text-xs font-black font-mono text-cyan-300">
            {score} XP
          </span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative w-full p-6 rounded-3xl bg-slate-950 border-2 border-cyan-500/30 shadow-2xl flex flex-col items-center gap-5 min-h-[340px] justify-between">
        {gameState === 'IDLE' && (
          <div className="my-auto flex flex-col items-center gap-4">
            <span className="text-5xl">🛑⚡</span>
            <h3 className="text-xl font-black text-white">
              {isRtl ? 'عالم الفوضى: تحدي الزر العكسي' : 'Chaos Reverse Button'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              {isRtl
                ? 'اختبار بديهة وتركيز فائق: اقرأ الأمر في أجزاء من الثانية ونفّذه! أحياناً يطلب منك الضغط وأحياناً يحذرك من اللمس.'
                : 'Rapid reflex test: obey the prompt in split seconds! Sometimes tap, sometimes freeze!'}
            </p>
            <Button variant="chaos" size="md" onClick={startGame}>
              {isRtl ? 'ابدأ الاختبار ⚡' : 'Start Challenge ⚡'}
            </Button>
          </div>
        )}

        {gameState === 'PLAYING' && command && (
          <div className="w-full flex flex-col items-center gap-4 my-auto">
            {/* Round Timer Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-75"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            {/* Instruction Command */}
            <div className="py-2 px-4 rounded-2xl bg-white/5 border border-white/10 w-full animate-bounce-short">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {isRtl ? command.textAr : command.textEn}
              </h2>
            </div>

            {/* The Big Interactive Button */}
            <button
              onClick={handlePress}
              className={`w-40 h-40 rounded-full border-8 bg-gradient-to-b ${buttonGradients[command.color]} active:scale-90 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer touch-none`}
            >
              <span className="text-3xl">
                {command.type === 'DONT_PRESS' ? '🚫' : command.type === 'DOUBLE_TAP' ? '⚡⚡' : '👆'}
              </span>
              <span className="text-white font-black text-xs uppercase tracking-wider drop-shadow-md">
                {tapsInRound > 0 ? `TAPS: ${tapsInRound}` : isRtl ? 'زر الفوضى' : 'CHAOS'}
              </span>
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              {isRtl ? 'يمكنك الضغط بالمسطرة (Spacebar) أو اللمس' : 'Press Spacebar or Tap'}
            </span>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="my-auto flex flex-col items-center gap-3">
            <span className="text-5xl">💥</span>
            <h3 className="text-xl font-black text-rose-400">
              {isRtl ? 'سقطت في الفخ!' : 'Caught In The Trap!'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl ? 'خدعتك البديهة وانتهت المحاولات الثلاث.' : 'Reflexes tricked! Out of lives.'}
            </p>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-300 font-bold">
              {isRtl ? 'النتيجة النهائية:' : 'Final Score:'} {score} XP
            </div>
            <Button variant="primary" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
              {isRtl ? 'محاولة جديدة ⚡' : 'Try Again ⚡'}
            </Button>
          </div>
        )}

        {gameState === 'VICTORY' && (
          <div className="my-auto flex flex-col items-center gap-3">
            <ShieldCheck className="w-14 h-14 text-emerald-400 animate-bounce" />
            <h3 className="text-xl font-black text-emerald-300">
              {isRtl ? 'إرادة فولاذية وتركيز أسطوري! 🏆' : 'Iron Will! Flawless Focus! 🏆'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تغلبت على جميع خدع زر الفوضى بنجاح!' : 'You mastered every single chaos trick!'}
            </p>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-base font-mono text-amber-300 font-black">
              +{score} XP
            </div>
            <Button variant="primary" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
              {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
