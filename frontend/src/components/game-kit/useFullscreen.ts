/**
 * useFullscreen.ts
 *
 * Immersive play mode for game stages.
 *
 * iOS Safari refuses `requestFullscreen()` on anything but a <video>, so a
 * native-only implementation would leave every iPhone player without the
 * feature. Instead we always drive a CSS overlay (works everywhere) and
 * additionally request native fullscreen when the browser supports it, which
 * also hides the browser chrome on Android and desktop.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { StageOrientation } from './types'

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'portrait' | 'landscape') => Promise<void>
}

function getFullscreenElement(): Element | null {
  const doc = document as FullscreenCapableDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

export interface UseFullscreenResult {
  /** Attach to the element that should fill the screen. */
  stageRef: React.RefObject<HTMLDivElement | null>
  /** True while the immersive overlay is active. */
  isFullscreen: boolean
  enter: () => void
  exit: () => void
  toggle: () => void
}

export function useFullscreen(orientation: StageOrientation = 'any'): UseFullscreenResult {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enter = useCallback(() => {
    setIsFullscreen(true)

    const node = stageRef.current as FullscreenCapableElement | null
    if (!node) return

    // Native fullscreen is a bonus, not a requirement: the CSS overlay already
    // covers the viewport, so a rejected promise is fine to swallow.
    const request = node.requestFullscreen?.bind(node) ?? node.webkitRequestFullscreen?.bind(node)
    if (request) {
      void Promise.resolve(request()).catch(() => undefined)
    }

    if (orientation !== 'any') {
      const screenOrientation = window.screen?.orientation as LockableOrientation | undefined
      void screenOrientation?.lock?.(orientation).catch(() => undefined)
    }
  }, [orientation])

  const exit = useCallback(() => {
    setIsFullscreen(false)

    if (getFullscreenElement()) {
      const doc = document as FullscreenCapableDocument
      const release = doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc)
      if (release) {
        void Promise.resolve(release()).catch(() => undefined)
      }
    }

    const screenOrientation = window.screen?.orientation as LockableOrientation | undefined
    screenOrientation?.unlock?.()
  }, [])

  const toggle = useCallback(() => {
    if (isFullscreen) exit()
    else enter()
  }, [isFullscreen, enter, exit])

  // Leaving native fullscreen (Esc, system gesture, Android back) must also
  // tear down the CSS overlay, otherwise the stage stays stuck over the page.
  useEffect(() => {
    const syncFromNative = () => {
      if (!getFullscreenElement()) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', syncFromNative)
    document.addEventListener('webkitfullscreenchange', syncFromNative)
    return () => {
      document.removeEventListener('fullscreenchange', syncFromNative)
      document.removeEventListener('webkitfullscreenchange', syncFromNative)
    }
  }, [])

  // Esc still has to work when only the CSS overlay is active (iOS, or when the
  // native request was rejected).
  useEffect(() => {
    if (!isFullscreen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !getFullscreenElement()) {
        exit()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFullscreen, exit])

  // Lock page scroll so touch drags inside the stage never pan the document.
  useEffect(() => {
    if (!isFullscreen) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isFullscreen])

  return { stageRef, isFullscreen, enter, exit, toggle }
}
