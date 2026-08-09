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
import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
