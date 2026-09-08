/**
 * CrewTriviaGame.tsx
 *
 * Arabic Trivia Showdown (مسابقة المعلومات الكبرى)
 * Multi-category trivia engine with lifelines and streak scoring.
 * Features:
 * - Rich Arabic & English question bank across Sports, Science, History, Tech, Cinema, and Geography.
 * - 3 Interactive Lifelines: 50:50 (حذف إجابتين), Freeze Time (+10s), Skip Question (تخطي).
 * - Streak combo multiplier system (x1, x2, x3, x4).
 * - Per-question timer with countdown audio ticks.
 * - Procedural Web Audio API sounds for correct hits, misses, and lifelines.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, Trophy, CheckCircle2, XCircle, Zap, Clock, HelpCircle, Shield, FastForward } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface CrewTriviaProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Question {
  categoryAr: string
  categoryEn: string
  q: string
  qEn: string
  options: string[]
  optionsEn: string[]
  correct: number
}

const TRIVIA_BANK: Question[] = [
  {
    categoryAr: 'رياضة ⚽',
    categoryEn: 'Sports',
    q: 'من هو المنتخب الأكثر تتويجاً بلقب كأس العالم في تاريخ كرة القدم؟ 🏆',
    qEn: 'Which national team has won the most FIFA World Cups in history?',
    options: ['البرازيل (5 ألقاب) 🇧🇷', 'ألمانيا (4 ألقاب) 🇩🇪', 'إيطاليا (4 ألقاب) 🇮🇹', 'الأرجنتين (3 ألقاب) 🇦🇷'],
    optionsEn: ['Brazil (5 titles)', 'Germany (4 titles)', 'Italy (4 titles)', 'Argentina (3 titles)'],
    correct: 0,
  },
  {
    categoryAr: 'تكنولوجيا 💻',
    categoryEn: 'Technology',
    q: 'ما هو الاسم الرمزي لنظام التشغيل أندرويد الذي طورته شركة جوجل لأول مرة؟ 🤖',
    qEn: 'What company originally created Android before Google acquired it?',
    options: ['Android Inc. 🤖', 'Sun Microsystems ☀️', 'Nokia 📱', 'Bell Labs 🔬'],
    optionsEn: ['Android Inc.', 'Sun Microsystems', 'Nokia', 'Bell Labs'],
    correct: 0,
  },
  {
    categoryAr: 'علوم 🔬',
    categoryEn: 'Science',
    q: 'ما هو الكوكب الأكثر سخونة في مجموعتنا الشمسية؟ ☀️',
    qEn: 'What is the hottest planet in our solar system?',
    options: ['عطارد (الأقرب للشمس) 🪐', 'الزهرة (الغلاف الكثيف) 🌋', 'المريخ 🔴', 'المشتري 🌀'],
    optionsEn: ['Mercury', 'Venus (Dense atmosphere)', 'Mars', 'Jupiter'],
    correct: 1,
  },
  {
    categoryAr: 'تاريخ 🏛️',
    categoryEn: 'History',
    q: 'أي من عجائب الدنيا السبع القديمة هي الوحيدة التي لا تزال قائمة حتى اليوم؟ 🏛️',
    qEn: 'Which ancient Wonder of the World still stands today?',
    options: ['حدائق بابل المعلقة 🌿', 'منارة الإسكندرية 🗼', 'هرم خوفو الأكبر ⛰️', 'تمثال رودس العملاق 🗿'],
    optionsEn: ['Hanging Gardens of Babylon', 'Lighthouse of Alexandria', 'Great Pyramid of Giza', 'Colossus of Rhodes'],
    correct: 2,
  },
  {
    categoryAr: 'جغرافيا 🌍',
    categoryEn: 'Geography',
    q: 'ما هي الدولة العربية الوحيدة التي تطل على البحرين الأبيض والأحمر معاً؟ 🌊',
    qEn: 'Which Arab nation borders both the Mediterranean Sea and Red Sea?',
    options: ['مصر 🇪🇬', 'السعودية 🇸🇦', 'الأردن 🇯🇴', 'السودان 🇸🇩'],
    optionsEn: ['Egypt', 'Saudi Arabia', 'Jordan', 'Sudan'],
    correct: 0,
  },
  {
    categoryAr: 'سينما 🎬',
    categoryEn: 'Cinema',
    q: 'ما هو أول فيلم سينمائي في التاريخ تجاوزت إيراداته 2 مليار دولار عالمياً؟ 🎥',
    qEn: 'What was the first movie in history to gross over $2 billion worldwide?',
    options: ['تيتانيك (Titanic) 🚢', 'أفاتار (Avatar) 🌌', 'أفنجرز: إند جيم 🦸', 'حرب النجوم ⚔️'],
    optionsEn: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars'],
    correct: 0,
  },
  {
    categoryAr: 'علوم 🧬',
    categoryEn: 'Biology',
    q: 'ما هو العضو الأكبر حجماً ووزناً في جسم الإنسان؟ 🫀',
    qEn: 'What is the largest organ in the human body?',
    options: ['الكبد 🧪', 'الجلد 🛡️', 'الرئتان 🫁', 'الدماغ 🧠'],
    optionsEn: ['Liver', 'Skin', 'Lungs', 'Brain'],
    correct: 1,
  },
  {
    categoryAr: 'رياضة 🎾',
    categoryEn: 'Sports',
    q: 'كم عدد لاعبي فريق كرة السلة داخل أرض الملعب أثناء المباراة؟ 🏀',
    qEn: 'How many players per team are on court in a basketball match?',
    options: ['4 لاعبين', '5 لاعبين', '6 لاعبين', '7 لاعبين'],
    optionsEn: ['4 players', '5 players', '6 players', '7 players'],
    correct: 1,
  },
  {
    categoryAr: 'تاريخ 📜',
    categoryEn: 'History',
    q: 'من هو القائد المسلم الذي فتح بلاد الأندلس عام 711 ميلادي؟ ⚔️',
    qEn: 'Who was the Muslim military commander that conquered Hispania in 711 AD?',
    options: ['طارق بن زياد ⚔️', 'صلاح الدين الأيوبي 🛡️', 'خالد بن الوليد 🗡️', 'عمرو بن العاص 🏹'],
    optionsEn: ['Tariq ibn Ziyad', 'Saladin', 'Khalid ibn al-Walid', 'Amr ibn al-Aas'],
    correct: 0,
  },
  {
    categoryAr: 'تكنولوجيا 🚀',
    categoryEn: 'Technology',
    q: 'ما اسم أول قمر صناعي أطلقه البشر إلى الفضاء الخارجي عام 1957؟ 🛰️',
    qEn: 'What was the first artificial satellite launched into orbit in 1957?',
    options: ['أبولو 11 🌕', 'سبوتنيك 1 🛰️', 'فوستوك 1 🚀', 'إكسبلورر 1 🔭'],
    optionsEn: ['Apollo 11', 'Sputnik 1', 'Vostok 1', 'Explorer 1'],
    correct: 1,
  },
]

export const CrewTriviaGame: React.FC<CrewTriviaProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [timeLeft, setTimeLeft] = useState(15)
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([])
  const [used5050, setUsed5050] = useState(false)
  const [usedFreeze, setUsedFreeze] = useState(false)
  const [usedSkip, setUsedSkip] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const currentQ = TRIVIA_BANK[currentIdx % TRIVIA_BANK.length]
  const timerRef = useRef<number | null>(null)

  // Timer per question
  useEffect(() => {
    if (isFinished || selectedOpt !== null) return

    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleAnswer(-1) // Timeout
          return 0
        }
        if (t === 4) sound.playCountdown(true)
        return t - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIdx, selectedOpt, isFinished])

  // Answer handler
  const handleAnswer = (index: number) => {
    if (selectedOpt !== null) return
    setSelectedOpt(index)
    if (timerRef.current) clearInterval(timerRef.current)

    let gained = 0
    if (index === currentQ.correct) {
      sound.playCoin()
      const newStreak = streak + 1
      setStreak(newStreak)

      let mult = 1
      if (newStreak >= 8) mult = 4
      else if (newStreak >= 5) mult = 3
      else if (newStreak >= 3) mult = 2
      setMultiplier(mult)

      gained = (200 + timeLeft * 10) * mult
      setScore((s) => s + gained)
    } else {
      sound.playMiss()
      setStreak(0)
      setMultiplier(1)
    }

    setTimeout(() => {
      if (currentIdx + 1 < TRIVIA_BANK.length) {
        setCurrentIdx((i) => i + 1)
        setSelectedOpt(null)
        setHiddenOptions([])
        setTimeLeft(15)
      } else {
        setIsFinished(true)
        sound.playWin()
        onFinish(score + gained + 300)
      }
    }, 1300)
  }

  // ── Lifelines ──
  const handle5050 = () => {
    if (used5050 || selectedOpt !== null) return
    sound.playPowerUp()
    setUsed5050(true)

    // Eliminate 2 wrong answers
    const wrongIndices = [0, 1, 2, 3].filter((idx) => idx !== currentQ.correct)
    const toRemove = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2)
    setHiddenOptions(toRemove)
  }

  const handleFreeze = () => {
    if (usedFreeze || selectedOpt !== null) return
    sound.playShieldUp()
    setUsedFreeze(true)
    setTimeLeft((t) => t + 10)
  }

  const handleSkip = () => {
    if (usedSkip || selectedOpt !== null) return
    sound.playSwoosh()
    setUsedSkip(true)
    if (currentIdx + 1 < TRIVIA_BANK.length) {
      setCurrentIdx((i) => i + 1)
      setSelectedOpt(null)
      setHiddenOptions([])
      setTimeLeft(15)
    }
  }

  const restart = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setHiddenOptions([])
    setScore(0)
    setStreak(0)
    setMultiplier(1)
    setUsed5050(false)
    setUsedFreeze(false)
    setUsedSkip(false)
    setTimeLeft(15)
    setIsFinished(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto select-none">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Score & Streak */}
        <div className="flex items-center gap-2 bg-brand-darkBg/90 border border-brand-purple/40 px-3 py-1.5 rounded-xl shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isRtl ? 'النقاط' : 'Score'}
            </span>
            <span className="text-sm font-black text-cyan-400 leading-none">{score}</span>
          </div>
        </div>

        {/* Streak indicator */}
        {streak >= 3 && (
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/60 px-2.5 py-1 rounded-xl text-amber-300 text-xs font-black animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>x{multiplier} STREAK</span>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl">
          <Clock className={`w-3.5 h-3.5 ${timeLeft <= 4 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <span className={`text-xs font-mono font-black ${timeLeft <= 4 ? 'text-rose-400' : 'text-slate-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Lifelines Toolbar */}
      <div className="grid grid-cols-3 gap-2 w-full px-2">
        <button
          onClick={handle5050}
          disabled={used5050 || selectedOpt !== null}
          className="py-1.5 px-2 rounded-xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 active:scale-95 text-purple-300 text-[11px] font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>50 : 50</span>
        </button>

        <button
          onClick={handleFreeze}
          disabled={usedFreeze || selectedOpt !== null}
          className="py-1.5 px-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 text-cyan-300 text-[11px] font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>+10s {isRtl ? 'تمديد' : 'Time'}</span>
        </button>

        <button
          onClick={handleSkip}
          disabled={usedSkip || selectedOpt !== null}
          className="py-1.5 px-2 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 active:scale-95 text-amber-300 text-[11px] font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-1 cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>{isRtl ? 'تخطي' : 'Skip'}</span>
        </button>
      </div>

      {!isFinished ? (
        <div className="flex flex-col gap-3 w-full px-2">
          {/* Question Card */}
          <div className="p-5 rounded-3xl bg-[#060714] border-2 border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center text-center gap-2">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              {isRtl ? currentQ.categoryAr : currentQ.categoryEn} • {currentIdx + 1}/{TRIVIA_BANK.length}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white leading-relaxed">
              {isRtl ? currentQ.q : currentQ.qEn}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2">
            {currentQ.options.map((opt, i) => {
              const isHidden = hiddenOptions.includes(i)
              let btnStyle = 'bg-brand-darkBg/90 border-brand-purple/40 text-slate-200 hover:border-cyan-400'

              if (selectedOpt !== null) {
                if (i === currentQ.correct) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_#10b981]'
                } else if (i === selectedOpt) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_15px_#f43f5e]'
                } else {
                  btnStyle = 'opacity-30 bg-brand-darkBg border-transparent text-slate-500'
                }
              }

              if (isHidden) {
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-white/5 bg-black/20 opacity-20 text-center text-xs"
                  >
                    —
                  </div>
                )
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOpt !== null}
                  className={`p-3.5 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-between active:scale-98 shadow-md cursor-pointer ${btnStyle}`}
                >
                  <span className="text-right flex-1">{isRtl ? opt : currentQ.optionsEn[i]}</span>
                  {selectedOpt !== null && i === currentQ.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {selectedOpt !== null && i === selectedOpt && i !== currentQ.correct && (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* Finished Victory Screen */
        <div className="w-full p-6 rounded-3xl bg-[#060714] border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-4xl animate-bounce">🧠🏆</div>
          <div>
            <h3 className="text-2xl font-black text-emerald-400">
              {isRtl ? 'اكتمل التحدي المعرفي!' : 'TRIVIA CHAMPION!'}
            </h3>
            <p className="text-sm font-bold text-slate-200 mt-1">
              {isRtl ? 'النقاط النهائية:' : 'Final Score:'}{' '}
              <span className="text-cyan-400 text-lg font-black">{score}</span>
            </p>
          </div>
          <Button variant="primary" onClick={restart} className="flex items-center gap-2 px-6 py-2.5">
            <RotateCcw className="w-4 h-4" />
            <span>{isRtl ? 'مسابقة جديدة' : 'Play Again'}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

