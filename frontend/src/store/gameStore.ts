/**
 * gameStore.ts
 *
 * Active game session state.
 *
 * Usage:
 *   import { useGameStore } from '@store/gameStore'
 */

import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// ── State Interface ───────────────────────────────────────────────────────────
interface GameState {
  // currentGame: Game | null
  // gameStatus: GameStatus
  // score: number
}

// ── Actions Interface ─────────────────────────────────────────────────────────
interface GameActions {
  // setCurrentGame: (game: Game) => void
  // updateScore: (points: number) => void
  // resetGame: () => void
}

type GameStore = GameState & GameActions

// ── Store ─────────────────────────────────────────────────────────────────────
export const useGameStore = create<GameStore>()((_set) => ({
  // TODO: Implement initial state and actions
}))
