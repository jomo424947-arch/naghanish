/**
 * StackTowerGame.tsx
 *
 * Neon Stack Tower — tap to place sliding blocks, perfect slices expand width.
 * Phase 2: useGameLoop, responsive stage, level-scaled width/speed, floor goals.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, Layers, Flame } from 'lucide-react'
import { Button } from '@components/common/Button'
import {
  useGameLoop,
  useGameShell,
  useResponsiveStage,
  type GameEngineProps,
} from '@components/game-kit'
import { useEventCallback } from '@hooks/useEventCallback'
import { sound } from '@/utils/soundManager'

const WORLD_W = 400
const WORLD_H = 520
const BLOCK_H = 24

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

function baseSpeedFor(level: number, difficulty: string): number {
  const d = difficulty === 'Easy' ? 3.0 : difficulty === 'Hard' ? 4.8 : 3.8
  return d + (level - 1) * 0.35
}

function initialWidthFor(level: number): number {
  return Math.max(90, 170 - (level - 1) * 12)
}

function floorsTarget(level: number): number {
  return 6 + level * 2
}

export const StackTowerGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const { containerRef, width, height, prepareCanvas } = useResponsiveStage({
    aspectRatio: WORLD_W / WORLD_H,
    minWidth: 240,
    maxWidth: 400,
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [floors, setFloors] = useState(0)
  const [combo, setCombo] = useState(0)
  const [highestCombo, setHighestCombo] = useState(0)
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'CLEARED'>('IDLE')
  const [feedback, setFeedback] = useState<{ text: string; color: string; key: number } | null>(
    null
  )

  const targetFloors = floorsTarget(level)
  const finishedRef = useRef(false)
  const gameStateRef = useRef(gameState)
  gameStateRef.current = gameState

  const stateRef = useRef({
    running: false,
    tower: [] as Block[],
    fallingPieces: [] as FallingPiece[],
    sparks: [] as Spark[],
    currentX: 0,
    currentW: 160,
    currentY: 380,
    blockHeight: BLOCK_H,
    direction: 1,
    speed: 3.8,
    cameraY: 0,
    targetCameraY: 0,
    score: 0,
    combo: 0,
    baseHue: 0,
    shake: 0,
    maxExpandW: 200,
  })

  const finishTower = useCallback(
    (finalScore: number, cleared: boolean) => {
      if (finishedRef.current) return
      finishedRef.current = true
      const stars = cleared
        ? finalScore >= targetFloors * 3
          ? 3
          : finalScore >= targetFloors * 1.5
            ? 2
            : 1
        : 0
      if (cleared) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      }
      onFinish(finalScore * 120 + (cleared ? 400 : 200), {
        levelReached: level,
        stars,
        clearedAll: false,
      })
    },
    [level, onFinish, onLevelComplete, targetFloors]
  )

  const startGame = useCallback(
    (autoStart = true) => {
      sound.playClick()
      const baseSpeed = baseSpeedFor(level, difficulty)
      const baseHue = Math.floor(Math.random() * 360)
      const initialW = initialWidthFor(level)
      const maxExpand = Math.max(initialW + 20, 200 - (level - 1) * 8)

      stateRef.current = {
        running: autoStart,
        tower: [
          {
            x: (WORLD_W - initialW) / 2,
            y: 420,
            w: initialW,
            h: BLOCK_H,
            hue: baseHue,
          },
        ],
        fallingPieces: [],
        sparks: [],
        currentX: -50,
        currentW: initialW,
        currentY: 420 - BLOCK_H,
        blockHeight: BLOCK_H,
        direction: 1,
        speed: baseSpeed,
        cameraY: 0,
        targetCameraY: 0,
        score: 0,
        combo: 0,
        baseHue,
        shake: 0,
        maxExpandW: maxExpand,
      }

      setScore(0)
      setFloors(0)
      setCombo(0)
      setHighestCombo(0)
      setFeedback(null)
      finishedRef.current = false
      setGameState(autoStart ? 'PLAYING' : 'IDLE')
      if (autoStart) sound.playPowerUp()
    },
    [difficulty, level]
  )

  useEffect(() => {
    startGame(false)
  }, [level, startGame])

  const handlePlaceBlock = useEventCallback(() => {
    if (gameStateRef.current === 'IDLE') {
      startGame(true)
      return
    }
    if (gameStateRef.current !== 'PLAYING' || !stateRef.current.running) return

    const s = stateRef.current
    const topBlock = s.tower[s.tower.length - 1]
    const diff = s.currentX - topBlock.x
    const overhang = Math.abs(diff)

    if (overhang >= s.currentW) {
      s.running = false
      s.shake = 15
      sound.playExplosion()

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
      finishTower(s.score, false)
      return
    }

    const currentHue = (s.baseHue + s.tower.length * 10) % 360
    const perfectThresh = Math.max(3, 5 - Math.floor((level - 1) / 2))

    if (overhang < perfectThresh) {
      const newCombo = s.combo + 1
      s.combo = newCombo
      setCombo(newCombo)
      setHighestCombo((h) => Math.max(h, newCombo))

      if (newCombo >= 8) sound.playComboX8()
      else if (newCombo >= 4) sound.playComboX4()
      else if (newCombo >= 2) sound.playComboX2()
      else sound.playPerfectHit()

      if (newCombo >= 3 && s.currentW < s.maxExpandW) {
        s.currentW = Math.min(s.maxExpandW, s.currentW + 12)
        setFeedback({
          text: isRtl ? 'تمدد وتوسيع! +12px' : 'COMBO EXPAND! +12px',
          color: '#10b981',
          key: Date.now(),
        })
      } else {
        setFeedback({
          text: isRtl ? `مثالي! ${newCombo}x` : `PERFECT! ${newCombo}x`,
          color: '#38bdf8',
          key: Date.now(),
        })
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
      s.combo = 0
      setCombo(0)
      sound.playMove()

      const newW = s.currentW - overhang
      const newX = diff > 0 ? s.currentX : topBlock.x
      const sliceW = overhang
      const sliceX = diff > 0 ? topBlock.x + topBlock.w : s.currentX

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
    const placedFloors = s.tower.length - 1
    setFloors(placedFloors)

    if (placedFloors >= targetFloors) {
      s.running = false
      setGameState('CLEARED')
      finishTower(s.score, true)
      return
    }

    s.speed = Math.min(8.5 + level * 0.3, s.speed + 0.08 + level * 0.01)

    s.currentY -= s.blockHeight
    s.currentX = s.direction > 0 ? -s.currentW : WORLD_W

    if (s.tower.length > 5) {
      s.targetCameraY = (s.tower.length - 5) * s.blockHeight
    }
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handlePlaceBlock()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handlePlaceBlock])

  useGameLoop(
    (delta) => {
      const s = stateRef.current
      const dt = delta * 60

      s.cameraY += (s.targetCameraY - s.cameraY) * 0.1

      let shakeOffsetX = 0
      let shakeOffsetY = 0
      if (s.shake > 0) {
        shakeOffsetX = (Math.random() - 0.5) * s.shake
        shakeOffsetY = (Math.random() - 0.5) * s.shake
        s.shake *= 0.85
        if (s.shake < 0.5) s.shake = 0
      }

      if (s.running && gameStateRef.current === 'PLAYING') {
        s.currentX += s.direction * s.speed * dt
        if (s.currentX + s.currentW > WORLD_W + 10) {
          s.currentX = WORLD_W + 10 - s.currentW
          s.direction = -1
        } else if (s.currentX < -10) {
          s.currentX = -10
          s.direction = 1
        }
      }

      for (let i = s.fallingPieces.length - 1; i >= 0; i--) {
        const p = s.fallingPieces[i]
        p.y += p.vy * dt
        p.x += p.vx * dt
        p.vy += 0.35 * dt
        p.rot += p.vRot * dt
        p.alpha -= 0.015 * dt
        if (p.alpha <= 0 || p.y > 600 - s.cameraY) s.fallingPieces.splice(i, 1)
      }

      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const sp = s.sparks[i]
        sp.x += sp.vx * dt
        sp.y += sp.vy * dt
        sp.life -= 0.04 * dt
        if (sp.life <= 0) s.sparks.splice(i, 1)
      }

      const ctx = prepareCanvas(canvasRef.current)
      if (!ctx) return

      ctx.save()
      ctx.scale(width / WORLD_W, height / WORLD_H)
      ctx.clearRect(0, 0, WORLD_W, WORLD_H)

      const bgGrad = ctx.createLinearGradient(0, 0, 0, WORLD_H)
      bgGrad.addColorStop(0, '#050714')
      bgGrad.addColorStop(1, '#0d132a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, WORLD_W, WORLD_H)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let y = 0; y < WORLD_H; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(WORLD_W, y)
        ctx.stroke()
      }

      ctx.translate(shakeOffsetX, shakeOffsetY + s.cameraY)

      s.tower.forEach((b, idx) => {
        const isTop = idx === s.tower.length - 1
        const mainColor = `hsl(${b.hue}, 85%, 55%)`
        const topColor = `hsl(${b.hue}, 95%, 70%)`
        const shadowColor = `hsl(${b.hue}, 80%, 35%)`

        ctx.fillStyle = mainColor
        ctx.fillRect(b.x, b.y, b.w, b.h)
        ctx.fillStyle = topColor
        ctx.fillRect(b.x, b.y, b.w, 4)
        ctx.fillStyle = shadowColor
        ctx.fillRect(b.x, b.y + b.h - 4, b.w, 4)

        if (isTop) {
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.5
          ctx.strokeRect(b.x, b.y, b.w, b.h)
        }
      })

      if (s.running || gameStateRef.current === 'PLAYING') {
        const curHue = (s.baseHue + s.tower.length * 10) % 360
        ctx.fillStyle = `hsl(${curHue}, 90%, 60%)`
        ctx.shadowColor = `hsl(${curHue}, 100%, 70%)`
        ctx.shadowBlur = 12
        ctx.fillRect(s.currentX, s.currentY, s.currentW, s.blockHeight)
        ctx.shadowBlur = 0
        ctx.fillStyle = `hsl(${curHue}, 100%, 80%)`
        ctx.fillRect(s.currentX, s.currentY, s.currentW, 4)
      }

      s.fallingPieces.forEach((p) => {
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate(p.rot)
        ctx.fillStyle = `hsl(${p.hue}, 80%, 50%)`
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })

      s.sparks.forEach((sp) => {
        ctx.fillStyle = sp.color
        ctx.globalAlpha = Math.max(0, sp.life)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      ctx.restore()
    },
    { running: !isPaused && gameState !== 'IDLE' }
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="text-xl font-black font-mono text-cyan-300">
              {floors}/{targetFloors}
            </span>
            <span className="text-xs font-mono text-amber-300/90">{score} pts</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-bounce">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{combo}x COMBO!</span>
            </div>
          )}
          <span className="text-xs text-cyan-500 font-mono">L{level}</span>
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

      <div ref={containerRef} className="w-full flex justify-center">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-brand-cardBorder shadow-2xl bg-black cursor-pointer active:scale-[0.99] transition-transform touch-none [overscroll-behavior:contain]"
          style={{ width, height }}
          onClick={handlePlaceBlock}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {isRtl ? `برج النيون · مرحلة ${level}` : `Stack Tower · Level ${level}`}
              </h3>
              <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
                {isRtl
                  ? `ابنِ ${targetFloors} طوابق. المراحل الأعلى: مكعبات أضيق وحركة أسرع.`
                  : `Stack ${targetFloors} floors. Higher levels = narrower blocks & faster slides.`}
              </p>
              <Button variant="primary" size="sm" onClick={() => startGame(true)}>
                {isRtl ? 'اضغط للبدء' : 'Tap to Build'}
              </Button>
            </div>
          )}

          {gameState === 'CLEARED' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
              <span className="text-4xl mb-2">🏆</span>
              <h3 className="text-2xl font-black text-emerald-400 mb-1">
                {isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'}
              </h3>
              <p className="text-xs text-white font-mono">
                {isRtl ? 'الارتفاع:' : 'Height:'} {floors} {isRtl ? 'طابق' : 'Fl'}
              </p>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
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
                  <span className="text-xl font-black text-cyan-400 font-mono">
                    {floors} {isRtl ? 'طابق' : 'Fl'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400">
                    {isRtl ? 'أعلى كومبو' : 'Max Combo'}
                  </span>
                  <span className="text-xl font-black text-amber-400 font-mono">{highestCombo}x</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => startGame(true)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isRtl ? 'إعادة البناء' : 'Rebuild Tower'}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-gray-500 font-mono text-center">
        {isRtl
          ? 'اضغط على الشاشة أو Space لإسقاط المكعب'
          : 'Tap screen or press Space to drop the current block'}
      </p>
    </div>
  )
}
