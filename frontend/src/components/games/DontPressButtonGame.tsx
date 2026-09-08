import React, { useState, useEffect } from 'react'
import { RotateCcw, AlertTriangle, Trophy, ShieldCheck } from 'lucide-react'
import { Button } from '@components/common/Button'

interface DontPressButtonProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const TAUNTS = [
  'إياك أن تضغط على هذا الزر الأحمر إطلاقاً! ⚠️',
  'أنا زر سري للغاية.. لا تلمسني! 🛑',
  'أعرف أن إصبعك يحكّك لتضغطه.. قاوم! 😈',
  'لو ضغطت ستنفجر شاشتك فوراً! 💥',
  'مستحيل تصمد 5 ثوانٍ أخرى دون أن تضغط! ⏳',
  'أنت على وشك الفوز وإثبات قوة إرادتك الخارقة.. لا تستسلم! 🛡️',
]

export const DontPressButtonGame: React.FC<DontPressButtonProps> = ({ onFinish, isRtl }) => {
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameState, setGameState] = useState<'IDLE' | 'COUNTING' | 'PRESSED' | 'SURVIVED'>('IDLE')
  const [tauntIdx, setTauntIdx] = useState(0)

  const startGame = () => {
    setTimeLeft(15)
    setGameState('COUNTING')
    setTauntIdx(0)
  }

  const handlePress = () => {
    if (gameState !== 'COUNTING') return
    setGameState('PRESSED')
    onFinish(150)
  }

  useEffect(() => {
    if (gameState !== 'COUNTING') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState('SURVIVED')
          onFinish(1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const tauntInterval = setInterval(() => {
      setTauntIdx((i) => (i + 1) % TAUNTS.length)
    }, 2500)

    return () => {
      clearInterval(timer)
      clearInterval(tauntInterval)
    }
  }, [gameState, onFinish])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto text-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-black">
        <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
        <span>{isRtl ? 'عالم الفوضى • تحدي الزر الممنوع' : 'FORBIDDEN BUTTON CHALLENGE'}</span>
      </div>

      {/* Countdown Timer */}
      {gameState === 'COUNTING' && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-black text-amber-300 font-mono">{timeLeft}s</span>
          <p className="text-xs text-slate-300 font-bold max-w-xs">{TAUNTS[tauntIdx]}</p>
        </div>
      )}

      {/* The Giant Forbidden Button */}
      <div className="relative py-4 flex items-center justify-center">
        <button
          onClick={handlePress}
          className={`w-44 h-44 rounded-full border-8 border-red-800 bg-gradient-to-b from-red-500 via-rose-600 to-red-900 shadow-[0_15px_35px_rgba(239,68,68,0.5)] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
            gameState === 'COUNTING' ? 'hover:scale-105 animate-pulse' : ''
          }`}
        >
          <span className="text-4xl">🚫</span>
          <span className="text-white font-black text-sm tracking-wider uppercase drop-shadow">
            {isRtl ? 'لا تضغطني!' : "DON'T PRESS!"}
          </span>
        </button>
      </div>

      {/* Outcomes */}
      {gameState === 'IDLE' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300">
            {isRtl ? 'هل تملك قوة الإرادة الكافية لتصمد 15 ثانية دون لمس هذا الزر المغري؟' : 'Can you resist the urge for 15 seconds without pressing it?'}
          </p>
          <Button variant="chaos" size="md" onClick={startGame}>
            {isRtl ? 'ابدأ اختبار الإرادة ⏳' : 'Start Challenge ⏳'}
          </Button>
        </div>
      )}

      {gameState === 'PRESSED' && (
        <div className="p-5 rounded-3xl bg-red-950/40 border-2 border-red-500 shadow-glow flex flex-col items-center gap-2 w-full animate-shake">
          <span className="text-4xl">💥</span>
          <h4 className="text-base font-black text-red-400">{isRtl ? 'خسرت! لم تستطع المقاومة 😈' : 'You caved in and pressed it!'}</h4>
          <p className="text-xs text-slate-300">{isRtl ? 'الفضول قضى عليك! حصلت على 150 نقطة فقط.' : 'Curiosity took over! Score: 150 PTS'}</p>
          <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'محاولة ثانية ⚡' : 'Try Again ⚡'}
          </Button>
        </div>
      )}

      {gameState === 'SURVIVED' && (
        <div className="p-5 rounded-3xl bg-emerald-950/40 border-2 border-emerald-400 shadow-glow-green flex flex-col items-center gap-2 w-full animate-bounce-short">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
          <h4 className="text-base font-black text-emerald-300">{isRtl ? 'إرادة فولاذية خارقة! فزت بالكامل 🎉' : 'Iron Will! You Won! 🎉'}</h4>
          <p className="text-xs text-white font-mono">{isRtl ? 'جائزة الإرادة: +1000 XP' : 'Reward: +1000 XP'}</p>
          <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            {isRtl ? 'العب ثانية ⚡' : 'Play Again ⚡'}
          </Button>
        </div>
      )}
    </div>
  )
}

