# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Tauschrausch Admin** — the moderation/management backend for the Tauschrausch festival app (the visitor-facing PWA lives in `../festival-app`). A desktop-first Vue 3 dashboard: admin login, a dark sidebar with 8 screens (Dashboard, Meldungen/reports, Inserate/listings, Spiele-Lobbys, Nutzer/users, Festivals, Zonen, Line-up), report & user moderation drawers, a festival switcher (multi-tenant), and CRUD for festivals, zones + site plan, stages, and acts — including a 3-step CSV line-up import and act shift/cancel flows. Frontend-only with in-memory mock data. **No persistence** (state resets on reload, by design — it's a demo backend). UI language is German.

This is a hand-port of a Claude Design prototype (`Festival-Admin.dc.html`) into real Vue.

## Commands

```bash
npm install        # dependencies
npm run dev        # dev server → http://localhost:5174
npm run build      # production build → dist/
npm run preview    # serve the built dist/ (defaults to :4173)
```

No test suite, linter, or typecheck script. `npm run build` (esbuild via Vite) does **not** typecheck — `tsconfig.json` has `strict: false` and the store is intentionally loosely typed (`any`). To sanity-check a change, build and drive it in the browser.

Demo login: username `admin`, password `admin` (any non-empty pair is accepted — `submitAdminLogin` only checks for emptiness).

## Architecture

**Everything routes through one Pinia store: `src/store/admin.ts`.** This is the load-bearing file — a near-verbatim port of the prototype's single `Component` class:

- `state` — one big `reactive()` object (screen, current view/sub-tab, selected festival, all mock data, filter state, open forms/drawers/dialogs, toast). `freshState()` defines the seed data. There is deliberately **no `localStorage` persistence** and no whitelist.
- **`setState(patch, cb?)`** — the only mutation path. Accepts an object or an updater `(state) => partial`, `Object.assign`s it, then runs the optional callback. Ported handlers use the updater form heavily; preserve this pattern rather than mutating `state` directly.
- **`vals`** — a single large `computed` (the port of the prototype's `renderVals()`). It returns a flat object of ~everything the templates need: screen/sub-tab boolean flags (`isDashboard`, `isLineupTimetable`, …), pre-decorated lists (`reportRows`, `listingRows`, `festivalCards`, `zoneRows`, `actRows`, timetable columns, …), pre-built inline-style strings, and event handlers (closures that call `setState`/actions). Components read state and dispatch actions **exclusively** through `app.vals.*`. When adding UI, add the derived values/handlers here, not ad hoc in components.
- Constants (`US`, `FS`, `RT`, `CAT`, `AST`) — status/type → style-map lookups — and `props` (`sidebarStyle`, `tableZebra`) live at module top. `props` mirrors the prototype's design-time knobs; there is no UI to change them.

**Routing is a `state.screen` + `state.view` string, not vue-router.** `App.vue` is the shell: on `screen === 'login'` it shows `<LoginScreen>`; on `'app'` it lays out `<Sidebar>` + `<Topbar>` + a `<main>` that renders exactly one view component via `v-if="app.vals.isX"`. Line-up has three sub-tabs (`isLineupActs`/`isLineupStages`/`isLineupTimetable`) gated the same way. Navigation = `setView(k)` / `selectFestival(id)` etc., all `setState`.

**Views** (`src/views/*View.vue`) are one component per screen, almost pure template — logic stays in the store. **`components/Overlays.vue`** holds every drawer, modal, form, and the toast; it renders as a sibling inside the app root so its `position:absolute;inset:0` overlays cover the frame. `Sidebar`/`Topbar`/`LoginScreen` are the remaining shell pieces.

**Styling** is inline styles + a small `:root` token set in `src/style.css` (`--bg/--panel/--ink/--sidebar/--lime/--amber/--magenta/--danger/…`). This matches the prototype's own structure, so the store builds most style strings (chips, badges, rows, timetable blocks) and templates bind them with `:style`. Keep new styling as inline `style`/`:style` strings using these vars. Fonts (Space Grotesk, Inter) and Phosphor icons load from CDN via `index.html`. Unlike `../festival-app` (which was refactored to scoped CSS), this app keeps the inline-style port for fidelity to the design — **design sync stays closer to 1:1 here**.

**Overlay convention:** overlays gate on a `v-if` from `vals` (e.g. `drawerOpen`, `confirmOpen`, `csvOpen`). The backdrop `@click` closes; the inner panel uses `@click.stop` to swallow the click. No `<Teleport>` — overlays already live at the app-root level.

## Key derived logic in `vals` (worth knowing before editing)

- **Multi-tenant filtering:** almost every list is filtered by `state.festivalId` first (`reportsAll`, `usersF`, `itemsF`, `lobbiesF`, per-festival `zones`/`stages`/`acts`/`plans`/`lineupDays`). The festival switcher just sets `festivalId`.
- **Confirm dialog** is a generic dispatcher: `ask({action, payload, …})` opens it; `runConfirm()` switches on `action` to the matching mutator (`delListing`, `banUser`, `removeZone`, `reportDelContent`, …).
- **CSV import** (`csvToMap`/`csvGoPreview`/`csvConfirm`) parses `;`- or `,`-delimited text, auto-maps headers by keyword, and in `vals` computes per-row `error`/`dup` status (dedup vs already-imported acts and vs earlier rows). `csvConfirm` reads the parsed rows cached in a store-scope `csvParsedForConfirm` (set as a side effect of the `vals` computer, mirroring the prototype's `this._csvParsed`) and creates missing stages/days on import.
- **Timetable** pixel-positions act blocks: `minOf()` converts `HH:MM` to minutes (hours < 8 wrap past midnight), the day's min/max span sets the height, and each block gets `top`/`height` at `1.3px` per minute, colored by status.
- **Zone reorder** is native HTML5 drag: `dragStart` stores the index in `state.dragZone`, `dragOver` calls `reorderZone(i)` to splice live.

## Gotchas

- Phosphor icons render via CSS `::before`, and Chromium includes that glyph in a button's accessible name. Prefer substring/text selectors over anchored name matches in Playwright.
- The store's `vals` computed has an intentional side effect (writing `csvParsedForConfirm`). It's safe because `vals` re-runs before any handler reads it, but don't rely on that pattern for new code — pass data through the action instead.
- `minOf` treats times before `08:00` as "after midnight" (adds 24h) so late-night acts sort/position correctly. Keep that in mind if you add daytime festivals.
