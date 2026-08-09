import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Zap, Clock, Play, Star, Sparkles } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

// Emojis for memory cards game
const EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮']

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  // Game selection state based on route param or fallback
  const isSpeedTest = id === 'g2'

  // Memory Game State
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
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
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted, gameWon])

  // Handle Card Flip
  const handleCardClick = (index: number) => {
    if (!gameStarted || cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = newFlipped
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].matched = true
        newCards[second].matched = true
        setCards(newCards)
        setFlippedIndices([])

        // Check if all matched
        if (newCards.every(c => c.matched)) {
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
      alert(dir === 'rtl' ? 'مبكر جداً! انتظر حتى يصبح اللون أخضر.' : 'Too early! Wait for the green screen.')
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
        title={isSpeedTest ? 'اختبار ردة الفعل والسرعة | نغنِش' : 'لعبة بطاقات الذاكرة | نغنِش'}
        description="العب الآن اختبر قدراتك الذهنية وسرعة البديهة على منصة نغنِش."
      />

      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.GAMES)}
        >
          {dir === 'rtl' ? 'العودة للألعاب' : 'Back to Games'}
        </Button>
      </div>

      {/* GAME 1: Reaction Speed Test */}
      {isSpeedTest ? (
        <Card variant="glowing" glowColor="cyan" className="p-6 sm:p-8 flex flex-col items-center text-center gap-6">
          <SectionTitle
            title={dir === 'rtl' ? 'اختبار ردة الفعل والسرعة ⚡' : 'Reaction Speed Test ⚡'}
            subtitle={dir === 'rtl' ? 'اضغط بأسرع ما يمكنك فور تغير اللون للأخضر' : 'Click as fast as possible when color turns green'}
          />

          <div
            onClick={reactionState === 'waiting' || reactionState === 'ready' ? handleReactionClick : undefined}
            className={`w-full h-64 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl p-6 ${
              reactionState === 'idle'
                ? 'bg-brand-darkBg border-2 border-dashed border-slate-600 hover:border-cyan-400'
                : reactionState === 'waiting'
                ? 'bg-amber-600 text-white animate-pulse'
                : reactionState === 'ready'
                ? 'bg-emerald-500 text-white scale-105 shadow-glow-blue'
                : 'bg-brand-card border-2 border-brand-purple'
            }`}
          >
            {reactionState === 'idle' && (
              <div className="flex flex-col items-center gap-3">
                <Zap className="w-16 h-16 text-cyan-300" />
                <Button variant="primary" size="lg" onClick={startReactionTest} leftIcon={<Play className="w-5 h-5 fill-current" />}>
                  {dir === 'rtl' ? 'ابدأ الاختبار' : 'Start Test'}
                </Button>
              </div>
            )}

            {reactionState === 'waiting' && (
              <p className="text-xl font-black">{dir === 'rtl' ? 'استعد... انتظر اللون الأخضر 🟡' : 'Wait for green... 🟡'}</p>
            )}

            {reactionState === 'ready' && (
              <p className="text-3xl font-black animate-bounce">{dir === 'rtl' ? 'اضغط الآن!! 🟢' : 'CLICK NOW!! 🟢'}</p>
            )}

            {reactionState === 'result' && (
              <div className="flex flex-col items-center gap-4">
                <Trophy className="w-12 h-12 text-amber-400" />
                <p className="text-3xl font-black text-gradient-primary">{reactionTime} ms</p>
                <p className="text-sm text-slate-300 font-bold">
                  {reactionTime && reactionTime < 250
                    ? (dir === 'rtl' ? 'سرعة خارقة كالفهد! 🐆' : 'Lightning fast! 🐆')
                    : (dir === 'rtl' ? 'سرعة ممتازة! استمر في التمرين 👍' : 'Great speed! Keep practice 👍')}
                </p>
                <Button variant="secondary" size="md" onClick={startReactionTest} leftIcon={<RotateCcw className="w-4 h-4" />}>
                  {dir === 'rtl' ? 'إعادة المحاولة' : 'Try Again'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* GAME 2: Memory Cards Game */
        <Card variant="glowing" glowColor="purple" className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-white">{dir === 'rtl' ? 'بطاقات الذاكرة 🃏' : 'Memory Cards 🃏'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{dir === 'rtl' ? 'طابق كافة الأزواج المتشابهة بأقل المحاولات' : 'Match all pairs in minimum moves'}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-xs font-bold text-slate-300">
                <Clock className="w-4 h-4 text-cyan-300" />
                <span>{elapsedTime}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-xs font-bold text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{moves} {dir === 'rtl' ? 'حركات' : 'moves'}</span>
              </div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center text-4xl shadow-glow">
                🃏
              </div>
              <h3 className="text-lg font-extrabold text-white">{dir === 'rtl' ? 'جاهز لتحدي الذاكرة؟' : 'Ready for Memory Challenge?'}</h3>
              <Button variant="primary" size="lg" onClick={initMemoryGame} leftIcon={<Play className="w-5 h-5 fill-current" />}>
                {dir === 'rtl' ? 'بدء اللعب' : 'Start Playing'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto w-full my-4">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl border-2 text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                    card.flipped || card.matched
                      ? 'bg-gradient-to-br from-brand-purple to-brand-blue border-cyan-300 rotate-y-180 scale-105'
                      : 'bg-brand-card border-brand-cardBorder hover:border-slate-500 hover:scale-102'
                  }`}
                >
                  {card.flipped || card.matched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          )}

          {/* Victory Modal */}
          {gameWon && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-purple/40 to-indigo-900/50 border-2 border-amber-400/60 text-center flex flex-col items-center gap-4 shadow-glow">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="text-2xl font-black text-white">{dir === 'rtl' ? 'مبروك! انتصار ساحق 🎉' : 'Congratulations! You Won 🎉'}</h3>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  {dir === 'rtl' ? `أنهيت اللعبة في ${moves} حركات و ${elapsedTime} ثانية!` : `Completed in ${moves} moves and ${elapsedTime} seconds!`}
                </p>
              </div>
              <Button variant="accent" size="md" onClick={initMemoryGame} leftIcon={<RotateCcw className="w-4 h-4" />}>
                {dir === 'rtl' ? 'العب مرة أخرى' : 'Play Again'}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Ad Placement */}
      <AdSlot variant="banner" slotId="ad-game-details" />
    </div>
  )
}
