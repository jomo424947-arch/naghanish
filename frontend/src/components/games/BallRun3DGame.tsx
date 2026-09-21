/**
 * BallRun3DGame.tsx
 *
 * Neon endless-runner: steer a glowing sphere across a 3-lane track, collect
 * gems, dodge red hazard blocks. Built on three.js (dynamic import).
 *
 * Key design decisions
 * --------------------
 * - The heavy Three.js setup lives inside a *single* `useEffect` with an empty
 *   dependency array so the WebGL context is created exactly once per mount.
 * - All mutable game state lives in `gsRef` (game-state ref) so the animation
 *   loop never reads stale React state.
 * - `start()` resets `gsRef` *and* repositions every Three.js object in-place —
 *   no remount, no new scene.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useGameShell, type GameEngineProps } from '@components/game-kit'
import { sound } from '@/utils/soundManager'

/* ── constants ─────────────────────────────────────────────────────────── */

type ThreeModule = typeof import('three')

const LANE_X = [-1.4, 0, 1.4] as const
const SEG_LEN = 7          // length of one track segment in world units
const SEG_COUNT = 14        // number of segments kept alive (ring buffer)
const TRACK_W = 4.6         // total track width
const BALL_R = 0.45         // ball radius
const BALL_Y = BALL_R + 0.175 // resting Y above a 0.35-thick floor centred at Y=0

/* ── helpers ───────────────────────────────────────────────────────────── */

function baseSpeed(difficulty: string): number {
  return difficulty === 'Easy' ? 8 : difficulty === 'Hard' ? 15 : 11
}

function gemsToWin(level: number): number {
  return 5 + level * 2
}

/* ── types ─────────────────────────────────────────────────────────────── */

interface Obstacle {
  mesh: InstanceType<ThreeModule['Mesh']>
}

interface Gem {
  mesh: InstanceType<ThreeModule['Mesh']>
  alive: boolean
}

interface Seg {
  group: InstanceType<ThreeModule['Group']>
  z: number
  obstacles: Obstacle[]
  gems: Gem[]
}

interface GameState {
  phase: 'IDLE' | 'RUNNING' | 'FALLING' | 'OVER' | 'WON'
  paused: boolean
  lane: number          // target lane index 0 | 1 | 2
  laneXSmooth: number   // smoothed x position
  score: number
  gems: number
  speed: number
}

/* ── component ─────────────────────────────────────────────────────────── */

export const BallRun3DGame: React.FC<GameEngineProps> = ({
  onFinish,
  isRtl,
  difficulty = 'Medium',
  level = 1,
  onLevelComplete,
}) => {
  const { isPaused } = useGameShell()

  const canvasBox = useRef<HTMLDivElement | null>(null)

  /* React-rendered UI state */
  const [uiPhase, setUiPhase] = useState<'IDLE' | 'RUNNING' | 'OVER' | 'WON'>('IDLE')
  const [uiScore, setUiScore] = useState(0)
  const [uiGems, setUiGems] = useState(0)
  const [loadErr, setLoadErr] = useState<string | null>(null)

  /* Mutable game state — never triggers re-renders */
  const gsRef = useRef<GameState>({
    phase: 'IDLE',
    paused: false,
    lane: 1,
    laneXSmooth: 0,
    score: 0,
    gems: 0,
    speed: baseSpeed(difficulty),
  })

  /* Keep paused in sync without re-running the effect */
  gsRef.current.paused = isPaused

  const target = gemsToWin(level)

  /* Stable refs for callbacks the animation loop needs */
  const propsRef = useRef({ onFinish, onLevelComplete, level, target, difficulty, isRtl })
  propsRef.current = { onFinish, onLevelComplete, level, target, difficulty, isRtl }

  /* Reference to the in-place reset function created inside the effect */
  const resetRef = useRef<(() => void) | null>(null)

  /* ── main Three.js effect (runs once) ────────────────────────────── */

  useEffect(() => {
    const box = canvasBox.current
    if (!box) return

    let disposed = false
    let raf = 0
    let renderer: InstanceType<ThreeModule['WebGLRenderer']> | null = null
    let ro: ResizeObserver | null = null

    /* keyboard state */
    const keys = { left: false, right: false }
    const onKD = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true
    }
    const onKU = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false
    }
    window.addEventListener('keydown', onKD)
    window.addEventListener('keyup', onKU)

    /* ── async init ─────────────────────────────────────────────── */
    ;(async () => {
      let THREE: ThreeModule
      try {
        THREE = await import('three')
      } catch {
        if (!disposed) setLoadErr(isRtl ? 'تعذر تحميل محرك 3D' : 'Failed to load 3D engine')
        return
      }
      if (disposed) return

      /* ── scene / camera / renderer ────────────────────────────── */
      const w0 = box.clientWidth || 320
      const h0 = box.clientHeight || 480

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x050711)
      scene.fog = new THREE.Fog(0x050711, 20, 70)

      const camera = new THREE.PerspectiveCamera(62, w0 / h0, 0.1, 120)
      camera.position.set(0, 4.5, 8)
      camera.lookAt(0, 0.6, -6)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
      renderer.setSize(w0, h0)
      box.appendChild(renderer.domElement)

      /* ── lights ───────────────────────────────────────────────── */
      scene.add(new THREE.AmbientLight(0x6688ff, 0.55))
      const sun = new THREE.DirectionalLight(0x88ffff, 1.1)
      sun.position.set(5, 12, 6)
      scene.add(sun)

      /* ── shared materials / geometries ─────────────────────────── */
      const ballGeo = new THREE.SphereGeometry(BALL_R, 28, 28)
      const ballMat = new THREE.MeshStandardMaterial({
        color: 0x00d2ff, emissive: 0x0891b2, emissiveIntensity: 0.9,
        metalness: 0.35, roughness: 0.15,
      })
      const ball = new THREE.Mesh(ballGeo, ballMat)
      ball.position.set(LANE_X[1], BALL_Y, 0)
      scene.add(ball)

      // Glow point light attached to ball
      const ballGlow = new THREE.PointLight(0x22d3ee, 1.2, 6)
      ballGlow.position.set(0, 0.3, 0)
      ball.add(ballGlow)

      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b, emissive: 0x4338ca, emissiveIntensity: 0.15,
        metalness: 0.5, roughness: 0.35,
      })
      const railMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7,
      })
      const obsGeo = new THREE.BoxGeometry(1.15, 0.8, 0.5)
      const obsMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.0,
        roughness: 0.15,
      })
      const gemGeo = new THREE.OctahedronGeometry(0.3)
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.9,
      })

      /* ── build track segments ─────────────────────────────────── */
      const segments: Seg[] = []
      let segCounter = 0     // monotonic index for obstacle seeding

      const floorGeo = new THREE.BoxGeometry(TRACK_W, 0.35, SEG_LEN - 0.15)
      const railGeo = new THREE.BoxGeometry(0.12, 0.22, SEG_LEN - 0.15)

      /** Populate obstacles / gems for a segment that just entered play. */
      function fillSeg(seg: Seg, idx: number) {
        // Remove old obstacles & gems
        for (const o of seg.obstacles) { seg.group.remove(o.mesh); o.mesh.geometry.dispose() }
        for (const g of seg.gems) { seg.group.remove(g.mesh); g.mesh.geometry.dispose() }
        seg.obstacles = []
        seg.gems = []

        if (idx <= 2) return  // first few segments are always clear

        const diff = propsRef.current.difficulty
        const hasObs = idx % 2 === 0
        const free = [...LANE_X]

        if (hasObs) {
          const n = diff === 'Hard' && Math.random() < 0.35 ? 2 : 1
          for (let i = 0; i < n && free.length > 1; i++) {
            const li = Math.floor(Math.random() * free.length)
            const lx = free.splice(li, 1)[0]
            const m = new THREE.Mesh(obsGeo, obsMat)
            m.position.set(lx, 0.175 + 0.4, 0)  // local to group
            seg.group.add(m)
            seg.obstacles.push({ mesh: m })
          }
        }

        // Place a gem on a remaining free lane
        if (Math.random() < 0.75 && free.length > 0) {
          const gx = free[Math.floor(Math.random() * free.length)]
          const m = new THREE.Mesh(gemGeo, gemMat)
          m.position.set(gx, 0.85, 0)
          seg.group.add(m)
          seg.gems.push({ mesh: m, alive: true })
        }
      }

      function makeSeg(z: number, idx: number): Seg {
        const grp = new THREE.Group()
        grp.position.set(0, 0, z)

        const floor = new THREE.Mesh(floorGeo, trackMat)
        grp.add(floor)

        const lr = new THREE.Mesh(railGeo, railMat)
        lr.position.set(-TRACK_W / 2, 0.19, 0)
        grp.add(lr)

        const rr = new THREE.Mesh(railGeo, railMat)
        rr.position.set(TRACK_W / 2, 0.19, 0)
        grp.add(rr)

        scene.add(grp)

        const seg: Seg = { group: grp, z, obstacles: [], gems: [] }
        fillSeg(seg, idx)
        segments.push(seg)
        return seg
      }

      for (let i = 0; i < SEG_COUNT; i++) {
        makeSeg(-i * SEG_LEN, i)
        segCounter = i + 1
      }

      /* ── in-place reset (no remount) ──────────────────────────── */
      function resetAll() {
        const gs = gsRef.current
        gs.lane = 1
        gs.laneXSmooth = LANE_X[1]
        gs.score = 0
        gs.gems = 0
        gs.speed = baseSpeed(propsRef.current.difficulty)

        ball.position.set(LANE_X[1], BALL_Y, 0)
        ball.rotation.set(0, 0, 0)
        ball.visible = true

        segCounter = SEG_COUNT
        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i]
          seg.z = -i * SEG_LEN
          seg.group.position.z = seg.z
          fillSeg(seg, i)
        }
      }
      resetRef.current = resetAll

      /* ── touch / pointer input ────────────────────────────────── */
      let touchStartX = 0
      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault()
        touchStartX = e.touches[0].clientX
      }
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        const gs = gsRef.current
        if (gs.phase !== 'RUNNING') return
        const dx = e.touches[0].clientX - touchStartX
        if (Math.abs(dx) > 30) {
          gs.lane = Math.max(0, Math.min(2, gs.lane + (dx > 0 ? 1 : -1)))
          touchStartX = e.touches[0].clientX
        }
      }
      box.addEventListener('touchstart', onTouchStart, { passive: false })
      box.addEventListener('touchmove', onTouchMove, { passive: false })

      /* ── animation loop ───────────────────────────────────────── */
      let prevT = performance.now()

      function tick(now: number) {
        if (disposed) return
        raf = requestAnimationFrame(tick)

        const dt = Math.min(0.06, (now - prevT) / 1000)
        prevT = now

        const gs = gsRef.current

        // Always render (even when paused) so the scene stays visible
        renderer?.render(scene, camera)

        if (gs.phase === 'IDLE' || gs.paused) return

        /* ── falling animation ─────────────────────────────────── */
        if (gs.phase === 'FALLING') {
          ball.position.y -= 12 * dt
          ball.rotation.x -= 7 * dt
          ball.rotation.z += (ball.position.x > 0 ? 5 : -5) * dt
          if (ball.position.y < -6) {
            gs.phase = 'OVER'
            setUiPhase('OVER')
            sound.playGameOver()
            propsRef.current.onFinish(gs.score, { levelReached: propsRef.current.level, stars: 0 })
          }
          return
        }

        if (gs.phase !== 'RUNNING') return

        /* ── lane switching via keyboard ───────────────────────── */
        if (keys.left) {
          keys.left = false   // consume — one lane per press
          gs.lane = Math.max(0, gs.lane - 1)
        }
        if (keys.right) {
          keys.right = false
          gs.lane = Math.min(2, gs.lane + 1)
        }

        /* ── smooth x interpolation ───────────────────────────── */
        const targetX = LANE_X[gs.lane]
        gs.laneXSmooth += (targetX - gs.laneXSmooth) * Math.min(1, dt * 14)
        ball.position.x = gs.laneXSmooth
        ball.rotation.x -= gs.speed * dt * 0.7

        /* ── move segments toward camera ──────────────────────── */
        for (const seg of segments) {
          seg.z += gs.speed * dt
          seg.group.position.z = seg.z

          // Spin gems
          for (const g of seg.gems) {
            if (g.alive) g.mesh.rotation.y += dt * 3
          }

          // Recycle segment that passed behind the camera
          if (seg.z > 14) {
            const minZ = Math.min(...segments.map(s => s.z))
            seg.z = minZ - SEG_LEN
            seg.group.position.z = seg.z
            fillSeg(seg, segCounter++)
          }

          /* ── collision zone (segment overlaps ball z ≈ 0) ──── */
          if (seg.z > -1.0 && seg.z < 1.5) {
            // Obstacle check
            for (const o of seg.obstacles) {
              const worldX = o.mesh.position.x // local x = world x because group x = 0
              const worldZ = seg.z + o.mesh.position.z
              const dx = Math.abs(ball.position.x - worldX)
              const dz = Math.abs(ball.position.z - worldZ)
              if (dx < 0.7 && dz < 0.7) {
                gs.phase = 'FALLING'
                sound.playGameOver()
                return
              }
            }

            // Gem collection
            for (const g of seg.gems) {
              if (!g.alive) continue
              const worldX = g.mesh.position.x
              const worldZ = seg.z + g.mesh.position.z
              const dx = Math.abs(ball.position.x - worldX)
              const dz = Math.abs(ball.position.z - worldZ)
              if (dx < 0.65 && dz < 1.0) {
                g.alive = false
                g.mesh.visible = false
                gs.gems += 1
                gs.score += 100
                setUiGems(gs.gems)
                setUiScore(gs.score)
                sound.playCoin()

                if (gs.gems >= propsRef.current.target) {
                  gs.phase = 'WON'
                  setUiPhase('WON')
                  const { level: lv, target: tgt, onLevelComplete: olc, onFinish: of2 } = propsRef.current
                  const stars = gs.score > tgt * 80 ? 3 : gs.score > tgt * 40 ? 2 : 1
                  olc?.(lv, stars)
                  sound.playWin()
                  of2(gs.score, { levelReached: lv, stars })
                  return
                }
              }
            }
          }
        }

        // Gradually speed up
        gs.speed += dt * 0.25

        // Camera subtle follow
        camera.position.x = ball.position.x * 0.3
        camera.lookAt(ball.position.x * 0.15, 0.5, -8)
      }

      raf = requestAnimationFrame(tick)

      /* ── resize observer ──────────────────────────────────────── */
      ro = new ResizeObserver(() => {
        if (!renderer) return
        const w = box.clientWidth || 320
        const h = box.clientHeight || 480
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      })
      ro.observe(box)
    })()

    /* ── cleanup ────────────────────────────────────────────────── */
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKD)
      window.removeEventListener('keyup', onKU)
      ro?.disconnect()

      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentElement === box) {
          box.removeChild(renderer.domElement)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // ↑ intentionally empty — the loop reads everything from refs

  /* ── start / restart ─────────────────────────────────────────────── */

  const start = useCallback(() => {
    sound.playClick()
    resetRef.current?.()
    gsRef.current.phase = 'RUNNING'
    setUiPhase('RUNNING')
    setUiScore(0)
    setUiGems(0)
    setLoadErr(null)
  }, [])

  /* ── render ──────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto select-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/40 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-black">
          <Trophy className="w-4 h-4" />
          <span>{isRtl ? 'النقاط:' : 'SCORE:'} {uiScore}</span>
        </div>
        <span className="text-amber-300 font-black">
          {uiGems}/{target} 💎
        </span>
        <span className="text-cyan-300 font-bold">L{level}</span>
      </div>

      {/* Canvas */}
      <div
        ref={canvasBox}
        className="relative w-full aspect-[3/4] max-h-[28rem] rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.2)] touch-none"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Start overlay */}
        {uiPhase === 'IDLE' && !loadErr && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-5xl">🏐</span>
            <p className="text-lg font-black text-white">
              {isRtl ? 'كرة الجري 3D' : 'Ball Run 3D'}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-[16rem]">
              {isRtl
                ? `اجمع ${target} جوهرة 💎 وتفادى الحواجز الحمراء\nاستخدم الأسهم أو اسحب يمين/يسار`
                : `Collect ${target} gems 💎 & dodge red blocks\nUse arrows or swipe left/right`}
            </p>
            <Button variant="primary" size="sm" onClick={start}>
              {isRtl ? 'ابدأ الجري 🚀' : 'Start Run 🚀'}
            </Button>
          </div>
        )}

        {/* Error overlay */}
        {loadErr && (
          <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-sm font-black text-rose-400">{loadErr}</p>
          </div>
        )}

        {/* Game-over / won overlay */}
        {(uiPhase === 'OVER' || uiPhase === 'WON') && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-5xl">{uiPhase === 'WON' ? '🏆' : '💥'}</span>
            <p className={`text-base font-black ${uiPhase === 'WON' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {uiPhase === 'WON'
                ? isRtl ? 'المرحلة خلصت!' : 'Level Cleared!'
                : isRtl ? 'اصطدمت!' : 'Crashed!'}
            </p>
            <p className="text-xs text-white font-mono">
              {isRtl ? 'النتيجة:' : 'Score:'} {uiScore} &nbsp;·&nbsp; 💎 {uiGems}/{target}
            </p>
            <Button variant="primary" size="sm" onClick={start} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRtl ? 'العب تاني' : 'Play Again'}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile lane-switch buttons */}
      <div className="flex items-center gap-8">
        <button
          type="button"
          onPointerDown={() => {
            const gs = gsRef.current
            if (gs.phase === 'RUNNING') gs.lane = Math.max(0, gs.lane - 1)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-2xl active:scale-90 transition-transform cursor-pointer"
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          onPointerDown={() => {
            const gs = gsRef.current
            if (gs.phase === 'RUNNING') gs.lane = Math.min(2, gs.lane + 1)
          }}
          className="w-16 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-black text-2xl active:scale-90 transition-transform cursor-pointer"
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  )
}
