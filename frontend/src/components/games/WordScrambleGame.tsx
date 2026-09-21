/**
 * WordScrambleGame.tsx
 *
 * Cyber Anagram & Word Scramble (مفكك الكلمات المشفرة)
 * Arabic & English progressive anagram deduction game:
 * - Scrambled letter tiles with tactile selection and undo.
 * - Dynamic hint system with timer bonuses.
 * - Progressive difficulty: 3-letter to 6-letter words.
 * - Complete Light Mode & Dark Mode contrast accessibility.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, CheckCircle2, HelpCircle, Clock } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface WordScrambleProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface PuzzleWord {
  answerAr: string
  scrambledAr: string[]
  hintAr: string
  answerEn: string
  scrambledEn: string[]
  hintEn: string
}

const PUZZLES: PuzzleWord[] = [
  {
    answerAr: 'شمس',
    scrambledAr: ['س', 'م', 'ش'],
    hintAr: 'النجم المضيء لمجموعتنا الشمسية ☀️',
    answerEn: 'SUN',
    scrambledEn: ['N', 'U', 'S'],
    hintEn: 'The central shining star of our system ☀️',
  },
  {
    answerAr: 'كوكب',
    scrambledAr: ['ب', 'ك', 'ك', 'و'],
    hintAr: 'جرم سماوي يدور حول الشمس 🪐',
    answerEn: 'MARS',
    scrambledEn: ['S', 'R', 'A', 'M'],
    hintEn: 'The red neighboring planet in our system 🪐',
  },
  {
    answerAr: 'بركان',
    scrambledAr: ['ن', 'ر', 'ك', 'ا', 'ب'],
    hintAr: 'جبل يقذف الحمم البركانية والغازات 🌋',
    answerEn: 'COMET',
    scrambledEn: ['T', 'E', 'M', 'O', 'C'],
    hintEn: 'An icy celestial body with a glowing tail ☄️',
  },
  {
    answerAr: 'الماس',
    scrambledAr: ['س', 'م', 'ا', 'ل', 'ا'],
    hintAr: 'أصلب الأحجار الكريمة وأنفسها في العالم 💎',
    answerEn: 'GALAXY',
    scrambledEn: ['Y', 'X', 'A', 'L', 'A', 'G'],
    hintEn: 'A massive gravitationally bound system of stars 🌌',
  },
  {
    answerAr: 'سفينة',
    scrambledAr: ['ة', 'ي', 'ف', 'ن', 'س'],
    hintAr: 'مركبة عملاقة تبحر وتشق أمواج المحيط 🚢',
    answerEn: 'ROCKET',
    scrambledEn: ['T', 'E', 'K', 'C', 'O', 'R'],
    hintEn: 'High-thrust space vehicle breaching atmosphere 🚀',
  },
]

export const WordScrambleGame: React.FC<WordScrambleProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const maxTime = difficulty === 'Easy' ? 40 : difficulty === 'Hard' ? 20 : 30
  const [round, setRound] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(maxTime)

  const timerRef = useRef<number | null>(null)
  const scoreRef = useRef(0)
  scoreRef.current = score

  const currentPuzzle = PUZZLES[round % PUZZLES.length]
  const targetAnswer = isRtl ? currentPuzzle.answerAr : currentPuzzle.answerEn
  const scrambledList = isRtl ? currentPuzzle.scrambledAr : currentPuzzle.scrambledEn
  const hintText = isRtl ? currentPuzzle.hintAr : currentPuzzle.hintEn

  const currentWordAttempt = selectedLetters.map((idx) => scrambledList[idx]).join('')

  const handleNextWord = useCallback((newScore: number) => {
    if (round + 1 < PUZZLES.length) {
      setRound((r) => r + 1)
      setSelectedLetters([])
      setIsCorrect(false)
      setTimeLeft(maxTime)
    } else {
      setIsFinished(true)
      const finalScore = newScore + 400
      sound.playWin()
      onFinish(finalScore)
    }
  }, [maxTime, onFinish, round])

  // Countdown timer per puzzle
  useEffect(() => {
    if (isFinished || isCorrect) return

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this word
          sound.playGameOver()
          handleNextWord(scoreRef.current)
          return maxTime
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [handleNextWord, isCorrect, isFinished, maxTime, round])

  const handleLetterClick = (index: number) => {
    if (isCorrect) return
    sound.playClick()

    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index))
      return
    }

    const nextSelected = [...selectedLetters, index]
    setSelectedLetters(nextSelected)

    const attempt = nextSelected.map((i) => scrambledList[i]).join('')
    if (attempt === targetAnswer) {
      sound.playCoin()
      setIsCorrect(true)
      const timeBonus = timeLeft * 10
      const nextScore = score + 200 + timeBonus
      setScore(nextScore)

      setTimeout(() => {
        handleNextWord(nextScore)
      }, 1200)
    }
  }

  const clearSelection = () => {
    sound.playClick()
    setSelectedLetters([])
  }

  const resetGame = () => {
    sound.playClick()
    setRound(0)
    setScore(0)
    setIsFinished(false)
    setIsCorrect(false)
    setSelectedLetters([])
    setTimeLeft(maxTime)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto text-center select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-xs font-mono shadow-md">
        <span className="text-amber-400 font-black">
          {isRtl ? 'اللغز:' : 'WORD:'} {round + 1} / {PUZZLES.length}
        </span>
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className={timeLeft <= 8 ? 'text-rose-400 animate-pulse font-black' : 'text-slate-200'}>
            {timeLeft}s
          </span>
        </div>
        <span className="text-cyan-300 font-black">{score} XP</span>
      </div>

      {!isFinished ? (
        <div className="flex flex-col items-center gap-5 w-full p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/30 shadow-2xl">
          {/* Hint Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 flex items-center gap-3 w-full text-left">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-slate-100 font-semibold leading-relaxed">{hintText}</p>
          </div>

          {/* Current Word Display */}
          <div className="min-h-16 px-6 py-2 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/50 flex items-center justify-center gap-2 text-3xl font-black text-cyan-300 tracking-widest shadow-inner w-full">
            {currentWordAttempt || (
              <span className="text-xs text-slate-400 font-normal">
                {isRtl ? 'انقر على الحروف لتجميع الكلمة' : 'Click letters to assemble word'}
              </span>
            )}
          </div>

          {/* Scrambled Letter Tiles */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap py-2">
            {scrambledList.map((char, i) => {
              const isUsed = selectedLetters.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => handleLetterClick(i)}
                  className={`w-12 h-12 rounded-2xl border-2 font-black text-xl flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                    isUsed
                      ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-40 scale-95'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10 hover:border-cyan-400 hover:scale-105'
                  }`}
                >
                  {char}
                </button>
              )
            })}
          </div>

          {/* Controls */}
          <button
            onClick={clearSelection}
            className="text-xs text-slate-400 hover:text-cyan-300 underline font-bold cursor-pointer"
          >
            {isRtl ? 'إعادة ترتيب الحروف' : 'Clear selection'}
          </button>

          {/* Success Overlay Banner */}
          {isCorrect && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 text-xs font-black flex items-center justify-center gap-2 animate-bounce-short w-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'إجابة صحيحة متألقة! +200 XP 🎉' : 'Correct Word! +200 XP 🎉'}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-400 shadow-glow-gold flex flex-col items-center gap-3 w-full animate-bounce-short">
          <Trophy className="w-12 h-12 text-amber-400" />
          <h4 className="text-xl font-black text-white">
            {isRtl ? 'عبقري الكلمات والحروف! 🔤' : 'Word Master Champion!'}
          </h4>
          <p className="text-sm text-amber-300 font-mono font-black">{score + 400} XP</p>
          <Button variant="gold" size="sm" onClick={resetGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}
