/**
 * cn.ts
 *
 * Merges Tailwind CSS class names using clsx + tailwind-merge.
 * This is the standard shadcn/ui utility function.
 *
 * Usage:
 *   import { cn } from '@utils/cn'
 *   <div className={cn('base-class', condition && 'conditional-class')} />
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
