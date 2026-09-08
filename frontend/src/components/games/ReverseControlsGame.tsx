/**
 * ReverseControlsGame.tsx
 *
 * Reverse Brain Reflex (عكس الاتجاهات والبديهة اللحظي)
 * Cognitive reflex and inhibitory control challenge.
 * Features:
 * - Counter-intuitive rapid prompts:
 *   1. Spatial Arrows: Arrow points left -> player MUST choose right!
 *   2. Stroop Conflict: Word says "أحمر" painted in Blue -> player must choose actual ink color!
 *   3. Inverted Directives: "Do NOT tap!" vs "TAP QUICKLY!".
 * - Accelerating shrink timer (from 3.0s down to 0.8s per prompt).
 * - Multi-tiered combo streaks (x2, x4, x8) with dynamic sound effects.
 * - Reactive screen flashes, neon glows, and score feedback.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, Zap, Sparkles, Flame, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface ReverseControlsProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type ChallengeType = 'arrow' | 'stroop' | 'command'

interface Challenge {
  type: ChallengeType
  promptText: string
  subPrompt?: string
  displayColor: string
  correctOption: string
  options: string[]
}

const COLOR_MAP: Record<string, string> = {
  أحمر: '#ef4444',
  أزرق: '#3b82f6',
  أخضر: '#10b981',
  أصفر: '#f59e0b',
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#10b981',
  Yellow: '#f59e0b',
}

export const ReverseControlsGame: React.FC<ReverseControlsProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [timeLeft, setTimeLeft] = useState(100) // percentage 100 -> 0
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')

  const scoreRef = useRef(0)
  const streakRef = useRef(0)
  const solvedCountRef = useRef(0)
  const timerIntervalRef = useRef<number | null>(null)

  // Difficulty timer speed
  const baseDuration = difficulty === 'Easy' ? 2800 : difficulty === 'Hard' ? 1400 : 2000

  // Generator for random reverse challenges
  const generateChallenge = useCallback((): Challenge => {
    const types: ChallengeType[] = ['arrow', 'stroop', 'command']
    const chosenType = types[Math.floor(Math.random() * types.length)]

    if (chosenType === 'arrow') {
      // Direction Arrow Reversal
      const dirs = [
        { label: '←', name: isRtl ? 'يسار' : 'Left', opposite: '→' },
        { label: '→', name: isRtl ? 'يمين' : 'Right', opposite: '←' },
        { label: '↑', name: isRtl ? 'أعلى' : 'Up', opposite: '↓' },
        { label: '↓', name: isRtl ? 'أسفل' : 'Down', opposite: '↑' },
      ]
      const chosenDir = dirs[Math.floor(Math.random() * dirs.length)]
      return {
        type: 'arrow',
        promptText: chosenDir.label,
        subPrompt: isRtl ? 'اختر الاتجاه المعاكس تماماً!' : 'Pick the opposite direction!',
        displayColor: '#06b6d4',
        correctOption: chosenDir.opposite,
        options: dirs.map((d) => d.label).sort(() => Math.random() - 0.5),
      }
    } else if (chosenType === 'stroop') {
      // Stroop Color Conflict
      const colorNames = isRtl ? ['أحمر', 'أزرق', 'أخضر', 'أصفر'] : ['Red', 'Blue', 'Green', 'Yellow']
      const textName = colorNames[Math.floor(Math.random() * colorNames.length)]
      const wrongColors = colorNames.filter((c) => c !== textName)
      const actualColorName = wrongColors[Math.floor(Math.random() * wrongColors.length)]

      return {
        type: 'stroop',
        promptText: textName,
        subPrompt: isRtl ? 'اختر لون الخط الحقيقي (وليس المكتوب)!' : 'Pick font color, not the word!',
        displayColor: COLOR_MAP[actualColorName],
        correctOption: actualColorName,
        options: [...colorNames].sort(() => Math.random() - 0.5),
      }
    } else {
      // Directive Reversal (Reverse Command)
      const isReverse = Math.random() > 0.4
      const words = isRtl
        ? isReverse
          ? { cmd: 'لا تضغط الأخضر!', ok: 'أزرق', no: 'أخضر' }
          : { cmd: 'اضغط الأزرق!', ok: 'أزرق', no: 'أخضر' }
        : isReverse
        ? { cmd: 'Do NOT pick Green!', ok: 'Blue', no: 'Green' }
        : { cmd: 'Pick Blue!', ok: 'Blue', no: 'Green' }

      return {
        type: 'command',
        promptText: words.cmd,
        subPrompt: isRtl ? 'اقرأ الأمر بدقة ونفذ عكس الفخ!' : 'Read carefully and avoid the trap!',
        displayColor: isReverse ? '#f43f5e' : '#10b981',
        correctOption: words.ok,
        options: [words.ok, words.no].sort(() => Math.random() - 0.5),
      }
    }
  }, [isRtl])

  // Step into Next Question with Timer
  const nextQuestion = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)

    const nextC = generateChallenge()
    setCurrentChallenge(nextC)
    setTimeLeft(100)

    // Duration decays slightly as player answers more
    const currentDuration = Math.max(
      800,
      baseDuration - Math.min(1000, solvedCountRef.current * 40)
    )
    const stepTime = currentDuration / 100

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 2) {
          // Time expired!
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
          handleAnswer('__TIMEOUT__')
          return 0
        }
        return prev - 1
      })
    }, stepTime)
  }, [baseDuration, generateChallenge])

  // Start / Reset Game
  const startGame = useCallback(() => {
    sound.playClick()
    scoreRef.current = 0
    streakRef.current = 0
    solvedCountRef.current = 0

    setScore(0)
    setStreak(0)
    setMultiplier(1)
    setFeedback(null)
    setGameState('PLAYING')

    nextQuestion()
  }, [nextQuestion])

  // Answer Submission
  const handleAnswer = useCallback(
    (selectedOption: string) => {
      if (!currentChallenge) return

      if (selectedOption === currentChallenge.correctOption) {
        // Correct!
        sound.playCoin()
        setFeedback('correct')
        setTimeout(() => setFeedback(null), 250)

        streakRef.current++
        setStreak(streakRef.current)

        let curMult = 1
        if (streakRef.current >= 20) {
          curMult = 8
          if (streakRef.current === 20) sound.playComboX8()
        } else if (streakRef.current >= 10) {
          curMult = 4
          if (streakRef.current === 10) sound.playComboX4()
        } else if (streakRef.current >= 5) {
          curMult = 2
          if (streakRef.current === 5) sound.playComboX2()
        }
        setMultiplier(curMult)

        scoreRef.current += 100 * curMult
        setScore(scoreRef.current)
        solvedCountRef.current++

        nextQuestion()
      } else {
        // Wrong or Timeout!
        sound.playMiss()
        sound.playGameOver()
        setFeedback('wrong')

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
        setGameState('GAMEOVER')
        onFinish(scoreRef.current)
      }
    },
    [currentChallenge, nextQuestion, onFinish]
  )

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

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
          {streak >= 5 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2 py-1 rounded-xl text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak} STREAK</span>
            </div>
          )}
          {multiplier > 1 && (
            <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-400/60 px-2 py-1 rounded-xl text-purple-300 text-xs font-black animate-bounce">
              <Zap className="w-3.5 h-3.5" />
              <span>x{multiplier}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Challenge Arena */}
      <div
        className={`relative w-full aspect-[340/360] max-h-[360px] rounded-3xl overflow-hidden border-2 p-6 flex flex-col items-center justify-between transition-all duration-200 shadow-xl ${
          feedback === 'correct'
            ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_30px_#10b981]'
            : feedback === 'wrong'
            ? 'border-rose-500 bg-rose-950/60 shadow-[0_0_30px_#f43f5e]'
            : 'border-purple-500/40 bg-[#060714] shadow-[0_0_30px_rgba(168,85,247,0.2)]'
        }`}
      >
        {/* Shrinking Time Bar */}
        {gameState === 'PLAYING' && (
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-75 ${
                timeLeft > 50
                  ? 'bg-emerald-400'
                  : timeLeft > 25
                  ? 'bg-amber-400'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${timeLeft}%` }}
            />
          </div>
        )}

        {/* Start Game Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 z-20">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#a855f7] animate-bounce">
              🔄
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'عكس الاتجاهات اللحظي' : 'Reverse Brain Reflex'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'السهم يسار؟ اضغط يمين! الكلمة بلون متعارض؟ اختر لون الخط الحقيقي! تحدى سرعة بديهتك.'
                  : 'Arrow points left? Tap right! Pick the contradictory color or directive!'}
              </p>
            </div>
            <Button variant="primary" onClick={startGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'ابدأ التحدي العكسي 🔄' : 'Start Reverse Reflex 🔄'}
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 z-20 animate-in fade-in zoom-in duration-300">
            <div className="text-4xl">🧠💥</div>
            <div>
              <h3 className="text-2xl font-black text-rose-400">
                {isRtl ? 'خدعك دماغك!' : 'BRAIN OVERLOAD'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'النقاط النهائية:' : 'Final Score:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{score}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isRtl ? `أعلى سلسلة: ${streak}` : `Best Streak: ${streak}`}
              </p>
            </div>
            <Button variant="primary" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Try Again'}</span>
            </Button>
          </div>
        )}

        {/* Active Prompt */}
        {gameState === 'PLAYING' && currentChallenge && (
          <>
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-400/30">
                {currentChallenge.subPrompt}
              </span>
              <div
                className="text-5xl font-black tracking-widest my-4 drop-shadow-[0_0_20px_currentColor] select-none"
                style={{ color: currentChallenge.displayColor }}
              >
                {currentChallenge.promptText}
              </div>
            </div>

            {/* Answer Options Grid */}
            <div
              className={`grid gap-3 w-full ${
                currentChallenge.options.length === 4 ? 'grid-cols-2' : 'grid-cols-2'
              }`}
            >
              {currentChallenge.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 rounded-2xl bg-brand-darkBg/90 border-2 border-brand-purple/40 hover:border-cyan-400 active:scale-95 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:bg-cyan-600 cursor-pointer"
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center">
        {isRtl
          ? 'تنبيه: الإجابة البديهية خاطئة دائماً! فكّر بالعكس قبل نفاد الوقت'
          : 'Warning: Automatic instinct is always wrong! Think in reverse before time expires'}
      </div>
    </div>
  )
}

