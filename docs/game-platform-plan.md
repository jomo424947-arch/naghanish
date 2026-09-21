# Game Platform Roadmap

Goal: turn the game section into a real platform — 7 games per world (42 total),
levels with progressive unlocking, a fullscreen play mode, and controls that
work properly on phones.

## Where we started

The repo already had more than it was showing. `frontend/src/components/games/`
holds 30 engines, but `frontend/src/data/games.data.ts` only listed 22, so seven
finished games were invisible to players. Reaching 42 therefore means writing 13
new games, not 20.

Three problems shaped the design:

`GameDetailsPage` static-imported all 30 engines, so opening any single game
downloaded every game. Adding 12 more plus three.js on top of that would have
made the page unusable on mobile.

Engines size their boards from constants — `SnakeGame` uses an
`18 x 18px` grid, fixed — so nothing could adapt to a phone or fill a fullscreen
stage.

Engines drive motion with `setInterval`, which makes game speed depend on the
player's device and keeps running while the tab is hidden.

## Decisions

3D uses `three` imported dynamically per engine, so only the four 3D games pay
for it. No `@react-three/fiber`.

Levels work on two axes: stages inside each game, and progressive unlocking of a
world's games as the player advances.

Progress persists to `localStorage` first. A backend table and sync endpoints
are deliberately deferred.

The game kit lives at `frontend/src/components/game-kit/` rather than
`frontend/src/game-kit/`, because the existing `@components/*` alias covers it
and no shared config file needs editing.

## Phases

### Phase 0 — Foundations (done)

`frontend/src/components/game-kit/`:

- `types.ts` — `GameEngineProps`, level and progress types. Done.
- `useFullscreen.ts` — CSS overlay always, native Fullscreen API when
  available, because iOS Safari rejects `requestFullscreen` on non-video
  elements. Handles Esc, orientation lock, scroll lock. Done.
- `useGameLoop.ts` — fixed-timestep `requestAnimationFrame`, auto-pause on
  `visibilitychange` and blur. Done.
- `useResponsiveStage.ts` — `ResizeObserver` on the container, DPR-aware canvas
  sizing clamped at 2. Done.
- `useGameProgress.ts` — per-game unlocked level, stars, best score. Done.
- `controls/` — `DPad`, `ActionButtons`, `SwipeZone`. Done.
- `GameShell.tsx` — HUD, pause, fullscreen button, level select. Done.

`frontend/src/data/games.registry.ts` and `GameDetailsPage` rewrite. Done.

### Phase 1 — Surface the hidden games (done)

Seven previously unlisted engines catalogued. Play metadata fields added.

### Phase 2 — Upgrade the existing engines (done for core loop list)

Converted to `useGameLoop` + responsive stage + level props:
Snake, BrickBreaker, NeonInvaders, DodgeRunner, GravityRunner, Pong, Hextris,
StackTower.

### Phase 3 / 4 — New games (partial)

Shipped / catalogued:
- Color Blocks, Ball Run 3D, Flow Connect, Tunnel Rush 3D, Whack-a-Glitch

Still todo for 42 total: Shilla trio (Word Bomb, Most Likely To, Charades),
Champions (Connect 4, Air Hockey, Penalty 3D, Typing Race), Chaos Glitch Maze 3D.

Arcade world is at the 7-game target. Catalog currently ~34 playable entries.

### Phase 5 — Polish

`GamesPage` filters by world and unlock state, lock badges in world sections,
bundle size check, testing on real devices. Backend progress sync if wanted.

## Final distribution

| World | Existing | Surfaced from hidden | New | Total |
| --- | --- | --- | --- | --- |
| Arcade | Hextris, Invaders, Snake, Brick | Flappy | Color Blocks, Ball Run 3D | 7 |
| Reflex | Rhythm, Dodge, Aim, Reverse | PerfectSecond, Simon | Tunnel Rush 3D | 7 |
| IQ Lab | 2048, Sokoban, Laser, Mines | Sudoku, Scramble | Flow Connect | 7 |
| Shilla | Draw, Trivia, WYR, Impostor | — | Word Bomb, Most Likely To, Charades | 7 |
| Champions | Stack, Math, Pong | — | Connect 4, Air Hockey, Penalty 3D, Typing Race | 7 |
| Chaos | Micro, Roulette, Gravity | DontPress, PixelRunner | Glitch Maze 3D, Whack-a-Glitch | 7 |

`SpaceShooterGame` stays unlisted and becomes an extra level pack for
`g-invaders` rather than a separate catalog entry.

## Requests to the Code Quality agent

Keep `useEventCallback` — the kit uses it for handlers inside long-lived loops.

While sweeping `frontend/src/components/games/`, please preserve behaviour only.
Do not delete the touch and keyboard handlers as unused, and do not "simplify"
game loops; Phase 2 rewrites them deliberately.

Tell us when the sweep on those 22 files is committed so ownership can transfer
and Phase 2 can start.
