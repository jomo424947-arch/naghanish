/**
 * partyStore.ts
 *
 * Party room and multiplayer session state.
 *
 * Usage:
 *   import { usePartyStore } from '@store/partyStore'
 */

import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// ── State Interface ───────────────────────────────────────────────────────────
interface PartyState {
  // room: Room | null
  // participants: Participant[]
  // roomStatus: RoomStatus
}

// ── Actions Interface ─────────────────────────────────────────────────────────
interface PartyActions {
  // setRoom: (room: Room) => void
  // addParticipant: (p: Participant) => void
  // leaveRoom: () => void
}

type PartyStore = PartyState & PartyActions

// ── Store ─────────────────────────────────────────────────────────────────────
export const usePartyStore = create<PartyStore>()((_set) => ({
  // TODO: Implement initial state and actions
}))
