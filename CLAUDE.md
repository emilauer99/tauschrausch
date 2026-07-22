# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Tauschrausch** — a mobile PWA for festivals: a marketplace of search/offer listings ("Suche"/"Biete"), 1:1 chat, game lobbies ("Spiele-Lobbys") and shared-act meetups ("Act-Treffen") with a line-up, a site map with pins, onboarding/auth, and a profile. Frontend-only with in-memory mock data; a whitelist persists to `localStorage`. No backend. UI language is German.

The app was originally hand-ported from a Claude Design prototype and then **refactored to an idiomatic Vue 3 architecture** (typed store, feature composables, scoped-CSS components, props-down/events-up). `reference/design-source.dc.html` is the visual/behavioral source of truth; `reference/prototype-bundle.html` is its compiled export.

## Commands

```bash
npm install        # dependencies
npm run dev        # dev server → http://localhost:5173
npm run build      # production build → dist/ (also emits PWA service worker)
npm run preview    # serve the built dist/
```

`vue-best-practices` skill (installed under `.claude/skills/`) is the standing style guide — load it for any Vue work. There is no test/lint/typecheck script: `npm run build` (esbuild via Vite) does **not** typecheck (`tsconfig.json` has `strict: false`). Verify changes by building and driving the app in a browser. `playwright` is a devDependency used for that.

Demo login: username `Lenerl`, password `festival` (seeded in `freshState()` in `src/data/seed.ts`).

## Architecture

Data flows **store → props down → events up**. Presentational components never read the global store; screens (route surfaces) do the wiring.

- **`src/store/app.ts`** — the single Pinia state hub. One `reactive` state object (typed as `AppState` in `src/data/seed.ts`); the only mutation path is the internal `setState(patch, cb?)` helper, which `Object.assign`s and then `persist()`s. Exposes: all state (via `toRefs`), **typed data getters** (view-models — plain data/labels/icon-class-strings, **no styling**, e.g. `feedCards`, `lobbyList`, `activeItem`, `planPins`), and **explicit actions** (`openItem`, `joinLobby`, `setTypeFilter`, …). Countdowns/reminders recompute from `state.tick`.
- **`src/types.ts`** — domain model (`Item`, `Lobby`, `Festival`, `Marker`, `Screen`, …). **`src/data/seed.ts`** — constants (`CAT`, `AV`, `GAMES`, `PLAN_ZONES`, `LINEUPS`, …) plus `AppState` and `freshState()`. **`src/utils/format.ts`** — pure helpers (`initials`, `priceInfo`, `countdownShort/Long`).
- **`src/composables/`** — reusable behavior: `useDragScroll` (horizontal chip rails), `useReminderTicker` (1-second tick), `useMapGestures` (pan/zoom/place, via a `useTemplateRef` to the plan layer).
- **`src/App.vue`** — thin shell: the phone frame (sets `data-theme` from `store.themeName`), `StatusBar`, `ReminderBanner`, a keyed `<component :is>` screen router driven by `store.screen`, `BottomNav`, and `OverlaysHost`.
- **`src/views/*Screen.vue`** — one route surface per screen; they compose components and wire events to store actions. `AuthScreens.vue` bundles register/login/reset; `LobbyDetailScreen.vue` serves both `lobbyDetail` and `actDetail` (branches on `activeLobby.isAct`).
- **`src/components/`** — `ui/` primitives (`AppButton`, `IconButton`, `SegmentedControl`, `ChipRail`, `TileButton`, `TextField`, `BottomSheet`, `AppModal`, `AvatarStack`, `MemberGrid`, `MarkerPin`, `PlanCanvas`, `ScreenHeader`, `FormSection`), feature components (`feed/`, `treffen/`, `chat/`, `map/`), and `OverlaysHost.vue` (all sheets/modals/toast). Every component takes typed props and `emit`s events.

**Routing is a `store.screen` string, not vue-router.** Navigation = actions that call `setState({ screen })` plus a `stack` for back-nav (`goBack`). `BottomNav` shows only on top-level screens (`isTopLevel`: feed/lobbies/profile); sub-screens navigate via their own back/close buttons.

**Styling: scoped CSS + CSS custom properties.** `src/assets/main.css` defines the reset, keyframes, and the theme tokens under `.frame[data-theme="dark|light"]` (`--bg/--card/--biete/--suche/--games/--ink/…`). Components use `<style scoped>` with class selectors referencing those `var(--…)`. Per-item accent colors are passed in as a CSS variable, e.g. `:style="{ '--accent': card.accentVar }"`, and read as `var(--accent)` in scoped CSS. Keep new styling this way; do not reintroduce inline style strings.

**Persistence:** `PERSIST_FIELDS` in `app.ts` is the `localStorage` whitelist (`tauschrausch:v1`). Transient UI (open sheets, drafts, `tick`, `firedReminders`) is excluded, so reminders re-evaluate on reload. `loadState()` merges saved fields over defaults and picks the initial screen (feed if session + festival exist, else welcome).

## Gotchas

- **Design sync is now manual.** Because styling moved from prototype-mirroring inline styles to scoped CSS, a `reference/design-source.dc.html` diff no longer maps 1:1 onto the code. Pulling a new design change means re-reading the changed section and translating it into the component + store structure by hand (this tradeoff was chosen deliberately over sync-friendliness).
- **No `Teleport` for overlays.** `OverlaysHost` already lives directly inside `.frame` (a sibling of the scrolling body), so `position:absolute; inset:0` sheets/modals cover the frame without Teleport. Teleport here caused `emitsOptions`/`nextSibling` null errors **only in production builds** — always verify overlays against `npm run build` + `preview`, not just `dev`.
- **Phosphor icons pollute accessible names.** Icons render via CSS `::before`, and Chromium includes that glyph in a button's accessible name, so exact/anchored name matches (`/^Einloggen$/`) fail in Playwright. Use substring matches; select icon-only buttons via `button:has(i.ph-arrow-left)`.
- Vue re-serializes `:style` string bindings (`width:52px` → `width: 52px`), so CSS-attribute substring selectors on inline styles are unreliable — prefer classes or role/text selectors.
