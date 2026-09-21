/**
 * useGameProgress.ts
 *
 * Per-game level progression: which levels are unlocked, stars earned on each,
 * and best score. Persisted to localStorage under `naghanish_progress_<id>`,
 * matching the `naghanish_*` convention used by the sound manager.
 *
 * Backend sync is intentionally out of scope for now; the shape here maps
 * cleanly onto a future table if we add one.
 */

import { useCallback, useMemo, useState } from 'react'
import type { GameProgressState, LevelRecord } from './types'

const STORAGE_PREFIX = 'naghanish_progress_'

const EMPTY_PROGRESS: GameProgressState = {
  unlockedLevel: 1,
  bestScore: 0,
  levels: {},
  totalStars: 0,
}

function storageKey(gameId: string): string {
  return `${STORAGE_PREFIX}${gameId}`
}

function readProgress(gameId: string): GameProgressState {
  if (typeof window === 'undefined') return EMPTY_PROGRESS

  try {
    const raw = window.localStorage.getItem(storageKey(gameId))
    if (!raw) return EMPTY_PROGRESS

    const parsed = JSON.parse(raw) as Partial<GameProgressState>
    const levels = parsed.levels ?? {}
    return {
      unlockedLevel: Math.max(1, parsed.unlockedLevel ?? 1),
      bestScore: parsed.bestScore ?? 0,
      levels,
      totalStars: Object.values(levels).reduce((sum, record) => sum + (record?.stars ?? 0), 0),
    }
  } catch {
    // Corrupted or unavailable storage (private mode, quota) must not break play.
    return EMPTY_PROGRESS
  }
}

function writeProgress(gameId: string, state: GameProgressState): void {
  try {
    window.localStorage.setItem(storageKey(gameId), JSON.stringify(state))
  } catch {
    // Progress is a convenience, never a blocker.
  }
}

/** Total stars across a set of games, for world-level unlock thresholds. */
export function getStarsForGames(gameIds: string[]): number {
  return gameIds.reduce((sum, id) => sum + readProgress(id).totalStars, 0)
}

/** True when the player has cleared at least one level of the game. */
export function hasPlayed(gameId: string): boolean {
  return readProgress(gameId).unlockedLevel > 1
}

export interface UseGameProgressResult extends GameProgressState {
  levelCount: number
  /** Whether a 1-based level is playable yet. */
  isLevelUnlocked: (level: number) => boolean
  /** Stars earned on a 1-based level, 0 if never cleared. */
  starsForLevel: (level: number) => number
  /** Records a cleared level, unlocking the next one. Returns the new state. */
  completeLevel: (level: number, stars: number, score: number) => void
  /** Records a score for games without discrete levels. */
  recordScore: (score: number) => void
  reset: () => void
}

export function useGameProgress(gameId: string, levelCount = 1): UseGameProgressResult {
  const [state, setState] = useState<GameProgressState>(() => readProgress(gameId))

  const persist = useCallback(
    (next: GameProgressState) => {
      setState(next)
      writeProgress(gameId, next)
    },
    [gameId]
  )

  const completeLevel = useCallback(
    (level: number, stars: number, score: number) => {
      setState((current) => {
        const clampedStars = Math.max(0, Math.min(3, Math.round(stars)))
        const previous: LevelRecord = current.levels[level] ?? { stars: 0, bestScore: 0 }

        // Only ever improve a record, so replaying a level cannot lose stars.
        const levels: Record<number, LevelRecord> = {
          ...current.levels,
          [level]: {
            stars: Math.max(previous.stars, clampedStars),
            bestScore: Math.max(previous.bestScore, score),
          },
        }

        const next: GameProgressState = {
          unlockedLevel: Math.min(levelCount, Math.max(current.unlockedLevel, level + 1)),
          bestScore: Math.max(current.bestScore, score),
          levels,
          totalStars: Object.values(levels).reduce((sum, record) => sum + record.stars, 0),
        }

        writeProgress(gameId, next)
        return next
      })
    },
    [gameId, levelCount]
  )

  const recordScore = useCallback(
    (score: number) => {
      setState((current) => {
        if (score <= current.bestScore) return current

        const next: GameProgressState = { ...current, bestScore: score }
        writeProgress(gameId, next)
        return next
      })
    },
    [gameId]
  )

  const reset = useCallback(() => persist(EMPTY_PROGRESS), [persist])

  const isLevelUnlocked = useCallback(
    (level: number) => level <= 1 || level <= state.unlockedLevel,
    [state.unlockedLevel]
  )

  const starsForLevel = useCallback(
    (level: number) => state.levels[level]?.stars ?? 0,
    [state.levels]
  )

  return useMemo(
    () => ({
      ...state,
      levelCount,
      isLevelUnlocked,
      starsForLevel,
      completeLevel,
      recordScore,
      reset,
    }),
    [state, levelCount, isLevelUnlocked, starsForLevel, completeLevel, recordScore, reset]
  )
}
