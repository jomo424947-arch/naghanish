import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, Trophy, Layers, Flame, Sparkles } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface StackTowerProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Block {
  x: number
  y: number
  w: number
  h: number
  hue: number
}

interface FallingPiece {
  x: number
  y: number
  w: number
  h: number
  vy: number
  vx: number
  rot: number
  vRot: number
  hue: number
  alpha: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
}

export const StackTowerGame: React.FC<StackTowerProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [highestCombo, setHighestCombo] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [feedback, setFeedback] = useState<{ text: string; color: string; key: number } | null>(null)

  const stateRef = useRef({
    running: false,
    tower: [] as Block[],
    fallingPieces: [] as FallingPiece[],
    sparks: [] as Spark[],
    currentX: 0,
    currentW: 160,
    currentY: 380,
    blockHeight: 24,
    direction: 1,
    speed: 3.8,
    cameraY: 0,
    targetCameraY: 0,
    score: 0,
    combo: 0,
    baseHue: Math.floor(Math.random() * 360),
    shake: 0,
  })

  // Start / Restart Game
  const startGame = () => {
    const baseSpeed = difficulty === 'Easy' ? 3.0 : difficulty === 'Hard' ? 4.8 : 3.8
    const baseHue = Math.floor(Math.random() * 360)
    const initialW = 170

    stateRef.current = {
      running: true,
      tower: [
        {
          x: (400 - initialW) / 2,
          y: 420,
          w: initialW,
          h: 24,
          hue: baseHue,
        },
      ],
      fallingPieces: [],
      sparks: [],
      currentX: -50,
      currentW: initialW,
      currentY: 420 - 24,
      blockHeight: 24,
      direction: 1,
      speed: baseSpeed,
      cameraY: 0,
      targetCameraY: 0,
      score: 0,
      combo: 0,
      baseHue,
      shake: 0,
    }

    setScore(0)
    setCombo(0)
    setHighestCombo(0)
    setFeedback(null)
    setGameState('PLAYING')
    soundManager.playPowerUp()
  }

  // Handle block drop
  const handlePlaceBlock = () => {
    if (gameState === 'IDLE') {
      startGame()
      return
    }
    if (gameState === 'GAMEOVER' || !stateRef.current.running) return

    const s = stateRef.current
    const topBlock = s.tower[s.tower.length - 1]
    const diff = s.currentX - topBlock.x
    const overhang = Math.abs(diff)

    // Complete Miss
    if (overhang >= s.currentW) {
      s.running = false
      s.shake = 15
      soundManager.playExplosion()

      // The entire block falls down
      s.fallingPieces.push({
        x: s.currentX,
        y: s.currentY,
        w: s.currentW,
        h: s.blockHeight,
        vy: 2,
        vx: s.direction * 3,
        rot: 0,
        vRot: (Math.random() - 0.5) * 0.15,
        hue: (s.baseHue + s.tower.length * 10) % 360,
        alpha: 1,
      })

      setGameState('GAMEOVER')
      onFinish(s.score * 120 + 200)
      return
    }

    const currentHue = (s.baseHue + s.tower.length * 10) % 360

    // Perfect slice threshold
    if (overhang < 5) {
      // Snaps to perfect!
      const newCombo = s.combo + 1
      s.combo = newCombo
      setCombo(newCombo)
      setHighestCombo((h) => Math.max(h, newCombo))

      // Trigger audio based on combo
      if (newCombo >= 8) soundManager.playComboX8()
      else if (newCombo >= 4) soundManager.playComboX4()
      else if (newCombo >= 2) soundManager.playComboX2()
      else soundManager.playPerfectHit()

      // Bonus block width expansion on 3+ combos!
      if (newCombo >= 3 && s.currentW < 200) {
        s.currentW = Math.min(200, s.currentW + 12)
        setFeedback({ text: isRtl ? 'تمدد وتوسيع! +12px' : 'COMBO EXPAND! +12px', color: '#10b981', key: Date.now() })
      } else {
        setFeedback({ text: isRtl ? `مثالي! ${newCombo}x` : `PERFECT! ${newCombo}x`, color: '#38bdf8', key: Date.now() })
      }

      s.tower.push({
        x: topBlock.x,
        y: s.currentY,
        w: s.currentW,
        h: s.blockHeight,
        hue: currentHue,
      })

      s.score += 2 + Math.min(newCombo, 5)
    } else {
      // Imperfect slice!
      s.combo = 0
      setCombo(0)
      soundManager.playMove()

      const newW = s.currentW - overhang
      const newX = diff > 0 ? s.currentX : topBlock.x
      const sliceW = overhang
      const sliceX = diff > 0 ? topBlock.x + topBlock.w : s.currentX

      // Add falling sliced piece
      s.fallingPieces.push({
        x: sliceX,
        y: s.currentY,
        w: sliceW,
        h: s.blockHeight,
        vy: 1.5,
        vx: diff > 0 ? 2.5 : -2.5,
        rot: 0,
        vRot: (diff > 0 ? 1 : -1) * 0.08,
        hue: currentHue,
        alpha: 1,
      })

      // Spawn spark particles at cut point
      for (let i = 0; i < 16; i++) {
        s.sparks.push({
          x: sliceX + (diff > 0 ? 0 : sliceW),
          y: s.currentY + s.blockHeight / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color: `hsl(${currentHue}, 100%, 65%)`,
          life: 1,
        })
      }

      s.tower.push({
        x: newX,
        y: s.currentY,
        w: newW,
        h: s.blockHeight,
        hue: currentHue,
      })

      s.currentW = newW
      s.score += 1
    }

    setScore(s.score)

    // Increase speed slightly with height
    s.speed = Math.min(8.5, s.speed + 0.08)

    // Advance to next level
    s.currentY -= s.blockHeight
    s.currentX = s.direction > 0 ? -s.currentW : 400

    // Adjust camera target
    if (s.tower.length > 5) {
      s.targetCameraY = (s.tower.length - 5) * s.blockHeight
    }
  }

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const render = () => {
      const s = stateRef.current

      // Smooth camera interpolation
      s.cameraY += (s.targetCameraY - s.cameraY) * 0.1

      // Screen shake decay
      let shakeOffsetX = 0
      let shakeOffsetY = 0
      if (s.shake > 0) {
        shakeOffsetX = (Math.random() - 0.5) * s.shake
        shakeOffsetY = (Math.random() - 0.5) * s.shake
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      ctx.save()
      ctx.clearRect(0, 0, 400, 520)

      // Background Cyber Sky Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 520)
      bgGrad.addColorStop(0, '#050714')
      bgGrad.addColorStop(1, '#0d132a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, 400, 520)

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let y = 0; y < 520; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(400, y)
        ctx.stroke()
      }

      ctx.translate(shakeOffsetX, shakeOffsetY + s.cameraY)

      // 1. Draw Tower Blocks
      s.tower.forEach((b, idx) => {
        const isTop = idx === s.tower.length - 1
        const mainColor = `hsl(${b.hue}, 85%, 55%)`
        const topColor = `hsl(${b.hue}, 95%, 70%)`
        const shadowColor = `hsl(${b.hue}, 80%, 35%)`

        // Block body
        ctx.fillStyle = mainColor
        ctx.fillRect(b.x, b.y, b.w, b.h)

        // Top highlight
        ctx.fillStyle = topColor
        ctx.fillRect(b.x, b.y, b.w, 4)

        // Bottom shadow
        ctx.fillStyle = shadowColor
        ctx.fillRect(b.x, b.y + b.h - 4, b.w, 4)

        // Outer glow on top block
        if (isTop) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.strokeRect(b.x, b.y, b.w, b.h)
        }
      })

      // 2. Update & Draw Moving Block
      if (s.running) {
        s.currentX += s.direction * s.speed
        if (s.currentX + s.currentW > 410) {
          s.currentX = 410 - s.currentW
          s.direction = -1
        } else if (s.currentX < -10) {
          s.currentX = -10
          s.direction = 1
        }

        const curHue = (s.baseHue + s.tower.length * 10) % 360
        ctx.fillStyle = `hsl(${curHue}, 90%, 60%)`
        ctx.shadowColor = `hsl(${curHue}, 100%, 70%)`
        ctx.shadowBlur = 12
        ctx.fillRect(s.currentX, s.currentY, s.currentW, s.blockHeight)
        ctx.shadowBlur = 0

        // Highlight line
        ctx.fillStyle = `hsl(${curHue}, 100%, 80%)`
        ctx.fillRect(s.currentX, s.currentY, s.currentW, 4)
      }

      // 3. Update & Draw Falling Slices
      for (let i = s.fallingPieces.length - 1; i >= 0; i--) {
        const p = s.fallingPieces[i]
        p.y += p.vy
        p.x += p.vx
        p.vy += 0.35 // Gravity
        p.rot += p.vRot
        p.alpha -= 0.015

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate(p.rot)
        ctx.fillStyle = `hsl(${p.hue}, 80%, 50%)`
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()

        if (p.alpha <= 0 || p.y > 600 - s.cameraY) {
          s.fallingPieces.splice(i, 1)
        }
      }

      // 4. Update & Draw Sparks
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const sp = s.sparks[i]
        sp.x += sp.vx
        sp.y += sp.vy
        sp.life -= 0.04

        ctx.fillStyle = sp.color
        ctx.globalAlpha = Math.max(0, sp.life)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2)
        ctx.fill()

        if (sp.life <= 0) s.sparks.splice(i, 1)
      }
      ctx.globalAlpha = 1

      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-black font-mono text-cyan-300">{score}</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-bounce">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{combo}x COMBO!</span>
            </div>
          )}
        </div>

        {feedback && (
          <span
            key={feedback.key}
            className="text-xs font-black font-mono animate-pulse px-2.5 py-1 rounded-lg bg-black/40 border border-white/10"
            style={{ color: feedback.color }}
          >
            {feedback.text}
          </span>
        )}
      </div>

      {/* Canvas Area */}
      <div
        className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-pointer active:scale-[0.99] transition-transform"
        onClick={handlePlaceBlock}
      >
        <canvas ref={canvasRef} width={400} height={520} className="w-full max-w-[400px] h-auto block" />

        {/* Start Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'برج النيون المتكدس 🗼' : 'NEON STACK TOWER 🗼'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
              {isRtl
                ? 'اضغط في التوقيت الدقيق لإسقاط المكعب فوق البرج! المحاذاة المثالية المتتالية تكافئك بتوسيع المكعب ومضاعفة النقاط.'
                : 'Tap with split-second precision to stack blocks! Hit perfect slices in a row to expand blocks and build an endless monolith.'}
            </p>
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 shadow-lg shadow-cyan-500/25 active:scale-95">
              {isRtl ? 'اضغط للبدء' : 'Tap to Build'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              {isRtl ? 'سقط البرج! 💥' : 'Tower Collapsed! 💥'}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {isRtl ? 'محاولة بطولية في بناء ناطحة السحاب!' : 'Great run building the cyber skyscraper!'}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'الارتفاع' : 'Height'}</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{score} {isRtl ? 'طابق' : 'Fl'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400">{isRtl ? 'أعلى كومبو' : 'Max Combo'}</span>
                <span className="text-xl font-black text-amber-400 font-mono">{highestCombo}x</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRtl ? 'إعادة البناء' : 'Rebuild Tower'}</span>
            </button>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl ? 'اضغط في أي مكان على الشاشة لإسقاط المكعب' : 'Tap anywhere on screen to drop current block'}
      </p>
    </div>
  )
}
