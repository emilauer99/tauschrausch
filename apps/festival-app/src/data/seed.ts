/* Static reference data + the mock seed state. */

import type {
  Account, CatKey, Category, Festival, GamePick, Item, Lineup, Lobby, LobbyMessage,
} from '@/types'

export const CAT: Record<CatKey, Category> = {
  getraenke: { label: 'Getränke', icon: 'ph-fill ph-beer-stein' },
  camping: { label: 'Camping', icon: 'ph-fill ph-tent' },
  hygiene: { label: 'Hygiene', icon: 'ph-fill ph-first-aid-kit' },
  schlafen: { label: 'Schlafen', icon: 'ph-fill ph-moon-stars' },
  services: { label: 'Services', icon: 'ph-fill ph-wrench' },
  mobil: { label: 'Mobilität', icon: 'ph-fill ph-car-profile' },
  sonst: { label: 'Sonstiges', icon: 'ph-fill ph-package' },
}
export const CAT_KEYS = Object.keys(CAT) as CatKey[]

/** Avatar palette (brand accents), indexed per member. */
export const AV = ['#C7FF3C', '#FF3CAC', '#FFB020', '#5CC8FF', '#B78CFF']

export const GAMES: GamePick[] = [
  { label: 'Flunkyball', icon: 'ph-fill ph-beer-bottle' },
  { label: 'Beerpong', icon: 'ph-fill ph-trophy' },
  { label: 'Bierpong', icon: 'ph-fill ph-beer-stein' },
  { label: 'Werwolf', icon: 'ph-fill ph-moon-stars' },
]

export const NICKS = [
  'Zeltklaus', 'Bierbaron', 'Glitzerelfe', 'Matschprinz', 'Dosenkönig', 'Sonnwendkind',
  'Wieselflink', 'Campingqueen', 'Festivalfuchs', 'Dosenpirat', 'Wiesenhexe',
  'Nachtschwärmer', 'Glitzerbär', 'Schlammkönig',
]

export const LINEUPS: Record<string, Lineup> = {
  summerbeats: {
    days: ['Fr 24.', 'Sa 25.', 'So 26.'],
    acts: [
      { id: 'sb-a', day: 0, time: '18:00', stage: 'Tent Stage', act: 'Auftakt Brass', min: 2 },
      { id: 'sb-indie', day: 0, time: '19:00', stage: 'Tent Stage', act: 'Elektro Kollektiv', min: 3 },
      { id: 'sb-b', day: 0, time: '20:30', stage: 'Main Stage', act: 'Rosa Rauschen', min: 14 },
      { id: 'sb-headliner', day: 0, time: '21:30', stage: 'Main Stage', act: 'Nachtsirene', min: 26 },
      { id: 'sb-dj', day: 0, time: '23:45', stage: 'Forest Floor', act: 'DJ Wildfang', min: 150 },
      { id: 'sb-c', day: 1, time: '17:00', stage: 'Tent Stage', act: 'Die Wellenbrecher', min: 600 },
      { id: 'sb-d', day: 1, time: '20:00', stage: 'Main Stage', act: 'Goldener Käfig', min: 700 },
      { id: 'sb-e', day: 1, time: '22:00', stage: 'Main Stage', act: 'Velvet Sturm', min: 800 },
      { id: 'sb-f', day: 2, time: '16:00', stage: 'Forest Floor', act: 'Sonntagskind', min: 1500 },
      { id: 'sb-g', day: 2, time: '19:30', stage: 'Main Stage', act: 'Abschluss All-Stars', min: 1600 },
    ],
  },
  bergklang: {
    days: ['Do', 'Fr', 'Sa'],
    acts: [
      { id: 'bk-a', day: 0, time: '19:00', stage: 'Talbühne', act: 'Alpenglühen', min: 120 },
      { id: 'bk-b', day: 0, time: '21:00', stage: 'Gipfelbühne', act: 'Höhenrausch', min: 240 },
      { id: 'bk-c', day: 1, time: '20:00', stage: 'Gipfelbühne', act: 'Firn', min: 900 },
    ],
  },
}

export const STAGE_POS: Record<string, Record<string, Marker>> = {
  summerbeats: {
    'Main Stage': { x: 50, y: 11 },
    'Tent Stage': { x: 25, y: 55 },
    'Forest Floor': { x: 80, y: 74 },
  },
}
type Marker = { x: number; y: number }

export const ZONE_DESCS: Record<string, string> = {
  'Camp A': 'Nordwiese', 'Camp B': 'am Hauptweg', 'Camp C': 'beim See', 'Camp D': 'Busreihe',
  Wohnwagen: 'für Camper', 'Green Camp': 'ruhig & grün',
}

/** Feed zone filter options (top-level camps only). */
export const FEED_ZONES = ['alle', 'Camp A', 'Camp B', 'Camp C', 'Camp D'] as const

export type PlanZoneRole = 'stage' | 'camp' | 'food' | 'info' | 'water'
export interface PlanZoneDef { label: string; x: number; y: number; w: number; h: number; role: PlanZoneRole }
export const PLAN_ZONES: PlanZoneDef[] = [
  { label: 'MAIN STAGE', x: 33, y: 5, w: 34, h: 12, role: 'stage' },
  { label: 'CAMP A', x: 5, y: 23, w: 23, h: 18, role: 'camp' },
  { label: 'CAMP B', x: 37, y: 24, w: 26, h: 20, role: 'camp' },
  { label: 'CAMP C', x: 72, y: 22, w: 23, h: 22, role: 'camp' },
  { label: 'CAMP D', x: 6, y: 50, w: 28, h: 20, role: 'camp' },
  { label: 'GREEN', x: 40, y: 52, w: 22, h: 17, role: 'camp' },
  { label: 'VANS', x: 71, y: 50, w: 24, h: 19, role: 'camp' },
  { label: 'SEE', x: 74, y: 73, w: 21, h: 20, role: 'water' },
  { label: 'FOOD & MARKT', x: 37, y: 75, w: 33, h: 12, role: 'food' },
  { label: 'INFO', x: 6, y: 75, w: 27, h: 13, role: 'info' },
]

export interface AppState {
  screen: import('@/types').Screen
  stack: import('@/types').Screen[]
  dark: boolean
  user: import('@/types').User | null
  isGuest: boolean
  authUser: string; authPass: string; authPass2: string; authEmail: string; authError: string
  resetUser: string; resetDone: string | null; authGateOpen: boolean; logoutOpen: boolean
  accounts: Account[]
  festival: Festival | null
  qrFestival: string
  festivalSearch: string
  nickname: string; zone: string; treffpunkt: string; viewZone: string
  feedVariant: import('@/types').FeedVariant; feedTouched: boolean
  typeFilter: string; catFilter: string
  zoneSheet: boolean; filterSheet: boolean; treffenSheet: boolean; toast: string | null
  cType: import('@/types').ListingType; cCat: CatKey | ''; cTitle: string
  cPrice: import('@/types').PriceKind; cPriceVal: string; cPhoto: boolean
  activeItemId: number; chatMsgs: import('@/types').ChatMessage[] | null; chatDraft: string
  editItemId: number | null; editLobbyId: number | null; confirmDelete: { kind: 'item' | 'lobby'; id: number } | null
  lobbyGame: string; lobbySpot: string; lobbyTime: string; lobbySlots: number
  activeLobbyId: number; joined: Record<number, boolean>; chatSeen: Record<number, number>
  reportOpen: boolean; reportText: string; leaveOpen: boolean; leaveText: string; lobbyDraft: string
  tick: number; gameTab: 'entdecken' | 'meine'
  remindersOptIn: boolean | null; optInOpen: boolean; bellOpen: boolean
  reminderModal: import('@/types').ReminderModal | null
  firedReminders: Record<string, boolean>; snoozeUntil: Record<number, number>
  treffenFilter: string; actFilter: string; actFilterQuery: string; gameFilter: string; lineupDay: number
  actQuery: string; actPick: import('@/types').LineupAct | null
  actStageFree: string; actTimeFree: string; actSpot: string; actNote: string
  aMarker: Marker | null; actSheet: string | null; createChooser: boolean
  actRulesSeen: boolean; treffenReport: boolean
  mapMode: 'place' | 'overview' | 'view' | null; mapCtx: 'listing' | 'lobby' | 'act' | null
  draftMarker: Marker | null; cMarker: Marker | null; lMarker: Marker | null
  mapZoom: number; mapPanX: number; mapPanY: number; mapFilter: string
  mapSheet: { kind: 'item' | 'lobby'; id: number } | null
  viewMarker: import('@/types').ViewMarker | null
  plans: Record<string, { active: boolean } | null>
  lobbyChats: Record<number, LobbyMessage[]>
  festivals: Festival[]
  items: Item[]
  lobbies: Lobby[]
}

export function freshState(): AppState {
  return {
    screen: 'welcome', stack: [], dark: true,
    user: null, isGuest: false,
    authUser: '', authPass: '', authPass2: '', authEmail: '', authError: '',
    resetUser: '', resetDone: null, authGateOpen: false, logoutOpen: false,
    accounts: [
      { username: 'Lenerl', password: 'festival', email: 'lena@example.com' },
      { username: 'Grillmeister58', password: 'grillen', email: '' },
    ],
    festival: null, qrFestival: 'SummerBeats 2026', festivalSearch: '',
    nickname: '', zone: 'Camp C', treffpunkt: '', viewZone: 'alle',
    feedVariant: 'poster', feedTouched: false, typeFilter: 'alle', catFilter: 'alle',
    zoneSheet: false, filterSheet: false, treffenSheet: false, toast: null,
    cType: 'biete', cCat: '', cTitle: '', cPrice: 'gratis', cPriceVal: '', cPhoto: false,
    activeItemId: 1, chatMsgs: null, chatDraft: '',
    editItemId: null, editLobbyId: null, confirmDelete: null,
    lobbyGame: 'Flunkyball', lobbySpot: '', lobbyTime: '', lobbySlots: 6,
    activeLobbyId: 1, joined: {}, chatSeen: {},
    reportOpen: false, reportText: '', leaveOpen: false, leaveText: '', lobbyDraft: '',
    tick: 0, gameTab: 'entdecken', remindersOptIn: null, optInOpen: false, bellOpen: false,
    reminderModal: null, firedReminders: {}, snoozeUntil: {},
    treffenFilter: 'alle', actFilter: '', actFilterQuery: '', gameFilter: 'alle', lineupDay: 0, actQuery: '', actPick: null,
    actStageFree: '', actTimeFree: '', actSpot: '', actNote: '',
    aMarker: null, actSheet: null, createChooser: false, actRulesSeen: false, treffenReport: false,
    mapMode: null, mapCtx: null, draftMarker: null, cMarker: null, lMarker: null,
    mapZoom: 1, mapPanX: 0, mapPanY: 0, mapFilter: 'alle', mapSheet: null, viewMarker: null,
    plans: { summerbeats: { active: true }, donauwave: null, bergklang: { active: true }, waldrave: { active: true }, nachtstrom: null },
    lobbyChats: {
      1: [{ who: 'CrewC', text: 'Servus! Wer bringt den Ball mit?' }, { who: 'Pia', text: 'Ich hab einen dabei 👍' }],
      2: [{ who: 'PongKings', text: 'Becher stehen bereit. Bringt Bier mit! 🍺' }],
      3: [{ who: 'Sunnyboy', text: 'Lagerfeuer brennt schon 🔥' }],
      4: [{ who: 'Mondkind', text: 'Brauchen noch Leute für die große Runde.' }],
    },
    festivals: [
      { id: 'summerbeats', name: 'SummerBeats 2026', place: 'Wien · Donauinsel', date: '24.–26. Juli', status: 'live', zones: ['Camp A', 'Camp B', 'Camp C', 'Camp D', 'Wohnwagen', 'Green Camp'] },
      { id: 'donauwave', name: 'Donauwave Open Air', place: 'Linz · Urfahr', date: '7.–9. August', status: 'soon', zones: ['Nord', 'Süd', 'Ost', 'West'] },
      { id: 'bergklang', name: 'Bergklang Festival', place: 'Innsbruck · Bergisel', date: '21.–23. August', status: 'soon', zones: ['Tal', 'Mitte', 'Gipfel', 'Wald'] },
      { id: 'waldrave', name: 'Waldrave am See', place: 'Klagenfurt · Wörthersee', date: '4.–6. September', status: 'soon', zones: ['See', 'Wald', 'Wiese', 'Busreihe'] },
      { id: 'nachtstrom', name: 'Nachtstrom', place: 'Graz · Schlossberg', date: '12.–14. Juni', status: 'ended', zones: ['A', 'B', 'C'] },
    ],
    items: [
      { id: 1, type: 'biete', cat: 'getraenke', title: 'Kaltes Bier · halbe Palette', zone: 'Camp B · Reihe 4', time: 'vor 9 Min', priceKind: 'tausch', desc: 'Bleibt sonst nur stehen. Tausch gegen Eis, Snacks oder einfach abholen — Hauptsache es trinkt jemand.', photo: 'Bierkasten', seller: 'Grillmeister58', rating: 96, deals: 34, mx: 50, my: 33 },
      { id: 2, type: 'suche', cat: 'camping', title: 'Luftpumpe — dringend!', zone: 'Camp C · Reihe 12', time: 'vor 2 Min', priceKind: 'verhandlung', price: '2 €', desc: 'Matratze ist über Nacht platt geworden. Borg sie mir kurz oder ich zahle 2 €. Blaue Piratenflagge.', photo: null, seller: 'Lenerl', rating: 100, deals: 3, mx: 81, my: 31 },
      { id: 3, type: 'biete', cat: 'services', title: 'Zeltaufbau in 10 Minuten', zone: 'Camp A · Infozelt', time: 'vor 20 Min', priceKind: 'verhandlung', price: '5 €', desc: 'Ich bau dir dein Zelt auf, während du das erste Bier aufmachst. Hab schon 30 heute gemacht.', photo: null, seller: 'ZeltProfi', rating: 92, deals: 18, mx: 16, my: 85 },
      { id: 4, type: 'suche', cat: 'hygiene', title: 'Sonnencreme LSF 50', zone: 'Camp C · Reihe 9', time: 'vor 15 Min', priceKind: 'verhandlung', price: '3 €', desc: 'Meine liegt daheim im Bad. Zahle 3 € oder tausche gegen Ohrstöpsel.', photo: null, seller: 'Sunnyboy', rating: 88, deals: 6 },
      { id: 5, type: 'biete', cat: 'camping', title: 'Ladestrom am Pavillon', zone: 'Camp B · Reihe 4', time: 'vor 1 Std', priceKind: 'gratis', desc: 'Powerbank leer? Steckdosenleiste am blauen Pavillon. Komm einfach vorbei, kostet nix.', photo: null, seller: 'Grillmeister58', rating: 96, deals: 34, mx: 47, my: 40 },
      { id: 6, type: 'biete', cat: 'schlafen', title: 'Schlafplatz im Bus frei', zone: 'Camp D · Busreihe', time: 'vor 30 Min', priceKind: 'verhandlung', price: '15 €/Nacht', desc: 'Ein Platz im ausgebauten Bus. Trocken, warm, mit Vorhang. Pro Nacht, gern für die letzte Nacht.', photo: 'Bus innen', seller: 'VanLife', rating: 99, deals: 21, mx: 20, my: 62 },
      { id: 7, type: 'suche', cat: 'getraenke', title: 'Eiswürfel — viele!', zone: 'Camp A · Reihe 2', time: 'vor 5 Min', priceKind: 'tausch', desc: 'Kühlbox wird warm. Tausche eine große Ladung Eis gegen Bier oder einen Spritz.', photo: null, seller: 'IceIce', rating: 90, deals: 4 },
      { id: 8, type: 'biete', cat: 'mobil', title: 'Mitfahrt Abreise So → Wien', zone: 'Camp C · Parkplatz P3', time: 'vor 45 Min', priceKind: 'verhandlung', price: 'Spritgeld', desc: '2 Plätze frei, Sonntag ca. 12 Uhr. Nur Handgepäck plus kleines Zelt, sonst passt es nicht.', photo: null, seller: 'Roadrunner', rating: 94, deals: 11 },
    ],
    lobbies: [
      { id: 1, game: 'Flunkyball', icon: 'ph-fill ph-beer-bottle', spot: 'Wiese hinter Camp B · Reihe 12 · blaue Flagge', time: 'gleich', startMin: 22, need: 8, members: ['CrewC', 'Max', 'Jonas', 'Pia'], mx: 39, my: 50 },
      { id: 2, game: 'Beerpong-Turnier', icon: 'ph-fill ph-trophy', spot: 'Zeltplatz · Reihe 7', time: 'gleich', startMin: 4, need: 8, members: ['PongKings', 'Lea', 'Tom', 'Nina', 'Ben', 'Sina'], mx: 80, my: 65 },
      { id: 3, game: 'Bierpong casual', icon: 'ph-fill ph-beer-stein', spot: 'Camp A · Lagerfeuer', time: 'jetzt', startMin: -3, need: 4, members: ['Sunnyboy', 'Kev'] },
      { id: 4, game: 'Werwolf (Nacht)', icon: 'ph-fill ph-moon-stars', spot: 'Großes Zelt · Camp C', time: 'heute Nacht', startMin: 240, need: 12, members: ['Mondkind', 'Anna', 'Flo', 'Rosa', 'Timo'] },
      { id: 101, kind: 'act', actId: 'sb-headliner', act: 'Nachtsirene', icon: 'ph-fill ph-music-notes', stage: 'Main Stage', time: '21:30', startMin: 26, spot: 'beim Getränkestand links vor der Bühne', members: ['Juli', 'Marco', 'Finn', 'Sara', 'Kai', 'Nora', 'Timo'], mx: 50, my: 11 },
      { id: 102, kind: 'act', actId: 'sb-indie', act: 'Elektro Kollektiv', icon: 'ph-fill ph-music-notes', stage: 'Tent Stage', time: '19:00', startMin: 3, spot: 'Fahnenmast direkt am Zelteingang', members: ['Mia', 'Tom', 'Lisa', 'Ben'], mx: 25, my: 55 },
      { id: 103, kind: 'act', actId: 'sb-dj', act: 'DJ Wildfang', icon: 'ph-fill ph-music-notes', stage: 'Forest Floor', time: '23:45', startMin: 150, spot: 'großer Baum mit Lichterkette', members: ['Vroni', 'Alex'], mx: 80, my: 74 },
    ],
  }
}
