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
        me: () => ['auth', 'me'],
    },
    // Users
    users: {
        all: () => ['users'],
        detail: (id) => ['users', id],
    },
    // Games
    games: {
        all: () => ['games'],
        detail: (id) => ['games', id],
        byCategory: (category) => ['games', 'category', category],
    },
    // Quizzes
    quizzes: {
        all: () => ['quizzes'],
        detail: (id) => ['quizzes', id],
    },
    // Leaderboard
    leaderboard: {
        global: () => ['leaderboard', 'global'],
        game: (gameId) => ['leaderboard', 'game', gameId],
        friends: () => ['leaderboard', 'friends'],
    },
    // Achievements
    achievements: {
        all: () => ['achievements'],
        user: (userId) => ['achievements', 'user', userId],
    },
    // Friends
    friends: {
        all: () => ['friends'],
        requests: () => ['friends', 'requests'],
    },
    // Notifications
    notifications: {
        all: () => ['notifications'],
    },
    // Profile
    profile: {
        detail: (userId) => ['profile', userId],
    },
    // Search
    search: {
        results: (query) => ['search', query],
    },
    // AI
    ai: {
        recommendations: () => ['ai', 'recommendations'],
    },
};
