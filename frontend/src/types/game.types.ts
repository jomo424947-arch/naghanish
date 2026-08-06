/**
 * game.types.ts
 *
 * Game and quiz domain TypeScript types.
 */

import type { ID, ISODateString } from './common.types'

// TODO: Implement game types
export type GameStatus = 'idle' | 'loading' | 'active' | 'paused' | 'finished'
export type RoomStatus = 'waiting' | 'starting' | 'active' | 'finished'
export type GameCategory = 'brain' | 'personality' | 'trivia' | 'party'

export interface Game {
  id: ID
  title: string
  description: string
  category: GameCategory
  thumbnail: string | null
  minPlayers: number
  maxPlayers: number
  durationMinutes: number
  createdAt: ISODateString
}

export interface Room {
  id: ID
  code: string
  hostId: ID
  gameId: ID
  status: RoomStatus
  maxParticipants: number
  createdAt: ISODateString
}

export interface Participant {
  id: ID
  userId: ID
  username: string
  avatarUrl: string | null
  isReady: boolean
  score: number
}
