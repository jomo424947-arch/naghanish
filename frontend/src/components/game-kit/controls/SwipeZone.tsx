/**
 * SwipeZone.tsx
 *
 * Wraps a play surface and reports swipes and taps. Centralises the gesture
 * handling that engines previously each reimplemented, including the
 * `touch-action`/`overscroll-behavior` guards that stop a downward swipe from
 * triggering pull-to-refresh in the middle of a game.
 */

import React, { useCallback, useRef } from 'react'
import { cn } from '@lib/utils'
import type { Direction } from './DPad'

export interface SwipeZoneProps {
  onSwipe?: (direction: Direction) => void
  onTap?: (point: { x: number; y: number }) => void
  /** Minimum travel in CSS pixels before a gesture counts as a swipe. */
  threshold?: number
  className?: string
  children?: React.ReactNode
}

export const SwipeZone: React.FC<SwipeZoneProps> = ({
  onSwipe,
  onTap,
  threshold = 24,
  className,
  children,
}) => {
  const startRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    startRef.current = { x: event.clientX, y: event.clientY }
  }, [])

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const start = startRef.current
      startRef.current = null
      if (!start) return

      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      if (Math.max(absX, absY) < threshold) {
        const bounds = event.currentTarget.getBoundingClientRect()
        onTap?.({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
        return
      }

      if (absX > absY) onSwipe?.(dx > 0 ? 'right' : 'left')
      else onSwipe?.(dy > 0 ? 'down' : 'up')
    },
    [onSwipe, onTap, threshold]
  )

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        startRef.current = null
      }}
      className={cn('touch-none select-none [overscroll-behavior:contain]', className)}
    >
      {children}
    </div>
  )
}
