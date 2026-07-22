# Tauschrausch — Monorepo

Hyperlokale **Tausch- und Treffen-Plattform für Festivals**. Das Repo bündelt zwei
eigenständige Vue-3-Apps, die aus Klick-Prototypen aus Claude Design als echte,
wartbare Anwendungen umgesetzt wurden. Beide sind reine Frontends mit Mock-Daten,
kein gemeinsames Backend.

## Apps

| App | Ordner | Zweck | Dev-Port |
|-----|--------|-------|----------|
| **Festival-App** | [`apps/festival-app`](apps/festival-app) | Besucher-PWA: Suche/Biete-Marktplatz, Chat, Spiele-Lobbys & Act-Treffen, Line-up, Geländekarte, Onboarding, Profil. Mobil, mit `localStorage`-Persistenz. | `5173` |
| **Festival-Admin** | [`apps/festival-admin`](apps/festival-admin) | Moderations-/Verwaltungs-Backend: Meldungen, Inserate, Lobbys, Nutzer, Festivals (Mandanten), Zonen + Geländeplan, Line-up (Bühnen/Acts/Timetable, CSV-Import). Desktop, ohne Persistenz. | `5174` |

Jede App ist eigenständig (eigenes `package.json`, `node_modules`, `vite.config.ts`).
Es gibt **keinen** Workspace-Root mit gemeinsamen Dependencies — jede App wird für sich
installiert und gebaut.

## Loslegen

```bash
# Besucher-App
cd apps/festival-app && npm install && npm run dev      # → http://localhost:5173

# Admin-Backend
cd apps/festival-admin && npm install && npm run dev    # → http://localhost:5174
```

Demo-Logins: Festival-App `Lenerl` / `festival` · Admin `admin` / `admin`.

## Aufbau

```
apps/
  festival-app/     Besucher-PWA (Vue 3 + Vite PWA, idiomatisch refaktoriert: typed Store,
                    Composables, scoped CSS). Details in apps/festival-app/CLAUDE.md
  festival-admin/   Admin-Backend (Vue 3 + Vite, Inline-Style-Port des Designs, ein Pinia-Store).
                    Details in apps/festival-admin/CLAUDE.md
.claude/            vue-best-practices Skill (Style-Guide für Vue-Arbeit)
```

Beide Apps folgen demselben Grundmuster: **ein Pinia-Store** hält den gesamten Zustand, die
Actions und ein großes abgeleitetes `vals`/Getter-Objekt (der Port der `renderVals`-Logik des
jeweiligen Prototyps); die View-Komponenten sind fast reine Templates. Die architektonischen
Details und Stolpersteine je App stehen in der jeweiligen `CLAUDE.md`.
