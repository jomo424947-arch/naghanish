import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Zap, Shield, Flame } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface PongGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  size: number
}

interface BallTrail {
  x: number
  y: number
  color: string
  alpha: number
}

export const PongGame: React.FC<PongGameProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PLAYER_WIN' | 'AI_WIN'>('IDLE')
  const [rallyCount, setRallyCount] = useState(0)
  const [maxRally, setMaxRally] = useState(0)

  const stateRef = useRef({
    running: false,
    pY: 130,
    aiY: 130,
    paddleW: 10,
    paddleH: 70,
    ballX: 240,
    ballY: 160,
    ballDX: 4.5,
    ballDY: 2.5,
    baseSpeed: 4.5,
    currentSpeed: 4.5,
    ballR: 6,
    pScore: 0,
    aiScore: 0,
    rally: 0,
    particles: [] as Particle[],
    trail: [] as BallTrail[],
    shake: 0,
    lastPaddleY: 130,
    paddleVelocityY: 0,
    isSuperSmash: false,
  })

  const WIN_SCORE = 5

  const resetBall = (scoredAgainstPlayer: boolean) => {
    const s = stateRef.current
    s.ballX = 240
    s.ballY = 160
    const initialSpeed = difficulty === 'Easy' ? 4.0 : difficulty === 'Hard' ? 5.5 : 4.8
    s.baseSpeed = initialSpeed
    s.currentSpeed = initialSpeed
    s.ballDX = (scoredAgainstPlayer ? 1 : -1) * initialSpeed
    s.ballDY = (Math.random() - 0.5) * initialSpeed * 1.2
    s.rally = 0
    s.isSuperSmash = false
    setRallyCount(0)
  }

  const startGame = () => {
    const initialSpeed = difficulty === 'Easy' ? 4.0 : difficulty === 'Hard' ? 5.5 : 4.8
    stateRef.current = {
      running: true,
      pY: 125,
      aiY: 125,
      paddleW: 10,
      paddleH: 70,
      ballX: 240,
      ballY: 160,
      ballDX: (Math.random() > 0.5 ? 1 : -1) * initialSpeed,
      ballDY: (Math.random() - 0.5) * initialSpeed,
      baseSpeed: initialSpeed,
      currentSpeed: initialSpeed,
      ballR: 6,
      pScore: 0,
      aiScore: 0,
      rally: 0,
      particles: [],
      trail: [],
      shake: 0,
      lastPaddleY: 125,
      paddleVelocityY: 0,
      isSuperSmash: false,
    }
    setPlayerScore(0)
    setAiScore(0)
    setRallyCount(0)
    setMaxRally(0)
    setGameState('PLAYING')
    soundManager.playPowerUp()
  }

  // Mouse / Touch movement tracking
  const updatePaddlePos = (clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleY = 320 / rect.height
    const relativeY = (clientY - rect.top) * scaleY
    const s = stateRef.current
    const newY = Math.max(0, Math.min(320 - s.paddleH, relativeY - s.paddleH / 2))
    s.paddleVelocityY = newY - s.lastPaddleY
    s.lastPaddleY = newY
    s.pY = newY
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => updatePaddlePos(e.clientY)
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches[0]) updatePaddlePos(e.touches[0].clientY)
  }

  // Animation & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const render = () => {
      const s = stateRef.current

      if (s.running) {
        // AI Tracking with organic human lag & anticipation
        const aiSpeed = difficulty === 'Easy' ? 3.2 : difficulty === 'Hard' ? 5.2 : 4.2
        const aiTarget = s.ballY - s.paddleH / 2
        // If ball is heading away, return to center
        const destY = s.ballDX > 0 ? aiTarget : 160 - s.paddleH / 2

        if (s.aiY + s.paddleH / 2 < destY + s.paddleH / 2 - 8) {
          s.aiY += aiSpeed
        } else if (s.aiY + s.paddleH / 2 > destY + s.paddleH / 2 + 8) {
          s.aiY -= aiSpeed
        }
        s.aiY = Math.max(0, Math.min(320 - s.paddleH, s.aiY))

        // Move Ball
        s.ballX += s.ballDX
        s.ballY += s.ballDY

        // Add trail
        s.trail.unshift({
          x: s.ballX,
          y: s.ballY,
          color: s.isSuperSmash ? '#f43f5e' : s.currentSpeed > 7 ? '#a855f7' : '#06b6d4',
          alpha: 0.6,
        })
        if (s.trail.length > 8) s.trail.pop()

        // Top / Bottom Wall Bounce
        if (s.ballY - s.ballR <= 0) {
          s.ballY = s.ballR
          s.ballDY = Math.abs(s.ballDY)
          soundManager.playMove()
        } else if (s.ballY + s.ballR >= 320) {
          s.ballY = 320 - s.ballR
          s.ballDY = -Math.abs(s.ballDY)
          soundManager.playMove()
        }

        // PLAYER PADDLE COLLISION (Left: x=20)
        if (
          s.ballX - s.ballR <= 20 + s.paddleW &&
          s.ballX + s.ballR >= 20 &&
          s.ballY >= s.pY &&
          s.ballY <= s.pY + s.paddleH &&
          s.ballDX < 0
        ) {
          // Calculate hit angle offset
          const relativeIntersectY = (s.pY + s.paddleH / 2) - s.ballY
          const normalizedRelativeIntersectionY = relativeIntersectY / (s.paddleH / 2)
          const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3) // max 60 deg

          // Speed increment
          s.currentSpeed = Math.min(11, s.currentSpeed * 1.05)
          s.ballDX = Math.abs(Math.cos(bounceAngle) * s.currentSpeed)
          s.ballDY = -Math.sin(bounceAngle) * s.currentSpeed + s.paddleVelocityY * 0.2

          // Check Super Smash (edge hit with fast paddle movement)
          const isEdgeHit = Math.abs(normalizedRelativeIntersectionY) > 0.65
          if (isEdgeHit && Math.abs(s.paddleVelocityY) > 4) {
            s.isSuperSmash = true
            s.ballDX *= 1.3
            s.shake = 8
            soundManager.playPerfectHit()
          } else {
            s.isSuperSmash = false
            soundManager.playLineClear()
          }

          s.rally++
          setRallyCount(s.rally)
          setMaxRally((prev) => Math.max(prev, s.rally))

          // Particle burst
          for (let i = 0; i < 10; i++) {
            s.particles.push({
              x: 20 + s.paddleW,
              y: s.ballY,
              vx: Math.random() * 4 + 1,
              vy: (Math.random() - 0.5) * 4,
              color: s.isSuperSmash ? '#f43f5e' : '#38bdf8',
              alpha: 1,
              size: Math.random() * 3 + 2,
            })
          }
        }

        // AI PADDLE COLLISION (Right: x = 460 - paddleW)
        const aiPaddleX = 460 - s.paddleW
        if (
          s.ballX + s.ballR >= aiPaddleX &&
          s.ballX - s.ballR <= aiPaddleX + s.paddleW &&
          s.ballY >= s.aiY &&
          s.ballY <= s.aiY + s.paddleH &&
          s.ballDX > 0
        ) {
          const relativeIntersectY = (s.aiY + s.paddleH / 2) - s.ballY
          const normalizedRelativeIntersectionY = relativeIntersectY / (s.paddleH / 2)
          const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3)

          s.currentSpeed = Math.min(10.5, s.currentSpeed * 1.04)
          s.ballDX = -Math.abs(Math.cos(bounceAngle) * s.currentSpeed)
          s.ballDY = -Math.sin(bounceAngle) * s.currentSpeed
          s.isSuperSmash = false
          soundManager.playLineClear()

          s.rally++
          setRallyCount(s.rally)
          setMaxRally((prev) => Math.max(prev, s.rally))

          for (let i = 0; i < 8; i++) {
            s.particles.push({
              x: aiPaddleX,
              y: s.ballY,
              vx: -(Math.random() * 4 + 1),
              vy: (Math.random() - 0.5) * 4,
              color: '#ec4899',
              alpha: 1,
              size: Math.random() * 3 + 2,
            })
          }
        }

        // GOAL SCORED!
        // Player scores!
        if (s.ballX > 485) {
          s.pScore++
          setPlayerScore(s.pScore)
          s.shake = 12
          soundManager.playPowerUp()

          if (s.pScore >= WIN_SCORE) {
            s.running = false
            setGameState('PLAYER_WIN')
            const finalScore = s.pScore * 200 + (s.pScore - s.aiScore) * 150 + s.rally * 30
            onFinish(finalScore)
          } else {
            resetBall(false)
          }
        }
        // AI scores!
        else if (s.ballX < -5) {
          s.aiScore++
          setAiScore(s.aiScore)
          s.shake = 12
          soundManager.playMiss()

          if (s.aiScore >= WIN_SCORE) {
            s.running = false
            setGameState('AI_WIN')
            onFinish(s.pScore * 100 + 100)
          } else {
            resetBall(true)
          }
        }
      }

      // RENDER CANVAS
      ctx.save()
      ctx.clearRect(0, 0, 480, 320)

      // Screen Shake
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      // Cyber Court Background
      const bgGrad = ctx.createRadialGradient(240, 160, 50, 240, 160, 280)
      bgGrad.addColorStop(0, '#0a0e27')
      bgGrad.addColorStop(1, '#02040d')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, 480, 320)

      // Center court dashed line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(240, 0)
      ctx.lineTo(240, 320)
      ctx.stroke()
      ctx.setLineDash([])

      // Center Court Cyber Circle
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(240, 160, 40, 0, Math.PI * 2)
      ctx.stroke()

      // 1. Draw Ball Trail
      s.trail.forEach((t, i) => {
        ctx.fillStyle = t.color
        ctx.globalAlpha = t.alpha * (1 - i / s.trail.length)
        ctx.beginPath()
        ctx.arc(t.x, t.y, s.ballR * (1 - (i * 0.08)), 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // 2. Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.04
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        if (p.alpha <= 0) s.particles.splice(i, 1)
      }
      ctx.globalAlpha = 1

      // 3. Draw Player Paddle (Cyan)
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.roundRect(20, s.pY, s.paddleW, s.paddleH, 5)
      ctx.fill()

      // 4. Draw AI Paddle (Pink)
      ctx.shadowColor = '#ec4899'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#f43f5e'
      ctx.beginPath()
      ctx.roundRect(460 - s.paddleW, s.aiY, s.paddleW, s.paddleH, 5)
      ctx.fill()
      ctx.shadowBlur = 0

      // 5. Draw Ball
      const ballColor = s.isSuperSmash ? '#ff0055' : '#ffffff'
      ctx.shadowColor = s.isSuperSmash ? '#ff0055' : '#38bdf8'
      ctx.shadowBlur = s.isSuperSmash ? 16 : 10
      ctx.fillStyle = ballColor
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [difficulty, onFinish])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto select-none">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full px-6 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-cyan-400 font-mono">PLAYER</span>
          <span className="text-2xl font-black font-mono text-cyan-300">{playerScore}</span>
        </div>

        {rallyCount > 2 && (
          <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-pulse">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{rallyCount}x RALLY</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-mono text-pink-400">{aiScore}</span>
          <span className="text-xs font-bold text-pink-400 font-mono">AI CYBER</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-none">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full max-w-[480px] h-auto block"
        />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'بونغ السيبرانية فائقة السرعة ⚡' : 'CYBER HYPER PONG ⚡'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
              {isRtl
                ? 'تحكم في المضرب الأيسر بالماوس أو اللمس. سدد ضربة Smash ساحقة عند تحريك المضرب بسرعة لحظة الارتطام! أول من يصل لـ 5 نقاط يفوز.'
                : 'Control left paddle via mouse or touch. Slice at speed for Super Smash! First to 5 points wins.'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              {isRtl ? 'بدء المباراة' : 'Serve Ball'}
            </button>
          </div>
        )}

        {/* Win / Loss Overlay */}
        {(gameState === 'PLAYER_WIN' || gameState === 'AI_WIN') && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              gameState === 'PLAYER_WIN'
                ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                : 'bg-red-500/20 border border-red-500/40 text-red-400'
            }`}>
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              {gameState === 'PLAYER_WIN'
                ? (isRtl ? 'انتصار ساحق للبطل! 🏆' : 'VICTORY! CHAMPION 🏆')
                : (isRtl ? 'تفوّق الذكاء الاصطناعي! 🤖' : 'AI DEFEAT! 🤖')}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl ? `النتيجة النهائية: ${playerScore} - ${aiScore}` : `Final Match Score: ${playerScore} - ${aiScore}`}
            </p>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRtl ? 'مباراة ثأرية جديدة' : 'Rematch'}</span>
            </button>
          </div>
        )}
      </div>

      <span className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl ? 'حرك الماوس أو إصبعك لأعلى ولأسفل للتحكم في المضرب' : 'Move cursor or finger up/down to control paddle'}
      </span>
    </div>
  )
}

