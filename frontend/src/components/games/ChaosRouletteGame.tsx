import React, { useState } from 'react'
import { RotateCcw, Sparkles, Flame, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'

interface ChaosRouletteProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const DARES = [
  { textAr: 'تكلّم بصوت روبوت في الجولة القادمة بالكامل 🤖', textEn: 'Speak in a robot voice for the next round 🤖', xp: 300 },
  { textAr: 'اعترف بآخر موقف محرج حصل لك هذا الأسبوع 😳', textEn: 'Confess your most embarrassing moment this week 😳', xp: 400 },
  { textAr: 'مضاعفة نقاط الـ XP مضاعفة خارقة +500 XP! ⚡', textEn: 'Super Bonus! +500 XP Instant multiplier! ⚡', xp: 500 },
  { textAr: 'تحدي الضحك: لا تبتسم أبداً لمدة 30 ثانية 😐', textEn: 'Try not to smile or laugh for 30 seconds 😐', xp: 350 },
  { textAr: 'قل جملة بالمقلوب واجعل أصحابك يفهمونها 🔄', textEn: 'Say a sentence backwards and make others guess it 🔄', xp: 300 },
  { textAr: 'قل 5 كلمات تبدأ بحرف (القاف) في 5 ثوانٍ ⏱️', textEn: 'Name 5 words starting with letter Q in 5 seconds ⏱️', xp: 450 },
  { textAr: 'حكم الشلة: الجميع يصوت على عقاب خفيف لك! 🎭', textEn: 'Crew Vote: Everyone votes on a funny dare for you! 🎭', xp: 350 },
  { textAr: 'جائزة الحظ العشوائي: +250 عملة كوينز ذهبية! 💰', textEn: 'Lucky Jackpot: +250 Gold Coins Bonus! 💰', xp: 600 },
]

export const ChaosRouletteGame: React.FC<ChaosRouletteProps> = ({ onFinish, isRtl }) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedDare, setSelectedDare] = useState<typeof DARES[0] | null>(null)
  const [spinsCount, setSpinsCount] = useState(0)

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSelectedDare(null)

    const randomDegrees = Math.floor(Math.random() * 360) + 1440 // 4+ full spins
    const nextRotation = rotation + randomDegrees
    setRotation(nextRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const normalizedDegree = (nextRotation % 360)
      const index = Math.floor((360 - normalizedDegree) / (360 / DARES.length)) % DARES.length
      const dare = DARES[index]
      setSelectedDare(dare)
      setSpinsCount((c) => c + 1)
      onFinish(dare.xp + 200)
    }, 3500)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto text-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/20 border border-lime-400/40 text-lime-300 text-xs font-black">
        <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
        <span>{isRtl ? 'روليت الفوضى والتحديات المجنونة' : 'CHAOS ROULETTE & DARES'}</span>
      </div>

      {/* Spinning Wheel Graphic */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Pointer Arrow at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />

        {/* The Wheel */}
        <div
          className="w-full h-full rounded-full border-4 border-lime-400/60 shadow-[0_0_40px_rgba(132,204,22,0.35)] relative overflow-hidden transition-all ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '3.5s' : '0s',
            background: 'conic-gradient(#ef4444 0deg 45deg, #f59e0b 45deg 90deg, #10b981 90deg 135deg, #06b6d4 135deg 180deg, #8b5cf6 180deg 225deg, #ec4899 225deg 270deg, #84cc16 270deg 315deg, #3b82f6 315deg 360deg)',
          }}
        >
          {/* Slices icons */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">
            <span className="absolute top-4">🤖</span>
            <span className="absolute right-4">⚡</span>
            <span className="absolute bottom-4">🎭</span>
            <span className="absolute left-4">💰</span>
          </div>
        </div>

        {/* Center Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute w-20 h-20 rounded-full bg-brand-darkBg border-4 border-amber-400 text-white font-black text-xs shadow-glow-gold flex flex-col items-center justify-center cursor-pointer active:scale-95 disabled:opacity-75 z-10"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isSpinning ? (isRtl ? 'تدور...' : '...') : (isRtl ? 'دَوِّر!' : 'SPIN!')}</span>
        </button>
      </div>

      {/* Selected Dare Outcome Card */}
      {selectedDare && (
        <div className="p-5 rounded-3xl bg-brand-card border-2 border-lime-400 shadow-glow-lime flex flex-col items-center gap-2 animate-bounce-short w-full">
          <span className="text-3xl">🎯</span>
          <h4 className="text-base font-black text-white">{isRtl ? 'التحدي المحتوم:' : 'Your Dare:'}</h4>
          <p className="text-xs text-lime-300 font-bold leading-relaxed">{isRtl ? selectedDare.textAr : selectedDare.textEn}</p>
          <span className="text-xs font-black text-amber-300 mt-1">+{selectedDare.xp} XP</span>
        </div>
      )}

      {/* Bottom Button */}
      <Button
        variant="chaos"
        size="md"
        fullWidth
        disabled={isSpinning}
        onClick={spinWheel}
      >
        {isRtl ? 'لف العجلة واقبل التحدي 🎲' : 'Spin the Wheel 🎲'}
      </Button>
    </div>
  )
}
