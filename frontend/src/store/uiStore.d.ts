/**
 * uiStore.ts
 *
 * Global UI state: sidebar, modals, loading overlays.
 *
 * Usage:
 *   import { useUiStore } from '@store/uiStore'
 */
interface UiState {
}
interface UiActions {
}
type UiStore = UiState & UiActions;
export declare const useUiStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UiStore>>;
export {};
