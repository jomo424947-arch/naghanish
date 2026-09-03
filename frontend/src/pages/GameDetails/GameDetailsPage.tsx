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

// Import Dedicated Real Game Engines
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

const MEMORY_EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮', '🎮', '🚀']

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()

  const isRtl = dir === 'rtl'
  const currentGame: GameItem = ALL_GAMES.find((g) => g.id === id) || ALL_GAMES[0]

  // States
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

  // Timer
  useEffect(() => {
    if (!gameStarted || gameWon) return
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameWon])

  // CPS Timer
  useEffect(() => {
    if (!gameStarted || currentGame.id !== 'g21' || gameWon) return
    if (tapTimeLeft <= 0) {
      handleFinishGame(tapCount * 100)
      return
    }
    const timer = setInterval(() => setTapTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, currentGame.id, tapTimeLeft, gameWon, tapCount])

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

        if (user) {
          updateProfile({
            xp: (user.xp || 0) + (res.data.xp_earned || currentGame.xpReward),
            coins: (user.coins || 0) + (res.data.coins_earned || 50),
          })
        }
      }
    } catch {
      // Local fallback
      setEarnedXp(currentGame.xpReward)
      setEarnedCoins(50)
      if (user) {
        updateProfile({
          xp: (user.xp || 0) + currentGame.xpReward,
          coins: (user.coins || 0) + 50,
        })
      }
    }
  }

  const handleStartGame = () => {
    setGameStarted(true)
    setGameWon(false)
    setScore(0)
    setElapsedTime(0)

    if (isMemoryGame) initMemoryGame()
    if (isSpeedReflex) startReactionRound()
    if (currentGame.id === 'g21') {
      setTapCount(0)
      setTapTimeLeft(5)
    }
    if (isMathGame) generateMathQuestion()
    if (isColorGame) generateColorQuestion()
    if (isAimGame) moveTarget()
  }

  // Engine Condition Helpers
  const isSnake = currentGame.id === 'g15'
  const isBrickBreaker = currentGame.id === 'g14'
  const isPong = currentGame.id === 'g20' || currentGame.id === 'g27'
  const isPixelRunner = currentGame.id === 'g7' || currentGame.id === 'g24' || currentGame.id === 'g19' || currentGame.id === 'g29' || currentGame.id === 'g58'
  const isSimon = currentGame.id === 'g6' || currentGame.id === 'g18'
  const isStackTower = currentGame.id === 'g17' || currentGame.id === 'g42'
  const isSpaceShooter = currentGame.id === 'g16' || currentGame.id === 'g49'
  const isWordScramble = currentGame.id === 'g5' || currentGame.id === 'g54' || currentGame.id === 'g28' || currentGame.id === 'g30'
  const isPerfectSecond = currentGame.id === 'g9' || currentGame.id === 'g26'
  const isChaosRoulette = currentGame.id === 'g13' || currentGame.id === 'g57'
  const isDontPress = currentGame.id === 'g55'
  const isWouldYouRather = currentGame.id === 'g35' || currentGame.id === 'g39'
  const isDrawAndGuess = currentGame.id === 'g33' || currentGame.id === 'g38'
  const isReverseControls = currentGame.id === 'g50' || currentGame.id === 'g25' || currentGame.id === 'g56'
  const isTrivia =
    currentGame.id === 'g10' ||
    currentGame.id === 'g11' ||
    currentGame.id === 'g12' ||
    currentGame.id === 'g34' ||
    currentGame.id === 'g36' ||
    currentGame.id === 'g37' ||
    currentGame.id === 'g40' ||
    currentGame.id === 'g41' ||
    currentGame.id === 'g47' ||
    currentGame.id === 'g48' ||
    currentGame.id === 'g51' ||
    currentGame.world === 'shilla'

  const isMemoryGame = currentGame.id === 'g1' || currentGame.id === 'g43' || currentGame.category === 'Memory'
  const isSpeedReflex = currentGame.id === 'g2' || currentGame.id === 'g23'
  const isCpsTapGame = currentGame.id === 'g21' || currentGame.id === 'g44'
  const isMathGame = currentGame.id === 'g3' || currentGame.id === 'g45' || currentGame.id === 'g31' || currentGame.id === 'g32'
  const isColorGame = currentGame.id === 'g4' || currentGame.id === 'g53'
  const isAimGame = currentGame.id === 'g8' || currentGame.id === 'g22' || currentGame.id === 'g46'

  // 1. Memory Game logic
  const initMemoryGame = () => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }))
    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
  }

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [firstIdx, secondIdx] = newFlipped
      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        newCards[firstIdx].matched = true
        newCards[secondIdx].matched = true
        setCards(newCards)
        setFlippedIndices([])

        if (newCards.every((c) => c.matched)) {
          handleFinishGame(1000 - moves * 20)
        }
      } else {
        setTimeout(() => {
          newCards[firstIdx].flipped = false
          newCards[secondIdx].flipped = false
          setCards([...newCards])
          setFlippedIndices([])
        }, 800)
      }
    }
  }

  // 2. Reflex Reaction logic
  const startReactionRound = () => {
    setReactionState('waiting')
    const delay = Math.floor(Math.random() * 2500) + 1500
    setTimeout(() => {
      setReactionState('ready')
      setStartTime(Date.now())
    }, delay)
  }

  const handleReflexClick = () => {
    if (reactionState === 'waiting') {
      setReactionState('idle')
      alert(isRtl ? 'بداية خاطئة! انتظر حتى تتحول الشاشة للأخضر' : 'False start! Wait for green')
    } else if (reactionState === 'ready') {
      const diff = Date.now() - startTime
      setReactionTime(diff)
      setReactionState('result')
      handleFinishGame(Math.max(100, 1000 - diff))
    }
  }

  // 4. Math logic
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

  const handleMathAnswer = (val: number) => {
    let correct = 0
    if (mathOp === '+') correct = mathNum1 + mathNum2
    if (mathOp === '-') correct = mathNum1 - mathNum2
    if (mathOp === '×') correct = mathNum1 * mathNum2

    if (val === correct) {
      const nextStreak = mathStreak + 1
      setMathStreak(nextStreak)
      if (nextStreak >= 5) {
        handleFinishGame(nextStreak * 250)
      } else {
        generateMathQuestion()
      }
    } else {
      setMathStreak(0)
      generateMathQuestion()
    }
  }

  // 5. Color Rush logic
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

  const handleColorAnswer = (userSaysMatch: boolean) => {
    if (userSaysMatch === colorMatched) {
      const newScore = score + 200
      setScore(newScore)
      if (newScore >= 800) {
        handleFinishGame(newScore)
      } else {
        generateColorQuestion()
      }
    } else {
      generateColorQuestion()
    }
  }

  // 6. Aim logic
  const moveTarget = () => {
    setTargetPos({
      top: Math.floor(Math.random() * 70) + 15,
      left: Math.floor(Math.random() * 70) + 15,
    })
  }

  const handleTargetHit = () => {
    const newScore = score + 150
    setScore(newScore)
    if (newScore >= 750) {
      handleFinishGame(newScore)
    } else {
      moveTarget()
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto pb-24">
      <SEO title={`${currentGame.titleAr} | نغنِش`} description={currentGame.descAr} />

      {/* Navigation Top Bar */}
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

      {/* Main Game Card */}
      <div className="relative rounded-[2rem] bg-brand-card border-2 border-brand-cardBorder shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Header Info */}
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

        {/* ── START SCREEN (Before game begins) ── */}
        {!gameStarted && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-12 text-center max-w-md">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-5xl shadow-glow animate-bounce">
              {currentGame.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentGame.titleAr}</h2>
              <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed">
                {currentGame.descAr}
              </p>
            </div>

            <Button variant="primary" size="lg" onClick={handleStartGame} leftIcon={<Play className="w-5 h-5 fill-current" />}>
              {isRtl ? 'العب الآن 🚀' : 'Play Now 🚀'}
            </Button>
          </div>
        )}

        {/* ── REAL DEDICATED GAME ENGINES ── */}
        {gameStarted && !gameWon && (
          <div className="w-full flex flex-col items-center">
            {/* 1. Snake Game */}
            {isSnake && <SnakeGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 2. Brick Breaker */}
            {isBrickBreaker && <BrickBreakerGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 3. Pong Showdown */}
            {isPong && <PongGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 4. Pixel Runner */}
            {isPixelRunner && <PixelRunnerGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 5. Simon Pattern */}
            {isSimon && <SimonPatternGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 6. Stack Tower */}
            {isStackTower && <StackTowerGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 7. Space Shooter */}
            {isSpaceShooter && <SpaceShooterGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 8. Word Scramble */}
            {isWordScramble && <WordScrambleGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 9. Perfect Second */}
            {isPerfectSecond && <PerfectSecondGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 10. Chaos Roulette */}
            {isChaosRoulette && <ChaosRouletteGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 11. Forbidden Button */}
            {isDontPress && <DontPressButtonGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 12. Would You Rather */}
            {isWouldYouRather && <WouldYouRatherGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 13. Draw & Guess */}
            {isDrawAndGuess && <DrawAndGuessGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 14. Reverse Controls */}
            {isReverseControls && <ReverseControlsGame onFinish={handleFinishGame} isRtl={isRtl} />}

            {/* 15. Crew Trivia */}
            {isTrivia && !isWouldYouRather && !isDrawAndGuess && (
              <CrewTriviaGame onFinish={handleFinishGame} isRtl={isRtl} />
            )}

            {/* 16. Memory Cards */}
            {isMemoryGame && (
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
            )}

            {/* 17. Reaction Speed */}
            {isSpeedReflex && (
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
                      ? (isRtl ? 'اضغط الآن فوراااً!' : 'CLICK NOW!')
                      : (isRtl ? 'اضغط هنا للبدء' : 'Click to start')}
                  </h3>
                </button>
              </div>
            )}

            {/* 18. CPS Tap Speed */}
            {isCpsTapGame && (
              <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                <div className="flex items-center justify-between w-full text-xs font-mono font-black">
                  <span className="text-rose-400">{tapTimeLeft}s Remaining</span>
                  <span className="text-cyan-300">CPS: {(tapCount / (5 - tapTimeLeft || 1)).toFixed(1)}</span>
                </div>
                <button
                  onClick={() => setTapCount((c) => c + 1)}
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 border-4 border-white/20 text-white flex flex-col items-center justify-center gap-1 shadow-glow active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="text-4xl font-black font-mono">{tapCount}</span>
                  <span className="text-xs font-black uppercase">{isRtl ? 'انقر بأقصى سرعة!' : 'TAP FAST!'}</span>
                </button>
              </div>
            )}

            {/* 19. Rapid Math */}
            {isMathGame && (
              <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="p-8 rounded-3xl bg-brand-darkBg border-2 border-brand-purple/50 shadow-inner flex items-center justify-center text-4xl font-black text-cyan-300 font-mono tracking-wider">
                  {mathNum1} {mathOp} {mathNum2} = ?
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {mathOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleMathAnswer(opt)}
                      className="p-4 rounded-2xl bg-brand-card border-2 border-brand-cardBorder hover:border-cyan-400 font-mono text-xl font-black text-white active:scale-95 transition-all shadow"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 20. Color Rush */}
            {isColorGame && (
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
            )}

            {/* 21. Aim Target */}
            {isAimGame && (
              <div className="relative w-full h-80 rounded-3xl bg-brand-darkBg border-2 border-brand-purple/40 overflow-hidden shadow-inner">
                <button
                  onClick={handleTargetHit}
                  style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-rose-500 border-4 border-white shadow-[0_0_20px_#f43f5e] flex items-center justify-center text-white active:scale-90 transition-transform cursor-crosshair"
                >
                  <Target className="w-7 h-7" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── VICTORY & SUMMARY SCREEN ── */}
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
                {isRtl ? 'مبروك الفوز والانتصار! 🎉' : 'Victory & Mastery! 🎉'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {isRtl ? 'تم تسجيل نتيجتك وحصدت مكافآت الخبرة والعملات بنجاح!' : 'Your score was submitted and rewards added!'}
              </p>
            </div>

            {/* Rewards Box */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isRtl ? 'الخبرة المكتسبة' : 'XP Gained'}
                </span>
                <span className="text-2xl font-black text-white mt-1">+{earnedXp || currentGame.xpReward} XP</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/40 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {isRtl ? 'العملات الذهبية' : 'Coins Reward'}
                </span>
                <span className="text-2xl font-black text-white mt-1">+{earnedCoins || 50} 💰</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full">
              <Button variant="primary" size="md" fullWidth onClick={handleStartGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
                {isRtl ? 'العب مرة أخرى ⚡' : 'Play Again ⚡'}
              </Button>
              <Button variant="secondary" size="md" fullWidth onClick={() => navigate(ROUTES.GAMES)}>
                {isRtl ? 'قائمة الألعاب' : 'All Games'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Ad slot */}
      <AdSlot variant="in-feed" />
    </div>
  )
}
