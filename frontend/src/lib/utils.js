import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * cn — Tailwind class merge utility
 * Combines clsx (conditional classes) and tailwind-merge (conflict resolution)
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
