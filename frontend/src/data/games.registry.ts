/**
 * games.registry.ts
 *
 * Lazy map from catalog game id → engine component.
 *
 * Every engine is reached through `lazy()` so opening one game never downloads
 * the other thirty. Do not static-import engines into pages; add them here.
 */

import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { GameEngineProps } from '@components/game-kit'

export type LazyGameEngine = LazyExoticComponent<ComponentType<GameEngineProps>>

/**
 * Wrap a named engine export as a default for React.lazy.
 * Engines keep named exports; only the registry cares about the default.
 */
function loadEngine(
  loader: () => Promise<Record<string, ComponentType<GameEngineProps>>>,
  exportName: string
): LazyGameEngine {
  return lazy(async () => {
    const module = await loader()
    // Engines use compatible props; cast keeps the registry typed without
    // forcing every legacy engine file to import GameEngineProps yet.
    const Component = module[exportName] as ComponentType<GameEngineProps> | undefined
    if (!Component) {
      throw new Error(`Game engine export "${exportName}" was not found`)
    }
    return { default: Component }
  })
}

export const GAME_ENGINES: Record<string, LazyGameEngine> = {
  // ── Arcade ──────────────────────────────────────────────────────────────
  'g-hextris': loadEngine(() => import('@components/games/HextrisGame'), 'HextrisGame'),
  'g-invaders': loadEngine(() => import('@components/games/NeonInvadersGame'), 'NeonInvadersGame'),
  'g-snake': loadEngine(() => import('@components/games/SnakeGame'), 'SnakeGame'),
  'g-brick': loadEngine(() => import('@components/games/BrickBreakerGame'), 'BrickBreakerGame'),
  'g-flappy': loadEngine(() => import('@components/games/FlappyHeroGame'), 'FlappyHeroGame'),
  'g-colorblocks': loadEngine(() => import('@components/games/ColorBlocksGame'), 'ColorBlocksGame'),
  'g-ballrun': loadEngine(() => import('@components/games/BallRun3DGame'), 'BallRun3DGame'),

  // ── Reflex ──────────────────────────────────────────────────────────────
  'g-rhythm': loadEngine(() => import('@components/games/RhythmRushGame'), 'RhythmRushGame'),
  'g-dodge': loadEngine(() => import('@components/games/DodgeRunnerGame'), 'DodgeRunnerGame'),
  'g-aim': loadEngine(() => import('@components/games/AimTrainerGame'), 'AimTrainerGame'),
  'g-reverse': loadEngine(() => import('@components/games/ReverseControlsGame'), 'ReverseControlsGame'),
  'g-second': loadEngine(() => import('@components/games/PerfectSecondGame'), 'PerfectSecondGame'),
  'g-simon': loadEngine(() => import('@components/games/SimonPatternGame'), 'SimonPatternGame'),
  'g-tunnel': loadEngine(() => import('@components/games/TunnelRush3DGame'), 'TunnelRush3DGame'),

  // ── IQ Lab ──────────────────────────────────────────────────────────────
  'g-2048': loadEngine(() => import('@components/games/Game2048'), 'Game2048'),
  'g-sokoban': loadEngine(() => import('@components/games/SokobanGame'), 'SokobanGame'),
  'g-laser': loadEngine(() => import('@components/games/LaserMirrorsGame'), 'LaserMirrorsGame'),
  'g-mines': loadEngine(() => import('@components/games/MinesweeperGame'), 'MinesweeperGame'),
  'g-sudoku': loadEngine(() => import('@components/games/SudokuGame'), 'SudokuGame'),
  'g-scramble': loadEngine(() => import('@components/games/WordScrambleGame'), 'WordScrambleGame'),
  'g-flow': loadEngine(() => import('@components/games/FlowConnectGame'), 'FlowConnectGame'),

  // ── Shilla ──────────────────────────────────────────────────────────────
  'g-draw': loadEngine(() => import('@components/games/DrawAndGuessGame'), 'DrawAndGuessGame'),
  'g-trivia': loadEngine(() => import('@components/games/CrewTriviaGame'), 'CrewTriviaGame'),
  'g-wyr': loadEngine(() => import('@components/games/WouldYouRatherGame'), 'WouldYouRatherGame'),
  'g-impostor': loadEngine(() => import('@components/games/ImpostorGame'), 'ImpostorGame'),

  // ── Champions ───────────────────────────────────────────────────────────
  'g-stack': loadEngine(() => import('@components/games/StackTowerGame'), 'StackTowerGame'),
  'g-math': loadEngine(() => import('@components/games/SpeedMathGame'), 'SpeedMathGame'),
  'g-pong': loadEngine(() => import('@components/games/PongGame'), 'PongGame'),

  // ── Chaos ───────────────────────────────────────────────────────────────
  'g-micro': loadEngine(() => import('@components/games/MicroGamesEngine'), 'MicroGamesEngine'),
  'g-roulette': loadEngine(() => import('@components/games/ChaosRouletteGame'), 'ChaosRouletteGame'),
  'g-gravity': loadEngine(() => import('@components/games/GravityRunnerGame'), 'GravityRunnerGame'),
  'g-dontpress': loadEngine(() => import('@components/games/DontPressButtonGame'), 'DontPressButtonGame'),
  'g-pixelrun': loadEngine(() => import('@components/games/PixelRunnerGame'), 'PixelRunnerGame'),
  'g-whack': loadEngine(() => import('@components/games/WhackGlitchGame'), 'WhackGlitchGame'),
}

/** Resolve a catalog id to its lazy engine, or null if the game is not playable. */
export function getGameEngine(gameId: string): LazyGameEngine | null {
  return GAME_ENGINES[gameId] ?? null
}
