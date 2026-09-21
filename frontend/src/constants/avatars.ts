/**
 * avatars.ts
 *
 * Selectable player avatars. Kept out of the picker component so Fast Refresh
 * stays intact and other pages can read the list without pulling in UI.
 */

export interface AvatarOption {
  id: string
  name: string
  icon?: string
  isMascot?: boolean
  color: string
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'mascot-gamer', name: 'Naghanish Gamer', isMascot: true, color: 'from-orange-500 to-amber-600' },
  { id: 'mascot-1', name: 'Brainy Mascot', icon: '🧠', color: 'from-purple-500 to-indigo-600' },
  { id: 'mascot-2', name: 'Party Bot', icon: '🤖', color: 'from-cyan-400 to-blue-600' },
  { id: 'mascot-3', name: 'Speed Champion', icon: '⚡', color: 'from-orange-400 to-amber-500' },
  { id: 'mascot-4', name: 'Star Winner', icon: '🏆', color: 'from-yellow-400 to-amber-600' },
  { id: 'mascot-5', name: 'Magic Quiz', icon: '🪄', color: 'from-pink-500 to-rose-600' },
  { id: 'mascot-6', name: 'Arcade Master', icon: '🕹️', color: 'from-emerald-400 to-teal-600' },
]
