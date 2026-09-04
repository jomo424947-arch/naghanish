import React, { useState, useRef, useEffect } from 'react'
import { RotateCcw, Trash2, CheckCircle2, Sparkles, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'

interface DrawAndGuessProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

const PROMPTS = [
  { word: 'بيتزا', wordEn: 'pizza', icon: '🍕' },
  { word: 'روبوت', wordEn: 'robot', icon: '🤖' },
  { word: 'طائرة', wordEn: 'airplane', icon: '✈️' },
  { word: 'تاج', wordEn: 'crown', icon: '👑' },
  { word: 'قمر', wordEn: 'moon', icon: '🌙' },
]

export const DrawAndGuessGame: React.FC<DrawAndGuessProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#00d2ff')
  const [lineWidth, setLineWidth] = useState(4)
  const [promptIdx, setPromptIdx] = useState(0)
  const [guessInput, setGuessInput] = useState('')
  const [isGuessed, setIsGuessed] = useState(false)
  const [score, setScore] = useState(0)

  const currentPrompt = PROMPTS[promptIdx]

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#0a081a'
    ctx.fillRect(0, 0, 320, 240)
  }

  useEffect(() => {
    clearCanvas()
  }, [promptIdx])

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDraw = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.beginPath()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = color

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanGuess = guessInput.trim().toLowerCase()
    if (
      cleanGuess === currentPrompt.word.toLowerCase() ||
      cleanGuess === currentPrompt.wordEn.toLowerCase()
    ) {
      setIsGuessed(true)
      const newScore = score + 300
      setScore(newScore)
      setTimeout(() => {
        setIsGuessed(false)
        setGuessInput('')
        if (promptIdx + 1 < PROMPTS.length) {
          setPromptIdx((p) => p + 1)
        } else {
          onFinish(newScore + 400)
        }
      }, 1500)
    } else {
      setGuessInput('')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Header & Prompt */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/50 border border-brand-cardBorder text-xs">
        <span className="text-amber-300 font-black">
          {isRtl ? 'المطلوب رسمه:' : 'DRAW THIS:'}{' '}
          <span className="text-white text-sm underline">{currentPrompt.word} {currentPrompt.icon}</span>
        </span>
        <span className="text-cyan-300 font-mono font-black">{score} XP</span>
      </div>

      {/* Drawing Canvas */}
      <div className="relative rounded-2xl border-2 border-brand-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden">
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
          className="bg-brand-darkBg block cursor-crosshair touch-none"
        />

        {isGuessed && (
          <div className="absolute inset-0 bg-emerald-950/85 flex flex-col items-center justify-center gap-2 text-center animate-bounce-short">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <h4 className="text-base font-black text-white">{isRtl ? 'تخمين صحيح ومبدع! 🎉' : 'Correct Guess! 🎉'}</h4>
            <p className="text-xs text-emerald-300 font-mono">+300 XP</p>
          </div>
        )}
      </div>

      {/* Palette & Tools */}
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-2">
          {['#00d2ff', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ffffff'].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-90 ${
                color === c ? 'scale-125 border-white shadow' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <button
          onClick={clearCanvas}
          className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 active:scale-95 text-xs font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isRtl ? 'مسح' : 'Clear'}</span>
        </button>
      </div>

      {/* Guess Input Form */}
      <form onSubmit={handleGuessSubmit} className="w-full flex items-center gap-2">
        <input
          type="text"
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
          placeholder={isRtl ? 'اكتب تخمينك هنا واضغط Enter...' : 'Type your guess here...'}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-brand-card border border-brand-cardBorder text-white text-xs font-bold outline-none focus:border-cyan-400"
        />
        <Button variant="primary" size="sm" type="submit">
          {isRtl ? 'تخمين 🎯' : 'Guess 🎯'}
        </Button>
      </form>
    </div>
  )
}
