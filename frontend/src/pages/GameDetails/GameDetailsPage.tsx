/**
 * GameDetailsPage.tsx
 *
 * Host page for a single game. Owns start / difficulty / victory chrome and
 * wraps the lazy engine in GameShell (fullscreen, pause, levels).
 *
 * Engines are never static-imported here — they come from games.registry.ts.
 */

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { GameShell, useGameProgress, type GameDifficulty, type GameFinishMeta } from '@components/game-kit'
import { useThemeStore } from '@store/themeStore'
import { useAuthStore } from '@store/authStore'
import { ROUTES } from '@constants/routes'
import { ALL_GAMES, getGameById, getPlayMeta, type GameItem } from '@data/games.data'
import { getGameEngine } from '@data/games.registry'
import { httpClient } from '@api/httpClient'
import { sound } from '@utils/soundManager'
import { getApiErrorMessage } from '@utils/apiError'

function EngineFallback({ isRtl }: { isRtl: boolean }) {
  return (
    <div className="w-full min-h-[20rem] flex flex-col items-center justify-center gap-3 text-slate-400">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-400/40 border-t-cyan-300 animate-spin" />
      <span className="text-xs font-black">{isRtl ? 'جاري تحميل اللعبة...' : 'Loading game...'}</span>
    </div>
  )
}

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const { user, updateProfile } = useAuthStore()

  const isRtl = dir === 'rtl'
  const lookedUpGame = getGameById(id ?? '')
  // Fallback keeps hooks unconditional; unknown IDs redirect below.
  const currentGame: GameItem = lookedUpGame ?? ALL_GAMES[0]

  const [difficulty, setDifficulty] = useState<GameDifficulty>('Medium')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [score, setScore] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [engineKey, setEngineKey] = useState(0)

  const diffMultiplier = difficulty === 'Hard' ? 2.5 : difficulty === 'Medium' ? 1.5 : 1.0
  const playMeta = getPlayMeta(currentGame)
  const Engine = useMemo(() => getGameEngine(currentGame.id), [currentGame.id])
  const progress = useGameProgress(currentGame.id, playMeta.levelCount)

  useEffect(() => {
    if (id?.startsWith('q')) {
      navigate(`/quizzes/${id}`, { replace: true })
      return
    }
    if (id && !lookedUpGame) {
      navigate(ROUTES.NOT_FOUND, { replace: true })
    }
  }, [id, lookedUpGame, navigate])

  // Reset session state when navigating between games.
  useEffect(() => {
    setGameStarted(false)
    setGameWon(false)
    setScore(0)
    setElapsedTime(0)
    setSelectedLevel(1)
    setEngineKey((key) => key + 1)
  }, [currentGame.id])

  useEffect(() => {
    if (!gameStarted || gameWon) return
    const timer = window.setInterval(() => setElapsedTime((prev) => prev + 1), 1000)
    return () => window.clearInterval(timer)
  }, [gameStarted, gameWon])

  const handleFinishGame = useCallback(
    async (finalScore: number, meta?: GameFinishMeta) => {
      setGameWon(true)
      setScore(finalScore)

      const levelReached = meta?.levelReached ?? selectedLevel
      const stars = meta?.stars ?? (finalScore > 600 ? 3 : finalScore > 250 ? 2 : 1)
      progress.completeLevel(levelReached, stars, finalScore)

      const baseReward = Math.round(currentGame.xpReward * diffMultiplier)

      try {
        const res = await httpClient.post(`/games/${currentGame.id}/submit`, {
          score: finalScore,
          elapsed_seconds: elapsedTime,
          difficulty,
        })
        if (res.data) {
          const xpGot = res.data.xpEarned ?? res.data.xp_earned ?? baseReward
          const coinsGot =
            res.data.coinsEarned ?? res.data.coins_earned ?? Math.round(50 * diffMultiplier)
          setEarnedXp(xpGot)
          setEarnedCoins(coinsGot)

          if (user) {
            updateProfile({
              xp: res.data.userXp ?? (user.xp || 0) + xpGot,
              coins: res.data.userCoins ?? (user.coins || 0) + coinsGot,
              level: res.data.userLevel ?? user.level,
              maxXp: res.data.userMaxXp ?? user.maxXp,
              rank: res.data.rankTitle ?? user.rank,
            })
          }
        }
      } catch (error) {
        console.warn('[GameDetails] submit failed:', getApiErrorMessage(error, 'submit failed'))
        setEarnedXp(baseReward)
        setEarnedCoins(Math.round(50 * diffMultiplier))
        if (user) {
          updateProfile({
            xp: (user.xp || 0) + baseReward,
            coins: (user.coins || 0) + Math.round(50 * diffMultiplier),
          })
        }
      }
    },
    [
      selectedLevel,
      progress,
      currentGame,
      diffMultiplier,
      elapsedTime,
      difficulty,
      user,
      updateProfile,
    ]
  )

  const handleLevelComplete = useCallback(
    (level: number, stars: number) => {
      progress.completeLevel(level, stars, score)
    },
    [progress, score]
  )

  const handleStartGame = () => {
    sound.playClick()
    setGameStarted(true)
    setGameWon(false)
    setScore(0)
    setElapsedTime(0)
    setEngineKey((key) => key + 1)
  }

  const handleRestart = () => {
    sound.playClick()
    setGameWon(false)
    setScore(0)
    setElapsedTime(0)
    setEngineKey((key) => key + 1)
    setGameStarted(true)
  }

  const earnedStars = score > 600 ? 3 : score > 250 ? 2 : 1

  if (!lookedUpGame) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto pb-24">
      <SEO title={`${currentGame.titleAr} | نغنِش`} description={currentGame.descAr} />

      <div className="flex items-center justify-between">
        <button
          type="button"
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

      <div className="relative rounded-[2rem] bg-brand-card border-2 border-brand-cardBorder shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {!gameStarted && (
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
        )}

        {/* Start screen */}
        {!gameStarted && !gameWon && (
          <div className="flex flex-col items-center gap-6 py-8 text-center max-w-md w-full">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-5xl shadow-glow animate-bounce">
              {currentGame.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentGame.titleAr}</h2>
              <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed">
                {currentGame.descAr}
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-2 p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                {isRtl ? 'اختر مستوى الصعوبة ومضاعف الـ XP' : 'Select Difficulty & XP Multiplier'}
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {(
                  [
                    {
                      id: 'Easy' as const,
                      labelAr: 'سهل',
                      mult: '1.0x',
                      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
                    },
                    {
                      id: 'Medium' as const,
                      labelAr: 'متوسط',
                      mult: '1.5x',
                      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
                    },
                    {
                      id: 'Hard' as const,
                      labelAr: 'صعب 🔥',
                      mult: '2.5x',
                      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
                    },
                  ] as const
                ).map((option) => {
                  const isSelected = difficulty === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setDifficulty(option.id)
                      }}
                      className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${option.color} shadow-glow scale-[1.03] border-current`
                          : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-black">{isRtl ? option.labelAr : option.id}</span>
                      <span className="text-[10px] font-mono opacity-80">{option.mult} XP</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {playMeta.levelCount > 1 && (
              <div className="w-full flex flex-col items-center gap-2 p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  {isRtl ? 'اختر المرحلة' : 'Select Level'}
                </span>
                <div className="flex flex-wrap justify-center gap-1.5 w-full">
                  {Array.from({ length: playMeta.levelCount }, (_, index) => index + 1).map(
                    (levelNumber) => {
                      const unlocked = progress.isLevelUnlocked(levelNumber)
                      const stars = progress.starsForLevel(levelNumber)
                      const isActive = selectedLevel === levelNumber
                      return (
                        <button
                          key={levelNumber}
                          type="button"
                          disabled={!unlocked}
                          onClick={() => {
                            sound.playClick()
                            setSelectedLevel(levelNumber)
                          }}
                          className={`w-11 h-12 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 font-mono text-xs font-black transition-all ${
                            isActive
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                              : unlocked
                                ? 'border-white/10 bg-white/5 text-slate-300 cursor-pointer'
                                : 'border-white/5 bg-black/40 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {unlocked ? levelNumber : <Lock className="w-3 h-3" />}
                          <span className="flex gap-px h-2">
                            {Array.from({ length: stars }, (_, starIndex) => (
                              <Star
                                key={starIndex}
                                className="w-1.5 h-1.5 text-amber-400 fill-amber-400"
                              />
                            ))}
                          </span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartGame}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              disabled={!Engine}
            >
              {isRtl ? 'ابدأ اللعب الآن 🚀' : 'Play Now 🚀'}
            </Button>

            {!Engine && (
              <p className="text-xs text-rose-400 font-bold">
                {isRtl ? 'محرك هذه اللعبة غير متاح حالياً' : 'This game engine is not available yet'}
              </p>
            )}
          </div>
        )}

        {/* Active game */}
        {gameStarted && !gameWon && Engine && (
          <div className="w-full">
            <GameShell
              gameId={currentGame.id}
              titleAr={currentGame.titleAr}
              titleEn={currentGame.title}
              icon={currentGame.icon}
              isRtl={isRtl}
              orientation={playMeta.preferredOrientation}
              levelCount={playMeta.levelCount}
              level={selectedLevel}
              onLevelChange={(level) => {
                setSelectedLevel(level)
                setEngineKey((key) => key + 1)
              }}
              hud={
                <div className="flex items-center gap-2 font-mono text-xs font-black text-cyan-300 bg-black/40 px-2.5 py-1 rounded-lg border border-cyan-400/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{elapsedTime}s</span>
                </div>
              }
              onExit={() => {
                setGameStarted(false)
                setGameWon(false)
              }}
              onRestart={handleRestart}
            >
              <Suspense fallback={<EngineFallback isRtl={isRtl} />}>
                <Engine
                  key={engineKey}
                  onFinish={handleFinishGame}
                  isRtl={isRtl}
                  difficulty={difficulty}
                  level={selectedLevel}
                  onLevelComplete={handleLevelComplete}
                />
              </Suspense>
            </GameShell>
          </div>
        )}

        {/* Victory */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-8 text-center max-w-md w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-5xl shadow-glow-gold">
                🏆
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-7 h-7 ${
                      starIdx <= earnedStars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {score > 0
                  ? isRtl
                    ? 'انتهت الجولة! 🎮'
                    : 'Round Complete! 🎮'
                  : isRtl
                    ? 'انتهت المحاولة'
                    : 'Session Over'}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-sm font-mono text-cyan-400 font-bold">
                  {isRtl ? 'النتيجة:' : 'Score:'} {score}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                  {difficulty === 'Hard'
                    ? isRtl
                      ? 'صعب (2.5x)'
                      : 'Hard (2.5x)'
                    : difficulty === 'Easy'
                      ? isRtl
                        ? 'سهل (1.0x)'
                        : 'Easy (1.0x)'
                      : isRtl
                        ? 'متوسط (1.5x)'
                        : 'Medium (1.5x)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/40 flex flex-col items-center">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isRtl ? 'الخبرة المكتسبة' : 'XP Gained'}
                </span>
                <span className="text-2xl font-black text-white mt-1">
                  +{earnedXp || currentGame.xpReward}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/40 flex flex-col items-center">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {isRtl ? 'العملات' : 'Coins'}
                </span>
                <span className="text-2xl font-black text-white mt-1">
                  +{earnedCoins || 50} 💰
                </span>
              </div>
            </div>

            <div className="w-full p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-2.5 text-right">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {isRtl ? 'تقدمك في اللعبة' : 'Your Progress'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isRtl ? 'نجوم:' : 'Stars:'} {progress.totalStars}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-bold">
                {isRtl
                  ? `أعلى مرحلة مفتوحة: ${progress.unlockedLevel} · أفضل نتيجة: ${progress.bestScore}`
                  : `Unlocked level: ${progress.unlockedLevel} · Best score: ${progress.bestScore}`}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleRestart}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
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
