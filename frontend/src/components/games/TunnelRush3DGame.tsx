/**
 * TunnelRush3DGame.tsx
 *
 * Fast 3D neon tunnel reflex runner:
 * Rotate inside a high-speed cylindrical tunnel, threading through the openings
 * in approaching neon barriers. dynamic three.js import ensures lightweight catalog.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameShell, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type ThreeModule = typeof import('three')

function speedFor(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 24 : difficulty === 'Hard' ? 38 : 30
  return base + (level - 1) * 3
}

function distanceTarget(level: number): number {
  return 120 + level * 40
}

const BARRIER_GAP_ANGLE = Math.PI * 0.75 // 135-degree gap to dodge through

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

  const resetSceneRef = useRef<(() => void) | null>(null)

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

      const width = mount.clientWidth || 320
      const height = mount.clientHeight || 420

      const scene = new THREE.Scene()
      scene.fog = new THREE.Fog(0x060214, 18, 60)
      scene.background = new THREE.Color(0x060214)

      const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100)
      camera.position.set(0, 0, 0)
      camera.lookAt(0, 0, -10)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height)
      mount.appendChild(renderer.domElement)

      const ambient = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambient)
      const light = new THREE.PointLight(0xf43f5e, 1.8, 30)
      scene.add(light)

      // Player Ship indicator (neon chevron at bottom of view)
      const shipGroup = new THREE.Group()
      const shipGeo = new THREE.ConeGeometry(0.18, 0.45, 4)
      const shipMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x00d2ff,
        emissiveIntensity: 1.4,
      })
      const shipMesh = new THREE.Mesh(shipGeo, shipMat)
      shipMesh.rotation.x = Math.PI / 2
      shipMesh.position.set(0, -1.35, -1.6)
      shipGroup.add(shipMesh)
      scene.add(shipGroup)

      const tunnelGroup = new THREE.Group()
      scene.add(tunnelGroup)

      const ringCount = 36
      const rings: Array<{
        mesh: InstanceType<ThreeModule['Mesh']>
        z: number
        isBarrier: boolean
        openAngle: number
        checked: boolean
      }> = []

      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0369a1,
        emissiveIntensity: 0.4,
        wireframe: true,
      })
      const barrierMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xbe123c,
        emissiveIntensity: 0.85,
        side: THREE.DoubleSide,
      })

      const barrierLength = Math.PI * 2 - BARRIER_GAP_ANGLE

      for (let i = 0; i < ringCount; i++) {
        const z = -i * 4
        const isBarrier = i > 4 && i % 3 === 0
        if (isBarrier) {
          const geo = new THREE.RingGeometry(1.5, 2.3, 32, 1, 0, barrierLength)
          const mesh = new THREE.Mesh(geo, barrierMat)
          mesh.position.z = z
          const openAngle = Math.random() * Math.PI * 2
          mesh.rotation.z = openAngle
          tunnelGroup.add(mesh)
          rings.push({ mesh, z, isBarrier: true, openAngle, checked: false })
        } else {
          const geo = new THREE.TorusGeometry(2.1, 0.04, 8, 48)
          const mesh = new THREE.Mesh(geo, tubeMat)
          mesh.position.z = z
          tunnelGroup.add(mesh)
          rings.push({ mesh, z, isBarrier: false, openAngle: 0, checked: false })
        }
      }

      const resetScene = () => {
        tunnelGroup.rotation.z = 0
        stateRef.current.angle = 0
        for (let i = 0; i < rings.length; i++) {
          const ring = rings[i]
          ring.z = -i * 4
          ring.mesh.position.z = ring.z
          ring.checked = false
          if (ring.isBarrier) {
            ring.openAngle = Math.random() * Math.PI * 2
            ring.mesh.rotation.z = ring.openAngle
          }
        }
      }
      resetSceneRef.current = resetScene

      let last = performance.now()
      const forward = speedFor(level, difficulty)

      const onPointer = (e: PointerEvent) => {
        if (!stateRef.current.hasStarted) return
        const bounds = mount.getBoundingClientRect()
        const x = (e.clientX - bounds.left) / bounds.width
        stateRef.current.angle = (x - 0.5) * Math.PI * 2.2
      }
      mount.addEventListener('pointermove', onPointer)
      mount.addEventListener('pointerdown', onPointer)

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

        if (keys.left) stateRef.current.angle -= 3.4 * dt
        if (keys.right) stateRef.current.angle += 3.4 * dt

        // Rotate tunnel to match player position
        tunnelGroup.rotation.z = -stateRef.current.angle

        for (const ring of rings) {
          ring.z += forward * dt
          ring.mesh.position.z = ring.z

          // Recycle ring
          if (ring.z > 3) {
            const minZ = Math.min(...rings.map((r) => r.z))
            ring.z = minZ - 4
            ring.mesh.position.z = ring.z
            ring.checked = false
            if (ring.isBarrier) {
              ring.openAngle = Math.random() * Math.PI * 2
              ring.mesh.rotation.z = ring.openAngle
            }
          }

          // Collision when barrier crosses the ship plane at z = -1.6
          if (ring.isBarrier && !ring.checked && ring.z > -2.1 && ring.z < -1.1) {
            ring.checked = true
            // In world space, ship is at angle -PI/2 (bottom)
            // In tunnel space, ship is at:
            const shipAngleInTunnel = (-Math.PI / 2 + stateRef.current.angle)
            // In barrier local mesh space:
            const angleInBarrier = (shipAngleInTunnel - ring.openAngle) % (Math.PI * 2)
            const norm = (angleInBarrier + Math.PI * 2) % (Math.PI * 2)

            // Solid part is [0, barrierLength], gap is (barrierLength, 2*PI)
            const isSolid = norm <= barrierLength
            if (isSolid) {
              endRun(false, stateRef.current.distance)
              return
            }
          }
        }

        stateRef.current.distance += forward * dt * 0.4
        if (Math.random() < 0.08) setDistance(Math.floor(stateRef.current.distance))

        if (stateRef.current.distance >= target) {
          endRun(true, stateRef.current.distance)
          return
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
        scene.remove(shipGroup)
        shipGeo.dispose()
        shipMat.dispose()
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
    resetSceneRef.current?.()
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
                ? `لُف لتعدّي فتحات الحواجز · اوصل ${target} متر`
                : `Rotate to pass barrier gaps · reach ${target}m`}
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
                  ? 'عدّيت النفق بنجاح!'
                  : 'Tunnel Cleared!'
                : isRtl
                  ? 'اصطدمت بالحاجز!'
                  : 'Crashed into barrier!'}
            </p>
            <p className="text-xs text-white font-mono">
              {isRtl ? 'المسافة:' : 'Distance:'} {Math.floor(distance)}m
            </p>
            <Button variant="primary" size="sm" onClick={start} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حاول تاني' : 'Try Again'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.angle -= 0.45
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-rose-300 font-black text-xl active:scale-95 cursor-pointer"
        >
          ↺
        </button>
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.angle += 0.45
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-rose-300 font-black text-xl active:scale-95 cursor-pointer"
        >
          ↻
        </button>
      </div>
    </div>
  )
}
