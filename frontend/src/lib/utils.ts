import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — Tailwind class merge utility
 * Combines clsx (conditional classes) and tailwind-merge (conflict resolution)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
