/**
 * DPad.tsx
 *
 * Shared directional pad for touch play. Uses pointer events so a held
 * direction repeats, and `touch-action: none` so dragging across the pad never
 * scrolls the page mid-game.
 */

import React, { useCallback, useEffect, useRef } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { cn } from '@lib/utils'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface DPadProps {
  onDirection: (direction: Direction) => void
  /** Omit the vertical buttons for games that only move sideways. */
  axis?: 'both' | 'horizontal'
  /** Repeat the direction while held, in ms. Omit for single-fire per press. */
  repeatMs?: number
  accentClass?: string
  className?: string
}

const BUTTON_BASE =
  'w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ' +
  'shadow-md cursor-pointer touch-none select-none transition-transform active:scale-90 ' +
  'hover:bg-white/10'

export const DPad: React.FC<DPadProps> = ({
  onDirection,
  axis = 'both',
  repeatMs,
  accentClass = 'text-cyan-300',
  className,
}) => {
  const repeatRef = useRef<number | null>(null)

  const stopRepeat = useCallback(() => {
    if (repeatRef.current !== null) {
      window.clearInterval(repeatRef.current)
      repeatRef.current = null
    }
  }, [])

  const press = useCallback(
    (direction: Direction) => (event: React.PointerEvent) => {
      // Keeps the browser from synthesising a delayed click or starting a drag.
      event.preventDefault()
      onDirection(direction)

      if (repeatMs) {
        stopRepeat()
        repeatRef.current = window.setInterval(() => onDirection(direction), repeatMs)
      }
    },
    [onDirection, repeatMs, stopRepeat]
  )

  useEffect(() => stopRepeat, [stopRepeat])

  const button = (direction: Direction, icon: React.ReactNode) => (
    <button
      type="button"
      aria-label={direction}
      onPointerDown={press(direction)}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onPointerCancel={stopRepeat}
      className={cn(BUTTON_BASE, accentClass)}
    >
      {icon}
    </button>
  )

  if (axis === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-6', className)}>
        {button('left', <ArrowLeft className="w-6 h-6" />)}
        {button('right', <ArrowRight className="w-6 h-6" />)}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      {button('up', <ArrowUp className="w-6 h-6" />)}
      <div className="flex items-center gap-8">
        {button('left', <ArrowLeft className="w-6 h-6" />)}
        {button('right', <ArrowRight className="w-6 h-6" />)}
      </div>
      {button('down', <ArrowDown className="w-6 h-6" />)}
    </div>
  )
}
