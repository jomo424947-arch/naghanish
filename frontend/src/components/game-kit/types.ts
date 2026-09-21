/**
 * types.ts
 *
 * Shared contracts for the game kit. Every playable engine in the app receives
 * `GameEngineProps`, so `GameShell` and the lazy registry can host any game
 * without knowing anything about its internals.
 */

export type GameDifficulty = 'Easy' | 'Medium' | 'Hard'

/** Games designed around a wide play area ask for landscape on mobile. */
export type StageOrientation = 'portrait' | 'landscape' | 'any'

/** Which on-screen control cluster `GameShell` should offer on touch devices. */
export type ControlScheme = 'none' | 'dpad' | 'horizontal' | 'tap' | 'swipe'

export interface GameFinishMeta {
  /** Highest level index the player reached, 1-based. */
  levelReached?: number
  /** Stars awarded for the final level, 0-3. */
  stars?: number
  /** Set when the player completed every level of the game. */
  clearedAll?: boolean
}

/**
 * The single prop contract for playable engines.
 *
 * Legacy engines only implement `onFinish`/`isRtl`/`difficulty`; the level
 * fields are additive so existing games keep working untouched.
 */
export interface GameEngineProps {
  onFinish: (score: number, meta?: GameFinishMeta) => void
  isRtl?: boolean
  difficulty?: GameDifficulty
  /** 1-based level the player selected, for games that expose levels. */
  level?: number
  /** Report a cleared level so progress can unlock the next one mid-session. */
  onLevelComplete?: (level: number, stars: number) => void
}

/** Per-level record persisted by `useGameProgress`. */
export interface LevelRecord {
  stars: number
  bestScore: number
}

export interface GameProgressState {
  /** Highest unlocked level, 1-based. Level 1 is always unlocked. */
  unlockedLevel: number
  bestScore: number
  levels: Record<number, LevelRecord>
  totalStars: number
}
