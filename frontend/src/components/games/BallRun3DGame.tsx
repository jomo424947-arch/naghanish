/**
 * BallRun3DGame.tsx
 *
 * High-performance three.js endless ball runner:
 * Steer a neon sphere across a 3-lane suspended track, collect floating gems,
 * dodge neon hazard barriers, and avoid falling off the edge.
 * dynamic import of three ensures only this game loads three.js.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameShell, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type ThreeModule = typeof import('three')

const LANES = [-1.4, 0, 1.4]
const SEGMENT_LEN = 7
const TOTAL_SEGMENTS = 14
const TRACK_WIDTH = 4.6

interface TrackSegment {
  mesh: InstanceType<ThreeModule['Mesh']>
  z: number
  obstacles: Array<InstanceType<ThreeModule['Mesh']>>
  gems: Array<InstanceType<ThreeModule['Mesh']>>
}

function speedForLevel(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 9 : difficulty === 'Hard' ? 16 : 12
  return base + (level - 1) * 1.3
}

function gemsNeeded(level: number): number {
  return 5 + level * 2
}

export const BallRun3DGame: React.FC<GameEngineProps> = ({
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
  const [score, setScore] = useState(0)
  const [gems, setGems] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)

  const resetSceneRef = useRef<(() => void) | null>(null)

  const stateRef = useRef({
    hasStarted: false,
    isPaused: false,
    isOver: false,
    isCleared: false,
    laneX: 0,
    score: 0,
    gems: 0,
    finished: false,
    falling: false,
  })

  stateRef.current.isPaused = isPaused

  const target = gemsNeeded(level)

  const endRun = useCallback(
    (won: boolean, finalScore: number) => {
      if (stateRef.current.finished) return
      stateRef.current.finished = true
      stateRef.current.isOver = !won
      stateRef.current.isCleared = won
      setIsOver(!won)
      setIsCleared(won)
      const stars = won ? (finalScore > target * 80 ? 3 : finalScore > target * 40 ? 2 : 1) : 0
      if (won) {
        onLevelComplete?.(level, stars)
        sound.playWin()
      } else {
        sound.playGameOver()
      }
      onFinish(finalScore, { levelReached: level, stars })
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
      scene.fog = new THREE.Fog(0x050711, 15, 65)
      scene.background = new THREE.Color(0x050711)

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
      camera.position.set(0, 4.2, 7.5)
      camera.lookAt(0, 0.8, -6)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height)
      mount.appendChild(renderer.domElement)

      // Lighting
      const ambient = new THREE.AmbientLight(0x6688ff, 0.6)
      scene.add(ambient)
      const sun = new THREE.DirectionalLight(0x88ffff, 1.2)
      sun.position.set(5, 12, 6)
      scene.add(sun)

      // Player Ball
      const ballGeo = new THREE.SphereGeometry(0.45, 24, 24)
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x0891b2,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.2,
      })
      const ball = new THREE.Mesh(ballGeo, ballMat)
      ball.position.set(0, 0.55, 0)
      scene.add(ball)

      // Materials
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x4338ca,
        emissiveIntensity: 0.2,
        metalness: 0.5,
        roughness: 0.4,
      })

      const railMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
      })

      const obstacleGeo = new THREE.BoxGeometry(1.15, 0.75, 0.45)
      const obstacleMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 1.2,
        roughness: 0.2,
      })

      const gemGeo = new THREE.OctahedronGeometry(0.28)
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.0,
      })

      const segments: TrackSegment[] = []
      let nextIndex = TOTAL_SEGMENTS

      const populateSegmentObjects = (seg: TrackSegment, index: number) => {
        // Clear previous
        for (const obs of seg.obstacles) {
          scene.remove(obs)
          obs.geometry.dispose()
        }
        seg.obstacles = []
        for (const g of seg.gems) {
          scene.remove(g)
          g.geometry.dispose()
        }
        seg.gems = []

        if (index <= 2) return // Keep first segments clear

        // Obstacles on some segments
        const hasObstacle = index % 2 === 0
        const freeLanes = [...LANES]

        if (hasObstacle) {
          // Choose 1 or 2 lanes for obstacles (ensure at least 1 lane is free!)
          const numObstacles = difficulty === 'Hard' && Math.random() < 0.4 ? 2 : 1
          for (let o = 0; o < numObstacles; o++) {
            if (freeLanes.length <= 1) break
            const laneIdx = Math.floor(Math.random() * freeLanes.length)
            const obsX = freeLanes.splice(laneIdx, 1)[0]
            const obs = new THREE.Mesh(obstacleGeo, obstacleMat)
            obs.position.set(obsX, 0.45 + 0.375, seg.z)
            scene.add(obs)
            seg.obstacles.push(obs)
          }
        }

        // Place a gem on one of the free lanes
        if (Math.random() < 0.7 && freeLanes.length > 0) {
          const gemX = freeLanes[Math.floor(Math.random() * freeLanes.length)]
          const gem = new THREE.Mesh(gemGeo, gemMat)
          gem.position.set(gemX, 0.9, seg.z)
          scene.add(gem)
          seg.gems.push(gem)
        }
      }

      const makeSegment = (z: number, index: number) => {
        const segGroup = new THREE.Group()

        // Main floor
        const floorGeo = new THREE.BoxGeometry(TRACK_WIDTH, 0.35, SEGMENT_LEN - 0.1)
        const floorMesh = new THREE.Mesh(floorGeo, trackMat)
        segGroup.add(floorMesh)

        // Side glowing rails
        const railGeo = new THREE.BoxGeometry(0.12, 0.25, SEGMENT_LEN - 0.1)
        const leftRail = new THREE.Mesh(railGeo, railMat)
        leftRail.position.set(-TRACK_WIDTH / 2, 0.2, 0)
        segGroup.add(leftRail)

        const rightRail = new THREE.Mesh(railGeo, railMat)
        rightRail.position.set(TRACK_WIDTH / 2, 0.2, 0)
        segGroup.add(rightRail)

        segGroup.position.set(0, 0, z)
        scene.add(segGroup)

        const seg: TrackSegment = {
          mesh: segGroup as unknown as InstanceType<ThreeModule['Mesh']>,
          z,
          obstacles: [],
          gems: [],
        }

        populateSegmentObjects(seg, index)
        segments.push(seg)
        return seg
      }

      for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        makeSegment(-i * SEGMENT_LEN, i)
      }

      const resetScene = () => {
        ball.position.set(0, 0.55, 0)
        ball.rotation.set(0, 0, 0)
        nextIndex = TOTAL_SEGMENTS
        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i]
          seg.z = -i * SEGMENT_LEN
          seg.mesh.position.z = seg.z
          populateSegmentObjects(seg, i)
        }
      }
      resetSceneRef.current = resetScene

      let last = performance.now()
      const forwardSpeed = speedForLevel(level, difficulty)
      const laneLimit = 1.85

      const onPointer = (e: PointerEvent) => {
        if (!stateRef.current.hasStarted || stateRef.current.falling) return
        const bounds = mount.getBoundingClientRect()
        const x = (e.clientX - bounds.left) / bounds.width
        stateRef.current.laneX = (x - 0.5) * laneLimit * 2
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

        // Falling off edge
        if (stateRef.current.falling) {
          ball.position.y -= 14 * dt
          ball.rotation.x -= 8 * dt
          ball.rotation.z += (ball.position.x > 0 ? 6 : -6) * dt
          if (ball.position.y < -5) {
            endRun(false, stateRef.current.score)
          }
          renderer?.render(scene, camera)
          return
        }

        // Steer
        if (keys.left) stateRef.current.laneX -= 6.5 * dt
        if (keys.right) stateRef.current.laneX += 6.5 * dt
        stateRef.current.laneX = Math.max(-laneLimit * 1.3, Math.min(laneLimit * 1.3, stateRef.current.laneX))
        ball.position.x += (stateRef.current.laneX - ball.position.x) * Math.min(1, dt * 12)
        ball.rotation.x -= forwardSpeed * dt * 0.7

        // Check if steered off the track edge
        if (Math.abs(ball.position.x) > TRACK_WIDTH / 2 + 0.15) {
          stateRef.current.falling = true
          sound.playGameOver()
          return
        }

        // Move track toward camera
        for (const seg of segments) {
          seg.z += forwardSpeed * dt
          seg.mesh.position.z = seg.z

          for (const obs of seg.obstacles) {
            obs.position.z = seg.z
          }

          for (const gem of seg.gems) {
            gem.position.z = seg.z
            gem.rotation.y += dt * 2.5
          }

          // Recycle far segment
          if (seg.z > 12) {
            const minZ = Math.min(...segments.map((s) => s.z))
            seg.z = minZ - SEGMENT_LEN
            seg.mesh.position.z = seg.z
            populateSegmentObjects(seg, nextIndex)
            nextIndex++
          }

          // Collision check near ball (z ~ 0)
          if (Math.abs(seg.z - ball.position.z) < 0.75) {
            // Check obstacle collision
            for (const obs of seg.obstacles) {
              const dx = Math.abs(ball.position.x - obs.position.x)
              if (dx < 0.72) {
                endRun(false, stateRef.current.score)
                return
              }
            }

            // Check gem collection
            for (let g = seg.gems.length - 1; g >= 0; g--) {
              const gem = seg.gems[g]
              const dx = Math.abs(ball.position.x - gem.position.x)
              if (dx < 0.65) {
                sound.playCoin()
                scene.remove(gem)
                gem.geometry.dispose()
                seg.gems.splice(g, 1)
                stateRef.current.gems += 1
                stateRef.current.score += 100
                setGems(stateRef.current.gems)
                setScore(stateRef.current.score)
                if (stateRef.current.gems >= target) {
                  endRun(true, stateRef.current.score)
                  return
                }
              }
            }
          }
        }

        // Score is only awarded for active gameplay achievements (gems and obstacle passes)

        // Camera follow
        camera.position.x = ball.position.x * 0.35
        camera.lookAt(ball.position.x * 0.2, 0.6, -8)
        renderer?.render(scene, camera)
      }

      raf = requestAnimationFrame(tick)

      resizeObserver = new ResizeObserver(() => {
        if (!renderer) return
        const w = mount.clientWidth || 320
        const h = mount.clientHeight || 420
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      })
      resizeObserver.observe(mount)

      // Cleanup
      ;(mount as HTMLDivElement & { __ballCleanup?: () => void }).__ballCleanup = () => {
        mount.removeEventListener('pointermove', onPointer)
        mount.removeEventListener('pointerdown', onPointer)
        segments.forEach((seg) => {
          scene.remove(seg.mesh)
          seg.obstacles.forEach((o) => {
            scene.remove(o)
            o.geometry.dispose()
          })
          seg.gems.forEach((g) => {
            scene.remove(g)
            g.geometry.dispose()
          })
        })
        ballGeo.dispose()
        ballMat.dispose()
        trackMat.dispose()
        railMat.dispose()
        obstacleGeo.dispose()
        obstacleMat.dispose()
        gemGeo.dispose()
        gemMat.dispose()
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      resizeObserver?.disconnect()
      const extra = (mount as HTMLDivElement & { __ballCleanup?: () => void }).__ballCleanup
      extra?.()
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
      laneX: 0,
      score: 0,
      gems: 0,
      finished: false,
      falling: false,
    }
    resetSceneRef.current?.()
    setHasStarted(true)
    setIsOver(false)
    setIsCleared(false)
    setScore(0)
    setGems(0)
    setLoadError(null)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>
            {isRtl ? 'النقاط:' : 'SCORE:'} {score}
          </span>
        </div>
        <span className="text-amber-300 font-black">
          {gems}/{target} 💎
        </span>
        <span className="text-cyan-300 font-bold">L{level}</span>
      </div>

      <div
        ref={mountRef}
        className="relative w-full aspect-[3/4] max-h-[28rem] rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.2)] touch-none [overscroll-behavior:contain]"
      >
        {!hasStarted && !loadError && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">🏐</span>
            <p className="text-base font-black text-white">{isRtl ? 'كرة الجري 3D' : 'Ball Run 3D'}</p>
            <p className="text-xs text-slate-300">
              {isRtl
                ? `اجمع ${target} جوهرة وتفادى الحواجز · تحكم يمين ويسار`
                : `Collect ${target} gems & dodge barriers · steer left/right`}
            </p>
            <Button variant="primary" size="sm" onClick={start}>
              {isRtl ? 'ابدأ الجري 🚀' : 'Start Run 🚀'}
            </Button>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-sm font-black text-rose-400">{loadError}</p>
          </div>
        )}

        {(isOver || isCleared) && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-4xl">{isCleared ? '🏆' : '💥'}</span>
            <p className={`text-base font-black ${isCleared ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCleared
                ? isRtl
                  ? 'المرحلة خلصت!'
                  : 'Level Cleared!'
                : isRtl
                  ? 'اصطدمت أو سقطت!'
                  : 'Crashed or fell off!'}
            </p>
            <p className="text-xs text-white font-mono">
              {isRtl ? 'النتيجة:' : 'Score:'} {score}
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
            stateRef.current.laneX = Math.max(-1.4, stateRef.current.laneX - 0.7)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-xl active:scale-95 cursor-pointer"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.laneX = Math.min(1.4, stateRef.current.laneX + 0.7)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-xl active:scale-95 cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  )
}
