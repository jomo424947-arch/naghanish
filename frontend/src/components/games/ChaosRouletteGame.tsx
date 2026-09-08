import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Sparkles, Flame, Zap, Shield, Skull, AlertCircle } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface ChaosRouletteProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Sector {
  id: string
  labelAr: string
  labelEn: string
  icon: string
  color: string
  xp: number
  descAr: string
  descEn: string
  actionType: 'dare' | 'jackpot' | 'glitch' | 'shield' | 'penalty'
}

const SECTORS: Sector[] = [
  {
    id: 'jackpot',
    labelAr: 'الجائزة الكبرى',
    labelEn: 'JACKPOT',
    icon: '💎',
    color: '#06b6d4',
    xp: 1200,
    descAr: 'ربحت كنز الفوضى الأسطوري! +1200 نقطة فخرية!',
    descEn: 'Legendary Cyber Jackpot! +1200 bonus XP!',
    actionType: 'jackpot',
  },
  {
    id: 'dare_robot',
    labelAr: 'صوت روبوت',
    labelEn: 'Robot Voice',
    icon: '🤖',
    color: '#8b5cf6',
    xp: 400,
    descAr: 'تحدث بصوت روبوت متقطع في الرسائل القادمة 🤖',
    descEn: 'Speak only in a staccato robotic voice! 🤖',
    actionType: 'dare',
  },
  {
    id: 'glitch',
    labelAr: 'خلل كمومي',
    labelEn: 'Quantum Glitch',
    icon: '👾',
    color: '#ec4899',
    xp: 650,
    descAr: 'تشويش بصري في النظام ومكافأة اختراق +650 XP!',
    descEn: 'System visual glitch & hack bonus +650 XP!',
    actionType: 'glitch',
  },
  {
    id: 'dare_rhyme',
    labelAr: 'تحدي القافية',
    labelEn: 'Speed Rhyme',
    icon: '🎤',
    color: '#f59e0b',
    xp: 450,
    descAr: 'قل بيتاً أو جملتين على نفس القافية في 5 ثوانٍ!',
    descEn: 'Make a 2-line rhyme in under 5 seconds!',
    actionType: 'dare',
  },
  {
    id: 'shield',
    labelAr: 'درع الحصانة',
    labelEn: 'Cyber Shield',
    icon: '🛡️',
    color: '#10b981',
    xp: 500,
    descAr: 'درع سيبراني يمنحك حصانة كاملة من أي خسارة!',
    descEn: 'Cyber shield granting immunity against any penalty!',
    actionType: 'shield',
  },
  {
    id: 'dare_laugh',
    labelAr: 'ممنوع الضحك',
    labelEn: 'No Smiling',
    icon: '😐',
    color: '#ef4444',
    xp: 400,
    descAr: 'تحدي التجهم: ممنوع الابتسام نهائياً لمدة 30 ثانية!',
    descEn: 'Deadpan challenge: zero smiling for 30 seconds!',
    actionType: 'dare',
  },
  {
    id: 'triple_xp',
    labelAr: 'مضاعف 3X',
    labelEn: '3X Multiplier',
    icon: '⚡',
    color: '#a855f7',
    xp: 900,
    descAr: 'مضاعفة خارقة للنتيجة ثلاث مرات!',
    descEn: 'Hyper score boost! 3X Score Multiplier!',
    actionType: 'jackpot',
  },
  {
    id: 'dare_reverse',
    labelAr: 'كلام بالمقلوب',
    labelEn: 'Reverse Word',
    icon: '🔄',
    color: '#14b8a6',
    xp: 350,
    descAr: 'انطق اسمك أو جملة كاملة بترتيب الحروف المعكوس!',
    descEn: 'Pronounce your username in reverse letters!',
    actionType: 'dare',
  },
  {
    id: 'mystery',
    labelAr: 'صندوق الغموض',
    labelEn: 'Mystery Box',
    icon: '📦',
    color: '#f97316',
    xp: 700,
    descAr: 'فتحت صندوق الفوضى السري! مكافأة غير متوقعة!',
    descEn: 'Opened the secret chaos crate! Rare perks unlocked!',
    actionType: 'jackpot',
  },
  {
    id: 'dare_confess',
    labelAr: 'اعتراف محرج',
    labelEn: 'Confession',
    icon: '😳',
    color: '#f43f5e',
    xp: 500,
    descAr: 'اعترف بأغرب موقف مضحك صار لك في لعبة أونلاين!',
    descEn: 'Confess your funniest online gaming fail!',
    actionType: 'dare',
  },
]

export const ChaosRouletteGame: React.FC<ChaosRouletteProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [spinsCount, setSpinsCount] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  const rotRef = useRef(0)
  const animRef = useRef<number | null>(null)

  // Draw the wheel onto HTML5 Canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 360
    const height = 360
    const cx = width / 2
    const cy = height / 2
    const radius = 160
    const numSectors = SECTORS.length
    const arc = (Math.PI * 2) / numSectors

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)

    // Outer rim glow
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 8
    ctx.shadowColor = '#22c55e'
    ctx.shadowBlur = 16
    ctx.beginPath()
    ctx.arc(0, 0, radius + 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw Sectors
    SECTORS.forEach((sector, i) => {
      const startAngle = i * arc
      const endAngle = startAngle + arc

      // Sector wedge
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = sector.color
      ctx.fill()
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Sector text & icon
      ctx.save()
      ctx.rotate(startAngle + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px monospace'
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur = 4
      ctx.fillText(isRtl ? sector.labelAr : sector.labelEn, radius - 28, 4)

      // Icon
      ctx.font = '16px sans-serif'
      ctx.fillText(sector.icon, radius - 8, 5)
      ctx.restore()
    })

    // Outer pegs/lights
    for (let i = 0; i < numSectors * 2; i++) {
      const pegAngle = i * (arc / 2)
      const px = Math.cos(pegAngle) * (radius + 2)
      const py = Math.sin(pegAngle) * (radius + 2)
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#fef08a'
      ctx.fill()
    }

    ctx.restore()

    // Center Hub (fixed, does not rotate)
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = '#0f172a'
    ctx.fill()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.shadowColor = '#f59e0b'
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Center icon
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '20px sans-serif'
    ctx.fillText('🌀', cx, cy)
  }

  useEffect(() => {
    drawWheel(0)
  }, [isRtl])

  // Spin Wheel Physics
  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSelectedSector(null)
    setGlitchActive(false)
    soundManager.playPowerUp()

    let currentAngle = rotRef.current
    const totalSpins = 4 + Math.random() * 3
    const targetDelta = totalSpins * Math.PI * 2 + Math.random() * Math.PI * 2
    const targetAngle = currentAngle + targetDelta
    const duration = 4000 // 4 seconds
    const startTime = performance.now()

    let lastPegIndex = -1

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)

      // Quintic ease-out for ultra smooth deceleration
      const ease = 1 - Math.pow(1 - t, 5)
      currentAngle = rotRef.current + targetDelta * ease
      drawWheel(currentAngle)

      // Peg clicking audio trigger
      const pegStep = (Math.PI * 2) / SECTORS.length
      const currentPeg = Math.floor(currentAngle / pegStep)
      if (currentPeg !== lastPegIndex) {
        lastPegIndex = currentPeg
        soundManager.playMove()
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        rotRef.current = currentAngle % (Math.PI * 2)
        setIsSpinning(false)

        // Calculate landed sector (Arrow is at the top: angle 3*PI/2 or 270 deg)
        const normalizedAngle = (Math.PI * 2 - (rotRef.current % (Math.PI * 2))) % (Math.PI * 2)
        // Top pointer is at 1.5 * PI (270 degrees)
        const pointerOffset = (Math.PI * 1.5)
        const adjustedAngle = (normalizedAngle + pointerOffset) % (Math.PI * 2)
        const arc = (Math.PI * 2) / SECTORS.length
        const index = Math.floor(adjustedAngle / arc) % SECTORS.length

        const landed = SECTORS[index]
        setSelectedSector(landed)
        setSpinsCount((c) => c + 1)
        setTotalScore((s) => s + landed.xp)

        if (landed.actionType === 'glitch') {
          setGlitchActive(true)
          soundManager.playExplosion()
        } else if (landed.actionType === 'jackpot') {
          soundManager.playPerfectHit()
        } else {
          soundManager.playLineClear()
        }

        onFinish(landed.xp)
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div className={`flex flex-col items-center gap-5 w-full max-w-md mx-auto select-none ${glitchActive ? 'animate-pulse' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-black text-white">
            {isRtl ? 'روليت الفوضى الكمومية' : 'QUANTUM CHAOS ROULETTE'}
          </span>
        </div>
        <div className="text-sm font-black font-mono text-cyan-300">
          {totalScore} <span className="text-xs text-gray-400">XP</span>
        </div>
      </div>

      {/* Wheel Wrapper with Top Pointer */}
      <div className="relative flex items-center justify-center p-2">
        {/* Top Pointer Needle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-[0_0_12px_#f59e0b]" />

        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-[320px] h-[320px] md:w-[360px] md:h-[360px] rounded-full drop-shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        />

        {/* Center overlay spin trigger button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="absolute z-10 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black text-sm shadow-xl shadow-amber-500/40 border-2 border-white flex flex-col items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-80 transition-transform cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-black animate-spin" />
          <span>{isSpinning ? (isRtl ? 'تدور...' : 'SPIN') : (isRtl ? 'دَوِّر!' : 'SPIN!')}</span>
        </button>
      </div>

      {/* Result Card */}
      {selectedSector && (
        <div className="p-5 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border-2 border-cyan-400/60 shadow-2xl flex flex-col items-center gap-3 w-full text-center animate-bounce-short">
          <span className="text-4xl">{selectedSector.icon}</span>
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              {isRtl ? 'النتيجة المحتومة' : 'CHAOS OUTCOME'}
            </span>
            <h4 className="text-xl font-black text-white mt-1">
              {isRtl ? selectedSector.labelAr : selectedSector.labelEn}
            </h4>
          </div>

          <p className="text-sm text-gray-300 max-w-xs font-medium">
            {isRtl ? selectedSector.descAr : selectedSector.descEn}
          </p>

          <div className="text-lg font-black text-amber-300 font-mono">
            +{selectedSector.xp} XP
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-600 to-cyan-600 text-white font-black text-base hover:opacity-90 shadow-lg shadow-green-500/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>{isRtl ? 'تدوير العجلة العشوائية' : 'Spin The Chaos Wheel'}</span>
      </button>
    </div>
  )
}

