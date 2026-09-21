/**
 * GameShell.tsx
 *
 * The chrome around every game: fullscreen, pause, sound, level select, and the
 * touch control slot. Engines render gameplay only.
 *
 * The shell wraps engines from the host page rather than from inside each
 * engine, which is what lets the existing catalog gain fullscreen and levels
 * without editing 22 game files.
 *
 * Engines that want to react to pause read `useGameShell()` and feed
 * `isPaused` into `useGameLoop`. Legacy engines that ignore it still get the
 * blocking overlay.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { cn } from '@lib/utils'
import { sound } from '@utils/soundManager'
import { useFullscreen } from './useFullscreen'
import { useGameProgress } from './useGameProgress'
import type { StageOrientation } from './types'

interface GameShellContextValue {
  isPaused: boolean
  isFullscreen: boolean
  level: number
  pause: () => void
  resume: () => void
}

const GameShellContext = createContext<GameShellContextValue | null>(null)

/**
 * Read shell state from inside an engine. Returns a safe default when the
 * engine is rendered outside a shell, so engines stay usable standalone.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGameShell(): GameShellContextValue {
  return (
    useContext(GameShellContext) ?? {
      isPaused: false,
      isFullscreen: false,
      level: 1,
      pause: () => undefined,
      resume: () => undefined,
    }
  )
}

export interface GameShellProps {
  gameId: string
  titleAr: string
  titleEn: string
  icon: string
  isRtl?: boolean
  orientation?: StageOrientation
  /** Number of levels. 1 (default) hides the level strip entirely. */
  levelCount?: number
  level?: number
  onLevelChange?: (level: number) => void
  /** Extra readouts shown in the toolbar, e.g. score or lives. */
  hud?: React.ReactNode
  /** Touch controls rendered beneath the stage. */
  controls?: React.ReactNode
  onExit?: () => void
  onRestart?: () => void
  children: React.ReactNode
}

const TOOLBAR_BUTTON =
  'p-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-white ' +
  'transition-colors cursor-pointer'

export const GameShell: React.FC<GameShellProps> = ({
  gameId,
  titleAr,
  titleEn,
  icon,
  isRtl = true,
  orientation = 'any',
  levelCount = 1,
  level = 1,
  onLevelChange,
  hud,
  controls,
  onExit,
  onRestart,
  children,
}) => {
  const { stageRef, isFullscreen, toggle: toggleFullscreen, exit: exitFullscreen } =
    useFullscreen(orientation)
  const progress = useGameProgress(gameId, levelCount)

  const [isPaused, setIsPaused] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(sound.isEnabled())
  const [isBgmOn, setIsBgmOn] = useState(sound.isBgmEnabled())

  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])

  const togglePause = useCallback(() => {
    sound.playClick()
    setIsPaused((current) => !current)
  }, [])

  const handleExit = useCallback(() => {
    exitFullscreen()
    onExit?.()
  }, [exitFullscreen, onExit])

  const contextValue = useMemo<GameShellContextValue>(
    () => ({ isPaused, isFullscreen, level, pause, resume }),
    [isPaused, isFullscreen, level, pause, resume]
  )

  const showLevels = levelCount > 1

  return (
    <GameShellContext.Provider value={contextValue}>
      <div
        ref={stageRef}
        className={cn(
          'flex flex-col w-full',
          isFullscreen
            ? 'fixed inset-0 z-[120] bg-brand-darkBg gap-2 overflow-hidden'
            : 'relative gap-3'
        )}
        style={
          isFullscreen
            ? {
                // Keep the toolbar and controls clear of notches and home bars.
                paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
                paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
                paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
                paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
              }
            : undefined
        }
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {isFullscreen && (
              <>
                <span className="text-xl shrink-0">{icon}</span>
                <span className="text-sm font-black text-white truncate">
                  {isRtl ? titleAr : titleEn}
                </span>
              </>
            )}
            {hud}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSoundOn(sound.toggleSound())}
              title={isRtl ? 'المؤثرات الصوتية' : 'Sound effects'}
              className={TOOLBAR_BUTTON}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBgmOn(sound.toggleBgm())}
              title={isRtl ? 'الموسيقى' : 'Music'}
              className={TOOLBAR_BUTTON}
            >
              <Music className={cn('w-4 h-4', isBgmOn ? 'text-cyan-400' : 'text-slate-500')} />
            </button>

            <button
              type="button"
              onClick={togglePause}
              title={isRtl ? 'إيقاف مؤقت' : 'Pause'}
              className={TOOLBAR_BUTTON}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-amber-300" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isRtl ? 'ملء الشاشة' : 'Fullscreen'}
              className={TOOLBAR_BUTTON}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-cyan-300" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {isFullscreen && (
              <button
                type="button"
                onClick={handleExit}
                title={isRtl ? 'خروج' : 'Exit'}
                className={TOOLBAR_BUTTON}
              >
                <X className="w-4 h-4 text-rose-400" />
              </button>
            )}
          </div>
        </div>

        {/* Level strip */}
        {showLevels && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 [scrollbar-width:none]">
            {Array.from({ length: levelCount }, (_, index) => index + 1).map((levelNumber) => {
              const unlocked = progress.isLevelUnlocked(levelNumber)
              const stars = progress.starsForLevel(levelNumber)
              const isActive = levelNumber === level

              return (
                <button
                  key={levelNumber}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    sound.playClick()
                    onLevelChange?.(levelNumber)
                  }}
                  title={
                    unlocked
                      ? `${isRtl ? 'مرحلة' : 'Level'} ${levelNumber}`
                      : isRtl
                        ? 'مقفلة — اكمل المرحلة السابقة'
                        : 'Locked — clear the previous level'
                  }
                  className={cn(
                    'shrink-0 w-12 rounded-xl border-2 px-1 py-1 flex flex-col items-center gap-0.5',
                    'font-mono text-xs font-black transition-all',
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-glow'
                      : unlocked
                        ? 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 cursor-pointer'
                        : 'border-white/5 bg-black/40 text-slate-600 cursor-not-allowed'
                  )}
                >
                  {unlocked ? levelNumber : <Lock className="w-3 h-3" />}
                  <span className="flex items-center gap-px h-2">
                    {stars > 0 &&
                      Array.from({ length: stars }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="w-1.5 h-1.5 text-amber-400 fill-amber-400"
                        />
                      ))}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Stage */}
        <div
          className={cn(
            'relative flex items-center justify-center w-full',
            'touch-none select-none [overscroll-behavior:contain]',
            isFullscreen ? 'flex-1 min-h-0' : ''
          )}
        >
          {children}

          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-4 text-center p-6"
            >
              <span className="text-4xl">⏸️</span>
              <p className="text-lg font-black text-white">
                {isRtl ? 'اللعبة متوقفة' : 'Game Paused'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={togglePause}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue border border-cyan-400/40 text-white text-sm font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isRtl ? 'استكمال' : 'Resume'}</span>
                </button>

                {onRestart && (
                  <button
                    type="button"
                    onClick={() => {
                      resume()
                      onRestart()
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isRtl ? 'من الأول' : 'Restart'}</span>
                  </button>
                )}
              </div>

              {onExit && (
                <button
                  type="button"
                  onClick={handleExit}
                  className="text-xs font-black text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isRtl ? 'الخروج من اللعبة' : 'Leave game'}
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Touch controls */}
        {controls && <div className="flex justify-center shrink-0">{controls}</div>}
      </div>
    </GameShellContext.Provider>
  )
}
