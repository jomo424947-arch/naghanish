import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Calculator, Trophy, Zap, Flame, RotateCcw, Clock, Check, X } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface SpeedMathProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Question {
  text: string
  answer: number
  options: number[]
}

export const SpeedMathGame: React.FC<SpeedMathProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [stats, setStats] = useState({ totalSolved: 0, correct: 0, wrong: 0 })

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate math questions
  const generateQuestion = useCallback((): Question => {
    let text = ''
    let answer = 0

    const types = difficulty === 'Easy' ? ['+', '-'] : ['+', '-', '*', '/']
    const op = types[Math.floor(Math.random() * types.length)]

    if (op === '+') {
      const a = Math.floor(Math.random() * (difficulty === 'Hard' ? 60 : 35)) + 10
      const b = Math.floor(Math.random() * (difficulty === 'Hard' ? 50 : 30)) + 5
      text = `${a} + ${b}`
      answer = a + b
    } else if (op === '-') {
      const a = Math.floor(Math.random() * (difficulty === 'Hard' ? 90 : 50)) + 20
      const b = Math.floor(Math.random() * (a - 5)) + 3
      text = `${a} - ${b}`
      answer = a - b
    } else if (op === '*') {
      const a = Math.floor(Math.random() * 12) + 3
      const b = Math.floor(Math.random() * 12) + 3
      text = `${a} × ${b}`
      answer = a * b
    } else {
      // Division with clean integer results
      const b = Math.floor(Math.random() * 11) + 2
      const res = Math.floor(Math.random() * 12) + 2
      const a = b * res
      text = `${a} ÷ ${b}`
      answer = res
    }

    // Generate 3 unique plausible distractors
    const optionsSet = new Set<number>([answer])
    while (optionsSet.size < 4) {
      const delta = (Math.floor(Math.random() * 8) + 1) * (Math.random() < 0.5 ? 1 : -1)
      const fake = Math.max(1, answer + delta)
      optionsSet.add(fake)
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5)

    return { text, answer, options }
  }, [difficulty])

  // Start game
  const startGame = () => {
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(45)
    setStats({ totalSolved: 0, correct: 0, wrong: 0 })
    setSelectedOption(null)
    setFeedback(null)
    setGameState('PLAYING')
    setQuestion(generateQuestion())
    soundManager.playPowerUp()
  }

  // Handle countdown
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setGameState('GAMEOVER')
          soundManager.playBossAlert()
          onFinish(score)
          return 0
        }
        if (prev <= 6) {
          soundManager.playCountdown()
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState, score, onFinish])

  // Answer handler
  const handleAnswer = (val: number) => {
    if (feedback !== null || !question) return
    setSelectedOption(val)

    const isCorrect = val === question.answer

    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > maxStreak) setMaxStreak(newStreak)

      if (newStreak >= 8) soundManager.playComboX8()
      else if (newStreak >= 4) soundManager.playComboX4()
      else if (newStreak >= 2) soundManager.playComboX2()
      else soundManager.playPerfectHit()

      const earned = 100 + newStreak * 25
      setScore((s) => s + earned)
      setStats((prev) => ({ ...prev, totalSolved: prev.totalSolved + 1, correct: prev.correct + 1 }))
      setFeedback('correct')
    } else {
      soundManager.playMiss()
      setStreak(0)
      setTimeLeft((t) => Math.max(1, t - 3)) // Time penalty
      setStats((prev) => ({ ...prev, totalSolved: prev.totalSolved + 1, wrong: prev.wrong + 1 }))
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      setSelectedOption(null)
      setQuestion(generateQuestion())
    }, 350)
  }

  // Keyboard controls (1, 2, 3, 4)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || !question) return
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (question.options[idx] !== undefined) {
          handleAnswer(question.options[idx])
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [gameState, question, handleAnswer])

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-ping' : 'text-amber-400'}`} />
          <span className={`text-xl font-black font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>

        {streak > 1 && (
          <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-bounce">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{streak}x STREAK</span>
          </div>
        )}

        <div className="text-xl font-black font-mono text-cyan-300">
          {score} <span className="text-xs text-gray-400">XP</span>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative w-full rounded-3xl p-6 bg-gradient-to-b from-brand-cardBg via-black/90 to-black border-2 border-brand-cardBorder shadow-2xl flex flex-col items-center justify-between min-h-[420px]">
        {gameState === 'IDLE' && (
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
              <Calculator className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'صراع الحساب السريع ⚡' : 'CYBER SPEED MATH ⚡'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
              {isRtl
                ? 'أجب عن أكبر عدد ممكن من المعادلات الرياضية في 45 ثانية! كل إجابة صحيحة متتالية تزيد الكومبو والنقاط.'
                : 'Solve equations as fast as possible in 45 seconds! Build combos for massive score multipliers.'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              {isRtl ? 'بدء التحدي' : 'Start Challenge'}
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && question && (
          <div className="flex flex-col items-center justify-between w-full h-full flex-1 gap-6">
            {/* Equation Display */}
            <div className="my-auto flex flex-col items-center">
              <span className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">
                {isRtl ? 'حل المعادلة التالية:' : 'Solve The Equation:'}
              </span>
              <div
                className={`text-4xl md:text-5xl font-black font-mono tracking-wider transition-all transform ${
                  feedback === 'correct'
                    ? 'text-green-400 scale-110'
                    : feedback === 'wrong'
                    ? 'text-red-400 scale-95'
                    : 'text-white'
                }`}
              >
                {question.text} = ?
              </div>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 gap-3.5 w-full">
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === opt
                const isRightAnswer = opt === question.answer

                let btnStyle = 'border-white/10 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-400/50 text-white'
                if (feedback && isSelected) {
                  btnStyle = isRightAnswer ? 'border-green-400 bg-green-500/30 text-green-300' : 'border-red-400 bg-red-500/30 text-red-300'
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={`relative py-5 px-4 rounded-2xl border text-2xl font-black font-mono transition-all duration-150 transform active:scale-95 ${btnStyle}`}
                  >
                    <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-500">[{i + 1}]</span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="flex flex-col items-center justify-center text-center my-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              {isRtl ? 'انتهى الوقت! 🏁' : 'Time Up! 🏁'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl ? 'أداء رياضي ذهني فائق السرعة!' : 'Lightning mental speed test completed!'}
            </p>

            <div className="grid grid-cols-3 gap-3 w-full mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'النقاط' : 'Score'}</span>
                <span className="text-lg font-black text-cyan-400 font-mono">{score}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'الدقة' : 'Accuracy'}</span>
                <span className="text-lg font-black text-green-400 font-mono">
                  {stats.totalSolved > 0 ? Math.round((stats.correct / stats.totalSolved) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'أعلى كومبو' : 'Max Streak'}</span>
                <span className="text-lg font-black text-amber-400 font-mono">{maxStreak}x</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRtl ? 'إعادة المحاولة' : 'Play Again'}</span>
            </button>
          </div>
        )}
      </div>

      <span className="text-[11px] text-gray-500 font-mono">
        {isRtl ? 'يمكنك استخدام المفاتيح 1-4 على لوحة المفاتيح' : 'Keyboard shortcuts [1, 2, 3, 4] supported'}
      </span>
    </div>
  )
}
