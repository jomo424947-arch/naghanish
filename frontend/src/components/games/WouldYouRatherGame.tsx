import React, { useState } from 'react'
import { RotateCcw, Trophy, Sparkles, ThumbsUp } from 'lucide-react'
import { Button } from '@components/common/Button'

interface WouldYouRatherProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const DILEMMAS = [
  {
    optA: 'تعرف سر كل شخص تقابله ولكن لا تقدر تقول لأحد 🤫',
    optB: 'تقدر تطير ولكن بسرعة السلحفاة 🐢',
    optAEn: 'Know everyone’s secret but can’t tell anyone 🤫',
    optBEn: 'Fly at turtle speed 🐢',
    percentA: 64,
    percentB: 36,
  },
  {
    optA: 'ما تقدر تاكل غير بيتزا لبقية حياتك 🍕',
    optB: 'ما تقدر تشرب غير عصير برتقال دافئ 🍊',
    optAEn: 'Only eat pizza for life 🍕',
    optBEn: 'Only drink warm orange juice 🍊',
    percentA: 82,
    percentB: 18,
  },
  {
    optA: 'كل ما تتكلم لازم تغني الكلام بصوت أوبرا 🎶',
    optB: 'تمشي دائماً بنظام الركض السريع في أي مكان 🏃',
    optAEn: 'Sing every sentence in opera 🎶',
    optBEn: 'Sprint everywhere you go 🏃',
    percentA: 45,
    percentB: 55,
  },
  {
    optA: 'تنام 4 ساعات وتصحى بكامل طاقتك كأنك سوبرمان ⚡',
    optB: 'تأكل ما تحب بدون أي زيادة في الوزن إطلاقاً 🍔',
    optAEn: 'Sleep 4 hrs with 100% superman energy ⚡',
    optBEn: 'Eat anything with zero weight gain 🍔',
    percentA: 41,
    percentB: 59,
  },
  {
    optA: 'تعيش في عام 3000 بكل تكنولوجيا المستقبل 🚀',
    optB: 'ترجع بالزمن للقرون الوسطى وتصير ملك 👑',
    optAEn: 'Live in year 3000 futuristic cyber world 🚀',
    optBEn: 'Go back to medieval times as a king 👑',
    percentA: 73,
    percentB: 27,
  },
]

export const WouldYouRatherGame: React.FC<WouldYouRatherProps> = ({ onFinish, isRtl }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<'A' | 'B' | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const currentDilemma = DILEMMAS[currentIdx]

  const handlePick = (choice: 'A' | 'B') => {
    if (selectedOpt) return
    setSelectedOpt(choice)
    setScore((s) => s + 150)

    setTimeout(() => {
      if (currentIdx + 1 < DILEMMAS.length) {
        setCurrentIdx((i) => i + 1)
        setSelectedOpt(null)
      } else {
        setIsFinished(true)
        onFinish(score + 350)
      }
    }, 2000)
  }

  const restart = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setScore(0)
    setIsFinished(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto text-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder text-xs font-mono">
        <span className="text-amber-300 font-black">
          {isRtl ? 'المعضلة:' : 'DILEMMA:'} {currentIdx + 1} / {DILEMMAS.length}
        </span>
        <span className="text-cyan-300 font-black">
          {isRtl ? 'النقاط:' : 'SCORE:'} {score} XP
        </span>
      </div>

      {!isFinished ? (
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'لو خيّروك.. ماذا تختار؟ 🤔' : 'Would You Rather? 🤔'}
          </h3>

          {/* Option A Card */}
          <button
            onClick={() => handlePick('A')}
            disabled={selectedOpt !== null}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer text-start relative overflow-hidden ${
              selectedOpt === 'A'
                ? 'bg-purple-950/60 border-brand-purple shadow-glow'
                : 'bg-brand-card/90 border-brand-cardBorder hover:border-brand-purple/60'
            }`}
          >
            <span className="text-xs font-black text-purple-300 uppercase">{isRtl ? 'الخيار الأول (أ)' : 'Option A'}</span>
            <p className="text-sm font-bold text-white leading-relaxed text-center">
              {isRtl ? currentDilemma.optA : currentDilemma.optAEn}
            </p>

            {/* Percentage Bar after selection */}
            {selectedOpt && (
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs font-black text-purple-300 mb-1">
                  <span>{isRtl ? 'اختيار اللاعبين' : 'Players picked'}</span>
                  <span>{currentDilemma.percentA}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400"
                    style={{ width: `${currentDilemma.percentA}%` }}
                  />
                </div>
              </div>
            )}
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-brand-darkBg border-2 border-white/20 text-xs font-black text-amber-300 flex items-center justify-center shadow">
              {isRtl ? 'أو' : 'OR'}
            </span>
          </div>

          {/* Option B Card */}
          <button
            onClick={() => handlePick('B')}
            disabled={selectedOpt !== null}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer text-start relative overflow-hidden ${
              selectedOpt === 'B'
                ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-blue'
                : 'bg-brand-card/90 border-brand-cardBorder hover:border-cyan-400/60'
            }`}
          >
            <span className="text-xs font-black text-cyan-300 uppercase">{isRtl ? 'الخيار الثاني (ب)' : 'Option B'}</span>
            <p className="text-sm font-bold text-white leading-relaxed text-center">
              {isRtl ? currentDilemma.optB : currentDilemma.optBEn}
            </p>

            {/* Percentage Bar after selection */}
            {selectedOpt && (
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs font-black text-cyan-300 mb-1">
                  <span>{isRtl ? 'اختيار اللاعبين' : 'Players picked'}</span>
                  <span>{currentDilemma.percentB}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-400"
                    style={{ width: `${currentDilemma.percentB}%` }}
                  />
                </div>
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-brand-card border-2 border-amber-400 shadow-glow-gold flex flex-col items-center gap-3 w-full animate-bounce-short">
          <Trophy className="w-12 h-12 text-amber-400" />
          <h4 className="text-lg font-black text-white">{isRtl ? 'أكملت معضلات الشلة بنجاح! 🎉' : 'Completed all dilemmas! 🎉'}</h4>
          <p className="text-xs text-slate-300">{isRtl ? 'مجموع النقاط المكتسبة:' : 'Earned Points:'} {score + 350} XP</p>
          <Button variant="gold" size="sm" onClick={restart} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}
