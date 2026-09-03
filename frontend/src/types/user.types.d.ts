/**
 * user.types.ts
 *
 * User domain TypeScript types.
 */
import type { ID, ISODateString } from './common.types';
export interface User {
    id: ID;
    username: string;
    email: string;
    avatarUrl: string | null;
    xp: number;
    coins: number;
    level: number;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}
export type UserRole = 'user' | 'moderator' | 'admin';
