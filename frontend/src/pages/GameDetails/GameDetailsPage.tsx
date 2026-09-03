import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  Clock,
  Play,
  Star,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  Target,
} from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { ALL_GAMES, GameItem } from '@data/games.data'
import { httpClient } from '@api/httpClient'

const MEMORY_EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮', '🎮', '🚀']

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()


  const isRtl = dir === 'rtl'
  const currentGame: GameItem = ALL_GAMES.find((g) => g.id === id) || ALL_GAMES[0]

  // Game Engine Mode Selection based on ID or Category
  const isMemoryGame = currentGame.id === 'g1' || currentGame.id === 'g43' || currentGame.category === 'Memory'
  const isSpeedReflex = currentGame.id === 'g2' || currentGame.id === 'g23' || currentGame.id === 'g26'
  const isCpsTapGame = currentGame.id === 'g21'
  const isMathGame = currentGame.id === 'g3' || currentGame.id === 'g45'
  const isColorGame = currentGame.id === 'g4' || currentGame.id === 'g53'
  const isAimGame = currentGame.id === 'g8' || currentGame.id === 'g22' || currentGame.id === 'g46'

  // General Game States
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [score, setScore] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)

  // 1. Memory Game State
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  // 2. Reflex Reaction State
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)

  // 3. CPS Tap Speed State
  const [tapCount, setTapCount] = useState(0)
  const [tapTimeLeft, setTapTimeLeft] = useState(5)

  // 4. Math Game State
  const [mathNum1, setMathNum1] = useState(12)
  const [mathNum2, setMathNum2] = useState(8)
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('+')
  const [mathOptions, setMathOptions] = useState<number[]>([])
  const [mathStreak, setMathStreak] = useState(0)

  // 5. Color Rush State
  const [colorText, setColorText] = useState('أحمر')
  const [colorHex, setColorHex] = useState('#EF4444')
  const [colorMatched, setColorMatched] = useState(true)

  // 6. Target Aim State
  const [targetPos, setTargetPos] = useState({ top: 40, left: 50 })

  // General Timer
  useEffect(() => {
    if (!gameStarted || gameWon) return
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameWon])

  // CPS Timer
  useEffect(() => {
    if (!gameStarted || !isCpsTapGame || gameWon) return
    if (tapTimeLeft <= 0) {
      handleFinishGame(tapCount * 100)
      return
    }
    const timer = setInterval(() => setTapTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, isCpsTapGame, tapTimeLeft, gameWon, tapCount])

  // Finish Game & Submit Score to Backend API
  const handleFinishGame = async (finalScore: number) => {
    setGameWon(true)
    setScore(finalScore)

    try {
      const res = await httpClient.post(`/games/${currentGame.id}/submit`, {
        score: finalScore,
        elapsed_seconds: elapsedTime,
      })
      if (res.data) {
        setEarnedXp(res.data.xp_earned || currentGame.xpReward)
        setEarnedCoins(res.data.coins_earned || 50)

        // Update local user state
        if (user) {
          updateProfile({
            xp: (user.xp || 0) + (res.data.xp_earned || currentGame.xpReward),
            coins: (user.coins || 100) + (res.data.coins_earned || 50),
          })
        }

      }
    } catch {
      setEarnedXp(currentGame.xpReward)
      setEarnedCoins(50)
    }
  }

  // ── 1. Init Memory Game
  const initMemoryGame = () => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))

    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
  }

  const handleCardClick = (index: number) => {
    if (!gameStarted || cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1)
      const [first, second] = newFlipped
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].matched = true
        newCards[second].matched = true
        setCards(newCards)
        setFlippedIndices([])

        if (newCards.every((c) => c.matched)) {
          handleFinishGame(Math.max(1000, 3000 - moves * 100))
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false
          newCards[second].flipped = false
          setCards(newCards)
          setFlippedIndices([])
        }, 700)
      }
    }
  }

  // ── 2. Reflex Speed Logic
  const startReactionTest = () => {
    setReactionState('waiting')
    setGameStarted(true)
    const randomDelay = Math.floor(Math.random() * 2500) + 1500
    setTimeout(() => {
      setReactionState('ready')
      setStartTime(Date.now())
    }, randomDelay)
  }

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      alert(isRtl ? 'مبكر جداً! انتظر حتى يصبح اللون أخضر.' : 'Too early! Wait for the green screen.')
      setReactionState('idle')
    } else if (reactionState === 'ready') {
      const diff = Date.now() - startTime
      setReactionTime(diff)
      setReactionState('result')
      handleFinishGame(Math.max(500, 2000 - diff * 2))
    }
  }

  // ── 3. CPS Tap Logic
  const startCpsGame = () => {
    setTapCount(0)
    setTapTimeLeft(5)
    setGameWon(false)
    setGameStarted(true)
  }

  const handleTap = () => {
    if (!gameStarted || gameWon) return
    setTapCount((prev) => prev + 1)
  }

  // ── 4. Math Game Logic
  const initMathRound = () => {
    const n1 = Math.floor(Math.random() * 20) + 5
    const n2 = Math.floor(Math.random() * 15) + 2
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    
    let ans = n1 + n2
    if (op === '-') ans = n1 - n2
    if (op === '×') ans = n1 * n2

    const opts = [ans, ans + 3, Math.max(1, ans - 2), ans + 5].sort(() => Math.random() - 0.5)

    setMathNum1(n1)
    setMathNum2(n2)
    setMathOp(op)
    setMathOptions(opts)
  }

  const startMathGame = () => {
    setMathStreak(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
    initMathRound()
  }

  const handleMathAnswer = (chosen: number) => {
    let correct = mathNum1 + mathNum2
    if (mathOp === '-') correct = mathNum1 - mathNum2
    if (mathOp === '×') correct = mathNum1 * mathNum2

    if (chosen === correct) {
      const newStreak = mathStreak + 1
      setMathStreak(newStreak)
      if (newStreak >= 10) {
        handleFinishGame(newStreak * 250)
      } else {
        initMathRound()
      }
    } else {
      handleFinishGame(mathStreak * 150)
    }
  }

  // ── 5. Color Rush Logic
  const initColorRound = () => {
    const colors = [
      { name: 'أحمر', hex: '#EF4444' },
      { name: 'أزرق', hex: '#3B82F6' },
      { name: 'أخضر', hex: '#10B981' },
      { name: 'أصفر', hex: '#F59E0B' },
      { name: 'بنفسجي', hex: '#8B5CF6' },
    ]
    const textObj = colors[Math.floor(Math.random() * colors.length)]
    const hexObj = colors[Math.floor(Math.random() * colors.length)]
    const isMatch = Math.random() > 0.5

    setColorText(textObj.name)
    setColorHex(isMatch ? textObj.hex : hexObj.hex)
    setColorMatched(isMatch ? true : textObj.name === hexObj.name)
  }

  const startColorGame = () => {
    setScore(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
    initColorRound()
  }

  const handleColorChoice = (userMatched: boolean) => {
    if (userMatched === colorMatched) {
      const newScore = score + 100
      setScore(newScore)
      if (newScore >= 1000) {
        handleFinishGame(newScore)
      } else {
        initColorRound()
      }
    } else {
      handleFinishGame(score)
    }
  }

  // ── 6. Aim Target Logic
  const startAimGame = () => {
    setScore(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
    moveTarget()
  }

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 70) + 15
    const left = Math.floor(Math.random() * 70) + 15
    setTargetPos({ top, left })
  }

  const handleTargetHit = () => {
    const newScore = score + 1
    setScore(newScore)
    if (newScore >= 15) {
      handleFinishGame(newScore * 200)
    } else {
      moveTarget()
    }
  }

  // ── Generic Arcade Clicker Strategy
  const startGenericGame = () => {
    setScore(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
  }

  const handleGenericAction = () => {
    const newScore = score + 100
    setScore(newScore)
    if (newScore >= 1000) {
      handleFinishGame(newScore)
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto">
      <SEO
        title={`${currentGame.titleAr} | منصة نغنِش`}
        description={currentGame.descAr}
      />

      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.GAMES)}
        >
          {isRtl ? 'العودة للألعاب' : 'Back to Games'}
        </Button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-purple/20 text-cyan-300 border border-purple-500/30 uppercase">
            {currentGame.world} WORLD • {currentGame.category}
          </span>
        </div>
      </div>

      {/* Main Interactive Game Container */}
      <Card
        variant="glowing"
        glowColor="purple"
        className="p-6 sm:p-8 flex flex-col gap-6 border-2 border-brand-purple/40"
      >
        {/* Game Title Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ModeMascot mode={currentGame.world} size="md" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? currentGame.titleAr : currentGame.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {isRtl ? currentGame.descAr : currentGame.descEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-cyan-400/30 text-xs font-black text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-300" />
              <span>{elapsedTime}s</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-amber-400/30 text-xs font-black text-amber-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>+{currentGame.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* ── GAME ENGINE DISPLAY ── */}
        {!gameStarted && !gameWon && (
          <div className="py-14 flex flex-col items-center justify-center text-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue flex items-center justify-center text-5xl shadow-glow">
              {currentGame.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isRtl ? `جاهز لبدء ${currentGame.titleAr}؟` : `Ready for ${currentGame.title}?`}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {isRtl ? `اكسب +${currentGame.xpReward} XP و 50 عملة عند إكمال التحدي بنجاح` : `Earn +${currentGame.xpReward} XP upon completion`}
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (isMemoryGame) initMemoryGame()
                else if (isSpeedReflex) startReactionTest()
                else if (isCpsTapGame) startCpsGame()
                else if (isMathGame) startMathGame()
                else if (isColorGame) startColorGame()
                else if (isAimGame) startAimGame()
                else startGenericGame()
              }}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
            >
              {isRtl ? 'بدء اللعب 🚀' : 'Start Game 🚀'}
            </Button>
          </div>
        )}

        {/* 1. Memory Game View */}
        {gameStarted && isMemoryGame && !gameWon && (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto w-full my-4">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-24 sm:h-28 rounded-2xl border-2 text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                  card.flipped || card.matched
                    ? 'bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue border-cyan-300 rotate-y-180 scale-105 shadow-glow-blue'
                    : 'bg-brand-card border-brand-cardBorder hover:border-cyan-400 hover:scale-102'
                }`}
              >
                {card.flipped || card.matched ? card.emoji : '❓'}
              </button>
            ))}
          </div>
        )}

        {/* 2. Reflex Reaction View */}
        {gameStarted && isSpeedReflex && !gameWon && (
          <div
            onClick={reactionState === 'waiting' || reactionState === 'ready' ? handleReactionClick : undefined}
            className={`w-full min-h-[300px] rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-2xl p-6 select-none relative overflow-hidden ${
              reactionState === 'waiting'
                ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white animate-pulse border-2 border-yellow-400'
                : reactionState === 'ready'
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-slate-950 scale-102 border-4 border-white'
                : 'bg-brand-card border-2 border-brand-purple'
            }`}
          >
            {reactionState === 'waiting' && (
              <p className="text-2xl sm:text-3xl font-black text-white">{isRtl ? 'استعد... انتظر اللون الأخضر! 🟡' : 'Wait for GREEN... 🟡'}</p>
            )}
            {reactionState === 'ready' && (
              <p className="text-4xl sm:text-5xl font-black animate-bounce text-slate-950">{isRtl ? 'اضغط الآن فوراً!! 🟢' : 'CLICK NOW!! 🟢'}</p>
            )}
          </div>
        )}

        {/* 3. CPS Tap Speed View */}
        {gameStarted && isCpsTapGame && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <span className="text-4xl font-black text-amber-400 font-mono">{tapTimeLeft}s</span>
              <p className="text-xs text-slate-400 mt-1">{isRtl ? 'الوقت المتبقي' : 'Time Remaining'}</p>
            </div>
            <button
              onClick={handleTap}
              className="w-44 h-44 rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-white text-3xl font-black flex flex-col items-center justify-center shadow-glow-red hover:scale-105 active:scale-95 transition-transform"
            >
              <span>{tapCount}</span>
              <span className="text-xs font-medium">{isRtl ? 'نقرة' : 'Clicks'}</span>
            </button>
          </div>
        )}

        {/* 4. Rapid Math View */}
        {gameStarted && isMathGame && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <span className="text-sm font-black text-cyan-300">{isRtl ? `سلسلة الإجابات: ${mathStreak}` : `Streak: ${mathStreak}`}</span>
              <h3 className="text-4xl sm:text-5xl font-black text-white mt-2 font-mono">
                {mathNum1} {mathOp} {mathNum2} = ?
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
              {mathOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMathAnswer(opt)}
                  className="p-4 rounded-2xl bg-brand-card border-2 border-brand-cardBorder hover:border-cyan-400 text-2xl font-black text-white hover:scale-105 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Color Rush View */}
        {gameStarted && isColorGame && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-2">{isRtl ? 'هل ينطبق اسم اللون مع الإضاءة؟' : 'Does the text match the color?'}</p>
              <span className="text-5xl font-black" style={{ color: colorHex }}>
                {colorText}
              </span>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="primary" size="lg" fullWidth onClick={() => handleColorChoice(true)}>
                {isRtl ? 'نعم ✓' : 'YES ✓'}
              </Button>
              <Button variant="secondary" size="lg" fullWidth onClick={() => handleColorChoice(false)}>
                {isRtl ? 'لا ✗' : 'NO ✗'}
              </Button>
            </div>
          </div>
        )}

        {/* 6. Aim Target View */}
        {gameStarted && isAimGame && !gameWon && (
          <div className="relative w-full h-80 bg-brand-darkBg rounded-3xl overflow-hidden border border-brand-cardBorder">
            <button
              onClick={handleTargetHit}
              style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 border-4 border-white shadow-glow-red flex items-center justify-center text-xl cursor-pointer hover:scale-110 active:scale-90 transition-transform"
            >
              🎯
            </button>
          </div>
        )}

        {/* Generic Interactive Engine View for remaining games */}
        {gameStarted && !isMemoryGame && !isSpeedReflex && !isCpsTapGame && !isMathGame && !isColorGame && !isAimGame && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="text-center">
              <span className="text-3xl font-black text-cyan-300 font-mono">{score} PTS</span>
              <p className="text-xs text-slate-400 mt-1">{isRtl ? 'اضغط للتفاعل وحصد النقاط' : 'Tap to interact and score'}</p>
            </div>
            <button
              onClick={handleGenericAction}
              className="w-36 h-36 rounded-3xl bg-gradient-to-br from-brand-purple to-indigo-600 text-5xl flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-transform"
            >
              {currentGame.icon}
            </button>
          </div>
        )}

        {/* Victory & Score Submission Screen */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-brand-card to-indigo-950/80 border-2 border-amber-400/80 text-center flex flex-col items-center gap-4 shadow-glow-gold"
          >
            <div className="text-6xl animate-bounce">🏆</div>
            <div>
              <h3 className="text-2xl font-black text-white">
                {isRtl ? 'انتصار رائع وتحدٍ مُكتمل! 🎉' : 'Awesome Victory! 🎉'}
              </h3>
              <p className="text-sm text-slate-300 font-medium mt-1">
                {isRtl
                  ? `أنهيت ${currentGame.titleAr} وحققت ${score} نقطة في ${elapsedTime} ثانية!`
                  : `Completed ${currentGame.title} with ${score} pts in ${elapsedTime}s!`}
              </p>
            </div>

            {/* Earned Rewards Badge */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>+{earnedXp} XP</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>+{earnedCoins} Coins</span>
              </div>
            </div>

            <Button
              variant="gold"
              size="md"
              onClick={() => {
                setGameWon(false)
                setGameStarted(false)
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {isRtl ? 'العب مرة أخرى ⚡' : 'Play Again ⚡'}
            </Button>
          </motion.div>
        )}
      </Card>

      {/* Native Ad Placement */}
      <AdSlot variant="banner" slotId="ad-game-details" />
    </div>
  )
}
