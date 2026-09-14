# Naghanish — Agent Working Agreement

Arabic-first gaming platform. React 19 + Vite + Tailwind frontend in `frontend/`,
FastAPI + SQLAlchemy backend in `backend/`.

Read `docs/game-platform-plan.md` before touching anything under
`frontend/src/components/games/` or `frontend/src/components/game-kit/`. That
document is the agreed roadmap; do not redesign around it.

## Two agents are working in this repo at the same time

Editing a file that the other agent has open loses work silently. Stay inside
your lane, and if you genuinely must cross into someone else's file, re-read it
immediately before the edit so you are patching current content.

| Area | Owner |
| --- | --- |
| `frontend/src/components/game-kit/**` | Game Platform |
| `frontend/src/data/games.data.ts`, `frontend/src/data/games.registry.ts` | Game Platform |
| `frontend/src/pages/GameDetails/GameDetailsPage.tsx` | Game Platform |
| **New** game engines in `frontend/src/components/games/` | Game Platform |
| **Existing** game engines in `frontend/src/components/games/` | Game Platform (lint sweep landed in `d9723c3`) |
| `frontend/src/constants/modes.ts` | Code Quality (already extracted) |
| `frontend/src/hooks/**` | Code Quality |
| `frontend/src/worlds/**`, all other `frontend/src/pages/**` | Code Quality |
| `backend/**` | Code Quality |
| `frontend/package.json` | Game Platform for `three`, Code Quality otherwise |
| `tsconfig.json`, `vite.config.ts`, `eslint.config.js` | Code Quality |

The lint sweep on existing engines is **done and committed** (`d9723c3`). Game Platform
owns those files for Phase 2 (levels, `useGameLoop`, responsive stages). Code Quality
stays out of `components/games/`, `game-kit/`, `games.data.ts`, `games.registry.ts`,
and `GameDetailsPage.tsx` unless fixing a one-line compile blocker by request.

## What Game Platform already shipped (Phase 0 + 1)

- `frontend/src/components/game-kit/**` — GameShell, fullscreen, game loop,
  responsive stage, progress, mobile controls
- `frontend/src/data/games.registry.ts` — lazy engine map
- Catalog expanded to 29 games (7 previously hidden engines now listed)
- `GameDetailsPage` rewritten to use the registry + GameShell (no static imports)

## Rules that apply to both agents

Do not add a path alias for the game kit. It lives under `src/components/` so
the existing `@components/*` alias already resolves it, which keeps
`tsconfig.json` and `vite.config.ts` conflict-free.

Never static-import a game engine into a page or another engine. Every engine is
reached through the lazy registry in `frontend/src/data/games.registry.ts`.
`GameDetailsPage` used to static-import all 30 engines into one chunk; that is
the regression to avoid.

Game chrome — fullscreen, pause, HUD, level select, mobile control clusters —
belongs to `GameShell` alone. An engine that re-implements any of it is a bug,
not a feature.

Every player-facing string ships in Arabic and English, selected by the `isRtl`
prop. Arabic is the default and the layout is RTL.
