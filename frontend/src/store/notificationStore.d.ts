/**
 * notificationStore.ts
 *
 * Notification bell and list state.
 *
 * Usage:
 *   import { useNotificationStore } from '@store/notificationStore'
 */
interface NotificationState {
}
interface NotificationActions {
}
type NotificationStore = NotificationState & NotificationActions;
export declare const useNotificationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NotificationStore>>;
export {};
