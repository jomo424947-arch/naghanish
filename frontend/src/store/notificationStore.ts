/**
 * notificationStore.ts
 *
 * Notification bell and list state.
 *
 * Usage:
 *   import { useNotificationStore } from '@store/notificationStore'
 */

import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// ── State Interface ───────────────────────────────────────────────────────────
interface NotificationState {
  // notifications: Notification[]
  // unreadCount: number
}

// ── Actions Interface ─────────────────────────────────────────────────────────
interface NotificationActions {
  // addNotification: (n: Notification) => void
  // markAllRead: () => void
  // clearAll: () => void
}

type NotificationStore = NotificationState & NotificationActions

// ── Store ─────────────────────────────────────────────────────────────────────
export const useNotificationStore = create<NotificationStore>()((_set) => ({
  // TODO: Implement initial state and actions
}))
