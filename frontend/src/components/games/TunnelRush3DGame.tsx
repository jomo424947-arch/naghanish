/**
 * TunnelRush3DGame.tsx
 *
 * First-person neon tunnel: rotate to dodge barrier wedges. three.js is loaded
 * dynamically so the rest of the catalog stays light.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameShell, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type ThreeModule = typeof import('three')

function speedFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 18 : difficulty === 'Hard' ? 32 : 24
  return base + (level - 1) * 2.5
}

function distanceTarget(level: number): number {
  return 40 + level * 15
}

export const TunnelRush3DGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [distance, setDistance] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  const target = distanceTarget(level)
  const stateRef = useRef({
    hasStarted: false,
    isPaused: false,
    isOver: false,
    isCleared: false,
    angle: 0,
    distance: 0,
    finished: false,
  })
  stateRef.current.isPaused = isPaused

  const endRun = useCallback(
    (won: boolean, dist: number) => {
      if (stateRef.current.finished) return
      stateRef.current.finished = true
      stateRef.current.isOver = !won
      stateRef.current.isCleared = won
      setIsOver(!won)
      setIsCleared(won)
      const score = Math.round(dist * 20)
      const stars = won ? (dist >= target * 1.2 ? 3 : dist >= target ? 2 : 1) : 0
      if (won) {
        onLevelComplete?.(level, Math.max(1, stars))
        sound.playWin()
      } else sound.playGameOver()
      onFinish(score, { levelReached: level, stars })
    },
    [level, onFinish, onLevelComplete, target]
  )

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let raf = 0
    let renderer: InstanceType<ThreeModule['WebGLRenderer']> | null = null
    let resizeObserver: ResizeObserver | null = null
    const keys = { left: false, right: false }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    ;(async () => {
      let THREE: ThreeModule
      try {
        THREE = await import('three')
      } catch {
        if (!disposed) setLoadError(isRtl ? 'تعذر تحميل محرك 3D' : 'Failed to load 3D engine')
        return
      }
      if (disposed) return

      const w = mount.clientWidth || 320
      const h = mount.clientHeight || 420
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x050711, 0.045)
      scene.background = new THREE.Color(0x050711)

      const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 200)
      camera.position.set(0, 0, 0)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
      renderer.setSize(w, h)
      mount.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0x6688ff, 0.5))
      const light = new THREE.PointLight(0x22d3ee, 1.4, 80)
      light.position.set(0, 0, 2)
      scene.add(light)

      const tunnelGroup = new THREE.Group()
      scene.add(tunnelGroup)

      const ringCount = 40
      const rings: Array<{
        mesh: InstanceType<ThreeModule['Mesh']>
        z: number
        isBarrier: boolean
        openAngle: number
      }> = []

      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0369a1,
        emissiveIntensity: 0.35,
        wireframe: true,
      })
      const barrierMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xbe123c,
        emissiveIntensity: 0.7,
        side: THREE.DoubleSide,
      })

      for (let i = 0; i < ringCount; i++) {
        const z = -i * 4
        const isBarrier = i > 4 && i % 3 === 0
        if (isBarrier) {
          const geo = new THREE.RingGeometry(1.6, 2.35, 32, 1, 0, Math.PI * 1.45)
          const mesh = new THREE.Mesh(geo, barrierMat)
          mesh.position.z = z
          const openAngle = Math.random() * Math.PI * 2
          mesh.rotation.z = openAngle
          tunnelGroup.add(mesh)
          rings.push({ mesh, z, isBarrier: true, openAngle })
        } else {
          const geo = new THREE.TorusGeometry(2.1, 0.04, 8, 48)
          const mesh = new THREE.Mesh(geo, tubeMat)
          mesh.position.z = z
          tunnelGroup.add(mesh)
          rings.push({ mesh, z, isBarrier: false, openAngle: 0 })
        }
      }

      let last = performance.now()
      const forward = speedFor(level, difficulty)

      const onPointer = (e: PointerEvent) => {
        if (!stateRef.current.hasStarted) return
        const bounds = mount.getBoundingClientRect()
        const x = (e.clientX - bounds.left) / bounds.width
        stateRef.current.angle = (x - 0.5) * Math.PI * 1.6
      }
      mount.addEventListener('pointermove', onPointer)
      mount.addEventListener('pointerdown', onPointer)

      const shipAngle = () => stateRef.current.angle

      const tick = (now: number) => {
        if (disposed) return
        raf = requestAnimationFrame(tick)
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now

        if (
          !stateRef.current.hasStarted ||
          stateRef.current.isPaused ||
          stateRef.current.isOver ||
          stateRef.current.isCleared
        ) {
          renderer?.render(scene, camera)
          return
        }

        if (keys.left) stateRef.current.angle -= 2.8 * dt
        if (keys.right) stateRef.current.angle += 2.8 * dt

        tunnelGroup.rotation.z = -shipAngle()

        for (const ring of rings) {
          ring.z += forward * dt
          ring.mesh.position.z = ring.z

          if (ring.z > 2) {
            const minZ = Math.min(...rings.map((r) => r.z))
            ring.z = minZ - 4
            ring.mesh.position.z = ring.z
            if (ring.isBarrier) {
              ring.openAngle = Math.random() * Math.PI * 2
              ring.mesh.rotation.z = ring.openAngle
            }
          }

          // Collision when barrier crosses the ship plane
          if (ring.isBarrier && ring.z > -0.6 && ring.z < 0.6) {
            // Ring opening spans ~1.45π starting at openAngle in mesh local space.
            // Ship is fixed at world angle 0 relative to tunnelGroup rotation.
            // Effective ship angle in barrier local frame:
            const local = ((shipAngle() - ring.openAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
            const opening = Math.PI * 1.45
            // Solid part is outside [0, opening] in the ring's theta — actually RingGeometry
            // draws from thetaStart=0 length=opening, so the GAP is the missing 0.55π.
            const gapStart = opening
            const gapEnd = Math.PI * 2
            const inGap = local >= gapStart && local <= gapEnd
            if (!inGap) {
              endRun(false, stateRef.current.distance)
            }
          }
        }

        stateRef.current.distance += forward * dt
        if (Math.random() < 0.08) setDistance(Math.floor(stateRef.current.distance))

        if (stateRef.current.distance >= target) {
          endRun(true, stateRef.current.distance)
        }

        light.position.z = 1 + Math.sin(now * 0.004) * 0.3
        renderer?.render(scene, camera)
      }

      raf = requestAnimationFrame(tick)

      resizeObserver = new ResizeObserver(() => {
        if (!renderer) return
        const nw = mount.clientWidth || 320
        const nh = mount.clientHeight || 420
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      })
      resizeObserver.observe(mount)

      ;(mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = () => {
        mount.removeEventListener('pointermove', onPointer)
        mount.removeEventListener('pointerdown', onPointer)
        rings.forEach((r) => {
          tunnelGroup.remove(r.mesh)
          r.mesh.geometry.dispose()
        })
        tubeMat.dispose()
        barrierMat.dispose()
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      resizeObserver?.disconnect()
      ;(mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup?.()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
      }
    }
  }, [difficulty, endRun, isRtl, level, target])

  const start = () => {
    sound.playClick()
    stateRef.current = {
      hasStarted: true,
      isPaused: false,
      isOver: false,
      isCleared: false,
      angle: 0,
      distance: 0,
      finished: false,
    }
    setHasStarted(true)
    setIsOver(false)
    setIsCleared(false)
    setDistance(0)
    setLoadError(null)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-rose-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-rose-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {Math.floor(distance)}m / {target}m
          </span>
        </div>
        <span className="text-cyan-300 font-bold">L{level}</span>
      </div>

      <div
        ref={mountRef}
        className="relative w-full aspect-[3/4] max-h-[28rem] rounded-3xl overflow-hidden border-2 border-rose-500/40 bg-slate-950 shadow-[0_0_30px_rgba(244,63,94,0.2)] touch-none [overscroll-behavior:contain]"
      >
        {!hasStarted && !loadError && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🌀</span>
            <p className="text-base font-black text-white">
              {isRtl ? 'نفق النيون' : 'Neon Tunnel Rush'}
            </p>
            <p className="text-xs text-slate-300">
              {isRtl
                ? `لُف لتعدّي الحواجز · اوصل ${target} متر`
                : `Rotate to dodge barriers · reach ${target}m`}
            </p>
            <Button variant="primary" size="sm" onClick={start}>
              {isRtl ? 'ادخل النفق 🚀' : 'Enter Tunnel 🚀'}
            </Button>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-20 bg-black/90 flex items-center justify-center p-4 text-center">
            <p className="text-sm font-black text-rose-400">{loadError}</p>
          </div>
        )}

        {(isOver || isCleared) && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">{isCleared ? '🏆' : '💥'}</span>
            <p className={`text-base font-black ${isCleared ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCleared
                ? isRtl
                  ? 'عدّيت النفق!'
                  : 'Tunnel Cleared!'
                : isRtl
                  ? 'اصطدمت بالحاجز!'
                  : 'Hit a barrier!'}
            </p>
            <Button variant="primary" size="sm" onClick={start} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'العب تاني' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.angle -= 0.35
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-rose-300 font-black text-xl active:scale-95"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.angle += 0.35
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-rose-300 font-black text-xl active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  )
}
