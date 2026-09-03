import React, { useState } from 'react'
import { RotateCcw, Trophy, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react'
import { Button } from '@components/common/Button'

interface WordScrambleProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const PUZZLES = [
  { answer: 'كوكب', scrambled: ['ب', 'ك', 'ك', 'و'], hint: 'جرم سماوي يدور حول الشمس 🪐' },
  { answer: 'بركان', scrambled: ['ن', 'ر', 'ك', 'ا', 'ب'], hint: 'جبل يقذف الحمم البركانية 🌋' },
  { answer: 'شمس', scrambled: ['س', 'م', 'ش'], hint: 'النجم المضيء لمجموعتنا الشمسية ☀️' },
  { answer: 'الماس', scrambled: ['س', 'م', 'ا', 'ل', 'ا'], hint: 'أصلب الأحجار الكريمة وأنفسها 💎' },
  { answer: 'سفينة', scrambled: ['ة', 'ي', 'ف', 'ن', 'س'], hint: 'مركبة عملاقة تبحر في المحيطات 🚢' },
]

export const WordScrambleGame: React.FC<WordScrambleProps> = ({ onFinish, isRtl }) => {
  const [round, setRound] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const currentPuzzle = PUZZLES[round]

  const currentWordAttempt = selectedLetters
    .map((idx) => currentPuzzle.scrambled[idx])
    .join('')

  const handleLetterClick = (index: number) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index))
      return
    }

    const nextSelected = [...selectedLetters, index]
    setSelectedLetters(nextSelected)

    const attempt = nextSelected.map((i) => currentPuzzle.scrambled[i]).join('')
    if (attempt === currentPuzzle.answer) {
      setIsCorrect(true)
      const nextScore = score + 250
      setScore(nextScore)

      setTimeout(() => {
        setIsCorrect(false)
        setSelectedLetters([])
        if (round + 1 < PUZZLES.length) {
          setRound(round + 1)
        } else {
          setIsFinished(true)
          onFinish(nextScore + 300)
        }
      }, 1400)
    }
  }

  const clearSelection = () => {
    setSelectedLetters([])
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto text-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder text-xs font-mono">
        <span className="text-amber-400 font-black">
          {isRtl ? 'اللغز:' : 'PUZZLE:'} {round + 1} / {PUZZLES.length}
        </span>
        <span className="text-cyan-300 font-black">{score} XP</span>
      </div>

      {!isFinished ? (
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Hint Card */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-purple/40 flex items-center gap-3 w-full">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <p className="text-xs text-slate-200 font-bold text-start">{currentPuzzle.hint}</p>
          </div>

          {/* Current Word Display */}
          <div className="min-h-14 px-6 py-2 rounded-2xl bg-black/60 border-2 border-brand-purple/60 flex items-center justify-center gap-2 text-2xl font-black text-cyan-300 tracking-widest shadow-inner">
            {currentWordAttempt || <span className="text-xs text-slate-500 font-normal">{isRtl ? 'انقر على الحروف لتجميع الكلمة' : 'Click letters to assemble word'}</span>}
          </div>

          {/* Scrambled Letter Tiles */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {currentPuzzle.scrambled.map((char, i) => {
              const isUsed = selectedLetters.includes(i)
              return (
                <button
                  key={i}
                  onClick={() => handleLetterClick(i)}
                  className={`w-12 h-12 rounded-2xl border-2 font-black text-lg flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                    isUsed
                      ? 'bg-purple-950/60 border-purple-400/30 text-purple-400 opacity-40 scale-95'
                      : 'bg-gradient-to-br from-brand-card to-purple-900/40 border-purple-500 text-white shadow-glow hover:scale-105'
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
            className="text-xs text-slate-400 hover:text-white underline font-bold"
          >
            {isRtl ? 'إعادة ترتيب الحروف' : 'Clear selection'}
          </button>

          {/* Success Overlay */}
          {isCorrect && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 text-xs font-black flex items-center gap-2 animate-bounce-short">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'إجابة عبقرية صحيحة! +250 XP 🎉' : 'Correct Word! +250 XP 🎉'}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-brand-card border-2 border-amber-400 shadow-glow-gold flex flex-col items-center gap-3 w-full animate-bounce-short">
          <Trophy className="w-12 h-12 text-amber-400" />
          <h4 className="text-lg font-black text-white">{isRtl ? 'عبقري الكلمات والحروف! 🔤' : 'Word Master Champion!'}</h4>
          <p className="text-xs text-slate-300">{score + 300} XP</p>
          <Button variant="gold" size="sm" onClick={() => { setRound(0); setScore(0); setIsFinished(false); }} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}
