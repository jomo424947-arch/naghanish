/**
 * useResponsiveStage.ts
 *
 * Measures the play area and derives a stage that fits it while keeping the
 * game's aspect ratio. Engines built on this scale from a narrow phone up to a
 * fullscreen desktop stage instead of being locked to constants like
 * `GRID_SIZE * CELL_SIZE`.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export interface ResponsiveStageOptions {
  /** Width / height the game is designed around. Defaults to square. */
  aspectRatio?: number
  /** Never render smaller than this, in CSS pixels. */
  minWidth?: number
  /** Never render larger than this, in CSS pixels. */
  maxWidth?: number
  /**
   * Upper bound on `devicePixelRatio`. Retina phones report 3, which triples
   * the fragment work for no visible gain on a neon-styled canvas.
   */
  maxPixelRatio?: number
}

export interface ResponsiveStage {
  /** Attach to the element that bounds the play area. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Stage size in CSS pixels — use for layout and pointer maths. */
  width: number
  height: number
  /** Effective device pixel ratio, already clamped. */
  pixelRatio: number
  /** Multiplier from design units to CSS pixels. */
  scale: number
  /**
   * Sizes a canvas for crisp rendering and scales its context so drawing code
   * can keep working in CSS pixels. Call at the top of each render pass.
   */
  prepareCanvas: (canvas: HTMLCanvasElement | null) => CanvasRenderingContext2D | null
}

export function useResponsiveStage({
  aspectRatio = 1,
  minWidth = 240,
  maxWidth = 720,
  maxPixelRatio = 2,
}: ResponsiveStageOptions = {}): ResponsiveStage {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: minWidth, height: minWidth / aspectRatio })
  const [pixelRatio, setPixelRatio] = useState(1)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const measure = () => {
      const bounds = node.getBoundingClientRect()
      if (bounds.width === 0 || bounds.height === 0) return

      // Fit inside the container on whichever axis is tighter.
      const widthFromHeight = bounds.height * aspectRatio
      const width = Math.round(
        Math.max(minWidth, Math.min(maxWidth, bounds.width, widthFromHeight))
      )

      setSize({ width, height: Math.round(width / aspectRatio) })
      setPixelRatio(Math.min(maxPixelRatio, window.devicePixelRatio || 1))
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    // Rotating a phone can change devicePixelRatio without resizing the node.
    window.addEventListener('orientationchange', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', measure)
    }
  }, [aspectRatio, minWidth, maxWidth, maxPixelRatio])

  const prepareCanvas = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return null

      const targetWidth = Math.round(size.width * pixelRatio)
      const targetHeight = Math.round(size.height * pixelRatio)

      // Assigning width/height clears the canvas, so only do it on real change.
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth
        canvas.height = targetHeight
        canvas.style.width = `${size.width}px`
        canvas.style.height = `${size.height}px`
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      return ctx
    },
    [size.width, size.height, pixelRatio]
  )

  return {
    containerRef,
    width: size.width,
    height: size.height,
    pixelRatio,
    scale: size.width / (maxWidth || 1),
    prepareCanvas,
  }
}
