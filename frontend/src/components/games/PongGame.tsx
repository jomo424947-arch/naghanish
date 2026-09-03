import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'

interface PongGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
}

export const PongGame: React.FC<PongGameProps> = ({ onFinish, isRtl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PLAYER_WIN' | 'AI_WIN'>('IDLE')

  const stateRef = useRef({
    running: false,
    paddlePlayerY: 120,
    paddleAiY: 120,
    paddleW: 8,
    paddleH: 55,
    ballX: 160,
    ballY: 120,
    ballDX: 3.5,
    ballDY: 2,
    ballR: 5,
    pScore: 0,
    aScore: 0,
  })

  const startGame = () => {
    stateRef.current = {
      running: true,
      paddlePlayerY: 120,
      paddleAiY: 120,
      paddleW: 8,
      paddleH: 55,
      ballX: 160,
      ballY: 120,
      ballDX: (Math.random() > 0.5 ? 1 : -1) * 3.5,
      ballDY: (Math.random() > 0.5 ? 1 : -1) * 2,
      ballR: 5,
      pScore: 0,
      aScore: 0,
    }
    setPlayerScore(0)
    setAiScore(0)
    setGameState('PLAYING')
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const relativeY = e.clientY - rect.top
    stateRef.current.paddlePlayerY = Math.max(0, Math.min(240 - stateRef.current.paddleH, relativeY - stateRef.current.paddleH / 2))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !e.touches[0]) return
    const rect = canvas.getBoundingClientRect()
    const relativeY = e.touches[0].clientY - rect.top
    stateRef.current.paddlePlayerY = Math.max(0, Math.min(240 - stateRef.current.paddleH, relativeY - stateRef.current.paddleH / 2))
  }

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      if (!s.running) return

      // AI Paddle Movement (Smooth tracking with human delay)
      const aiCenter = s.paddleAiY + s.paddleH / 2
      if (aiCenter < s.ballY - 12) {
        s.paddleAiY += 2.8
      } else if (aiCenter > s.ballY + 12) {
        s.paddleAiY -= 2.8
      }
      s.paddleAiY = Math.max(0, Math.min(240 - s.paddleH, s.paddleAiY))

      // Move Ball
      s.ballX += s.ballDX
      s.ballY += s.ballDY

      // Top/Bottom Wall Bounce
      if (s.ballY - s.ballR < 0 || s.ballY + s.ballR > 240) {
        s.ballDY = -s.ballDY
      }

      // Player Paddle Bounce (Left: x = 15)
      if (
        s.ballX - s.ballR <= 15 + s.paddleW &&
        s.ballX + s.ballR >= 15 &&
        s.ballY >= s.paddlePlayerY &&
        s.ballY <= s.paddlePlayerY + s.paddleH
      ) {
        s.ballDX = Math.abs(s.ballDX) * 1.05
        const delta = (s.ballY - (s.paddlePlayerY + s.paddleH / 2)) / (s.paddleH / 2)
        s.ballDY = delta * 4
      }

      // AI Paddle Bounce (Right: x = 300)
      if (
        s.ballX + s.ballR >= 300 &&
        s.ballX - s.ballR <= 300 + s.paddleW &&
        s.ballY >= s.paddleAiY &&
        s.ballY <= s.paddleAiY + s.paddleH
      ) {
        s.ballDX = -Math.abs(s.ballDX) * 1.05
        const delta = (s.ballY - (s.paddleAiY + s.paddleH / 2)) / (s.paddleH / 2)
        s.ballDY = delta * 4
      }

      // Goal Check
      if (s.ballX < 0) {
        // AI scored
        s.aScore += 1
        setAiScore(s.aScore)
        if (s.aScore >= 5) {
          s.running = false
          setGameState('AI_WIN')
          onFinish(s.pScore * 100 + 100)
          return
        }
        s.ballX = 160
        s.ballY = 120
        s.ballDX = 3.5
        s.ballDY = 2
      } else if (s.ballX > 320) {
        // Player scored
        s.pScore += 1
        setPlayerScore(s.pScore)
        if (s.pScore >= 5) {
          s.running = false
          setGameState('PLAYER_WIN')
          onFinish(1000)
          return
        }
        s.ballX = 160
        s.ballY = 120
        s.ballDX = -3.5
        s.ballDY = -2
      }

      // Draw
      ctx.fillStyle = '#0a081e'
      ctx.fillRect(0, 0, 320, 240)

      // Center Dotted Line
      ctx.strokeStyle = '#ffffff20'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 6])
      ctx.beginPath()
      ctx.moveTo(160, 0)
      ctx.lineTo(160, 240)
      ctx.stroke()
      ctx.setLineDash([])

      // Player Paddle (Cyan)
      ctx.fillStyle = '#00d2ff'
      ctx.shadowColor = '#00d2ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(15, s.paddlePlayerY, s.paddleW, s.paddleH, 4)
      ctx.fill()

      // AI Paddle (Pink)
      ctx.fillStyle = '#f43f5e'
      ctx.shadowColor = '#f43f5e'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(300, s.paddleAiY, s.paddleW, s.paddleH, 4)
      ctx.fill()

      // Ball (White)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      animId = requestAnimationFrame(loop)
    }

    if (gameState === 'PLAYING') {
      animId = requestAnimationFrame(loop)
    }

    return () => cancelAnimationFrame(animId)
  }, [gameState, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-6 py-2 rounded-2xl bg-black/50 border border-cyan-500/30 font-mono text-sm font-black">
        <span className="text-cyan-300">{isRtl ? 'أنت:' : 'YOU:'} {playerScore}</span>
        <span className="text-slate-500">VS</span>
        <span className="text-rose-400">{isRtl ? 'الكمبيوتر:' : 'AI:'} {aiScore}</span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,210,255,0.3)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="bg-brand-darkBg block cursor-ns-resize touch-none"
        />

        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🏓</span>
            <p className="text-sm font-black text-white">{isRtl ? 'بينج بونج النيون السريع' : 'Neon Pong Showdown'}</p>
            <p className="text-[11px] text-slate-300">
              {isRtl ? 'حرك المضرب للأعلى والأسفل لصد الكرة.. أول من يصل لـ 5 أهداف يفوز!' : 'Move paddle up & down to deflect the ball. First to 5 points wins!'}
            </p>
            <Button variant="primary" size="sm" onClick={startGame}>
              {isRtl ? 'ابدأ المباراة 🚀' : 'Start Match 🚀'}
            </Button>
          </div>
        )}

        {gameState === 'PLAYER_WIN' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-base font-black text-emerald-400">{isRtl ? 'فوز ساحق بالبطولة! 🎉' : 'You Won! 🎉'}</p>
            <p className="text-xs text-white font-mono">{playerScore} - {aiScore}</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'العب ثانية ⚡' : 'Rematch ⚡'}
            </Button>
          </div>
        )}

        {gameState === 'AI_WIN' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🤖</span>
            <p className="text-base font-black text-rose-400">{isRtl ? 'فاز الكمبيوتر في الجولة!' : 'AI Won this round!'}</p>
            <p className="text-xs text-white font-mono">{playerScore} - {aiScore}</p>
            <Button variant="gold" size="sm" onClick={startGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              {isRtl ? 'إعادة التحدي ⚡' : 'Retry ⚡'}
            </Button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-medium">
        {isRtl ? '💡 اسحب إصبعك أو الماوس رأسياً لتحريك مضربك.' : '💡 Move your finger or mouse vertically to control paddle.'}
      </p>
    </div>
  )
}
