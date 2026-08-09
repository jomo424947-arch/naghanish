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
export declare const QUERY_KEYS: {
    readonly auth: {
        readonly me: () => readonly ["auth", "me"];
    };
    readonly users: {
        readonly all: () => readonly ["users"];
        readonly detail: (id: string) => readonly ["users", string];
    };
    readonly games: {
        readonly all: () => readonly ["games"];
        readonly detail: (id: string) => readonly ["games", string];
        readonly byCategory: (category: string) => readonly ["games", "category", string];
    };
    readonly quizzes: {
        readonly all: () => readonly ["quizzes"];
        readonly detail: (id: string) => readonly ["quizzes", string];
    };
    readonly leaderboard: {
        readonly global: () => readonly ["leaderboard", "global"];
        readonly game: (gameId: string) => readonly ["leaderboard", "game", string];
        readonly friends: () => readonly ["leaderboard", "friends"];
    };
    readonly achievements: {
        readonly all: () => readonly ["achievements"];
        readonly user: (userId: string) => readonly ["achievements", "user", string];
    };
    readonly friends: {
        readonly all: () => readonly ["friends"];
        readonly requests: () => readonly ["friends", "requests"];
    };
    readonly notifications: {
        readonly all: () => readonly ["notifications"];
    };
    readonly profile: {
        readonly detail: (userId: string) => readonly ["profile", string];
    };
    readonly search: {
        readonly results: (query: string) => readonly ["search", string];
    };
    readonly ai: {
        readonly recommendations: () => readonly ["ai", "recommendations"];
    };
};
