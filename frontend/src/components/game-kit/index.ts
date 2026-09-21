/**
 * Public surface of the game kit. Engines and pages import from here rather
 * than reaching into individual files, so the internal layout can move without
 * breaking every consumer.
 */

export type {
  ControlScheme,
  GameDifficulty,
  GameEngineProps,
  GameFinishMeta,
  GameProgressState,
  LevelRecord,
  StageOrientation,
} from './types'

export { useFullscreen } from './useFullscreen'
export type { UseFullscreenResult } from './useFullscreen'

export { useGameLoop } from './useGameLoop'
export type { GameLoopOptions } from './useGameLoop'

export { useResponsiveStage } from './useResponsiveStage'
export type { ResponsiveStage, ResponsiveStageOptions } from './useResponsiveStage'

export { useGameProgress, getStarsForGames, hasPlayed } from './useGameProgress'
export type { UseGameProgressResult } from './useGameProgress'

export { GameShell, useGameShell } from './GameShell'
export type { GameShellProps } from './GameShell'

export { DPad, SwipeZone, ActionButton, ActionButtons } from './controls'
export type {
  Direction,
  DPadProps,
  SwipeZoneProps,
  ActionButtonProps,
  ActionButtonsProps,
} from './controls'
