/**
 * queryKeys.ts
 *
 * TanStack Query key factory.
 * All query keys must be defined here to ensure consistency,
 * avoid typos, and enable targeted cache invalidation.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all() })
 */

export const QUERY_KEYS = {
  // Auth
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // Users
  users: {
    all: () => ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },

  // Games
  games: {
    all: () => ['games'] as const,
    detail: (id: string) => ['games', id] as const,
    byCategory: (category: string) => ['games', 'category', category] as const,
  },

  // Quizzes
  quizzes: {
    all: () => ['quizzes'] as const,
    detail: (id: string) => ['quizzes', id] as const,
  },

  // Leaderboard
  leaderboard: {
    global: () => ['leaderboard', 'global'] as const,
    game: (gameId: string) => ['leaderboard', 'game', gameId] as const,
    friends: () => ['leaderboard', 'friends'] as const,
  },

  // Achievements
  achievements: {
    all: () => ['achievements'] as const,
    user: (userId: string) => ['achievements', 'user', userId] as const,
  },

  // Friends
  friends: {
    all: () => ['friends'] as const,
    requests: () => ['friends', 'requests'] as const,
  },

  // Notifications
  notifications: {
    all: () => ['notifications'] as const,
  },

  // Profile
  profile: {
    detail: (userId: string) => ['profile', userId] as const,
  },

  // Search
  search: {
    results: (query: string) => ['search', query] as const,
  },

  // AI
  ai: {
    recommendations: () => ['ai', 'recommendations'] as const,
  },
} as const
