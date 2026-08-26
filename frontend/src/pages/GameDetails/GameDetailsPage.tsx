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
} from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

// Emojis for memory cards game
const EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮']

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  const isRtl = dir === 'rtl'
  const isSpeedTest = id === 'g2'

  // Memory Game State
  const [cards, setCards] = useState<
    { id: number; emoji: string; flipped: boolean; matched: boolean }[]
  >([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Reaction Game State
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)

  // Init Memory Cards Game
  const initMemoryGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))

    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
    setGameWon(false)
    setElapsedTime(0)
    setGameStarted(true)
  }

  // Memory Game Timer
  useEffect(() => {
    if (!gameStarted || gameWon) return
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameWon])

  // Handle Card Flip
  const handleCardClick = (index: number) => {
    if (
      !gameStarted ||
      cards[index].flipped ||
      cards[index].matched ||
      flippedIndices.length === 2
    )
      return

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

        // Check if all matched
        if (newCards.every((c) => c.matched)) {
          setGameWon(true)
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false
          newCards[second].flipped = false
          setCards(newCards)
          setFlippedIndices([])
        }, 800)
      }
    }
  }

  // Reaction Game Logic
  const startReactionTest = () => {
    setReactionState('waiting')
    const randomDelay = Math.floor(Math.random() * 3000) + 2000
    setTimeout(() => {
      setReactionState('ready')
      setStartTime(Date.now())
    }, randomDelay)
  }

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      alert(
        isRtl
          ? 'مبكر جداً! انتظر حتى يصبح اللون أخضر.'
          : 'Too early! Wait for the green screen.'
      )
      setReactionState('idle')
    } else if (reactionState === 'ready') {
      const diff = Date.now() - startTime
      setReactionTime(diff)
      setReactionState('result')
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto">
      <SEO
        title={
          isSpeedTest
            ? 'اختبار ردة الفعل والسرعة | نغنِش'
            : 'لعبة بطاقات الذاكرة | نغنِش'
        }
        description="العب الآن اختبر قدراتك الذهنية وسرعة البديهة على منصة نغنِش."
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
          <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-purple/20 text-cyan-300 border border-purple-500/30">
            {isSpeedTest ? 'REFLEX MODE' : 'ARCADE MODE'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          GAME 1: Reaction Speed Test (REFLEX WORLD)
      ───────────────────────────────────────────────────────────── */}
      {isSpeedTest ? (
        <Card
          variant="glowing"
          glowColor="red"
          className="p-6 sm:p-8 flex flex-col items-center text-center gap-6 border-2 border-red-500/40"
        >
          <div className="flex items-center gap-3">
            <ModeMascot mode="reflex" size="md" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? 'اختبار ردة الفعل والسرعة الخاطفة ⚡' : 'Reflex Speed Test Arena ⚡'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isRtl
                  ? 'اضغط بأسرع ما يمكنك فور تغير لون الشاشة للأخضر'
                  : 'Click as fast as humanly possible when the screen turns green'}
              </p>
            </div>
          </div>

          <div
            onClick={
              reactionState === 'waiting' || reactionState === 'ready'
                ? handleReactionClick
                : undefined
            }
            className={`w-full min-h-[300px] rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-2xl p-6 select-none relative overflow-hidden ${
              reactionState === 'idle'
                ? 'bg-brand-darkBg border-2 border-dashed border-red-500/40 hover:border-red-400'
                : reactionState === 'waiting'
                ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white animate-pulse border-2 border-yellow-400'
                : reactionState === 'ready'
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-slate-950 scale-102 shadow-glow-lime border-4 border-white'
                : 'bg-brand-card border-2 border-brand-purple'
            }`}
          >
            {reactionState === 'idle' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-red-500/20 text-red-400 flex items-center justify-center text-4xl shadow-glow-red">
                  ⚡
                </div>
                <h3 className="text-lg font-black text-white">
                  {isRtl ? 'جاهز لاختبار أقصى سرعة لديك؟' : 'Ready for the ultimate speed test?'}
                </h3>
                <Button
                  variant="reflex"
                  size="lg"
                  onClick={startReactionTest}
                  leftIcon={<Play className="w-5 h-5 fill-current" />}
                >
                  {isRtl ? 'ابدأ الاختبار 🚀' : 'Start Test 🚀'}
                </Button>
              </div>
            )}

            {reactionState === 'waiting' && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl sm:text-3xl font-black tracking-tight">
                  {isRtl ? 'استعد... انتظر اللون الأخضر! 🟡' : 'Wait for GREEN... 🟡'}
                </p>
                <p className="text-xs text-amber-200 font-bold">
                  {isRtl ? 'لا تضغط الآن وإلا ستخسر المحاولة!' : 'Do not click yet!'}
                </p>
              </div>
            )}

            {reactionState === 'ready' && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-4xl sm:text-5xl font-black animate-bounce tracking-tight">
                  {isRtl ? 'اضغط الآن فوراً!! 🟢' : 'CLICK NOW!! 🟢'}
                </p>
                <p className="text-sm font-black text-slate-950">
                  {isRtl ? 'أسرع بأقصى سرعة!' : 'FASTEST REFLEX!'}
                </p>
              </div>
            )}

            {reactionState === 'result' && (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-3xl bg-amber-400/20 text-amber-400">
                  <Trophy className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-black text-gradient-primary">
                    {reactionTime} ms
                  </p>
                  <p className="text-sm text-slate-300 font-bold mt-1">
                    {reactionTime && reactionTime < 250
                      ? isRtl
                        ? 'سرعة خارقة كالفهد! 🐆 تم تسجيل رقم قياسي'
                        : 'Lightning fast! 🐆 Pro gamer reflexes'
                      : isRtl
                      ? 'سرعة ممتازة! تدرب لتصل لأقل من 250ms 👍'
                      : 'Great speed! Keep practicing for sub-250ms 👍'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="reflex"
                    size="md"
                    onClick={startReactionTest}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    {isRtl ? 'إعادة المحاولة' : 'Try Again'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            GAME 2: Memory Cards Game (ARCADE WORLD)
        ───────────────────────────────────────────────────────────── */
        <Card
          variant="glowing"
          glowColor="cyan"
          className="p-6 sm:p-8 flex flex-col gap-6 border-2 border-brand-purple/40"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ModeMascot mode="arcade" size="md" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isRtl ? 'بطاقات الذاكرة الخارقة 🃏' : 'Memory Cards Arena 🃏'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {isRtl
                    ? 'طابق كافة الأزواج المتشابهة بأقل المحاولات'
                    : 'Match all card pairs in minimum moves'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-cyan-400/30 text-xs font-black text-cyan-300 shadow-glow-blue">
                <Clock className="w-4 h-4 text-cyan-300" />
                <span>{elapsedTime}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-amber-400/30 text-xs font-black text-amber-300 shadow-glow-gold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>
                  {moves} {isRtl ? 'حركات' : 'moves'}
                </span>
              </div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="py-14 flex flex-col items-center justify-center text-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue flex items-center justify-center text-5xl shadow-glow">
                🃏
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {isRtl ? 'جاهز لتحدي الذاكرة وتحطيم الرقم القياسي؟' : 'Ready for Memory Challenge?'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {isRtl
                    ? 'اكسب +250 XP عند إنهاء التحدي بنجاح'
                    : 'Earn +250 XP upon completing the challenge'}
                </p>
              </div>
              <Button
                variant="arcade"
                size="lg"
                onClick={initMemoryGame}
                leftIcon={<Play className="w-5 h-5 fill-current" />}
              >
                {isRtl ? 'بدء اللعب 🚀' : 'Start Playing 🚀'}
              </Button>
            </div>
          ) : (
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

          {/* Victory Modal */}
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-brand-card to-indigo-950/80 border-2 border-amber-400/80 text-center flex flex-col items-center gap-4 shadow-glow-gold"
            >
              <div className="text-6xl animate-bounce">🏆</div>
              <div>
                <h3 className="text-2xl font-black text-white">
                  {isRtl ? 'مبروك! انتصار ساحق 🎉' : 'Victory! Challenge Completed 🎉'}
                </h3>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  {isRtl
                    ? `أنهيت اللعبة في ${moves} حركات و ${elapsedTime} ثانية! وكسبت +250 XP`
                    : `Finished in ${moves} moves and ${elapsedTime}s! Earned +250 XP`}
                </p>
              </div>
              <Button
                variant="gold"
                size="md"
                onClick={initMemoryGame}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                {isRtl ? 'العب مرة أخرى ⚡' : 'Play Again ⚡'}
              </Button>
            </motion.div>
          )}
        </Card>
      )}

      {/* Native Ad Placement */}
      <AdSlot variant="banner" slotId="ad-game-details" />
    </div>
  )
}
