# Tauschrausch

Hyperlokale **Tausch- und Treffen-App für Festivals** — eine mobile Progressive Web App (PWA).
Besucher landen ohne Download über einen Link auf dem Festivalgelände und können in Sekunden
Dinge **suchen/bieten**, sich für **Spiele-Lobbys** (Flunkyball, Beerpong …) oder gemeinsame
**Act-Besuche** zusammentun — alles auf die Realität eines Festivals zugeschnitten
(schlechtes Netz, grelle Sonne, wenig Akku).

Diese Implementierung setzt den Klick-Prototyp aus Claude Design als echte, wartbare
**Vue 3 + Vite** App um. Alle Daten sind Mock-Daten im Speicher; ein Teil des Zustands
(Login, gewähltes Festival, Theme, erstellte Inserate, beigetretene Lobbys) wird in
`localStorage` gespeichert und übersteht ein Reload. Kein Backend.

## Tech-Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 5** + **vite-plugin-pwa** (Service Worker, Web-App-Manifest, Offline-Caching der Fonts/Icons)
- **Pinia** — zentraler Store (`src/store/app.ts`) mit dem gesamten Zustand, den Actions und
  einem großen abgeleiteten `vals`-Computed (dem Port der `renderVals`-Logik des Prototyps)
- **TypeScript**
- Fonts: Space Grotesk + Inter · Icons: [Phosphor Icons](https://phosphoricons.com/) (per CDN)

## Befehle

```bash
npm install        # Abhängigkeiten installieren
npm run dev        # Dev-Server (http://localhost:5173)
npm run build      # Produktions-Build nach dist/
npm run preview    # gebauten Build lokal servieren
```

## Projektstruktur

```
index.html                 Vite-Einstiegspunkt
vite.config.ts             Vite- + PWA-Konfiguration
public/                    Icons (favicon.svg, icon.svg, icon-maskable.svg)
src/
  main.ts                  App-Bootstrap (Vue + Pinia)
  style.css                Globales CSS (Reset, Keyframes, versteckte Scrollbars)
  App.vue                  Phone-Shell: Statusleiste, Banner, Bottom-Nav, mountet alle Views + Overlays
  store/app.ts             Pinia-Store — Zustand, Actions, abgeleitete Werte (vals)
  views/                   Bildschirme (Onboarding, Feed, Create, Detail, Chat, Treffen,
                           Lobby/Act erstellen & Detail, Line-up, Karte, Profil)
  components/Overlays.vue  Alle Sheets, Toasts und Modals
reference/                 Original-Design zur Referenz
  design-source.dc.html    Quell-Prototyp aus Claude Design (Vorlage dieser Umsetzung)
  prototype-bundle.html    Exportierter, eigenständiger Prototyp-Build
```

## Bildschirme & Flows

- **Onboarding** — Willkommen → Registrieren/Einloggen (Demo-Konto: `Lenerl` / `festival`) →
  Festival wählen (QR-Vorschlag oder manuell) → Camping-Zone
- **Feed** — Marktplatz aus Suche/Biete-Inseraten; Filter nach Typ, Kategorie und Zone;
  drei Layout-Varianten (Poster / Kompakt / Foto); Detailansicht + 1:1-Chat
- **Inserat erstellen** — Suche/Biete, Kategorie, Titel, Preis (VB/Tausch/Gratis),
  optionaler Standort am Geländeplan
- **Treffen** — Spiele-Lobbys & Act-Treffen entdecken, beitreten, Gruppenchat, eigene eröffnen;
  Line-up mit „Wer geht mit?"-Gruppen; Erinnerungen 30/5 Min vor Start
- **Karte** — Geländeplan mit Zonen und Pins für Inserate/Lobbys; Zoom & Pan
- **Profil** — Score/Deals, Sonnen-Modus (Light/Dark), Erinnerungen, Festival wechseln, ausloggen

## Hinweis

Reiner Frontend-Prototyp mit Mock-Daten — bewusst ohne Zahlungsabwicklung, ohne echtes Backend.
Ein späterer Ausbau (z. B. Supabase für Auth, Realtime-Chat und Persistenz) ist im Konzeptpapier
skizziert.
