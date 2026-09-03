/**
 * gameStore.ts
 *
 * Active game session state.
 *
 * Usage:
 *   import { useGameStore } from '@store/gameStore'
 */
interface GameState {
}
interface GameActions {
}
type GameStore = GameState & GameActions;
export declare const useGameStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GameStore>>;
export {};
