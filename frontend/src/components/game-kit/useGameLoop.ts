/**
 * useGameLoop.ts
 *
 * Fixed-timestep game loop on `requestAnimationFrame`.
 *
 * Replaces the `setInterval` pattern used by the older engines, which tied game
 * speed to the device and kept simulating while the tab was hidden. The
 * callback receives seconds elapsed, so movement can be expressed per second
 * and stays identical on a 60Hz phone and a 144Hz monitor.
 */

import { useEffect, useRef } from 'react'
import { useEventCallback } from '@hooks/useEventCallback'

export interface GameLoopOptions {
  /** Pause the simulation without unmounting. */
  running?: boolean
  /**
   * Simulation rate in Hz. The callback is invoked a whole number of times per
   * frame at this rate, independent of display refresh rate.
   */
  hz?: number
  /** Pause automatically when the tab is hidden or the window loses focus. */
  pauseOnBlur?: boolean
}

/**
 * @param step Advances the simulation by `delta` seconds.
 */
export function useGameLoop(
  step: (delta: number) => void,
  { running = true, hz = 60, pauseOnBlur = true }: GameLoopOptions = {}
): void {
  const stableStep = useEventCallback(step)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const accumulatorRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return

    // Treat a hidden tab as paused so returning to the game does not replay a
    // huge backlog of simulation steps.
    let isBlurred = false

    const fixedDelta = 1 / hz
    // Cap the catch-up work for one frame so a stall cannot freeze the page.
    const maxAccumulated = fixedDelta * 5

    const tick = (time: number) => {
      frameRef.current = requestAnimationFrame(tick)

      if (isBlurred) {
        lastTimeRef.current = time
        return
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time
        return
      }

      const elapsed = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time
      accumulatorRef.current = Math.min(accumulatorRef.current + elapsed, maxAccumulated)

      while (accumulatorRef.current >= fixedDelta) {
        accumulatorRef.current -= fixedDelta
        stableStep(fixedDelta)
      }
    }

    const handleVisibility = () => {
      isBlurred = document.hidden
      if (!document.hidden) {
        lastTimeRef.current = 0
        accumulatorRef.current = 0
      }
    }

    const handleBlur = () => {
      isBlurred = true
    }

    const handleFocus = () => {
      isBlurred = false
      lastTimeRef.current = 0
      accumulatorRef.current = 0
    }

    if (pauseOnBlur) {
      document.addEventListener('visibilitychange', handleVisibility)
      window.addEventListener('blur', handleBlur)
      window.addEventListener('focus', handleFocus)
    }

    lastTimeRef.current = 0
    accumulatorRef.current = 0
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      if (pauseOnBlur) {
        document.removeEventListener('visibilitychange', handleVisibility)
        window.removeEventListener('blur', handleBlur)
        window.removeEventListener('focus', handleFocus)
      }
    }
  }, [running, hz, pauseOnBlur, stableStep])
}
