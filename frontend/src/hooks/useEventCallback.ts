/**
 * useEventCallback.ts
 *
 * Returns a callback with a stable identity that always invokes the latest
 * version of `fn`. Use it for handlers referenced inside long-lived effects
 * (game loops, intervals, event listeners) so the effect never re-subscribes
 * yet never captures a stale closure.
 */

import { useCallback, useLayoutEffect, useRef } from 'react'

export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const ref = useRef(fn)

  useLayoutEffect(() => {
    ref.current = fn
  })

  return useCallback((...args: Args) => ref.current(...args), [])
}
