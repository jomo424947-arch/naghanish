import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, CheckCircle2, XCircle, Zap, Clock } from 'lucide-react'
import { Button } from '@components/common/Button'

interface CrewTriviaProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const QUESTIONS = [
  {
    q: 'ما هو أسرع كائن حي على وجه الأرض في الانقضاض؟ 🦅',
    qEn: 'What is the fastest living creature on Earth?',
    options: ['الفهد الصياد 🐆', 'صقر الشاهين 🦅', 'سمكة التونة 🐟', 'النسر الذهبي 🦅'],
    optionsEn: ['Cheetah', 'Peregrine Falcon', 'Tuna Fish', 'Golden Eagle'],
    correct: 1,
  },
  {
    q: 'ما هي عاصمة أقدم حضارة في التاريخ وعرفت بمدينة الألف مئذنة؟ 🕌',
    qEn: 'What city is known as the City of a Thousand Minarets?',
    options: ['بغداد 🏛️', 'دمشق 🏛️', 'القاهرة 🕌', 'إسطنبول 🕌'],
    optionsEn: ['Baghdad', 'Damascus', 'Cairo', 'Istanbul'],
    correct: 2,
  },
  {
    q: 'ما هو العنصر الكيميائي الأكثر وفرة في الكون؟ 🌌',
    qEn: 'What is the most abundant chemical element in the universe?',
    options: ['الهيدروجين ⚛️', 'الأكسجين 🌬️', 'الكربون 💎', 'الهيليوم 🎈'],
    optionsEn: ['Hydrogen', 'Oxygen', 'Carbon', 'Helium'],
    correct: 0,
  },
  {
    q: 'في أي لعبة فيديو ظهرت شخصية ماريو لأول مرة عام 1981؟ 🕹️',
    qEn: 'In which video game did Mario first appear in 1981?',
    options: ['Super Mario Bros', 'Donkey Kong 🦍', 'Pac-Man', 'Zelda'],
    optionsEn: ['Super Mario Bros', 'Donkey Kong', 'Pac-Man', 'Zelda'],
    correct: 1,
  },
  {
    q: 'ما هو الشيء الذي كلما زاد نقص؟ ⏳',
    qEn: 'What is the thing that decreases as it increases?',
    options: ['الحفرة 🕳️', 'العمر 🎂', 'المال 💰', 'العلم 📚'],
    optionsEn: ['The Hole', 'Age', 'Money', 'Knowledge'],
    correct: 1,
  },
]

export const CrewTriviaGame: React.FC<CrewTriviaProps> = ({ onFinish, isRtl }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(12)
  const [isFinished, setIsFinished] = useState(false)

  const currentQ = QUESTIONS[currentIdx]

  useEffect(() => {
    if (isFinished || selectedOpt !== null) return

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          handleAnswer(-1) // Time out
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentIdx, selectedOpt, isFinished])

  const handleAnswer = (index: number) => {
    if (selectedOpt !== null) return
    setSelectedOpt(index)

    let roundScore = 0
    if (index === currentQ.correct) {
      roundScore = 200 + timeLeft * 10
      setScore((s) => s + roundScore)
    }

    setTimeout(() => {
      if (currentIdx + 1 < QUESTIONS.length) {
        setCurrentIdx((i) => i + 1)
        setSelectedOpt(null)
        setTimeLeft(12)
      } else {
        setIsFinished(true)
        onFinish(score + roundScore + 250)
      }
    }, 1500)
  }

  const restart = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setScore(0)
    setTimeLeft(12)
    setIsFinished(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto text-center">
      {/* Top Status */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder text-xs font-mono">
        <span className="text-amber-300 font-black">
          {isRtl ? 'السؤال:' : 'Q:'} {currentIdx + 1} / {QUESTIONS.length}
        </span>
        <div className="flex items-center gap-1 text-cyan-300 font-black">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeLeft}s</span>
        </div>
        <span className="text-purple-300 font-black">{score} XP</span>
      </div>

      {!isFinished ? (
        <div className="flex flex-col gap-4 w-full">
          {/* Question Card */}
          <div className="p-6 rounded-3xl bg-brand-card border-2 border-brand-purple/50 shadow-glow min-h-24 flex items-center justify-center">
            <h3 className="text-base font-black text-white leading-relaxed">
              {isRtl ? currentQ.q : currentQ.qEn}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, i) => {
              let btnStyle = 'bg-brand-card/90 border-brand-cardBorder hover:border-cyan-400'
              if (selectedOpt !== null) {
                if (i === currentQ.correct) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-glow-green'
                } else if (i === selectedOpt) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200'
                } else {
                  btnStyle = 'opacity-40 bg-brand-card border-transparent'
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedOpt !== null}
                  onClick={() => handleAnswer(i)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer font-bold text-xs ${btnStyle}`}
                >
                  <span className="text-white">{isRtl ? opt : currentQ.optionsEn[i]}</span>
                  {selectedOpt !== null && i === currentQ.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {selectedOpt === i && i !== currentQ.correct && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-brand-card border-2 border-amber-400 shadow-glow-gold flex flex-col items-center gap-3 w-full animate-bounce-short">
          <Trophy className="w-12 h-12 text-amber-400" />
          <h4 className="text-lg font-black text-white">{isRtl ? 'أنهيت جولة الأسئلة بنجاح! 🎤' : 'Trivia Complete! 🎤'}</h4>
          <p className="text-xs text-slate-300">{score + 250} XP</p>
          <Button variant="gold" size="sm" onClick={restart} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'جولة جديدة ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}
