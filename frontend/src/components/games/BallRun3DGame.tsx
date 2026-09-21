/**
 * BallRun3DGame.tsx
 *
 * Medium-complexity three.js endless ball run: steer a neon sphere along a
 * segmented track, collect gems, and avoid gaps. three is imported dynamically
 * so other games never pay for the dependency.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameShell, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

type ThreeModule = typeof import('three')

interface TrackSegment {
  mesh: InstanceType<ThreeModule['Mesh']>
  z: number
  hasGap: boolean
  gem?: InstanceType<ThreeModule['Mesh']>
}

function speedForLevel(level: number, difficulty: string): number {
  const base = difficulty === 'Easy' ? 8 : difficulty === 'Hard' ? 14 : 11
  return base + (level - 1) * 1.2
}

function gemsNeeded(level: number): number {
  return 6 + level * 3
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

  const stateRef = useRef({
    hasStarted: false,
    isPaused: false,
    isOver: false,
    isCleared: false,
    laneX: 0,
    score: 0,
    gems: 0,
    finished: false,
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
      scene.fog = new THREE.Fog(0x050711, 12, 55)
      scene.background = new THREE.Color(0x050711)

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
      camera.position.set(0, 4.5, 8)
      camera.lookAt(0, 0, -6)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height)
      mount.appendChild(renderer.domElement)

      const ambient = new THREE.AmbientLight(0x6688ff, 0.55)
      scene.add(ambient)
      const sun = new THREE.DirectionalLight(0x88ffff, 1.1)
      sun.position.set(4, 10, 6)
      scene.add(sun)

      const ballGeo = new THREE.SphereGeometry(0.45, 24, 24)
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x0891b2,
        emissiveIntensity: 0.7,
        metalness: 0.35,
        roughness: 0.25,
      })
      const ball = new THREE.Mesh(ballGeo, ballMat)
      ball.position.set(0, 0.55, 0)
      scene.add(ball)

      const segmentLen = 6
      const segments: TrackSegment[] = []
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.15,
        metalness: 0.4,
        roughness: 0.55,
      })
      const gapMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.15,
      })
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
      })

      const makeSegment = (z: number, index: number) => {
        const hasGap = index > 2 && index % 4 === 0
        const geo = new THREE.BoxGeometry(4.2, 0.35, segmentLen - 0.15)
        const mesh = new THREE.Mesh(geo, hasGap ? gapMat : trackMat)
        mesh.position.set(0, 0, z)
        scene.add(mesh)

        let gem: InstanceType<ThreeModule['Mesh']> | undefined
        if (!hasGap && index % 2 === 1) {
          const gemGeo = new THREE.OctahedronGeometry(0.28)
          gem = new THREE.Mesh(gemGeo, gemMat)
          gem.position.set((Math.random() - 0.5) * 2.4, 0.9, z)
          scene.add(gem)
        }

        const seg: TrackSegment = { mesh, z, hasGap, gem }
        segments.push(seg)
        return seg
      }

      for (let i = 0; i < 12; i++) makeSegment(-i * segmentLen, i)

      let last = performance.now()
      let nextIndex = 12
      const forwardSpeed = speedForLevel(level, difficulty)
      const laneLimit = 1.6

      const onPointer = (e: PointerEvent) => {
        if (!stateRef.current.hasStarted) return
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

        // Steer
        if (keys.left) stateRef.current.laneX -= 6 * dt
        if (keys.right) stateRef.current.laneX += 6 * dt
        stateRef.current.laneX = Math.max(-laneLimit, Math.min(laneLimit, stateRef.current.laneX))
        ball.position.x += (stateRef.current.laneX - ball.position.x) * Math.min(1, dt * 10)
        ball.rotation.x -= forwardSpeed * dt * 0.6

        // Move world toward camera
        for (const seg of segments) {
          seg.z += forwardSpeed * dt
          seg.mesh.position.z = seg.z
          if (seg.gem) {
            seg.gem.position.z = seg.z
            seg.gem.rotation.y += dt * 2
          }

          // Recycle far segments
          if (seg.z > 10) {
            const minZ = Math.min(...segments.map((s) => s.z))
            seg.z = minZ - segmentLen
            seg.hasGap = nextIndex > 2 && nextIndex % 4 === 0
            seg.mesh.material = seg.hasGap ? gapMat : trackMat
            seg.mesh.position.z = seg.z
            if (seg.gem) {
              scene.remove(seg.gem)
              seg.gem.geometry.dispose()
              seg.gem = undefined
            }
            if (!seg.hasGap && nextIndex % 2 === 1) {
              const gemGeo = new THREE.OctahedronGeometry(0.28)
              seg.gem = new THREE.Mesh(gemGeo, gemMat)
              seg.gem.position.set((Math.random() - 0.5) * 2.4, 0.9, seg.z)
              scene.add(seg.gem)
            }
            nextIndex++
          }

          // Collision / collect near ball (z ~ 0)
          if (Math.abs(seg.z) < 0.9) {
            if (seg.hasGap) {
              endRun(false, stateRef.current.score)
            } else if (seg.gem) {
              const dx = seg.gem.position.x - ball.position.x
              if (Math.abs(dx) < 0.7) {
                sound.playCoin()
                scene.remove(seg.gem)
                seg.gem.geometry.dispose()
                seg.gem = undefined
                stateRef.current.gems += 1
                stateRef.current.score += 50
                setGems(stateRef.current.gems)
                setScore(stateRef.current.score)
                if (stateRef.current.gems >= target) {
                  endRun(true, stateRef.current.score)
                }
              }
            }
          }
        }

        // Passive score for distance
        stateRef.current.score += Math.floor(forwardSpeed * dt * 2)
        if (Math.random() < 0.05) setScore(stateRef.current.score)

        camera.position.x = ball.position.x * 0.35
        camera.lookAt(ball.position.x * 0.2, 0.5, -8)
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

      // Cleanup extras on unmount via closed-over refs
      ;(mount as HTMLDivElement & { __ballCleanup?: () => void }).__ballCleanup = () => {
        mount.removeEventListener('pointermove', onPointer)
        mount.removeEventListener('pointerdown', onPointer)
        segments.forEach((seg) => {
          scene.remove(seg.mesh)
          seg.mesh.geometry.dispose()
          if (seg.gem) {
            scene.remove(seg.gem)
            seg.gem.geometry.dispose()
          }
        })
        ballGeo.dispose()
        ballMat.dispose()
        trackMat.dispose()
        gapMat.dispose()
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
    }
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
                ? `اجمع ${target} جوهرة وتفادى الفراغات · حرّك يمين/يسار`
                : `Collect ${target} gems and dodge gaps · steer left/right`}
            </p>
            <Button variant="primary" size="sm" onClick={start}>
              {isRtl ? 'ابدأ الجري 🚀' : 'Start Run 🚀'}
            </Button>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-sm font-black text-rose-400">{loadError}</p>
            <p className="text-xs text-slate-400">
              {isRtl ? 'ثبّت three من مجلد frontend ثم أعد المحاولة' : 'Install three in frontend/ and retry'}
            </p>
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
                  ? 'وقعت في الفراغ!'
                  : 'Fell through!'}
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
            stateRef.current.laneX = Math.max(-1.6, stateRef.current.laneX - 0.55)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-xl active:scale-95"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => {
            stateRef.current.laneX = Math.min(1.6, stateRef.current.laneX + 0.55)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-xl active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  )
}
