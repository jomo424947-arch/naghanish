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
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
