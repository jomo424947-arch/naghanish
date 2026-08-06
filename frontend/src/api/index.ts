/**
 * index.ts — API barrel export
 *
 * Re-exports all typed API endpoint modules.
 * Import from '@api' to access any endpoint function.
 */

export { httpClient } from './httpClient'

// TODO: Export endpoint modules as they are created:
// export * from './endpoints/auth.api'
// export * from './endpoints/users.api'
// export * from './endpoints/games.api'
// export * from './endpoints/quizzes.api'
// export * from './endpoints/party.api'
// export * from './endpoints/leaderboard.api'
// export * from './endpoints/achievements.api'
// export * from './endpoints/missions.api'
// export * from './endpoints/friends.api'
// export * from './endpoints/notifications.api'
// export * from './endpoints/search.api'
// export * from './endpoints/profile.api'
// export * from './endpoints/settings.api'
// export * from './endpoints/community.api'
// export * from './endpoints/ai.api'
