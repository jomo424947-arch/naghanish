/**
 * uiStore.ts
 *
 * Global UI state: sidebar, modals, loading overlays.
 *
 * Usage:
 *   import { useUiStore } from '@store/uiStore'
 */

import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// ── State Interface ───────────────────────────────────────────────────────────
interface UiState {
  // isSidebarOpen: boolean
  // isGlobalLoading: boolean
  // activeModal: string | null
}

// ── Actions Interface ─────────────────────────────────────────────────────────
interface UiActions {
  // toggleSidebar: () => void
  // setGlobalLoading: (loading: boolean) => void
  // openModal: (id: string) => void
  // closeModal: () => void
}

type UiStore = UiState & UiActions

// ── Store ─────────────────────────────────────────────────────────────────────
export const useUiStore = create<UiStore>()((_set) => ({
  // TODO: Implement initial state and actions
}))
