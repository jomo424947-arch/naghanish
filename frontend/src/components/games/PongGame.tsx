/**
 * PongGame.tsx
 *
 * Cyber Hyper Pong — mouse/touch paddle, AI opponent, super smash.
 * Phase 2: useGameLoop, responsive stage, level-scaled AI/ball/win points.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, Zap, Flame } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { useEventCallback } from '@hooks/useEventCallback'
import { sound } from '@/utils/soundManager'

const WORLD_W = 480
const WORLD_H = 320

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

function initialBallSpeed(level: number, difficulty: string): number {
  const d = difficulty === 'Easy' ? 4.0 : difficulty === 'Hard' ? 5.5 : 4.8
  return d + (level - 1) * 0.35
}

function aiSpeedFor(level: number, difficulty: string): number {
  const d = difficulty === 'Easy' ? 3.2 : difficulty === 'Hard' ? 5.2 : 4.2
  return d + (level - 1) * 0.4
}

function winScoreFor(level: number): number {
  return Math.min(9, 4 + Math.floor(level / 2))
}

export const PongGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width, height, prepareCanvas } = useResponsiveStage({
    aspectRatio: WORLD_W / WORLD_H,
    minWidth: 280,
    maxWidth: 520,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PLAYER_WIN' | 'AI_WIN'>('IDLE')
  const [rallyCount, setRallyCount] = useState(0)
  const [maxRally, setMaxRally] = useState(0)

  const WIN_SCORE = winScoreFor(level)
  const finishedRef = useRef(false)
  const gameStateRef = useRef(gameState)
  gameStateRef.current = gameState

  const stateRef = useRef({
    running: false,
    pY: 130,
    aiY: 130,
    paddleW: 10,
    paddleH: 70,
    ballX: WORLD_W / 2,
    ballY: WORLD_H / 2,
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

  const finishMatch = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared ? (finalScore >= 800 ? 3 : finalScore >= 400 ? 2 : 1) : 0
      if (cleared) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      } else {
        sound.playGameOver()
      }
      onFinish(finalScore, { levelReached: level, stars, clearedAll: false })
    },
    [level, onFinish, onLevelComplete]
  )

  const resetBall = useEventCallback((scoredAgainstPlayer: boolean) => {
    const s = stateRef.current
    s.ballX = WORLD_W / 2
    s.ballY = WORLD_H / 2
    const spd = initialBallSpeed(level, difficulty)
    s.baseSpeed = spd
    s.currentSpeed = spd
    s.ballDX = (scoredAgainstPlayer ? 1 : -1) * spd
    s.ballDY = (Math.random() - 0.5) * spd * 1.2
    s.rally = 0
    s.isSuperSmash = false
    setRallyCount(0)
  })

  const startGame = useCallback(
    (autoStart = true) => {
      sound.playClick()
      const spd = initialBallSpeed(level, difficulty)
      stateRef.current = {
        running: autoStart,
        pY: 125,
        aiY: 125,
        paddleW: 10,
        paddleH: Math.max(48, 70 - (level - 1) * 3),
        ballX: WORLD_W / 2,
        ballY: WORLD_H / 2,
        ballDX: (Math.random() > 0.5 ? 1 : -1) * spd,
        ballDY: (Math.random() - 0.5) * spd,
        baseSpeed: spd,
        currentSpeed: spd,
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
      finishedRef.current = false
      setGameState(autoStart ? 'PLAYING' : 'IDLE')
      if (autoStart) sound.playPowerUp()
    },
    [difficulty, level]
  )

  useEffect(() => {
    startGame(false)
  }, [level, startGame])

  const updatePaddlePos = (clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (rect.height <= 0) return
    const relativeY = ((clientY - rect.top) / rect.height) * WORLD_H
    const s = stateRef.current
    const newY = Math.max(0, Math.min(WORLD_H - s.paddleH, relativeY - s.paddleH / 2))
    s.paddleVelocityY = newY - s.lastPaddleY
    s.lastPaddleY = newY
    s.pY = newY
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => updatePaddlePos(e.clientY)
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (e.touches[0]) updatePaddlePos(e.touches[0].clientY)
  }

  useGameLoop(
    (delta) => {
      const s = stateRef.current
      const dt = delta * 60

      if (s.running && gameStateRef.current === 'PLAYING') {
        const aiSpeed = aiSpeedFor(level, difficulty)
        const aiTarget = s.ballY - s.paddleH / 2
        const destY = s.ballDX > 0 ? aiTarget : WORLD_H / 2 - s.paddleH / 2

        if (s.aiY + s.paddleH / 2 < destY + s.paddleH / 2 - 8) {
          s.aiY += aiSpeed * dt
        } else if (s.aiY + s.paddleH / 2 > destY + s.paddleH / 2 + 8) {
          s.aiY -= aiSpeed * dt
        }
        s.aiY = Math.max(0, Math.min(WORLD_H - s.paddleH, s.aiY))

        s.ballX += s.ballDX * dt
        s.ballY += s.ballDY * dt

        s.trail.unshift({
          x: s.ballX,
          y: s.ballY,
          color: s.isSuperSmash ? '#f43f5e' : s.currentSpeed > 7 ? '#a855f7' : '#06b6d4',
          alpha: 0.6,
        })
        if (s.trail.length > 8) s.trail.pop()

        if (s.ballY - s.ballR <= 0) {
          s.ballY = s.ballR
          s.ballDY = Math.abs(s.ballDY)
          sound.playMove()
        } else if (s.ballY + s.ballR >= WORLD_H) {
          s.ballY = WORLD_H - s.ballR
          s.ballDY = -Math.abs(s.ballDY)
          sound.playMove()
        }

        if (
          s.ballX - s.ballR <= 20 + s.paddleW &&
          s.ballX + s.ballR >= 20 &&
          s.ballY >= s.pY &&
          s.ballY <= s.pY + s.paddleH &&
          s.ballDX < 0
        ) {
          const relativeIntersectY = s.pY + s.paddleH / 2 - s.ballY
          const normalizedRelativeIntersectionY = relativeIntersectY / (s.paddleH / 2)
          const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3)

          s.currentSpeed = Math.min(11 + level * 0.3, s.currentSpeed * 1.05)
          s.ballDX = Math.abs(Math.cos(bounceAngle) * s.currentSpeed)
          s.ballDY = -Math.sin(bounceAngle) * s.currentSpeed + s.paddleVelocityY * 0.2

          const isEdgeHit = Math.abs(normalizedRelativeIntersectionY) > 0.65
          if (isEdgeHit && Math.abs(s.paddleVelocityY) > 4) {
            s.isSuperSmash = true
            s.ballDX *= 1.3
            s.shake = 8
            sound.playPerfectHit()
          } else {
            s.isSuperSmash = false
            sound.playLineClear()
          }

          s.rally++
          setRallyCount(s.rally)
          setMaxRally((prev) => Math.max(prev, s.rally))

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

        const aiPaddleX = WORLD_W - 20 - s.paddleW
        if (
          s.ballX + s.ballR >= aiPaddleX &&
          s.ballX - s.ballR <= aiPaddleX + s.paddleW &&
          s.ballY >= s.aiY &&
          s.ballY <= s.aiY + s.paddleH &&
          s.ballDX > 0
        ) {
          const relativeIntersectY = s.aiY + s.paddleH / 2 - s.ballY
          const normalizedRelativeIntersectionY = relativeIntersectY / (s.paddleH / 2)
          const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3)

          s.currentSpeed = Math.min(10.5 + level * 0.25, s.currentSpeed * 1.04)
          s.ballDX = -Math.abs(Math.cos(bounceAngle) * s.currentSpeed)
          s.ballDY = -Math.sin(bounceAngle) * s.currentSpeed
          s.isSuperSmash = false
          sound.playLineClear()

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

        if (s.ballX > WORLD_W + 5) {
          s.pScore++
          setPlayerScore(s.pScore)
          s.shake = 12
          sound.playPowerUp()

          if (s.pScore >= WIN_SCORE) {
            s.running = false
            setGameState('PLAYER_WIN')
            const finalScore = s.pScore * 200 + (s.pScore - s.aiScore) * 150 + s.rally * 30
            finishMatch(finalScore, true)
          } else {
            resetBall(false)
          }
        } else if (s.ballX < -5) {
          s.aiScore++
          setAiScore(s.aiScore)
          s.shake = 12
          sound.playMiss()

          if (s.aiScore >= WIN_SCORE) {
            s.running = false
            setGameState('AI_WIN')
            finishMatch(s.pScore * 100 + 100, false)
          } else {
            resetBall(true)
          }
        }
      }

      // Particle motion (always while loop runs)
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.alpha -= 0.04 * dt
        if (p.alpha <= 0) s.particles.splice(i, 1)
      }

      const ctx = prepareCanvas(canvasRef.current)
      if (!ctx) return

      ctx.save()
      ctx.scale(width / WORLD_W, height / WORLD_H)
      ctx.clearRect(0, 0, WORLD_W, WORLD_H)

      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake)
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      const bgGrad = ctx.createRadialGradient(
        WORLD_W / 2,
        WORLD_H / 2,
        50,
        WORLD_W / 2,
        WORLD_H / 2,
        280
      )
      bgGrad.addColorStop(0, '#0a0e27')
      bgGrad.addColorStop(1, '#02040d')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, WORLD_W, WORLD_H)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 8])
      ctx.beginPath()
      ctx.moveTo(WORLD_W / 2, 0)
      ctx.lineTo(WORLD_W / 2, WORLD_H)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(WORLD_W / 2, WORLD_H / 2, 40, 0, Math.PI * 2)
      ctx.stroke()

      s.trail.forEach((t, i) => {
        ctx.fillStyle = t.color
        ctx.globalAlpha = t.alpha * (1 - i / s.trail.length)
        ctx.beginPath()
        ctx.arc(t.x, t.y, s.ballR * (1 - i * 0.08), 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      s.particles.forEach((p) => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.roundRect(20, s.pY, s.paddleW, s.paddleH, 5)
      ctx.fill()

      ctx.shadowColor = '#ec4899'
      ctx.fillStyle = '#f43f5e'
      ctx.beginPath()
      ctx.roundRect(WORLD_W - 20 - s.paddleW, s.aiY, s.paddleW, s.paddleH, 5)
      ctx.fill()
      ctx.shadowBlur = 0

      const ballColor = s.isSuperSmash ? '#ff0055' : '#ffffff'
      ctx.shadowColor = s.isSuperSmash ? '#ff0055' : '#38bdf8'
      ctx.shadowBlur = s.isSuperSmash ? 16 : 10
      ctx.fillStyle = ballColor
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.restore()
    },
    { running: !isPaused && gameState !== 'IDLE' }
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto select-none">
      <div className="flex items-center justify-between w-full px-6 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-cyan-400 font-mono">PLAYER</span>
          <span className="text-2xl font-black font-mono text-cyan-300">
            {playerScore}/{WIN_SCORE}
          </span>
        </div>

        {rallyCount > 2 && (
          <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-pulse">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{rallyCount}x RALLY</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs text-cyan-500 font-mono">L{level}</span>
          <span className="text-2xl font-black font-mono text-pink-400">{aiScore}</span>
          <span className="text-xs font-bold text-pink-400 font-mono">AI</span>
        </div>
      </div>

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-none touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
        >
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="block w-full h-full"
          />

          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {isRtl ? `بونغ السيبرانية · مرحلة ${level}` : `Cyber Pong · Level ${level}`}
              </h3>
              <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
                {isRtl
                  ? `أول من يصل لـ ${WIN_SCORE} يفوز. المراحل الأعلى: كرة وذكاء أسرع.`
                  : `First to ${WIN_SCORE} wins. Higher levels = faster ball & smarter AI.`}
              </p>
              <Button variant="primary" size="sm" onClick={() => startGame(true)}>
                {isRtl ? 'بدء المباراة' : 'Serve Ball'}
              </Button>
            </div>
          )}

          {(gameState === 'PLAYER_WIN' || gameState === 'AI_WIN') && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  gameState === 'PLAYER_WIN'
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-red-500/20 border border-red-500/40 text-red-400'
                }`}
              >
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                {gameState === 'PLAYER_WIN'
                  ? isRtl
                    ? 'انتصار ساحق للبطل! 🏆'
                    : 'VICTORY! CHAMPION 🏆'
                  : isRtl
                    ? 'تفوّق الذكاء الاصطناعي! 🤖'
                    : 'AI DEFEAT! 🤖'}
              </h3>
              <p className="text-xs text-gray-400 mb-1">
                {isRtl
                  ? `النتيجة النهائية: ${playerScore} - ${aiScore}`
                  : `Final Match Score: ${playerScore} - ${aiScore}`}
              </p>
              <p className="text-xs text-amber-300 font-mono font-bold mb-6">
                {isRtl ? `أطول تبادل: ${maxRally}x` : `Longest Rally: ${maxRally}x`}
              </p>

              <Button
                variant="primary"
                size="sm"
                onClick={() => startGame(true)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'مباراة ثأرية جديدة' : 'Rematch'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <span className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl
          ? 'حرك الماوس أو إصبعك لأعلى ولأسفل للتحكم في المضرب'
          : 'Move cursor or finger up/down to control paddle'}
      </span>
    </div>
  )
}
