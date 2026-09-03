/**
 * partyStore.ts
 *
 * Party room and multiplayer session state.
 *
 * Usage:
 *   import { usePartyStore } from '@store/partyStore'
 */
interface PartyState {
}
interface PartyActions {
}
type PartyStore = PartyState & PartyActions;
export declare const usePartyStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PartyStore>>;
export {};
