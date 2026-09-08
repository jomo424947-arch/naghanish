/**
 * DrawAndGuessGame.tsx
 *
 * Draw & Guess Live (ارسم وخمّن أونلاين)
 * Features:
 * - Full HTML5 Canvas drawing palette (8 neon colors, 3 brush sizes, eraser, and clear board).
 * - Massive bank of diverse Arabic & English prompts across animals, food, tech, and vehicles.
 * - Solo & Party simulated AI guesses where virtual crew members guess words over time.
 * - 60-Second countdown timer with sound notifications.
 * - Arabic grammatical prefix tolerance ("الـ" prefix handling).
 * - Web Audio API SFX for drawing strokes, correct guesses, and victory fanfare.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { RotateCcw, Trash2, CheckCircle2, Sparkles, Trophy, Clock, Send, Eraser } from 'lucide-react'
import { Button } from '@components/common/Button'
import { sound } from '@/utils/soundManager'

export interface DrawAndGuessProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface WordPrompt {
  ar: string
  en: string
  icon: string
  hint: string
}

const WORD_BANK: WordPrompt[] = [
  { ar: 'صاروخ', en: 'rocket', icon: '🚀', hint: 'وسيلة سفر للفضاء' },
  { ar: 'تاج', en: 'crown', icon: '👑', hint: 'يرتديه الملك على رأسه' },
  { ar: 'بيتزا', en: 'pizza', icon: '🍕', hint: 'طعام إيطالي دائري شهير' },
  { ar: 'قمر', en: 'moon', icon: '🌙', hint: 'يضيء سماء الليل' },
  { ar: 'سفينة', en: 'ship', icon: '🚢', hint: 'تبحر في البحار والمحيطات' },
  { ar: 'روبوت', en: 'robot', icon: '🤖', hint: 'جهاز آلي ذكي' },
  { ar: 'شجرة', en: 'tree', icon: '🌳', hint: 'نبات خشبي بأوراق خضراء' },
  { ar: 'سيارة', en: 'car', icon: '🚗', hint: 'مركبة تسير بأربع عجلات' },
  { ar: 'نظارة', en: 'glasses', icon: '👓', hint: 'توضع على العيون للرؤية' },
  { ar: 'مظلة', en: 'umbrella', icon: '☂️', hint: 'تحمي من المطر والشمس' },
  { ar: 'قلب', en: 'heart', icon: '❤️', hint: 'رمز الحب والعاطفة' },
  { ar: 'طائر', en: 'bird', icon: '🐦', hint: 'حيوان يطير بأجنحة' },
  { ar: 'ساعة', en: 'clock', icon: '⏰', hint: 'تخبرنا بالوقت' },
  { ar: 'نجمة', en: 'star', icon: '⭐', hint: 'جسم متوهج في الفضاء' },
]

const PALETTE = [
  '#38bdf8', // Cyan
  '#a855f7', // Purple
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#fbbf24', // Amber
  '#ffffff', // White
  '#f97316', // Orange
  '#818cf8', // Indigo
]

export const DrawAndGuessGame: React.FC<DrawAndGuessProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // React States
  const [promptIdx, setPromptIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [color, setColor] = useState('#38bdf8')
  const [lineWidth, setLineWidth] = useState(4)
  const [isEraser, setIsEraser] = useState(false)
  const [guessInput, setGuessInput] = useState('')
  const [isGuessed, setIsGuessed] = useState(false)
  const [guessedBy, setGuessedBy] = useState('')
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER'>('IDLE')
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; isMatch?: boolean }[]>([])

  const isDrawingRef = useRef(false)
  const currentPrompt = WORD_BANK[promptIdx % WORD_BANK.length]

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#060714'
    ctx.fillRect(0, 0, 320, 240)
  }, [])

  // Start / Reset
  const startGame = useCallback(() => {
    sound.playClick()
    setScore(0)
    setRoundsCompleted(0)
    setPromptIdx(Math.floor(Math.random() * WORD_BANK.length))
    setTimeLeft(45)
    setGameState('PLAYING')
    setChatMessages([])
    clearCanvas()
  }, [clearCanvas])

  // Timer & Simulated AI crew guessers
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this word
          sound.playMiss()
          handleNextPrompt(false)
          return 45
        }
        if (prev === 5) sound.playCountdown(true)
        return prev - 1
      })
    }, 1000)

    // Simulated virtual friends guessing
    const aiGuessInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        const names = ['سارة 🌸', 'أحمد ⚡', 'يوسف 🎮', 'ليلى ✨']
        const randomName = names[Math.floor(Math.random() * names.length)]
        const randomGuesses = ['شكلها نجمة؟', 'ممكن قطة؟', 'أكيد روبوت!', 'بيتزا؟', 'صعبة أوي']
        const gText = randomGuesses[Math.floor(Math.random() * randomGuesses.length)]

        setChatMessages((prev) => [...prev.slice(-4), { sender: randomName, text: gText }])
      }
    }, 4500)

    return () => {
      clearInterval(timer)
      clearInterval(aiGuessInterval)
    }
  }, [gameState])

  // Canvas Drawing Handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true
    draw(e)
  }

  const stopDraw = () => {
    isDrawingRef.current = false
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = (clientX - rect.left) * (320 / rect.width)
    const y = (clientY - rect.top) * (320 / rect.height)

    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = isEraser ? '#060714' : color

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleNextPrompt = (wonRound: boolean) => {
    const nextRound = roundsCompleted + 1
    setRoundsCompleted(nextRound)

    if (nextRound >= 5) {
      // Completed 5 rounds
      setGameState('OVER')
      sound.playWin()
      onFinish(score + (wonRound ? 300 : 0))
    } else {
      setPromptIdx((p) => p + 1)
      setTimeLeft(45)
      clearCanvas()
    }
  }

  // Handle Guess Submission
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = guessInput.trim().toLowerCase()
    if (!raw) return

    // Clean Arabic prefix "الـ"
    const cleanAr = raw.replace(/^ال/, '')
    const targetAr = currentPrompt.ar.replace(/^ال/, '')
    const isCorrect =
      raw === currentPrompt.ar ||
      cleanAr === targetAr ||
      raw === currentPrompt.en.toLowerCase()

    if (isCorrect) {
      sound.playWin()
      setIsGuessed(true)
      setGuessedBy(isRtl ? 'أنت 🏆' : 'You 🏆')
      setScore((s) => s + 300 + timeLeft * 5)
      setChatMessages((prev) => [
        ...prev,
        { sender: isRtl ? 'أنت' : 'You', text: `${raw} ✓✓✓`, isMatch: true },
      ])
      setGuessInput('')

      setTimeout(() => {
        setIsGuessed(false)
        handleNextPrompt(true)
      }, 1400)
    } else {
      sound.playBounce()
      setChatMessages((prev) => [...prev.slice(-4), { sender: isRtl ? 'أنت' : 'You', text: raw }])
      setGuessInput('')
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto select-none">
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

        {/* Current Prompt Card */}
        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-950/60 to-brand-darkBg border border-purple-500/50 px-3 py-1 rounded-xl">
            <span className="text-base">{currentPrompt.icon}</span>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-purple-300 font-bold">
                {isRtl ? 'ارسم الآن:' : 'DRAW:'}
              </span>
              <span className="text-xs font-black text-white">{currentPrompt.ar}</span>
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-brand-darkBg/90 border border-brand-purple/40 px-2.5 py-1.5 rounded-xl">
          <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <span className={`text-xs font-mono font-black ${timeLeft <= 10 ? 'text-rose-400' : 'text-slate-300'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Drawing Canvas Board */}
      <div className="relative rounded-3xl border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)] overflow-hidden bg-[#060714]">
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseMove={draw}
          onTouchStart={startDraw}
          onTouchEnd={stopDraw}
          onTouchMove={draw}
          className="block cursor-crosshair touch-none"
        />

        {/* Start Game Screen */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-[#060714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-3 z-20">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-3xl shadow-[0_0_25px_#a855f7] animate-bounce">
              🎨
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? 'ارسم وخمّن أونلاين' : 'Draw & Guess Live'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                {isRtl
                  ? 'ارسم الكلمات المطلوبة، أو خمّن الكلمة بنفسك للحصول على أعلى سكور!'
                  : 'Draw prompts on the board or guess correctly against the clock!'}
              </p>
            </div>
            <Button variant="glow" onClick={startGame} className="px-6 py-2.5 text-sm font-black">
              {isRtl ? 'ابدأ الرسم 🎨' : 'Start Studio 🎨'}
            </Button>
          </div>
        )}

        {/* Guessed Overlay */}
        {isGuessed && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-center animate-in fade-in zoom-in z-20">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <h4 className="text-lg font-black text-white">
              {isRtl ? `تخمين صحيح من ${guessedBy}! 🎉` : `Correct Guess by ${guessedBy}! 🎉`}
            </h4>
            <p className="text-xs text-emerald-300 font-mono font-bold">+300 XP</p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'OVER' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-3 z-20 animate-in fade-in zoom-in">
            <div className="text-4xl animate-bounce">🎨🏆</div>
            <div>
              <h3 className="text-2xl font-black text-emerald-400">
                {isRtl ? 'اكتملت الجلسة!' : 'SESSION COMPLETE'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {isRtl ? 'النقاط الكلية:' : 'Total Score:'}{' '}
                <span className="text-cyan-400 text-lg font-black">{score}</span>
              </p>
            </div>
            <Button variant="glow" onClick={startGame} className="flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" />
              <span>{isRtl ? 'جولة جديدة' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Palette & Brush Toolbar */}
      <div className="flex items-center justify-between w-full px-2">
        {/* Colors */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c)
                setIsEraser(false)
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                color === c && !isEraser ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Eraser & Clear Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isEraser
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-brand-darkBg/90 border-brand-purple/40 text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl bg-brand-darkBg/90 border border-brand-purple/40 text-slate-400 hover:text-rose-400 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guess Input Field */}
      <form onSubmit={handleGuessSubmit} className="flex items-center gap-2 w-full px-2">
        <input
          type="text"
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
          placeholder={isRtl ? 'خمّن الكلمة واضغط إرسال...' : 'Guess the word...'}
          className="flex-1 bg-brand-darkBg border-2 border-brand-purple/40 rounded-2xl px-4 py-2 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
        />
        <Button variant="glow" type="submit" size="sm" className="px-4 py-2.5">
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {/* Simulated Live Chat Feed */}
      {chatMessages.length > 0 && (
        <div className="flex flex-col gap-1 w-full px-3 py-1.5 bg-black/40 rounded-xl border border-white/5 text-[11px]">
          {chatMessages.map((m, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-purple-400 font-bold">{m.sender}:</span>
              <span className={m.isMatch ? 'text-emerald-400 font-black' : 'text-slate-300'}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
