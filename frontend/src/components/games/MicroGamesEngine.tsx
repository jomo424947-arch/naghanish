import React, { useState, useEffect, useRef } from 'react'
import { Zap, Heart, Trophy, RotateCcw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface MicroGamesEngineProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

type MicroGameType =
  | 'TAP_FRENZY'
  | 'DONT_TOUCH'
  | 'CUT_WIRE'
  | 'SNIPE_TARGET'
  | 'MATCH_SHAPE'
  | 'PRESS_COLOR'

export const MicroGamesEngine: React.FC<MicroGamesEngineProps> = ({ onFinish, isRtl, difficulty = 'Medium' }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE')
  const [lives, setLives] = useState(3)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [currentGame, setCurrentGame] = useState<MicroGameType>('TAP_FRENZY')
  const [instruction, setInstruction] = useState({ ar: '', en: '' })
  const [timeLeft, setTimeLeft] = useState(100) // percentage 100 -> 0
  const [roundStatus, setRoundStatus] = useState<'pending' | 'success' | 'fail'>('pending')
  const [speedLevel, setSpeedLevel] = useState(1)

  // Sub-game specific state
  const [tapCount, setTapCount] = useState(0)
  const [requiredTaps, setRequiredTaps] = useState(5)
  const [wireColors, setWireColors] = useState<string[]>([])
  const [targetWire, setTargetWire] = useState('red')
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 })
  const [targetShape, setTargetShape] = useState<'circle' | 'square' | 'triangle'>('circle')
  const [requiredColor, setRequiredColor] = useState<'cyan' | 'pink' | 'amber'>('cyan')

  const timerRef = useRef<number | null>(null)
  const roundStartTime = useRef<number>(0)
  const roundDuration = useRef<number>(3500) // ms

  // Choose next micro-game
  const startNextMicroGame = (nextRound: number, currentScore: number, currentLives: number) => {
    setRound(nextRound)
    setRoundStatus('pending')
    setTimeLeft(100)

    // Increase speed every 3 rounds
    const speedMult = Math.max(0.65, 1 - Math.floor(nextRound / 3) * 0.08)
    const baseDuration = difficulty === 'Easy' ? 4000 : difficulty === 'Hard' ? 3000 : 3500
    roundDuration.current = baseDuration * speedMult
    setSpeedLevel(Math.floor(nextRound / 3) + 1)

    const gamePool: MicroGameType[] = [
      'TAP_FRENZY',
      'DONT_TOUCH',
      'CUT_WIRE',
      'SNIPE_TARGET',
      'MATCH_SHAPE',
      'PRESS_COLOR',
    ]
    const chosen = gamePool[Math.floor(Math.random() * gamePool.length)]
    setCurrentGame(chosen)

    // Setup microgame specific parameters
    if (chosen === 'TAP_FRENZY') {
      const taps = difficulty === 'Hard' ? 6 : 5
      setRequiredTaps(taps)
      setTapCount(0)
      setInstruction({
        ar: `اضغط بسرعة ${taps} مرات! ⚡`,
        en: `RAPID TAP ${taps} TIMES! ⚡`,
      })
    } else if (chosen === 'DONT_TOUCH') {
      setInstruction({
        ar: 'ممنوع تلمس أي شيء! تجمد! 🛑',
        en: 'FREEZE! DO NOT TOUCH ANYTHING! 🛑',
      })
    } else if (chosen === 'CUT_WIRE') {
      const colors = ['red', 'blue', 'yellow', 'green'].sort(() => Math.random() - 0.5).slice(0, 3)
      setWireColors(colors)
      const target = colors[Math.floor(Math.random() * colors.length)]
      setTargetWire(target)
      const colorNamesAr: Record<string, string> = { red: 'الأحمر', blue: 'الأزرق', yellow: 'الأصفر', green: 'الأخضر' }
      setInstruction({
        ar: `اقطع السلك ${colorNamesAr[target]}! ✂️`,
        en: `CUT THE ${target.toUpperCase()} WIRE! ✂️`,
      })
    } else if (chosen === 'SNIPE_TARGET') {
      setTargetPos({
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 60) + 20,
      })
      setInstruction({
        ar: 'اصطد الهدف المتحرك الآن! 🎯',
        en: 'HIT THE TARGET NOW! 🎯',
      })
    } else if (chosen === 'MATCH_SHAPE') {
      const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle']
      const s = shapes[Math.floor(Math.random() * shapes.length)]
      setTargetShape(s)
      const shapeNamesAr: Record<string, string> = { circle: 'الدائرة', square: 'المربع', triangle: 'المثلث' }
      setInstruction({
        ar: `اضغط على ${shapeNamesAr[s]}! 🔷`,
        en: `TAP THE ${s.toUpperCase()}! 🔷`,
      })
    } else if (chosen === 'PRESS_COLOR') {
      const colors: ('cyan' | 'pink' | 'amber')[] = ['cyan', 'pink', 'amber']
      const c = colors[Math.floor(Math.random() * colors.length)]
      setRequiredColor(c)
      const colorNamesAr = { cyan: 'السماوي', pink: 'الوردي', amber: 'الذهبي' }
      setInstruction({
        ar: `اضغط الزر ${colorNamesAr[c]}! 🔘`,
        en: `TAP THE ${c.toUpperCase()} BUTTON! 🔘`,
      })
    }

    roundStartTime.current = performance.now()
    soundManager.playCountdown()
  }

  // Handle Win Round
  const handleSuccess = () => {
    if (roundStatus !== 'pending') return
    setRoundStatus('success')
    soundManager.playPerfectHit()
    const points = 200 + round * 40
    setScore((s) => s + points)

    setTimeout(() => {
      startNextMicroGame(round + 1, score + points, lives)
    }, 800)
  }

  // Handle Fail Round
  const handleFail = () => {
    if (roundStatus !== 'pending') return
    setRoundStatus('fail')
    soundManager.playMiss()
    const newLives = lives - 1
    setLives(newLives)

    if (newLives <= 0) {
      setTimeout(() => {
        soundManager.playExplosion()
        setGameState('GAMEOVER')
        onFinish(score)
      }, 900)
    } else {
      setTimeout(() => {
        startNextMicroGame(round + 1, score, newLives)
      }, 900)
    }
  }

  // Timer loop for active round
  useEffect(() => {
    if (gameState !== 'PLAYING' || roundStatus !== 'pending') return

    let animId: number
    const updateTimer = () => {
      const elapsed = performance.now() - roundStartTime.current
      const remaining = Math.max(0, 1 - elapsed / roundDuration.current)
      setTimeLeft(remaining * 100)

      if (remaining <= 0) {
        // Time expired!
        if (currentGame === 'DONT_TOUCH') {
          // Survived not touching!
          handleSuccess()
        } else {
          handleFail()
        }
      } else {
        animId = requestAnimationFrame(updateTimer)
      }
    }

    animId = requestAnimationFrame(updateTimer)
    return () => cancelAnimationFrame(animId)
  }, [gameState, roundStatus, currentGame])

  // Subgame Actions
  const handleTap = () => {
    if (roundStatus !== 'pending') return
    if (currentGame === 'DONT_TOUCH') {
      handleFail()
      return
    }
    if (currentGame === 'TAP_FRENZY') {
      soundManager.playMove()
      const next = tapCount + 1
      setTapCount(next)
      if (next >= requiredTaps) {
        handleSuccess()
      }
    }
  }

  const handleCutWire = (wire: string) => {
    if (roundStatus !== 'pending') return
    if (wire === targetWire) handleSuccess()
    else handleFail()
  }

  const handleHitTarget = () => {
    if (roundStatus !== 'pending') return
    handleSuccess()
  }

  const handlePickShape = (shape: 'circle' | 'square' | 'triangle') => {
    if (roundStatus !== 'pending') return
    if (shape === targetShape) handleSuccess()
    else handleFail()
  }

  const handlePickColor = (color: 'cyan' | 'pink' | 'amber') => {
    if (roundStatus !== 'pending') return
    if (color === requiredColor) handleSuccess()
    else handleFail()
  }

  const startGame = () => {
    setLives(3)
    setScore(0)
    setGameState('PLAYING')
    startNextMicroGame(1, 0, 3)
    soundManager.playPowerUp()
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`w-5 h-5 ${
                heart <= lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono">
            LVL {speedLevel}
          </span>
          <span className="text-xs font-mono text-gray-400">R{round}</span>
        </div>

        <div className="text-xl font-black font-mono text-cyan-300">
          {score} <span className="text-[10px] text-gray-400">XP</span>
        </div>
      </div>

      {/* Main Micro-Game Arena */}
      <div
        className="relative w-full rounded-3xl p-6 bg-gradient-to-b from-brand-cardBg via-black/95 to-black border-2 border-brand-cardBorder shadow-2xl flex flex-col items-center justify-between min-h-[440px] overflow-hidden"
        onClick={currentGame === 'TAP_FRENZY' || currentGame === 'DONT_TOUCH' ? handleTap : undefined}
      >
        {gameState === 'IDLE' && (
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
              <Zap className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'جنون المايكرو جيمز ⚡' : 'CYBER MICRO MADNESS ⚡'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xs mb-6 leading-relaxed">
              {isRtl
                ? 'تحديات سريعة خاطفة مدتها 3 ثوانٍ فقط! اقرأ الأمر ونفذه فوراً قبل انتهاء شريط الوقت.'
                : 'Lightning 3-second micro challenges! Execute instant commands before time drains out.'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black hover:opacity-90 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              {isRtl ? 'بدء الجنون!' : 'START MADNESS!'}
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full flex flex-col justify-between h-full flex-1">
            {/* Rapid Depleting Timer Bar */}
            <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 mb-4">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  timeLeft > 40 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-red-500 animate-pulse'
                }`}
                style={{ width: `${timeLeft}%` }}
              />
            </div>

            {/* Instruction Banner */}
            <div className="text-center my-2">
              <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-md animate-bounce">
                {isRtl ? instruction.ar : instruction.en}
              </h3>
            </div>

            {/* Micro-Game Body */}
            <div className="relative flex-1 flex items-center justify-center w-full min-h-[200px]">
              {/* 1. TAP FRENZY */}
              {currentGame === 'TAP_FRENZY' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-6xl font-black text-amber-400 font-mono scale-110 transition-transform">
                    {tapCount} / {requiredTaps}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {isRtl ? 'اضغط على الشاشة بأقصى سرعة!' : 'TAP RAPIDLY ON SCREEN!'}
                  </div>
                </div>
              )}

              {/* 2. DONT TOUCH */}
              {currentGame === 'DONT_TOUCH' && (
                <div className="flex flex-col items-center gap-3 text-red-400 animate-pulse">
                  <AlertTriangle className="w-20 h-20" />
                  <span className="text-lg font-black">{isRtl ? 'ثابت! لا تلمس!' : 'DON’T MOVE!'}</span>
                </div>
              )}

              {/* 3. CUT THE WIRE */}
              {currentGame === 'CUT_WIRE' && (
                <div className="flex items-center justify-center gap-6 w-full">
                  {wireColors.map((color) => {
                    const bgClass =
                      color === 'red'
                        ? 'bg-red-500 shadow-red-500/50'
                        : color === 'blue'
                        ? 'bg-blue-500 shadow-blue-500/50'
                        : color === 'yellow'
                        ? 'bg-yellow-400 shadow-yellow-400/50'
                        : 'bg-green-500 shadow-green-500/50'

                    return (
                      <button
                        key={color}
                        onClick={() => handleCutWire(color)}
                        className={`w-12 h-36 rounded-xl ${bgClass} shadow-lg border-2 border-white/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer`}
                      >
                        <span className="text-xs font-black text-black rotate-90 uppercase font-mono">
                          WIRE
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 4. SNIPE TARGET */}
              {currentGame === 'SNIPE_TARGET' && (
                <button
                  onClick={handleHitTarget}
                  style={{ top: `${targetPos.y}%`, left: `${targetPos.x}%` }}
                  className="absolute w-16 h-16 rounded-full bg-red-600 border-4 border-white shadow-xl shadow-red-500/60 flex items-center justify-center animate-ping-short transform -translate-x-1/2 -translate-y-1/2 cursor-pointer active:scale-90"
                >
                  <span className="text-2xl">🎯</span>
                </button>
              )}

              {/* 5. MATCH SHAPE */}
              {currentGame === 'MATCH_SHAPE' && (
                <div className="flex items-center justify-center gap-5 w-full">
                  <button
                    onClick={() => handlePickShape('circle')}
                    className="w-16 h-16 rounded-full bg-cyan-500 border-2 border-white/60 shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  >
                    ⚪
                  </button>
                  <button
                    onClick={() => handlePickShape('square')}
                    className="w-16 h-16 rounded-xl bg-purple-500 border-2 border-white/60 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  >
                    ⬛
                  </button>
                  <button
                    onClick={() => handlePickShape('triangle')}
                    className="w-16 h-16 rounded-xl bg-amber-500 border-2 border-white/60 shadow-lg shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                  >
                    🔺
                  </button>
                </div>
              )}

              {/* 6. PRESS COLOR */}
              {currentGame === 'PRESS_COLOR' && (
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  <button
                    onClick={() => handlePickColor('cyan')}
                    className="py-6 rounded-2xl bg-cyan-500 border-2 border-white/50 text-black font-black font-mono shadow-lg shadow-cyan-500/30 active:scale-95"
                  >
                    CYAN
                  </button>
                  <button
                    onClick={() => handlePickColor('pink')}
                    className="py-6 rounded-2xl bg-pink-500 border-2 border-white/50 text-white font-black font-mono shadow-lg shadow-pink-500/30 active:scale-95"
                  >
                    PINK
                  </button>
                  <button
                    onClick={() => handlePickColor('amber')}
                    className="py-6 rounded-2xl bg-amber-500 border-2 border-white/50 text-black font-black font-mono shadow-lg shadow-amber-500/30 active:scale-95"
                  >
                    GOLD
                  </button>
                </div>
              )}

              {/* Round Success / Fail Overlay */}
              {roundStatus === 'success' && (
                <div className="absolute inset-0 bg-green-950/60 backdrop-blur-xs flex flex-col items-center justify-center animate-scale-in">
                  <CheckCircle className="w-20 h-20 text-green-400" />
                  <span className="text-2xl font-black text-green-300 mt-2">
                    {isRtl ? 'رائع!' : 'SUCCESS!'}
                  </span>
                </div>
              )}
              {roundStatus === 'fail' && (
                <div className="absolute inset-0 bg-red-950/60 backdrop-blur-xs flex flex-col items-center justify-center animate-scale-in">
                  <XCircle className="w-20 h-20 text-red-400" />
                  <span className="text-2xl font-black text-red-300 mt-2">
                    {isRtl ? 'أخفقت!' : 'FAILED!'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="flex flex-col items-center justify-center text-center my-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">
              {isRtl ? 'نفدت المحاولات! 💥' : 'LIVES DEPLETED! 💥'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl
                ? `صمدت حتى الجولة ${round} بسرعة فائقة!`
                : `You survived up to round ${round} with extreme reflexes!`}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center mb-6 w-full max-w-xs">
              <span className="text-xs text-gray-400">{isRtl ? 'إجمالي النقاط' : 'Total Score'}</span>
              <span className="text-3xl font-black text-cyan-400 font-mono mt-1">{score} XP</span>
            </div>

            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black hover:opacity-90 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRtl ? 'إعادة التحدي' : 'Play Again'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
