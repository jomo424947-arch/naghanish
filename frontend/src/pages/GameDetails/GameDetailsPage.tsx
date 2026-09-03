import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Zap,
  Clock,
  Play,
  Sparkles,
  CheckCircle2,
  XCircle,
  Target,
} from 'lucide-react'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { ROUTES } from '@constants/routes'
import { ALL_GAMES, GameItem } from '@data/games.data'
import { httpClient } from '@api/httpClient'

// ── Import ALL dedicated game engine components ──
import { SnakeGame } from '@components/games/SnakeGame'
import { BrickBreakerGame } from '@components/games/BrickBreakerGame'
import { PongGame } from '@components/games/PongGame'
import { PixelRunnerGame } from '@components/games/PixelRunnerGame'
import { SimonPatternGame } from '@components/games/SimonPatternGame'
import { StackTowerGame } from '@components/games/StackTowerGame'
import { SpaceShooterGame } from '@components/games/SpaceShooterGame'
import { WordScrambleGame } from '@components/games/WordScrambleGame'
import { PerfectSecondGame } from '@components/games/PerfectSecondGame'
import { ChaosRouletteGame } from '@components/games/ChaosRouletteGame'
import { DontPressButtonGame } from '@components/games/DontPressButtonGame'
import { WouldYouRatherGame } from '@components/games/WouldYouRatherGame'
import { DrawAndGuessGame } from '@components/games/DrawAndGuessGame'
import { CrewTriviaGame } from '@components/games/CrewTriviaGame'
import { ReverseControlsGame } from '@components/games/ReverseControlsGame'

// ── Engine type for each game ──
type EngineType =
  | 'snake'
  | 'brick'
  | 'pong'
  | 'runner'
  | 'simon'
  | 'stack'
  | 'shooter'
  | 'scramble'
  | 'second'
  | 'roulette'
  | 'dontpress'
  | 'rather'
  | 'draw'
  | 'trivia'
  | 'reverse'
  | 'memory'
  | 'reflex'
  | 'cps'
  | 'math'
  | 'color'
  | 'aim'

/**
 * Master map: game ID → engine type.
 * Every single game ID in the entire app is mapped here.
 */
const GAME_ENGINE_MAP: Record<string, EngineType> = {
  // ── Arcade World ──
  g1: 'memory',
  g4: 'color',
  g7: 'runner',
  g14: 'brick',
  g15: 'snake',
  g16: 'shooter',
  g17: 'stack',
  g18: 'simon',
  g19: 'snake',
  g20: 'pong',
  // ── Reflex World ──
  g2: 'reflex',
  g8: 'aim',
  g9: 'second',
  g21: 'cps',
  g22: 'aim',
  g23: 'reflex',
  g24: 'runner',
  g25: 'reverse',
  g26: 'second',
  g27: 'pong',
  // ── IQ Lab World ──
  g3: 'math',
  g5: 'scramble',
  g6: 'simon',
  g28: 'math',
  g29: 'runner',
  g30: 'simon',
  g31: 'math',
  g32: 'math',
  g59: 'math',
  g60: 'simon',
  // ── Shilla World ──
  g10: 'trivia',
  g11: 'trivia',
  g33: 'draw',
  g34: 'trivia',
  g35: 'rather',
  g36: 'trivia',
  g37: 'trivia',
  g38: 'draw',
  g39: 'rather',
  g40: 'trivia',
  // ── Champions World ──
  g12: 'trivia',
  g41: 'trivia',
  g42: 'stack',
  g43: 'memory',
  g44: 'cps',
  g45: 'math',
  g46: 'aim',
  g47: 'pong',
  g48: 'trivia',
  g49: 'shooter',
  // ── Chaos World ──
  g13: 'roulette',
  g50: 'reverse',
  g51: 'trivia',
  g52: 'second',
  g53: 'color',
  g54: 'scramble',
  g55: 'dontpress',
  g56: 'reverse',
  g57: 'roulette',
  g58: 'runner',
}

const MEMORY_EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮', '🎮', '🚀']

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()

  const isRtl = dir === 'rtl'
  const currentGame: GameItem = ALL_GAMES.find((g) => g.id === id) || ALL_GAMES[0]
  const engine: EngineType = GAME_ENGINE_MAP[currentGame.id] || 'trivia'

  // Redirect quiz URLs if mistakenly routed here
  useEffect(() => {
    if (id && id.startsWith('q')) {
      navigate(`/quizzes/${id}`, { replace: true })
    }
  }, [id, navigate])

  // ── Core State ──
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [score, setScore] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)

  // ── Inline-engine state (Memory, Reflex, CPS, Math, Color, Aim) ──
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const [tapTimeLeft, setTapTimeLeft] = useState(5)
  const [mathNum1, setMathNum1] = useState(12)
  const [mathNum2, setMathNum2] = useState(8)
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+')
  const [mathOptions, setMathOptions] = useState<number[]>([])
  const [mathStreak, setMathStreak] = useState(0)
  const [colorText, setColorText] = useState('أحمر')
  const [colorHex, setColorHex] = useState('#EF4444')
  const [colorMatched, setColorMatched] = useState(true)
  const [targetPos, setTargetPos] = useState({ top: 40, left: 50 })
  const [aimScore, setAimScore] = useState(0)

  // ── Timer ──
  useEffect(() => {
    if (!gameStarted || gameWon) return
    const timer = setInterval(() => setElapsedTime((p) => p + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameWon])

  // ── CPS Timer ──
  useEffect(() => {
    if (!gameStarted || engine !== 'cps' || gameWon) return
    if (tapTimeLeft <= 0) {
      handleFinishGame(tapCount * 100)
      return
    }
    const timer = setInterval(() => setTapTimeLeft((p) => p - 1), 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, engine, tapTimeLeft, gameWon])

  // ── Finish Game ──
  const handleFinishGame = useCallback(async (finalScore: number) => {
    setGameWon(true)
    setScore(finalScore)

    try {
      const res = await httpClient.post(`/games/${currentGame.id}/submit`, {
        score: finalScore,
        elapsed_seconds: elapsedTime,
      })
      if (res.data) {
        const xpGot = res.data.xpEarned ?? res.data.xp_earned ?? currentGame.xpReward
        const coinsGot = res.data.coinsEarned ?? res.data.coins_earned ?? 50
        setEarnedXp(xpGot)
        setEarnedCoins(coinsGot)

        if (user) {
          updateProfile({
            xp: res.data.userXp ?? ((user.xp || 0) + xpGot),
            coins: res.data.userCoins ?? ((user.coins || 0) + coinsGot),
            level: res.data.userLevel ?? user.level,
            maxXp: res.data.userMaxXp ?? user.maxXp,
            rank: res.data.rankTitle ?? user.rank,
          })
        }
      }
    } catch {
      const fallbackXp = currentGame.xpReward
      const fallbackCoins = 50
      setEarnedXp(fallbackXp)
      setEarnedCoins(fallbackCoins)
      if (user) {
        updateProfile({
          xp: (user.xp || 0) + fallbackXp,
          coins: (user.coins || 0) + fallbackCoins,
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGame, elapsedTime, user])

  // ── Inline engine helpers ──
  const initMemoryGame = () => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }))
    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
  }

  const generateMathQuestion = () => {
    const n1 = Math.floor(Math.random() * 20) + 5
    const n2 = Math.floor(Math.random() * 15) + 2
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let correct = 0
    if (op === '+') correct = n1 + n2
    if (op === '-') correct = n1 - n2
    if (op === '×') correct = n1 * n2
    const opts = [
      correct,
      correct + (Math.random() > 0.5 ? 2 : -2),
      correct + (Math.random() > 0.5 ? 5 : -5),
      correct + (Math.random() > 0.5 ? 10 : -10),
    ].sort(() => Math.random() - 0.5)
    setMathNum1(n1)
    setMathNum2(n2)
    setMathOp(op)
    setMathOptions(opts)
  }

  const generateColorQuestion = () => {
    const colors = [
      { text: 'أحمر', hex: '#EF4444' },
      { text: 'أزرق', hex: '#3B82F6' },
      { text: 'أخضر', hex: '#10B981' },
      { text: 'أصفر', hex: '#F59E0B' },
    ]
    const chosenText = colors[Math.floor(Math.random() * colors.length)]
    const match = Math.random() > 0.5
    const chosenHex = match
      ? chosenText.hex
      : colors.filter((c) => c.hex !== chosenText.hex)[Math.floor(Math.random() * 3)].hex
    setColorText(chosenText.text)
    setColorHex(chosenHex)
    setColorMatched(chosenText.hex === chosenHex)
  }

  const startReactionRound = () => {
    setReactionState('waiting')
    const delay = Math.floor(Math.random() * 2500) + 1500
    setTimeout(() => {
      setReactionState('ready')
      setStartTime(Date.now())
    }, delay)
  }

  const moveTarget = () => {
    setTargetPos({
      top: Math.floor(Math.random() * 70) + 15,
      left: Math.floor(Math.random() * 70) + 15,
    })
  }

  // ── Start / Restart ──
  const handleStartGame = () => {
    setGameStarted(true)
    setGameWon(false)
    setScore(0)
    setAimScore(0)
    setElapsedTime(0)
    setMathStreak(0)

    switch (engine) {
      case 'memory': initMemoryGame(); break
      case 'reflex': startReactionRound(); break
      case 'cps': setTapCount(0); setTapTimeLeft(5); break
      case 'math': generateMathQuestion(); break
      case 'color': generateColorQuestion(); break
      case 'aim': moveTarget(); break
      default: break // dedicated components handle their own init
    }
  }

  // ── Inline engine event handlers ──
  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return
    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)
    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = newFlipped
      if (cards[a].emoji === cards[b].emoji) {
        newCards[a].matched = true
        newCards[b].matched = true
        setCards(newCards)
        setFlippedIndices([])
        if (newCards.every((c) => c.matched)) handleFinishGame(1000 - moves * 20)
      } else {
        setTimeout(() => {
          newCards[a].flipped = false
          newCards[b].flipped = false
          setCards([...newCards])
          setFlippedIndices([])
        }, 800)
      }
    }
  }

  const handleReflexClick = () => {
    if (reactionState === 'waiting') {
      setReactionState('idle')
    } else if (reactionState === 'ready') {
      const diff = Date.now() - startTime
      setReactionTime(diff)
      setReactionState('result')
      handleFinishGame(Math.max(100, 1000 - diff))
    }
  }

  const handleMathAnswer = (val: number) => {
    let correct = 0
    if (mathOp === '+') correct = mathNum1 + mathNum2
    if (mathOp === '-') correct = mathNum1 - mathNum2
    if (mathOp === '×') correct = mathNum1 * mathNum2
    if (val === correct) {
      const ns = mathStreak + 1
      setMathStreak(ns)
      if (ns >= 5) handleFinishGame(ns * 250)
      else generateMathQuestion()
    } else {
      setMathStreak(0)
      generateMathQuestion()
    }
  }

  const handleColorAnswer = (userSaysMatch: boolean) => {
    if (userSaysMatch === colorMatched) {
      const ns = score + 200
      setScore(ns)
      if (ns >= 800) handleFinishGame(ns)
      else generateColorQuestion()
    } else {
      generateColorQuestion()
    }
  }

  const handleTargetHit = () => {
    const ns = aimScore + 150
    setAimScore(ns)
    if (ns >= 750) handleFinishGame(ns)
    else moveTarget()
  }

  // ── Render the correct dedicated component ──
  const renderDedicatedEngine = () => {
    switch (engine) {
      case 'snake':    return <SnakeGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'brick':    return <BrickBreakerGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'pong':     return <PongGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'runner':   return <PixelRunnerGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'simon':    return <SimonPatternGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'stack':    return <StackTowerGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'shooter':  return <SpaceShooterGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'scramble': return <WordScrambleGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'second':   return <PerfectSecondGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'roulette': return <ChaosRouletteGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'dontpress':return <DontPressButtonGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'rather':   return <WouldYouRatherGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'draw':     return <DrawAndGuessGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'trivia':   return <CrewTriviaGame onFinish={handleFinishGame} isRtl={isRtl} />
      case 'reverse':  return <ReverseControlsGame onFinish={handleFinishGame} isRtl={isRtl} />
      default:         return null
    }
  }

  // ── Render inline engine UI ──
  const renderInlineEngine = () => {
    switch (engine) {
      case 'memory':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-black text-slate-300">
              <span>{isRtl ? 'الحركات:' : 'Moves:'} {moves}</span>
              <span>•</span>
              <span className="text-amber-300">
                {isRtl ? 'المطابقات:' : 'Matched:'} {cards.filter((c) => c.matched).length / 2} / 8
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl text-3xl font-black flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                    card.flipped || card.matched
                      ? 'bg-gradient-to-br from-brand-purple to-blue-600 border-cyan-400 shadow-glow'
                      : 'bg-brand-darkBg border-brand-cardBorder hover:border-brand-purple'
                  }`}
                >
                  {card.flipped || card.matched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          </div>
        )

      case 'reflex':
        return (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <button
              onClick={handleReflexClick}
              className={`w-full h-64 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 text-center p-6 transition-all duration-200 cursor-pointer ${
                reactionState === 'waiting'
                  ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_30px_#f43f5e]'
                  : reactionState === 'ready'
                  ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_40px_#10b981] animate-pulse'
                  : 'bg-brand-card border-brand-cardBorder'
              }`}
            >
              <span className="text-5xl">
                {reactionState === 'waiting' ? '🛑' : reactionState === 'ready' ? '⚡' : '⏱️'}
              </span>
              <h3 className="text-xl font-black text-white">
                {reactionState === 'waiting'
                  ? (isRtl ? 'انتظر اللون الأخضر...' : 'Wait for Green...')
                  : reactionState === 'ready'
                  ? (isRtl ? 'اضغط الآن!' : 'CLICK NOW!')
                  : (isRtl ? 'اضغط هنا للبدء' : 'Click to start')}
              </h3>
            </button>
          </div>
        )

      case 'cps':
        return (
          <div className="flex flex-col items-center gap-6 w-full max-w-xs">
            <div className="flex items-center justify-between w-full text-xs font-mono font-black">
              <span className="text-rose-400">{tapTimeLeft}s</span>
              <span className="text-cyan-300">CPS: {(tapCount / Math.max(1, 5 - tapTimeLeft)).toFixed(1)}</span>
            </div>
            <button
              onClick={() => setTapCount((c) => c + 1)}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 border-4 border-white/20 text-white flex flex-col items-center justify-center gap-1 shadow-glow active:scale-95 transition-transform cursor-pointer"
            >
              <span className="text-4xl font-black font-mono">{tapCount}</span>
              <span className="text-xs font-black uppercase">{isRtl ? 'انقر بأقصى سرعة!' : 'TAP FAST!'}</span>
            </button>
          </div>
        )

      case 'math':
        return (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <span>🔥 {isRtl ? 'سلسلة:' : 'Streak:'} {mathStreak} / 5</span>
            </div>
            <div className="p-8 rounded-3xl bg-brand-darkBg border-2 border-brand-purple/50 shadow-inner flex items-center justify-center text-4xl font-black text-cyan-300 font-mono tracking-wider">
              {mathNum1} {mathOp} {mathNum2} = ?
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {mathOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMathAnswer(opt)}
                  className="p-4 rounded-2xl bg-brand-card border-2 border-brand-cardBorder hover:border-cyan-400 font-mono text-xl font-black text-white active:scale-95 transition-all shadow cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )

      case 'color':
        return (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="p-8 rounded-3xl bg-brand-darkBg border-2 border-brand-purple/50 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl font-black tracking-widest drop-shadow-md" style={{ color: colorHex }}>
                {colorText}
              </span>
              <p className="text-[11px] text-slate-400">{isRtl ? 'هل يتطابق اسم اللون مع لونه الحقيقي؟' : 'Does word match color?'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={() => handleColorAnswer(true)}
                className="p-4 rounded-2xl bg-emerald-600 border border-emerald-400 text-white font-black text-base flex items-center justify-center gap-2 shadow active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isRtl ? 'متطابقان ✓' : 'Match ✓'}</span>
              </button>
              <button
                onClick={() => handleColorAnswer(false)}
                className="p-4 rounded-2xl bg-rose-600 border border-rose-400 text-white font-black text-base flex items-center justify-center gap-2 shadow active:scale-95 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
                <span>{isRtl ? 'مختلفان ✗' : 'Mismatch ✗'}</span>
              </button>
            </div>
          </div>
        )

      case 'aim':
        return (
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="text-xs font-black text-amber-300">🎯 {aimScore} / 750</span>
            <div className="relative w-full h-80 rounded-3xl bg-brand-darkBg border-2 border-brand-purple/40 overflow-hidden shadow-inner">
              <button
                onClick={handleTargetHit}
                style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-rose-500 border-4 border-white shadow-[0_0_20px_#f43f5e] flex items-center justify-center text-white active:scale-90 transition-transform cursor-crosshair"
              >
                <Target className="w-7 h-7" />
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Is it a dedicated component or inline?
  const isDedicated = !['memory', 'reflex', 'cps', 'math', 'color', 'aim'].includes(engine)

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto pb-24">
      <SEO title={`${currentGame.titleAr} | نغنِش`} description={currentGame.descAr} />

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للألعاب' : 'Back to Games'}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-card border border-brand-cardBorder text-slate-300">
            {currentGame.categoryAr}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
            +{currentGame.xpReward} XP
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative rounded-[2rem] bg-brand-card border-2 border-brand-cardBorder shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-darkBg flex items-center justify-center text-3xl border-2 border-brand-cardBorder shadow-md">
              {currentGame.icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentGame.titleAr}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{currentGame.descAr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm font-black text-cyan-300 bg-black/40 px-3 py-1.5 rounded-xl border border-cyan-400/30">
            <Clock className="w-4 h-4" />
            <span>{elapsedTime}s</span>
          </div>
        </div>

        {/* ── START SCREEN ── */}
        {!gameStarted && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-12 text-center max-w-md">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-5xl shadow-glow animate-bounce">
              {currentGame.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentGame.titleAr}</h2>
              <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed">{currentGame.descAr}</p>
            </div>
            <Button variant="primary" size="lg" onClick={handleStartGame} leftIcon={<Play className="w-5 h-5 fill-current" />}>
              {isRtl ? 'ابدأ اللعب 🚀' : 'Play Now 🚀'}
            </Button>
          </div>
        )}

        {/* ── GAME AREA ── */}
        {gameStarted && !gameWon && (
          <div className="w-full flex flex-col items-center">
            {isDedicated ? renderDedicatedEngine() : renderInlineEngine()}
          </div>
        )}

        {/* ── VICTORY SCREEN ── */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-8 text-center max-w-md w-full"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-5xl shadow-glow-gold">
              🏆
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isRtl ? 'مبروك! 🎉' : 'Victory! 🎉'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {isRtl ? 'تم تسجيل نتيجتك بنجاح!' : 'Score submitted!'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isRtl ? 'الخبرة' : 'XP'}
                </span>
                <span className="text-2xl font-black text-white mt-1">+{earnedXp || currentGame.xpReward}</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/40 flex flex-col items-center">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {isRtl ? 'عملات' : 'Coins'}
                </span>
                <span className="text-2xl font-black text-white mt-1">+{earnedCoins || 50} 💰</span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full">
              <Button variant="primary" size="md" fullWidth onClick={handleStartGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
                {isRtl ? 'العب تاني ⚡' : 'Play Again ⚡'}
              </Button>
              <Button variant="secondary" size="md" fullWidth onClick={() => navigate(ROUTES.GAMES)}>
                {isRtl ? 'كل الألعاب' : 'All Games'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <AdSlot variant="in-feed" />
    </div>
  )
}
