import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

/*
 * Tauschrausch Admin — application store.
 *
 * Faithful port of the Claude Design prototype's single `Component` class
 * (see ../../festival-app/reference or the admin design source). One reactive
 * `state`, a set of actions, and one big `vals` computed (the port of the
 * prototype's renderVals). All data is in-memory mock data; the moderation
 * dashboard resets on reload by design.
 */

const props = { sidebarStyle: 'dunkel', tableZebra: true }

// ---- static reference maps (were class fields) ------------------------------
const US: Record<string, any> = {
  aktiv: { l: 'aktiv', t: '#2E7D00', bg: 'color-mix(in oklab,#C7FF3C 30%,#fff)', dot: '#8BC400' },
  verwarnt: { l: 'verwarnt', t: '#8A5A00', bg: 'color-mix(in oklab,#FFB020 26%,#fff)', dot: '#FFB020' },
  eingeschraenkt: { l: 'eingeschränkt', t: '#8A3D00', bg: 'color-mix(in oklab,#E07B0A 24%,#fff)', dot: '#E07B0A' },
  gesperrt: { l: 'gesperrt', t: '#A01062', bg: 'color-mix(in oklab,#FF3CAC 18%,#fff)', dot: '#FF3CAC' },
  gebannt: { l: 'gebannt', t: '#B3001B', bg: 'color-mix(in oklab,#FF4D4D 18%,#fff)', dot: '#FF4D4D' },
}
const FS: Record<string, any> = {
  live: { l: 'läuft', t: '#2E7D00', bg: 'color-mix(in oklab,#C7FF3C 32%,#fff)', dot: '#8BC400' },
  soon: { l: 'kommt bald', t: '#8A5A00', bg: 'color-mix(in oklab,#FFB020 26%,#fff)', dot: '#FFB020' },
  ended: { l: 'beendet', t: '#5C626C', bg: '#EEF0EA', dot: '#B2B7AE' },
}
const RT: Record<string, any> = {
  inserat: { l: 'Inserat', icon: 'ph-fill ph-tag' }, lobby: { l: 'Lobby', icon: 'ph-fill ph-game-controller' },
  nutzer: { l: 'Nutzer', icon: 'ph-fill ph-user' }, chat: { l: 'Chat', icon: 'ph-fill ph-chat-circle' },
}
const CAT: Record<string, any> = {
  getraenke: { l: 'Getränke', icon: 'ph-fill ph-beer-stein' }, camping: { l: 'Camping', icon: 'ph-fill ph-tent' },
  hygiene: { l: 'Hygiene', icon: 'ph-fill ph-first-aid-kit' }, schlafen: { l: 'Schlafen', icon: 'ph-fill ph-moon' },
  services: { l: 'Services', icon: 'ph-fill ph-hand-heart' }, mobil: { l: 'Mobilität', icon: 'ph-fill ph-car' },
  sonstiges: { l: 'Sonstiges', icon: 'ph-fill ph-dots-three-outline' },
}
const AST: Record<string, any> = {
  geplant: { l: 'geplant', t: '#2E7D00', bg: 'color-mix(in oklab,#C7FF3C 30%,#fff)' },
  verschoben: { l: 'verschoben', t: '#8A5A00', bg: 'color-mix(in oklab,#FFB020 28%,#fff)' },
  abgesagt: { l: 'abgesagt', t: '#B3001B', bg: 'color-mix(in oklab,#FF4D4D 15%,#fff)' },
}

function freshState() {
  return {
    screen: 'login', view: 'dashboard', festivalId: 'sb', fSwitchOpen: false,
    adminUser: '', adminPass: '', loginErr: '',
    reportType: 'alle', reportStatus: 'offen',
    lineupTab: 'acts', lineupDay: 0, lineupStageFilter: 'alle', lobbyKind: 'alle',
    stageForm: null as any, actForm: null as any, actDialog: null as any,
    csvOpen: false, csvStep: 'upload', csv: { text: '', headers: [] as string[], rows: [] as string[][], map: {} as Record<string, string> },
    listingCat: 'alle', listingType: 'alle', listingQuery: '', selListings: [] as string[],
    lobbyState: 'alle', userQuery: '', userStatus: 'alle',
    drawer: null as any, confirm: null as any, festivalForm: null as any, zoneForm: null as any, dragZone: null as number | null, toast: null as string | null,
    admin: { name: 'Mara Kern', role: 'Moderation · Crew' },
    festivals: [
      { id: 'sb', name: 'SummerBeats 2026', place: 'Wien · Donauinsel', from: '24.07.', to: '26.07.2026', status: 'live' },
      { id: 'dw', name: 'Donauwave Open Air', place: 'Linz · Urfahr', from: '07.08.', to: '09.08.2026', status: 'soon' },
      { id: 'bk', name: 'Bergklang Festival', place: 'Innsbruck · Bergisel', from: '21.08.', to: '23.08.2026', status: 'soon' },
      { id: 'ns', name: 'Nachtstrom', place: 'Graz · Schlossberg', from: '12.06.', to: '14.06.2026', status: 'ended' },
    ] as any[],
    zones: {
      sb: [{ id: 'z1', name: 'Camp A', marker: 'Nordwiese', color: '#C7FF3C' }, { id: 'z2', name: 'Camp B', marker: 'am Hauptweg', color: '#FFB020' }, { id: 'z3', name: 'Camp C', marker: 'beim See, blaue Flagge', color: '#FF3CAC' }, { id: 'z4', name: 'Camp D', marker: 'Busreihe', color: '#6C72F0' }, { id: 'z5', name: 'Wohnwagen', marker: 'für Camper mit Bus', color: '#2E9CCA' }, { id: 'z6', name: 'Green Camp', marker: 'ruhig & grün', color: '#3FB27A' }],
      dw: [{ id: 'd1', name: 'Nord', marker: 'am Fluss', color: '#C7FF3C' }, { id: 'd2', name: 'Süd', marker: 'beim Eingang', color: '#FFB020' }, { id: 'd3', name: 'Ost', marker: 'Waldrand', color: '#3FB27A' }, { id: 'd4', name: 'West', marker: 'Parkplatz', color: '#6C72F0' }],
      bk: [{ id: 'b1', name: 'Tal', marker: 'unten', color: '#C7FF3C' }, { id: 'b2', name: 'Mitte', marker: 'Hauptbühne', color: '#FFB020' }, { id: 'b3', name: 'Gipfel', marker: 'oben', color: '#FF3CAC' }],
      ns: [{ id: 'n1', name: 'A', marker: 'Schlossberg-Nord', color: '#C7FF3C' }, { id: 'n2', name: 'B', marker: 'Schlossberg-Süd', color: '#FFB020' }],
    } as Record<string, any[]>,
    users: [
      { id: 'u1', username: 'Grillmeister58', fid: 'sb', joined: '24.07.', reports: 0, score: 96, status: 'aktiv' },
      { id: 'u2', username: 'Lenerl', fid: 'sb', joined: '25.07.', reports: 0, score: 100, status: 'aktiv' },
      { id: 'u3', username: 'ZeltProfi', fid: 'sb', joined: '24.07.', reports: 1, score: 92, status: 'verwarnt' },
      { id: 'u4', username: 'BierDealer', fid: 'sb', joined: '25.07.', reports: 4, score: 61, status: 'eingeschraenkt' },
      { id: 'u5', username: 'NightMoves', fid: 'sb', joined: '26.07.', reports: 6, score: 38, status: 'gesperrt' },
      { id: 'u6', username: 'SpamKing', fid: 'sb', joined: '25.07.', reports: 9, score: 12, status: 'gebannt' },
      { id: 'u7', username: 'VanLife', fid: 'sb', joined: '24.07.', reports: 0, score: 99, status: 'aktiv' },
      { id: 'u8', username: 'Sunnyboy', fid: 'sb', joined: '25.07.', reports: 1, score: 88, status: 'aktiv' },
      { id: 'u9', username: 'Roadrunner', fid: 'sb', joined: '26.07.', reports: 0, score: 94, status: 'aktiv' },
      { id: 'u10', username: 'IceIce', fid: 'dw', joined: '07.08.', reports: 0, score: 90, status: 'aktiv' },
    ] as any[],
    reports: [
      { id: 'r1', type: 'inserat', preview: '„Wodka-Flatrate — 5 €/Becher, ganze Nacht"', reporter: 'Lenerl', reason: 'Alkoholverkauf', time: 'vor 8 Min', fid: 'sb', status: 'offen', targetUser: 'BierDealer', link: 'l4', body: 'Inserat bietet Spirituosen gegen Geld an. Verkauf von Alkohol durch Privatpersonen ist laut Community-Regeln nicht erlaubt — nur Tausch oder Verschenken.' },
      { id: 'r2', type: 'chat', preview: '„Verschwinde von meinem Platz, sonst…"', reporter: 'Pia', reason: 'Belästigung / Drohung', time: 'vor 22 Min', fid: 'sb', status: 'offen', targetUser: 'NightMoves', link: '', body: 'Gemeldeter Chatverlauf enthält Drohungen gegenüber der Melderin. Wortfilter hat „sonst…" markiert.' },
      { id: 'r3', type: 'inserat', preview: '„Kräuter-Mischung, beste Qualität 🌿"', reporter: 'System · Wortfilter', reason: 'Verdacht Drogen', time: 'vor 40 Min', fid: 'sb', status: 'offen', targetUser: 'NightMoves', link: 'l7', body: 'Automatisch markiert. Formulierung und Emoji deuten auf verbotene Substanzen hin. Verbotsliste greift.' },
      { id: 'r4', type: 'nutzer', preview: 'Profil „SpamKing"', reporter: 'Grillmeister58', reason: 'Spam / Fake-Profil', time: 'vor 1 Std', fid: 'sb', status: 'offen', targetUser: 'SpamKing', link: '', body: 'Postet identische Inserate im Minutentakt über mehrere Zonen. Mehrfach von verschiedenen Nutzern gemeldet.' },
      { id: 'r5', type: 'lobby', preview: '„After-Show im Waldstück, nur Auserwählte"', reporter: 'Anna', reason: 'Unangebrachtes Verhalten', time: 'vor 2 Std', fid: 'sb', status: 'offen', targetUser: 'NightMoves', link: 'lb6', body: 'Lobby wirkt wie ein Vorwand für ein privates Treffen abseits belebter Orte. Sicherheitsrisiko.' },
      { id: 'r6', type: 'chat', preview: '„Ticket für Sonntag noch zu haben?"', reporter: 'Tom', reason: 'Ticket-Zweitmarkt', time: 'gestern', fid: 'sb', status: 'erledigt', targetUser: '', link: '', body: 'Ticket-Handel ist im MVP nicht erlaubt. Wurde bereits geprüft und geschlossen.' },
      { id: 'r7', type: 'inserat', preview: '„Feuerwerk-Reste, günstig abzugeben"', reporter: 'System · Wortfilter', reason: 'Pyrotechnik', time: 'gestern', fid: 'sb', status: 'erledigt', targetUser: '', link: '', body: 'Pyrotechnik steht auf der Verbotsliste. Inhalt wurde entfernt.' },
    ] as any[],
    items: [
      { id: 'l1', title: 'Kaltes Bier · halbe Palette', cat: 'getraenke', type: 'biete', author: 'Grillmeister58', zone: 'Camp B', fid: 'sb', flagged: false },
      { id: 'l2', title: 'Luftpumpe — dringend!', cat: 'camping', type: 'suche', author: 'Lenerl', zone: 'Camp C', fid: 'sb', flagged: false },
      { id: 'l3', title: 'Zeltaufbau in 10 Minuten', cat: 'services', type: 'biete', author: 'ZeltProfi', zone: 'Camp A', fid: 'sb', flagged: false },
      { id: 'l4', title: 'Wodka-Flatrate — 5 €/Becher', cat: 'getraenke', type: 'biete', author: 'BierDealer', zone: 'Camp B', fid: 'sb', flagged: true },
      { id: 'l5', title: 'Sonnencreme LSF 50', cat: 'hygiene', type: 'suche', author: 'Sunnyboy', zone: 'Camp C', fid: 'sb', flagged: false },
      { id: 'l6', title: 'Schlafplatz im Bus frei', cat: 'schlafen', type: 'biete', author: 'VanLife', zone: 'Camp D', fid: 'sb', flagged: false },
      { id: 'l7', title: 'Kräuter-Mischung 🌿', cat: 'sonstiges', type: 'biete', author: 'NightMoves', zone: 'Camp A', fid: 'sb', flagged: true },
      { id: 'l8', title: 'Mitfahrt Abreise So → Wien', cat: 'mobil', type: 'biete', author: 'Roadrunner', zone: 'Camp C', fid: 'sb', flagged: false },
      { id: 'l9', title: 'Powerbank leihen', cat: 'camping', type: 'suche', author: 'IceIce', zone: 'Nord', fid: 'dw', flagged: false },
    ] as any[],
    lobbies: [
      { id: 'lb1', game: 'Flunkyball', icon: 'ph-fill ph-beer-bottle', spot: 'Wiese hinter Camp B · Reihe 12', time: '17:00', filled: 4, cap: 8, creator: 'CrewC', fid: 'sb', state: 'offen' },
      { id: 'lb2', game: 'Beerpong-Turnier', icon: 'ph-fill ph-trophy', spot: 'Zeltplatz · Reihe 7', time: '16:30', filled: 6, cap: 8, creator: 'PongKings', fid: 'sb', state: 'offen' },
      { id: 'lb3', game: 'Bierpong casual', icon: 'ph-fill ph-beer-stein', spot: 'Camp A · Lagerfeuer', time: 'jetzt', filled: 2, cap: 4, creator: 'Sunnyboy', fid: 'sb', state: 'offen' },
      { id: 'lb4', game: 'Werwolf (Nacht)', icon: 'ph-fill ph-moon-stars', spot: 'Großes Zelt · Camp C', time: '23:00', filled: 5, cap: 12, creator: 'Mondkind', fid: 'sb', state: 'offen' },
      { id: 'lb5', game: 'Beerpong', icon: 'ph-fill ph-trophy', spot: 'Zeltplatz · Reihe 3', time: 'gestern', filled: 8, cap: 8, creator: 'Lea', fid: 'sb', state: 'vergangen' },
      { id: 'lb6', game: 'After-Show Runde', icon: 'ph-fill ph-moon-stars', spot: 'Waldstück (unklar)', time: '01:00', filled: 3, cap: 6, creator: 'NightMoves', fid: 'sb', state: 'offen' },
      { id: 'lb7', kind: 'act', game: 'Nachtsirene · Begleitung', icon: 'ph-fill ph-music-notes', spot: 'beim Getränkestand links vor der Bühne', time: '21:30', filled: 7, cap: 0, creator: 'Juli', fid: 'sb', state: 'offen' },
      { id: 'lb8', kind: 'act', game: 'Elektro Kollektiv · Begleitung', icon: 'ph-fill ph-music-notes', spot: 'Fahnenmast am Zelteingang', time: '19:00', filled: 4, cap: 0, creator: 'Mia', fid: 'sb', state: 'offen' },
      { id: 'lb9', kind: 'act', game: 'DJ Wildfang · Begleitung', icon: 'ph-fill ph-music-notes', spot: 'großer Baum mit Lichterkette', time: '23:45', filled: 2, cap: 0, creator: 'Vroni', fid: 'sb', state: 'offen' },
    ] as any[],
    plans: { sb: { active: true, name: 'gelaende-summerbeats.jpg', markers: [
      { label: 'Bier · Camp B, Reihe 4', color: '#C7FF3C', left: '31%', top: '42%' },
      { label: 'Luftpumpe gesucht · Camp C', color: '#FF3CAC', left: '63%', top: '34%' },
      { label: 'Beerpong · Zeltplatz Reihe 7', color: '#FFB020', left: '49%', top: '64%' },
      { label: 'Zeltaufbau · Camp A Infozelt', color: '#3FB27A', left: '19%', top: '70%' },
      { label: 'Ladestrom · blauer Pavillon', color: '#6C72F0', left: '77%', top: '55%' },
    ] } } as Record<string, any>,
    stages: { sb: [
      { id: 'st1', name: 'Main Stage', left: '50%', top: '20%' },
      { id: 'st2', name: 'Tent Stage', left: '26%', top: '60%' },
      { id: 'st3', name: 'Forest Floor', left: '80%', top: '72%' },
    ] } as Record<string, any[]>,
    lineupDays: { sb: ['Fr 24.', 'Sa 25.', 'So 26.'] } as Record<string, string[]>,
    acts: { sb: [
      { id: 'a1', name: 'Auftakt Brass', stageId: 'st2', day: 0, start: '18:00', end: '18:45', status: 'geplant', treffen: 0 },
      { id: 'a2', name: 'Elektro Kollektiv', stageId: 'st2', day: 0, start: '19:00', end: '20:00', status: 'geplant', treffen: 1 },
      { id: 'a3', name: 'Rosa Rauschen', stageId: 'st1', day: 0, start: '20:30', end: '21:15', status: 'geplant', treffen: 0 },
      { id: 'a4', name: 'Nachtsirene', stageId: 'st1', day: 0, start: '21:30', end: '23:00', status: 'geplant', treffen: 1 },
      { id: 'a5', name: 'DJ Wildfang', stageId: 'st3', day: 0, start: '23:45', end: '01:30', status: 'verschoben', treffen: 1 },
      { id: 'a6', name: 'Die Wellenbrecher', stageId: 'st2', day: 1, start: '17:00', end: '18:00', status: 'geplant', treffen: 0 },
      { id: 'a7', name: 'Goldener Käfig', stageId: 'st1', day: 1, start: '20:00', end: '21:30', status: 'geplant', treffen: 0 },
      { id: 'a8', name: 'Velvet Sturm', stageId: 'st1', day: 1, start: '22:00', end: '23:30', status: 'abgesagt', treffen: 0 },
      { id: 'a9', name: 'Sonntagskind', stageId: 'st3', day: 2, start: '16:00', end: '17:00', status: 'geplant', treffen: 0 },
      { id: 'a10', name: 'Abschluss All-Stars', stageId: 'st1', day: 2, start: '19:30', end: '21:00', status: 'geplant', treffen: 0 },
    ] } as Record<string, any[]>,
    COLORS: ['#C7FF3C', '#FFB020', '#FF3CAC', '#6C72F0', '#2E9CCA', '#3FB27A'],
  }
}

export const useAdminStore = defineStore('admin', () => {
  const state = reactive<any>(freshState())
  let toastTimer: any = null
  let csvParsedForConfirm: any[] = []

  function setState(patch: any, cb?: () => void) {
    Object.assign(state, typeof patch === 'function' ? patch(state) : patch)
    cb?.()
  }

  // ---- helpers --------------------------------------------------------------
  const fest = (id?: string) => state.festivals.find((f: any) => f.id === (id || state.festivalId))
  const curZones = () => state.zones[state.festivalId] || []
  const curStages = () => state.stages[state.festivalId] || []
  const curActs = () => state.acts[state.festivalId] || []
  const curDays = () => state.lineupDays[state.festivalId] || []
  const stageName = (id: string) => { const st = curStages().find((x: any) => x.id === id); return st ? st.name : '—' }
  const lobKind = (l: any) => (l && l.kind) || 'spiel'
  const init2 = (str: string) => { str = str || ''; const p = str.trim().split(/\s+/); return ((p[0] || '')[0] || '') + ((p[1] || p[0] || '')[1] || (p[1] || '')[0] || '') }
  function flash(m: string) { setState({ toast: m }); clearTimeout(toastTimer); toastTimer = setTimeout(() => setState({ toast: null }), 2400) }
  const stop = (e: any) => { if (e && e.stopPropagation) e.stopPropagation() }
  function minOf(t: string) { if (!t || t === '—') return 0; const m = ('' + t).match(/(\d{1,2}):(\d{2})/); if (!m) return 0; let h = +m[1]; const mi = +m[2]; if (h < 8) h += 24; return h * 60 + mi }

  // ---- style builders (inline, ported) --------------------------------------
  const chip = (active: boolean, accent?: string) => `padding:8px 13px;border-radius:9px;border:1px solid ${active ? 'transparent' : 'var(--line)'};background:${active ? (accent || 'var(--sidebar)') : 'var(--panel)'};color:${active ? (accent ? '#14300A' : '#fff') : 'var(--ink2)'};font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;white-space:nowrap;`
  const badge = (status: string) => { const m = US[status] || US.aktiv; return { label: m.l, dot: m.dot, style: `display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:7px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12px;background:${m.bg};color:${m.t};` } }
  const rstatusStyle = (st: string) => { const off = st === 'offen'; return `display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:7px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11.5px;background:${off ? 'color-mix(in oklab,#FFB020 24%,#fff)' : '#EEF0EA'};color:${off ? '#8A5A00' : '#5C626C'};` }
  const typeStyle = (t: string) => { const b = t === 'biete'; return `display:inline-flex;padding:3px 9px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11.5px;background:${b ? 'color-mix(in oklab,#C7FF3C 32%,#fff)' : 'color-mix(in oklab,#FF3CAC 16%,#fff)'};color:${b ? '#2E7D00' : '#A01062'};` }
  const avatarFor = (status: string) => { const m = US[status] || US.aktiv; return { bg: m.bg, ink: m.t } }

  // ---- actions --------------------------------------------------------------
  function submitAdminLogin() { if (!state.adminUser.trim() || !state.adminPass) { setState({ loginErr: 'Bitte Username und Passwort eingeben.' }); return } setState({ screen: 'app', loginErr: '' }) }
  const logout = () => setState({ screen: 'login', adminPass: '', fSwitchOpen: false, drawer: null })
  const setView = (v: string) => setState({ view: v, drawer: null, fSwitchOpen: false, selListings: [] })
  const selectFestival = (id: string) => setState({ festivalId: id, fSwitchOpen: false, selListings: [], drawer: null })
  const openReport = (id: string) => setState({ drawer: { kind: 'report', id } })
  const openUser = (id: string) => setState({ drawer: { kind: 'user', id } })
  const closeDrawer = () => setState({ drawer: null })

  const setUserStatus = (username: string, status: string, msg: string) => { setState((s: any) => ({ users: s.users.map((u: any) => (u.username === username ? { ...u, status } : u)) })); flash(msg) }
  const banUser = (username: string) => { setState((s: any) => ({ users: s.users.map((u: any) => (u.username === username ? { ...u, status: 'gebannt' } : u)), confirm: null, drawer: null })); flash(username + ' wurde gebannt.') }
  const deleteUser = (username: string) => { setState((s: any) => ({ users: s.users.filter((u: any) => u.username !== username), confirm: null, drawer: null })); flash(username + ' wurde gelöscht.') }

  const delListing = (id: string) => { setState((s: any) => ({ items: s.items.filter((x: any) => x.id !== id), selListings: s.selListings.filter((x: string) => x !== id), confirm: null })); flash('Inserat gelöscht.') }
  const delListings = (ids: string[]) => { setState((s: any) => ({ items: s.items.filter((x: any) => !ids.includes(x.id)), selListings: [], confirm: null })); flash(ids.length + ' Inserate gelöscht.') }
  const toggleListing = (id: string) => setState((s: any) => ({ selListings: s.selListings.includes(id) ? s.selListings.filter((x: string) => x !== id) : [...s.selListings, id] }))

  const closeLobby = (id: string) => { setState((s: any) => ({ lobbies: s.lobbies.map((l: any) => (l.id === id ? { ...l, state: 'vergangen' } : l)) })); flash('Lobby geschlossen.') }
  const delLobby = (id: string) => { setState((s: any) => ({ lobbies: s.lobbies.filter((l: any) => l.id !== id), confirm: null })); flash('Lobby gelöscht.') }

  const reportDelContent = (rep: any) => { setState((s: any) => ({ items: rep.link ? s.items.filter((x: any) => x.id !== rep.link) : s.items, lobbies: rep.link ? s.lobbies.filter((l: any) => l.id !== rep.link) : s.lobbies, reports: s.reports.map((r: any) => (r.id === rep.id ? { ...r, status: 'erledigt' } : r)), drawer: null, confirm: null })); flash('Inhalt gelöscht, Meldung erledigt.') }
  const reportMeasure = (rep: any, status: string, label: string) => { setState((s: any) => ({ users: s.users.map((u: any) => (u.username === rep.targetUser ? { ...u, status } : u)), reports: s.reports.map((r: any) => (r.id === rep.id ? { ...r, status: 'erledigt' } : r)), drawer: null, confirm: null })); flash(rep.targetUser + ' ' + label + ' · Meldung erledigt.') }
  const resolveReport = (rep: any, note: string) => { setState((s: any) => ({ reports: s.reports.map((r: any) => (r.id === rep.id ? { ...r, status: 'erledigt' } : r)), drawer: null })); flash('Meldung geschlossen (' + note + ').') }

  const openNewFestival = () => setState({ festivalForm: { mode: 'new', id: null, name: '', place: '', from: '', to: '', status: 'soon' }, fSwitchOpen: false })
  const editFestival = (f: any) => setState({ festivalForm: { mode: 'edit', id: f.id, name: f.name, place: f.place, from: f.from, to: f.to, status: f.status } })
  const setFf = (k: string, v: any) => setState((s: any) => ({ festivalForm: { ...s.festivalForm, [k]: v } }))
  const closeFestivalForm = () => setState({ festivalForm: null })
  function saveFestival() {
    const f = state.festivalForm; if (!f.name.trim()) { flash('Bitte einen Namen eingeben.'); return }
    if (f.mode === 'new') { const id = 'f' + Date.now(); setState((s: any) => ({ festivals: [...s.festivals, { id, name: f.name.trim(), place: f.place.trim() || '—', from: f.from || '—', to: f.to || '', status: f.status }], zones: { ...s.zones, [id]: [] }, festivalForm: null })); flash('Festival angelegt.') }
    else { setState((s: any) => ({ festivals: s.festivals.map((x: any) => (x.id === f.id ? { ...x, name: f.name.trim(), place: f.place.trim(), from: f.from, to: f.to, status: f.status } : x)), festivalForm: null })); flash('Festival aktualisiert.') }
  }
  const archiveFestival = (f: any) => { setState((s: any) => ({ festivals: s.festivals.map((x: any) => (x.id === f.id ? { ...x, status: 'ended' } : x)), confirm: null })); flash(f.name + ' archiviert.') }

  const openNewZone = () => setState({ zoneForm: { mode: 'new', id: null, name: '', marker: '', color: state.COLORS[0] } })
  const editZone = (z: any) => setState({ zoneForm: { mode: 'edit', id: z.id, name: z.name, marker: z.marker, color: z.color } })
  const setZf = (k: string, v: any) => setState((s: any) => ({ zoneForm: { ...s.zoneForm, [k]: v } }))
  const closeZoneForm = () => setState({ zoneForm: null })
  function saveZone() {
    const z = state.zoneForm; const fid = state.festivalId; if (!z.name.trim()) { flash('Bitte einen Namen eingeben.'); return }
    if (z.mode === 'new') { const id = 'z' + Date.now(); setState((s: any) => ({ zones: { ...s.zones, [fid]: [...(s.zones[fid] || []), { id, name: z.name.trim(), marker: z.marker.trim() || '—', color: z.color }] }, zoneForm: null })); flash('Zone hinzugefügt.') }
    else { setState((s: any) => ({ zones: { ...s.zones, [fid]: s.zones[fid].map((x: any) => (x.id === z.id ? { ...x, name: z.name.trim(), marker: z.marker.trim(), color: z.color } : x)) }, zoneForm: null })); flash('Zone aktualisiert.') }
  }
  const removeZone = (id: string) => { const fid = state.festivalId; setState((s: any) => ({ zones: { ...s.zones, [fid]: s.zones[fid].filter((z: any) => z.id !== id) }, confirm: null })); flash('Zone entfernt.') }
  const uploadPlan = () => { const fid = state.festivalId; setState((s: any) => ({ plans: { ...s.plans, [fid]: { active: true, name: 'geländeplan.jpg', markers: [] } } })); flash('Geländeplan hochgeladen — jetzt aktiv für die App.') }
  const replacePlan = () => { const fid = state.festivalId; setState((s: any) => ({ plans: { ...s.plans, [fid]: null } })); flash('Zieh den neuen Plan in die Ablage.') }
  const removePlan = () => { const fid = state.festivalId; setState((s: any) => ({ plans: { ...s.plans, [fid]: null }, confirm: null })); flash('Geländeplan entfernt.') }
  const togglePlanActive = () => { const fid = state.festivalId; setState((s: any) => { const pl = s.plans[fid]; if (!pl) return {}; return { plans: { ...s.plans, [fid]: { ...pl, active: !pl.active } } } }) }
  const reorderZone = (to: number) => { const from = state.dragZone; if (from == null || from === to) return; const fid = state.festivalId; setState((s: any) => { const arr = [...s.zones[fid]]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m); return { zones: { ...s.zones, [fid]: arr }, dragZone: to } }) }

  const setLineupTab = (t: string) => setState({ lineupTab: t })
  function posFromEvent(e: any) { const el = e.currentTarget; const r = el.getBoundingClientRect(); const x = Math.round((e.clientX - r.left) / r.width * 100); const y = Math.round((e.clientY - r.top) / r.height * 100); return { left: Math.max(2, Math.min(98, x)) + '%', top: Math.max(3, Math.min(97, y)) + '%' } }
  const openNewStage = () => setState({ stageForm: { mode: 'new', id: null, name: '', pos: null } })
  const editStage = (st: any) => setState({ stageForm: { mode: 'edit', id: st.id, name: st.name, pos: st.left ? { left: st.left, top: st.top } : null } })
  const setStf = (k: string, v: any) => setState((s: any) => ({ stageForm: { ...s.stageForm, [k]: v } }))
  const stagePlace = (e: any) => { const pos = posFromEvent(e); setState((s: any) => ({ stageForm: { ...s.stageForm, pos } })) }
  const clearStagePos = () => setState((s: any) => ({ stageForm: { ...s.stageForm, pos: null } }))
  const closeStageForm = () => setState({ stageForm: null })
  function saveStage() {
    const st = state.stageForm; const fid = state.festivalId; if (!st.name.trim()) { flash('Bitte einen Bühnennamen eingeben.'); return } const pos = st.pos || {}
    if (st.mode === 'new') { const id = 'st' + Date.now(); setState((s: any) => ({ stages: { ...s.stages, [fid]: [...(s.stages[fid] || []), { id, name: st.name.trim(), left: pos.left || null, top: pos.top || null }] }, stageForm: null })); flash('Bühne angelegt.') }
    else { setState((s: any) => ({ stages: { ...s.stages, [fid]: s.stages[fid].map((x: any) => (x.id === st.id ? { ...x, name: st.name.trim(), left: pos.left || null, top: pos.top || null } : x)) }, stageForm: null })); flash('Bühne aktualisiert.') }
  }
  const removeStage = (id: string) => { const fid = state.festivalId; setState((s: any) => ({ stages: { ...s.stages, [fid]: (s.stages[fid] || []).filter((x: any) => x.id !== id) }, confirm: null })); flash('Bühne entfernt.') }
  const openNewAct = () => { const st = curStages()[0]; setState({ actForm: { mode: 'new', id: null, name: '', stageId: st ? st.id : '', day: state.lineupDay || 0, start: '', end: '', status: 'geplant' } }) }
  const editAct = (a: any) => setState({ actForm: { mode: 'edit', id: a.id, name: a.name, stageId: a.stageId, day: a.day, start: a.start, end: a.end, status: a.status } })
  const setAf = (k: string, v: any) => setState((s: any) => ({ actForm: { ...s.actForm, [k]: v } }))
  const closeActForm = () => setState({ actForm: null })
  function saveAct() {
    const a = state.actForm; const fid = state.festivalId; if (!a.name.trim()) { flash('Bitte einen Act-Namen eingeben.'); return } if (!a.stageId) { flash('Bitte eine Bühne wählen.'); return }
    if (a.mode === 'new') { const id = 'a' + Date.now(); setState((s: any) => ({ acts: { ...s.acts, [fid]: [...(s.acts[fid] || []), { id, name: a.name.trim(), stageId: a.stageId, day: a.day, start: a.start || '—', end: a.end || '—', status: a.status, treffen: 0 }] }, actForm: null })); flash('Act angelegt.') }
    else { setState((s: any) => ({ acts: { ...s.acts, [fid]: s.acts[fid].map((x: any) => (x.id === a.id ? { ...x, name: a.name.trim(), stageId: a.stageId, day: a.day, start: a.start, end: a.end, status: a.status } : x)) }, actForm: null })); flash('Act aktualisiert.') }
  }
  const removeAct = (id: string) => { const fid = state.festivalId; setState((s: any) => ({ acts: { ...s.acts, [fid]: (s.acts[fid] || []).filter((x: any) => x.id !== id) }, confirm: null })); flash('Act gelöscht.') }
  const openActDialog = (a: any, mode: string) => setState({ actDialog: { mode, id: a.id, name: a.name, treffen: a.treffen || 0, start: a.start, end: a.end } })
  const setAd = (k: string, v: any) => setState((s: any) => ({ actDialog: { ...s.actDialog, [k]: v } }))
  const closeActDialog = () => setState({ actDialog: null })
  function confirmActDialog() {
    const d = state.actDialog; const fid = state.festivalId; if (!d) return; const info = d.treffen > 0 ? (d.treffen + ' Begleit-Treffen informiert.') : 'keine Begleit-Treffen betroffen.'
    if (d.mode === 'shift') { setState((s: any) => ({ acts: { ...s.acts, [fid]: s.acts[fid].map((x: any) => (x.id === d.id ? { ...x, status: 'verschoben', start: d.start, end: d.end } : x)) }, actDialog: null })); flash('„' + d.name + '" verschoben · ' + info) }
    else { setState((s: any) => ({ acts: { ...s.acts, [fid]: s.acts[fid].map((x: any) => (x.id === d.id ? { ...x, status: 'abgesagt' } : x)) }, actDialog: null })); flash('„' + d.name + '" abgesagt · ' + info) }
  }
  const openCsv = () => setState({ csvOpen: true, csvStep: 'upload', csv: { text: '', headers: [], rows: [], map: {} } })
  const closeCsv = () => setState({ csvOpen: false })
  const setCsvText = (t: string) => setState((s: any) => ({ csv: { ...s.csv, text: t } }))
  function onCsvFile(e: any) { const f = e.target.files && e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => setState((s: any) => ({ csv: { ...s.csv, text: String(rd.result || '') } })); rd.readAsText(f) }
  const csvSample = () => setCsvText('Act;Bühne;Tag;Start;Ende\nAurora Skies;Main Stage;Sa 25.;20:00;21:30\nBassgewitter;Forest Floor;Sa 25.;22:00;23:30\nLo-Fi Wiesn;Tent Stage;Sa 25.;18:30;19:30\nAurora Skies;Main Stage;Sa 25.;20:00;21:30\nKlanglos;;So 26.;15:00;16:00')
  function parseCsv(text: string) { const lines = (text || '').trim().split(/\r?\n/).filter((l) => l.trim()); if (!lines.length) return { headers: [] as string[], rows: [] as string[][] }; const c = lines[0]; const sep = (c.split(';').length > c.split(',').length) ? ';' : ','; const sp = (l: string) => l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return { headers: sp(lines[0]), rows: lines.slice(1).map(sp) } }
  function csvToMap() { if (!(state.csv.text || '').trim()) { flash('Bitte CSV einfügen oder Datei wählen.'); return } const { headers, rows } = parseCsv(state.csv.text); const find = (...keys: string[]) => headers.find((h) => keys.some((k) => h.toLowerCase().includes(k))) || ''; const map = { act: find('act', 'künstler', 'name'), stage: find('bühne', 'buehne', 'stage'), day: find('tag', 'day', 'datum'), start: find('start', 'von', 'beginn'), end: find('ende', 'end', 'bis') }; setState((s: any) => ({ csv: { ...s.csv, headers, rows, map }, csvStep: 'map' })) }
  const setCsvMap = (field: string, header: string) => setState((s: any) => ({ csv: { ...s.csv, map: { ...s.csv.map, [field]: header } } }))
  const csvGoPreview = () => setState({ csvStep: 'preview' })
  const csvBack = () => setState((s: any) => ({ csvStep: s.csvStep === 'preview' ? 'map' : 'upload' }))
  function csvConfirm() {
    const fid = state.festivalId; const parsed = csvParsedForConfirm || []; const ok = parsed.filter((r: any) => !r.error)
    setState((s: any) => { const days = [...(s.lineupDays[fid] || [])]; const stages = [...(s.stages[fid] || [])]; const acts = [...(s.acts[fid] || [])]
      ok.forEach((r: any, i: number) => { let dayIdx = days.indexOf(r.day); if (dayIdx < 0 && r.day) { days.push(r.day); dayIdx = days.length - 1 } if (dayIdx < 0) dayIdx = 0
        let st = stages.find((x: any) => x.name.toLowerCase() === r.stage.toLowerCase()); if (!st) { st = { id: 'st' + Date.now() + i, name: r.stage, left: null, top: null }; stages.push(st) }
        acts.push({ id: 'a' + Date.now() + i, name: r.act, stageId: st.id, day: dayIdx, start: r.start || '—', end: r.end || '—', status: 'geplant', treffen: 0 }) })
      return { lineupDays: { ...s.lineupDays, [fid]: days }, stages: { ...s.stages, [fid]: stages }, acts: { ...s.acts, [fid]: acts }, csvOpen: false } })
    flash(ok.length + ' Acts importiert.')
  }
  const ask = (c: any) => setState({ confirm: c })
  const closeConfirm = () => setState({ confirm: null })
  function runConfirm() {
    const c = state.confirm; if (!c) return; const a = c.action, p = c.payload
    if (a === 'delListing') return delListing(p)
    if (a === 'delListings') return delListings(p)
    if (a === 'delLobby') return delLobby(p)
    if (a === 'banUser') return banUser(p)
    if (a === 'deleteUser') return deleteUser(p)
    if (a === 'archiveFestival') return archiveFestival(p)
    if (a === 'removeZone') return removeZone(p)
    if (a === 'removeStage') return removeStage(p)
    if (a === 'removeAct') return removeAct(p)
    if (a === 'removePlan') return removePlan()
    if (a === 'reportDelContent') return reportDelContent(p)
    setState({ confirm: null })
  }

  // =========================================================================
  // vals — port of renderVals()
  // =========================================================================
  const vals = computed(() => {
    const s = state; const p = props; const v = s.view; const isv = (k: string) => v === k
    const cur = fest() || s.festivals[0]
    const dark = (p.sidebarStyle || 'dunkel') !== 'hell'
    const zebra = p.tableZebra !== false
    const reportsAll = s.reports.filter((r: any) => r.fid === s.festivalId)
    const openCount = reportsAll.filter((r: any) => r.status === 'offen').length
    const usersF = s.users.filter((u: any) => u.fid === s.festivalId)
    const itemsF = s.items.filter((x: any) => x.fid === s.festivalId)
    const lobbiesF = s.lobbies.filter((l: any) => l.fid === s.festivalId)
    const activeUsers = usersF.filter((u: any) => u.status !== 'gebannt').length
    const openLobbies = lobbiesF.filter((l: any) => l.state === 'offen').length

    const navDef: any[] = [['dashboard', 'Dashboard', 'ph-fill ph-squares-four'], ['meldungen', 'Meldungen', 'ph-fill ph-flag-banner'], ['inserate', 'Inserate', 'ph-fill ph-tag'], ['lobbys', 'Spiele / Lobbys', 'ph-fill ph-game-controller'], ['nutzer', 'Nutzer', 'ph-fill ph-users-three'], ['festivals', 'Festivals', 'ph-fill ph-ticket'], ['zonen', 'Zonen', 'ph-fill ph-map-pin-area'], ['lineup', 'Line-up', 'ph-fill ph-microphone-stage']]
    const nav = navDef.map(([k, label, icon]) => { const active = v === k; const cnt = k === 'meldungen' ? openCount : 0
      return { label, icon, on: () => setView(k), hasCount: cnt > 0, count: cnt,
        countStyle: `min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:var(--amber);color:#14300A;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;`,
        style: `display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:11px;border:none;cursor:pointer;width:100%;background:${active ? (dark ? 'var(--sb-active)' : 'color-mix(in oklab,#C7FF3C 22%,#fff)') : 'transparent'};color:${active ? (dark ? '#EAF7C8' : '#2E4A00') : (dark ? 'var(--sb-ink)' : 'var(--ink2)')};` } })

    const titles: Record<string, string[]> = { dashboard: ['Dashboard', 'Überblick für ' + cur.name], meldungen: ['Meldungen', 'Moderations-Queue · ' + cur.name], inserate: ['Inserate', 'Marktplatz von ' + cur.name], lobbys: ['Spiele / Lobbys', 'Trinkspiel-Lobbys von ' + cur.name], nutzer: ['Nutzer', 'Profile & Maßnahmen · ' + cur.name], festivals: ['Festivals', 'Alle Mandanten verwalten'], zonen: ['Zonen', 'Campingzonen von ' + cur.name], lineup: ['Line-up', 'Bühnen & Acts von ' + cur.name] }
    const tt = titles[v] || ['', '']

    const kpi = (icon: string, iconBg: string, iconcol: string, value: any, label: string, trend: string, trendcol: string) => ({ icon, iconBg, iconcol, value, label, trend, trendStyle: `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;color:${trendcol};background:color-mix(in oklab,${trendcol} 14%,#fff);padding:3px 8px;border-radius:6px;` })
    const kpis = [
      kpi('ph-fill ph-flag-banner', 'color-mix(in oklab,#FFB020 16%,#fff)', '#B57500', openCount, 'offene Meldungen', openCount > 0 ? 'zu prüfen' : 'sauber', openCount > 0 ? '#B57500' : '#2E7D00'),
      kpi('ph-fill ph-users-three', 'color-mix(in oklab,#C7FF3C 24%,#fff)', '#4C7A00', activeUsers, 'aktive Nutzer', '+12%', '#2E7D00'),
      kpi('ph-fill ph-tag', '#EEF0EA', '#5C626C', itemsF.length, 'Inserate', 'live', '#5C626C'),
      kpi('ph-fill ph-game-controller', 'color-mix(in oklab,#FFB020 16%,#fff)', '#B57500', openLobbies, 'offene Lobbys', 'aktiv', '#B57500'),
    ]
    const latestReports = reportsAll.slice(0, 4).map((r: any) => ({ preview: r.preview, reason: r.reason, time: r.time, icon: (RT[r.type] || RT.inserat).icon, statusLabel: r.status === 'offen' ? 'offen' : 'erledigt', statusStyle: rstatusStyle(r.status), open: () => { setView('meldungen'); setTimeout(() => openReport(r.id), 0) } }))
    const dashMeta = [{ label: 'Zonen', value: (s.zones[s.festivalId] || []).length }, { label: 'Vergangene Lobbys', value: lobbiesF.filter((l: any) => l.state !== 'offen').length }, { label: 'Gemeldete Inhalte', value: itemsF.filter((x: any) => x.flagged).length }, { label: 'Gebannte Nutzer', value: usersF.filter((u: any) => u.status === 'gebannt').length }]

    const rtChips = [['alle', 'Alle'], ['inserat', 'Inserat'], ['lobby', 'Lobby'], ['nutzer', 'Nutzer'], ['chat', 'Chat']].map(([k, l]) => ({ label: l, on: () => setState({ reportType: k }), style: chip(s.reportType === k) }))
    const rsChips = [['offen', 'Offen'], ['erledigt', 'Erledigt'], ['alle', 'Alle']].map(([k, l]) => ({ label: l, on: () => setState({ reportStatus: k }), style: chip(s.reportStatus === k) }))
    const repF = reportsAll.filter((r: any) => (s.reportType === 'alle' || r.type === s.reportType) && (s.reportStatus === 'alle' || r.status === s.reportStatus))
    const reportRows = repF.map((r: any, i: number) => ({ open: () => openReport(r.id), icon: (RT[r.type] || RT.inserat).icon, typeLabel: (RT[r.type] || RT.inserat).l, preview: r.preview, reporter: r.reporter, reason: r.reason, time: r.time, statusLabel: r.status === 'offen' ? 'offen' : 'erledigt', statusStyle: rstatusStyle(r.status), rowStyle: `display:grid;grid-template-columns:110px 1fr 130px 160px 96px 116px;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line2);cursor:pointer;${zebra && i % 2 ? 'background:var(--panel2);' : ''}` }))

    const catChips = ([['alle', 'Alle']] as any[]).concat(Object.keys(CAT).map((k) => [k, CAT[k].l])).map(([k, l]) => ({ label: l, on: () => setState({ listingCat: k }), style: chip(s.listingCat === k) }))
    const ltChips = [['alle', 'Alle'], ['biete', 'Biete'], ['suche', 'Suche']].map(([k, l]) => ({ label: l, on: () => setState({ listingType: k }), style: chip(s.listingType === k) }))
    const lq = s.listingQuery.trim().toLowerCase()
    const listF = itemsF.filter((x: any) => (s.listingCat === 'alle' || x.cat === s.listingCat) && (s.listingType === 'alle' || x.type === s.listingType) && (!lq || x.title.toLowerCase().includes(lq) || x.author.toLowerCase().includes(lq)))
    const listingRows = listF.map((l: any, i: number) => { const checked = s.selListings.includes(l.id); const c = CAT[l.cat] || CAT.sonstiges
      return { id: l.id, title: l.title, catLabel: c.l, catIcon: c.icon, author: l.author, zone: l.zone, flagged: l.flagged, checked, typeLabel: l.type === 'biete' ? 'Biete' : 'Suche', typeStyle: typeStyle(l.type), boxBorder: checked ? 'var(--lime)' : 'var(--line)', boxBg: checked ? 'var(--lime)' : 'transparent',
        toggle: (e: any) => { stop(e); toggleListing(l.id) }, del: (e: any) => { stop(e); ask({ action: 'delListing', payload: l.id, title: 'Inserat löschen?', body: '„' + l.title + '" wird dauerhaft entfernt.', label: 'Löschen', danger: true, icon: 'ph-fill ph-trash' }) },
        rowStyle: `display:grid;grid-template-columns:46px 1fr 150px 140px 130px 96px 64px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--line2);${checked ? 'background:color-mix(in oklab,#C7FF3C 8%,#fff);' : (zebra && i % 2 ? 'background:var(--panel2);' : '')}` } })
    const allSelected = listF.length > 0 && listF.every((l: any) => s.selListings.includes(l.id))

    const lobChips = [['alle', 'Alle'], ['offen', 'Offen'], ['vergangen', 'Vergangen']].map(([k, l]) => ({ label: l, on: () => setState({ lobbyState: k }), style: chip(s.lobbyState === k) }))
    const lobKindChips = [['alle', 'Alle'], ['spiel', 'Spiel'], ['act', 'Act']].map(([k, l]) => ({ label: l, on: () => setState({ lobbyKind: k }), style: chip(s.lobbyKind === k, k === 'act' ? 'var(--magenta)' : (k === 'spiel' ? 'var(--amber)' : undefined)) }))
    const lobF = lobbiesF.filter((l: any) => (s.lobbyState === 'alle' || l.state === s.lobbyState) && (s.lobbyKind === 'alle' || lobKind(l) === s.lobbyKind))
    const lobbyRows = lobF.map((l: any, i: number) => { const isAct = lobKind(l) === 'act'
      return { game: l.game, icon: l.icon, iconCol: isAct ? '#A01062' : '#B57500', iconBg: isAct ? 'color-mix(in oklab,var(--magenta) 12%,#fff)' : 'color-mix(in oklab,var(--amber) 14%,#fff)', spot: l.spot, time: l.time, creator: l.creator, canClose: l.state === 'offen',
        kindLabel: isAct ? 'Act' : 'Spiel', kindStyle: `display:inline-flex;padding:2px 8px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:10.5px;flex-shrink:0;background:${isAct ? 'color-mix(in oklab,var(--magenta) 14%,#fff)' : 'color-mix(in oklab,var(--amber) 22%,#fff)'};color:${isAct ? '#A01062' : '#8A5A00'};`,
        part: isAct ? (l.filled + ' dabei') : (l.filled + '/' + l.cap), statusLabel: l.state === 'offen' ? 'offen' : 'vergangen', statusStyle: rstatusStyle(l.state === 'offen' ? 'offen' : 'x'),
        close: (e: any) => { stop(e); closeLobby(l.id) }, del: (e: any) => { stop(e); ask({ action: 'delLobby', payload: l.id, title: 'Treffen löschen?', body: '„' + l.game + '" und der zugehörige Gruppenchat werden entfernt.', label: 'Löschen', danger: true, icon: 'ph-fill ph-trash' }) },
        rowStyle: `display:grid;grid-template-columns:1fr 1.3fr 120px 118px 140px 104px 132px;align-items:center;padding:13px 18px;border-bottom:1px solid var(--line2);${zebra && i % 2 ? 'background:var(--panel2);' : ''}` } })

    const usChips = [['alle', 'Alle'], ['aktiv', 'Aktiv'], ['verwarnt', 'Verwarnt'], ['eingeschraenkt', 'Eingeschränkt'], ['gesperrt', 'Gesperrt'], ['gebannt', 'Gebannt']].map(([k, l]) => ({ label: l, on: () => setState({ userStatus: k }), style: chip(s.userStatus === k) }))
    const uq = s.userQuery.trim().toLowerCase()
    const usF = usersF.filter((u: any) => (s.userStatus === 'alle' || u.status === s.userStatus) && (!uq || u.username.toLowerCase().includes(uq)))
    const userRows = usF.map((u: any, i: number) => { const b = badge(u.status); const av = avatarFor(u.status)
      return { username: u.username, init: init2(u.username).toUpperCase(), avBg: av.bg, avInk: av.ink, festName: (fest(u.fid) || {}).name || '—', joined: u.joined, reports: u.reports, score: u.score + '%',
        scoreCol: u.score >= 80 ? '#2E7D00' : (u.score >= 50 ? '#B57500' : 'var(--danger)'), repStyle: `font-family:'Space Grotesk',sans-serif;font-weight:700;${u.reports >= 4 ? 'color:var(--danger);' : (u.reports > 0 ? 'color:#B57500;' : 'color:var(--ink3);')}`,
        badgeLabel: b.label, badgeStyle: b.style, dot: b.dot, open: () => openUser(u.id),
        rowStyle: `display:grid;grid-template-columns:1fr 160px 120px 120px 96px 150px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--line2);cursor:pointer;${zebra && i % 2 ? 'background:var(--panel2);' : ''}` } })

    const festivalCards = s.festivals.map((f: any) => { const fb = FS[f.status] || FS.soon; const rc = s.reports.filter((r: any) => r.fid === f.id && r.status === 'offen').length
      return { name: f.name, place: f.place, dates: f.from + '–' + f.to, badgeLabel: fb.l, badgeStyle: `display:inline-flex;align-items:center;padding:3px 9px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11.5px;background:${fb.bg};color:${fb.t};`,
        users: s.users.filter((u: any) => u.fid === f.id && u.status !== 'gebannt').length, listings: s.items.filter((x: any) => x.fid === f.id).length, reports: rc, repCol: rc > 0 ? '#B57500' : 'var(--ink)', zoneCount: (s.zones[f.id] || []).length, dim: f.status === 'ended' ? 'opacity:.7;' : '',
        edit: (e: any) => { stop(e); editFestival(f) }, archive: (e: any) => { stop(e); ask({ action: 'archiveFestival', payload: f, title: 'Festival archivieren?', body: '„' + f.name + '" wird auf „beendet" gesetzt und für Besucher ausgeblendet.', label: 'Archivieren', danger: false, icon: 'ph-fill ph-archive' }) },
        manage: () => selectFestival(f.id), zones: () => { selectFestival(f.id); setTimeout(() => setView('zonen'), 0) } } })

    const plan = s.plans[s.festivalId] || null
    const hasPlan = !!plan
    const planMarkers = hasPlan ? plan.markers.map((m: any) => ({ label: m.label, color: m.color, pinStyle: `left:${m.left};top:${m.top};` })) : []
    const planActive = hasPlan && plan.active
    const planStatusStyle = `display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:8px;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12px;` + (planActive ? 'background:color-mix(in oklab,#C7FF3C 30%,#fff);color:#2E7D00;' : 'background:#EEF0EA;color:#5C626C;')

    const zoneRows = curZones().map((z: any, i: number) => ({ name: z.name, marker: z.marker, color: z.color, pos: i + 1,
      dragStart: () => setState({ dragZone: i }), dragOver: (e: any) => { e.preventDefault(); reorderZone(i) }, dragEnd: () => setState({ dragZone: null }),
      edit: (e: any) => { stop(e); editZone(z) }, remove: (e: any) => { stop(e); ask({ action: 'removeZone', payload: z.id, title: 'Zone entfernen?', body: '„' + z.name + '" wird aus der Zonen-Auswahl und den Feed-Filtern der App entfernt.', label: 'Entfernen', danger: true, icon: 'ph-fill ph-trash' }) },
      rowStyle: `display:flex;align-items:center;gap:13px;padding:13px 16px;background:var(--panel);border:1px solid ${s.dragZone === i ? 'var(--lime)' : 'var(--line)'};border-radius:13px;${s.dragZone === i ? 'box-shadow:0 8px 24px -12px rgba(20,22,26,.3);' : ''}` }))

    let dReport: any = null, isReportDrawer = false, isUserDrawer = false, dUser: any = null
    if (s.drawer && s.drawer.kind === 'report') { const r = s.reports.find((x: any) => x.id === s.drawer.id); if (r) { isReportDrawer = true
      dReport = { typeLabel: (RT[r.type] || RT.inserat).l, icon: (RT[r.type] || RT.inserat).icon, preview: r.preview, body: r.body, reporter: r.reporter, reason: r.reason, time: r.time, festName: (fest(r.fid) || {}).name || '', statusLabel: r.status === 'offen' ? 'offen' : 'erledigt', statusStyle: rstatusStyle(r.status), hasTargetUser: !!r.targetUser, targetUser: r.targetUser,
        delContent: () => ask({ action: 'reportDelContent', payload: r, title: 'Inhalt löschen?', body: 'Der gemeldete Inhalt wird entfernt und die Meldung als erledigt markiert.', label: 'Löschen', danger: true, icon: 'ph-fill ph-trash' }),
        warn: () => reportMeasure(r, 'verwarnt', 'verwarnt'), restrict: () => reportMeasure(r, 'eingeschraenkt', 'eingeschränkt'), suspend: () => reportMeasure(r, 'gesperrt', 'befristet gesperrt'),
        ban: () => ask({ action: 'banUser', payload: r.targetUser, title: 'Nutzer wirklich bannen?', body: '„' + r.targetUser + '" wird dauerhaft gesperrt (Konto entfernt, IP-Sperre). Das lässt sich nicht rückgängig machen.', label: 'Bannen', danger: true, icon: 'ph-fill ph-prohibit' }),
        resolveOk: () => resolveReport(r, 'erledigt'), resolveDismiss: () => resolveReport(r, 'unbegründet') } } }
    if (s.drawer && s.drawer.kind === 'user') { const u = s.users.find((x: any) => x.id === s.drawer.id); if (u) { isUserDrawer = true; const b = badge(u.status); const av = avatarFor(u.status)
      dUser = { username: u.username, init: init2(u.username).toUpperCase(), avBg: av.bg, avInk: av.ink, score: u.score + '%', scoreCol: u.score >= 80 ? '#2E7D00' : (u.score >= 50 ? '#B57500' : 'var(--danger)'), reports: u.reports, repCol: u.reports >= 4 ? 'var(--danger)' : (u.reports > 0 ? '#B57500' : 'var(--ink)'), joined: u.joined, badgeLabel: b.label, badgeStyle: b.style, dot: b.dot,
        warn: () => { setUserStatus(u.username, 'verwarnt', u.username + ' verwarnt.'); setState({ drawer: null }) }, restrict: () => { setUserStatus(u.username, 'eingeschraenkt', u.username + ' eingeschränkt.'); setState({ drawer: null }) },
        ban: () => ask({ action: 'banUser', payload: u.username, title: 'Nutzer wirklich bannen?', body: '„' + u.username + '" wird dauerhaft gesperrt (Konto entfernt, IP-Sperre). Das lässt sich nicht rückgängig machen.', label: 'Bannen', danger: true, icon: 'ph-fill ph-prohibit' }) } } }
    const suspendOptions = ['24 Std', '3 Tage', 'Ganzes Festival'].map((d) => ({ label: d, style: `flex:1;padding:9px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12px;cursor:pointer;`, on: () => { if (dUser) { setUserStatus(dUser.username, 'gesperrt', dUser.username + ' für ' + d + ' gesperrt.'); setState({ drawer: null }) } } }))

    const festSwitch = s.festivals.map((f: any) => { const fb = FS[f.status] || FS.soon; const isc = f.id === s.festivalId
      return { name: f.name, place: f.place, dot: fb.dot, current: isc, on: () => selectFestival(f.id), style: `display:flex;align-items:center;gap:11px;width:100%;padding:10px;border-radius:10px;border:none;background:${isc ? 'var(--panel2)' : 'transparent'};cursor:pointer;` } })

    const c = s.confirm
    const confirmBtnStyle = c ? `flex:1.3;padding:13px;border-radius:12px;border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;background:${c.danger ? 'var(--danger)' : 'var(--sidebar)'};` : ''
    const confirmIconBg = c ? (c.danger ? 'color-mix(in oklab,#FF4D4D 13%,#fff)' : 'var(--panel2)') : ''
    const confirmIconCol = c ? (c.danger ? 'var(--danger)' : 'var(--ink)') : ''

    const ff = s.festivalForm || {}
    const ffStatusOptions = [['soon', 'kommt bald'], ['live', 'läuft'], ['ended', 'beendet']].map(([k, l]) => ({ label: l, on: () => setFf('status', k), style: chip(ff.status === k, k === 'live' ? 'var(--lime)' : (k === 'soon' ? 'var(--amber)' : undefined)) }))
    const zf = s.zoneForm || {}
    const zfColorOptions = s.COLORS.map((col: string) => ({ active: zf.color === col, on: () => setZf('color', col), style: `width:38px;height:38px;border-radius:10px;background:${col};border:2px solid ${zf.color === col ? 'var(--ink)' : 'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;` }))

    // ----- LINE-UP -----
    const stagesCur = curStages(), actsCur = curActs(), daysCur = curDays()
    const lineupEmpty = stagesCur.length === 0 && actsCur.length === 0
    const lineupDayIdx = Math.min(s.lineupDay, Math.max(0, daysCur.length - 1))
    const lineupTabDefs: any[] = [['acts', 'Acts', 'ph-fill ph-microphone-stage'], ['buehnen', 'Bühnen', 'ph-fill ph-map-pin-area'], ['timetable', 'Timetable', 'ph-fill ph-calendar-blank']]
    const lineupTabs = lineupTabDefs.map(([k, label, icon]) => ({ label, icon, on: () => setLineupTab(k), active: s.lineupTab === k, style: `display:flex;align-items:center;gap:8px;padding:9px 15px;border-radius:10px;border:1px solid ${s.lineupTab === k ? 'transparent' : 'var(--line)'};background:${s.lineupTab === k ? 'var(--sidebar)' : 'var(--panel)'};color:${s.lineupTab === k ? '#fff' : 'var(--ink2)'};font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;` }))
    const stageRows = stagesCur.map((st: any) => { const cnt = actsCur.filter((a: any) => a.stageId === st.id).length; const hasPos = !!st.left
      return { name: st.name, cnt, hasPos, posLabel: hasPos ? (st.left + ' · ' + st.top) : 'keine Position', edit: (e: any) => { stop(e); editStage(st) }, remove: (e: any) => { stop(e); ask({ action: 'removeStage', payload: st.id, title: 'Bühne entfernen?', body: '„' + st.name + '" wird entfernt.' + (cnt > 0 ? (' ' + cnt + ' Acts verlieren ihre Zuordnung.') : ''), label: 'Entfernen', danger: true, icon: 'ph-fill ph-trash' }) } } })
    const dayChips = daysCur.map((d: string, i: number) => ({ label: d, on: () => setState({ lineupDay: i }), style: chip(lineupDayIdx === i) }))
    const stageFilterChips = ([{ key: 'alle', label: 'Alle Bühnen' }] as any[]).concat(stagesCur.map((st: any) => ({ key: st.id, label: st.name }))).map((o: any) => ({ label: o.label, on: () => setState({ lineupStageFilter: o.key }), style: chip(s.lineupStageFilter === o.key) }))
    const actsF = actsCur.filter((a: any) => a.day === lineupDayIdx && (s.lineupStageFilter === 'alle' || a.stageId === s.lineupStageFilter)).slice().sort((a: any, b: any) => minOf(a.start) - minOf(b.start))
    const actRows = actsF.map((a: any, i: number) => { const stt = AST[a.status] || AST.geplant
      return { name: a.name, stage: stageName(a.stageId), day: daysCur[a.day] || '—', start: a.start, end: a.end, treffen: a.treffen,
        statusLabel: stt.l, statusStyle: `display:inline-flex;align-items:center;padding:4px 10px;border-radius:7px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11.5px;background:${stt.bg};color:${stt.t};`,
        nameStyle: `font-size:13.5px;font-weight:600;${a.status === 'abgesagt' ? 'text-decoration:line-through;color:var(--ink3);' : ''}`,
        treffenStyle: `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;${a.treffen > 0 ? 'color:#A01062;' : 'color:var(--ink3);'}`, canShift: a.status !== 'abgesagt',
        edit: (e: any) => { stop(e); editAct(a) }, shift: (e: any) => { stop(e); openActDialog(a, 'shift') }, cancel: (e: any) => { stop(e); openActDialog(a, 'cancel') }, del: (e: any) => { stop(e); ask({ action: 'removeAct', payload: a.id, title: 'Act löschen?', body: '„' + a.name + '" wird aus dem Line-up gelöscht.', label: 'Löschen', danger: true, icon: 'ph-fill ph-trash' }) },
        rowStyle: `display:grid;grid-template-columns:1.4fr 1fr 84px 132px 128px 88px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--line2);${zebra && i % 2 ? 'background:var(--panel2);' : ''}` } })
    const ttActs = actsCur.filter((a: any) => a.day === lineupDayIdx && stagesCur.some((st: any) => st.id === a.stageId))
    let ttbl: any = null
    if (stagesCur.length) { const px = 1.3; const mm = ttActs.map((a: any) => [minOf(a.start), minOf(a.end)]).filter((x: any) => x[1] > x[0])
      let lo = mm.length ? Math.min(...mm.map((x: any) => x[0])) : 16 * 60, hi = mm.length ? Math.max(...mm.map((x: any) => x[1])) : 24 * 60
      lo = Math.floor(lo / 60) * 60; hi = Math.ceil(hi / 60) * 60; if (hi <= lo) hi = lo + 120
      const hours: any[] = []; for (let m = lo; m <= hi; m += 60) { const hh = Math.floor((m / 60) % 24); hours.push({ label: (hh < 10 ? '0' : '') + hh + ':00', topStyle: 'top:' + (34 + (m - lo) * px) + 'px;' }) }
      const cols = stagesCur.map((st: any) => ({ name: st.name, blocks: ttActs.filter((a: any) => a.stageId === st.id).map((a: any) => { const s0 = minOf(a.start), e0 = minOf(a.end); const h = Math.max(26, (e0 - s0) * px); const cancel = a.status === 'abgesagt'; const shift = a.status === 'verschoben'
        return { name: a.name, time: a.start + '–' + a.end, shift, cancel,
          style: `position:absolute;left:5px;right:5px;top:${(s0 - lo) * px}px;height:${h}px;border-radius:9px;padding:7px 9px;overflow:hidden;box-sizing:border-box;background:${cancel ? '#F1F2EE' : (shift ? 'color-mix(in oklab,#FFB020 18%,#fff)' : 'color-mix(in oklab,#C7FF3C 20%,#fff)')};border:1px solid ${cancel ? 'var(--line)' : (shift ? 'color-mix(in oklab,#FFB020 55%,#fff)' : 'color-mix(in oklab,#C7FF3C 55%,#fff)')};${cancel ? 'opacity:.7;' : ''}`,
          nameStyle: `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12.5px;line-height:1.15;${cancel ? 'text-decoration:line-through;color:var(--ink3);' : 'color:var(--ink);'}` } }) }))
      ttbl = { hours, cols, height: (hi - lo) * px, bodyStyle: 'height:' + ((hi - lo) * px) + 'px;' } }
    const timetableNoActs = !!ttbl && ttbl.cols.every((col: any) => col.blocks.length === 0)

    const csv = s.csv; const csvHeaders = csv.headers || []
    const csvMapFields = [['act', 'Act'], ['stage', 'Bühne'], ['day', 'Tag'], ['start', 'Start'], ['end', 'Ende']].map(([k, label]) => ({ key: k, label, value: csv.map[k] || '', options: ([{ v: '', l: '— nicht zuordnen —' }] as any[]).concat(csvHeaders.map((h: string) => ({ v: h, l: h }))), on: (e: any) => setCsvMap(k, e.target.value) }))
    const colIdx = (f: string) => csvHeaders.indexOf(csv.map[f])
    const seenCsv: Record<string, boolean> = {}
    const csvParsedRaw = (csv.rows || []).map((row: string[]) => { const g = (f: string) => { const idx = colIdx(f); return idx >= 0 ? (row[idx] || '').trim() : '' }
      const act = g('act'), stage = g('stage'), day = g('day'), start = g('start'), end = g('end'); let error = ''; if (!act) error = 'Act fehlt'; else if (!stage) error = 'Bühne fehlt'; else if (!start) error = 'Startzeit fehlt'
      let dup = false; const key = (act + '|' + day + '|' + start).toLowerCase(); if (!error) { if (seenCsv[key] || actsCur.some((a: any) => (a.name + '|' + (daysCur[a.day] || '') + '|' + a.start).toLowerCase() === key)) dup = true; seenCsv[key] = true }
      return { act, stage, day, start, end, error, dup } })
    csvParsedForConfirm = csvParsedRaw.map((r: any) => ({ act: r.act, stage: r.stage, day: r.day, start: r.start, end: r.end, error: !!r.error }))
    const csvRows = csvParsedRaw.map((r: any) => ({ act: r.act || '—', stage: r.stage || '—', day: r.day || '—', start: r.start || '—', end: r.end || '—', status: r.error ? r.error : (r.dup ? 'Dopplung' : 'OK'),
      statusStyle: `display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:6px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:11px;` + (r.error ? 'background:color-mix(in oklab,#FF4D4D 14%,#fff);color:#B3001B;' : (r.dup ? 'background:color-mix(in oklab,#FFB020 22%,#fff);color:#8A5A00;' : 'background:color-mix(in oklab,#C7FF3C 26%,#fff);color:#2E7D00;')),
      rowStyle: `display:grid;grid-template-columns:1.3fr 1fr 84px 74px 74px 104px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line2);${r.error ? 'background:color-mix(in oklab,#FF4D4D 5%,#fff);' : ''}` }))
    const csvOkCount = csvParsedRaw.filter((r: any) => !r.error && !r.dup).length, csvErrCount = csvParsedRaw.filter((r: any) => r.error).length, csvDupCount = csvParsedRaw.filter((r: any) => !r.error && r.dup).length
    const af = s.actForm || {}, stf = s.stageForm || {}, ad = s.actDialog || {}

    return {
      isLogin: s.screen === 'login', isApp: s.screen === 'app',
      adminUser: s.adminUser, onAdminUser: (e: any) => setState({ adminUser: e.target.value }), adminPass: s.adminPass, onAdminPass: (e: any) => setState({ adminPass: e.target.value }),
      loginErr: s.loginErr, hasLoginErr: !!s.loginErr, submitAdminLogin, logout,
      adminName: s.admin.name, adminRole: s.admin.role, adminInit: init2(s.admin.name).toUpperCase(),
      sbBg: dark ? 'var(--sidebar)' : 'var(--panel)', sbBorder: dark ? 'var(--sidebar)' : 'var(--line)', sbLine: dark ? 'var(--sb-line)' : 'var(--line)', sbLogoBg: dark ? 'rgba(255,255,255,.08)' : 'var(--sidebar)', sbTitle: dark ? '#fff' : 'var(--ink)', sbSub: dark ? '#7C818B' : 'var(--ink3)',
      nav, viewTitle: tt[0], viewSub: tt[1],
      isDashboard: isv('dashboard'), isMeldungen: isv('meldungen'), isInserate: isv('inserate'), isLobbys: isv('lobbys'), isNutzer: isv('nutzer'), isFestivals: isv('festivals'), isZonen: isv('zonen'),
      curFestName: cur.name, curFestPlace: cur.place, curFestDates: cur.from + '–' + cur.to, curFestDot: (FS[cur.status] || FS.soon).dot,
      fSwitchOpen: s.fSwitchOpen, toggleSwitch: () => setState((x: any) => ({ fSwitchOpen: !x.fSwitchOpen })), festSwitch,
      kpis, latestReports, dashMeta, goMeldungen: () => setView('meldungen'), goZonen: () => setView('zonen'),
      reportTypeChips: rtChips, reportStatusChips: rsChips, reportRows, noReports: reportRows.length === 0,
      listingQuery: s.listingQuery, onListingQuery: (e: any) => setState({ listingQuery: e.target.value }), listingCatChips: catChips, listingTypeChips: ltChips, listingRows,
      hasSelection: s.selListings.length > 0, selCount: s.selListings.length, clearSelection: () => setState({ selListings: [] }),
      askDeleteSelected: () => ask({ action: 'delListings', payload: [...s.selListings], title: 'Inserate löschen?', body: s.selListings.length + ' ausgewählte Inserate werden dauerhaft entfernt.', label: 'Löschen', danger: true, icon: 'ph-fill ph-trash' }),
      toggleAllListings: () => setState(() => ({ selListings: allSelected ? [] : listF.map((l: any) => l.id) })), allSelected, allBoxBorder: allSelected ? 'var(--lime)' : 'var(--ink3)', allBoxBg: allSelected ? 'var(--lime)' : 'transparent',
      lobbyChips: lobChips, lobbyRows,
      userQuery: s.userQuery, onUserQuery: (e: any) => setState({ userQuery: e.target.value }), userStatusChips: usChips, userRows,
      festivalCards, openNewFestival,
      zoneRows, zoneCount: curZones().length, openNewZone,
      hasPlan, noPlan: !hasPlan, planMarkers, planName: hasPlan ? plan.name : '',
      planMarkerCount: hasPlan ? plan.markers.length : 0, planHasMarkers: hasPlan && plan.markers.length > 0, planNoMarkers: hasPlan && plan.markers.length === 0,
      planActive, planStatusStyle, planStatusLabel: planActive ? 'Aktiv für die App' : 'Für App deaktiviert', planStatusIcon: planActive ? 'ph-fill ph-check-circle' : 'ph-fill ph-eye-slash',
      uploadPlan, replacePlan, togglePlanActive,
      askRemovePlan: () => ask({ action: 'removePlan', title: 'Geländeplan entfernen?', body: 'Der Plan und alle darauf gesetzten Marker werden für Besucher ausgeblendet.', label: 'Entfernen', danger: true, icon: 'ph-fill ph-trash' }),
      drawerOpen: !!s.drawer, closeDrawer, stop, isReportDrawer, isUserDrawer, dReport, dUser, suspendOptions,
      confirmOpen: !!c, confirmTitle: c ? c.title : '', confirmBody: c ? c.body : '', confirmLabel: c ? c.label : '', confirmIcon: c ? c.icon : '', confirmIconBg, confirmIconCol, confirmBtnStyle, closeConfirm, runConfirm,
      festivalFormOpen: !!s.festivalForm, festivalFormTitle: ff.mode === 'edit' ? 'Festival bearbeiten' : 'Neues Festival anlegen', festivalSaveLabel: ff.mode === 'edit' ? 'Speichern' : 'Anlegen',
      ffName: ff.name || '', onFfName: (e: any) => setFf('name', e.target.value), ffPlace: ff.place || '', onFfPlace: (e: any) => setFf('place', e.target.value), ffFrom: ff.from || '', onFfFrom: (e: any) => setFf('from', e.target.value), ffTo: ff.to || '', onFfTo: (e: any) => setFf('to', e.target.value), ffStatusOptions,
      closeFestivalForm, saveFestival,
      zoneFormOpen: !!s.zoneForm, zoneFormTitle: zf.mode === 'edit' ? 'Zone bearbeiten' : 'Zone hinzufügen', zoneSaveLabel: zf.mode === 'edit' ? 'Speichern' : 'Hinzufügen',
      zfName: zf.name || '', onZfName: (e: any) => setZf('name', e.target.value), zfMarker: zf.marker || '', onZfMarker: (e: any) => setZf('marker', e.target.value), zfColorOptions,
      closeZoneForm, saveZone,
      isLineup: isv('lineup'), lobbyKindChips: lobKindChips,
      lineupEmpty, lineupNotEmpty: !lineupEmpty, lineupTabs, isLineupActs: s.lineupTab === 'acts', isLineupStages: s.lineupTab === 'buehnen', isLineupTimetable: s.lineupTab === 'timetable', timetableHeightStyle: ttbl ? ('height:' + (34 + ttbl.height) + 'px;') : '',
      openCsv, openNewAct, openNewStage,
      stageRows, stageCount: stagesCur.length, hasStages: stagesCur.length > 0, noStages: stagesCur.length === 0,
      dayChips, hasDays: daysCur.length > 0, stageFilterChips, actRows, hasActsDay: actsF.length > 0, noActsDay: actsF.length === 0, actDayLabel: daysCur[lineupDayIdx] || '', totalActs: actsCur.length,
      timetable: ttbl, hasTimetable: !!ttbl, timetableNoStages: stagesCur.length === 0, timetableNoActs,
      stageFormOpen: !!s.stageForm, stageFormTitle: stf.mode === 'edit' ? 'Bühne bearbeiten' : 'Bühne anlegen', stageSaveLabel: stf.mode === 'edit' ? 'Speichern' : 'Anlegen',
      stfName: stf.name || '', onStfName: (e: any) => setStf('name', e.target.value), stfHasPlan: hasPlan, stfPlanName: hasPlan ? plan.name : '', stfHasPos: !!stf.pos, stfNoPos: !stf.pos, stfNoPlan: !hasPlan, stfPinStyle: stf.pos ? `left:${stf.pos.left};top:${stf.pos.top};` : 'display:none;',
      stagePlace, clearStagePos, closeStageForm, saveStage,
      actFormOpen: !!s.actForm, actFormTitle: af.mode === 'edit' ? 'Act bearbeiten' : 'Act anlegen', actSaveLabel: af.mode === 'edit' ? 'Speichern' : 'Anlegen', afNoStages: stagesCur.length === 0,
      afName: af.name || '', onAfName: (e: any) => setAf('name', e.target.value), afStart: af.start || '', onAfStart: (e: any) => setAf('start', e.target.value), afEnd: af.end || '', onAfEnd: (e: any) => setAf('end', e.target.value),
      afStageOptions: stagesCur.map((st: any) => ({ label: st.name, on: () => setAf('stageId', st.id), style: chip(af.stageId === st.id) })),
      afDayOptions: daysCur.map((d: string, i: number) => ({ label: d, on: () => setAf('day', i), style: chip(af.day === i) })),
      afStatusOptions: [['geplant', 'geplant'], ['verschoben', 'verschoben'], ['abgesagt', 'abgesagt']].map(([k, l]) => ({ label: l, on: () => setAf('status', k), style: chip(af.status === k, k === 'geplant' ? 'var(--lime)' : (k === 'verschoben' ? 'var(--amber)' : undefined)) })),
      closeActForm, saveAct,
      actDialogOpen: !!s.actDialog, actDialogShift: ad.mode === 'shift', actDialogCancel: ad.mode === 'cancel', adName: ad.name || '', adTreffen: ad.treffen || 0, adHasTreffen: (ad.treffen || 0) > 0,
      adStart: ad.start || '', onAdStart: (e: any) => setAd('start', e.target.value), adEnd: ad.end || '', onAdEnd: (e: any) => setAd('end', e.target.value),
      closeActDialog, confirmActDialog, adNoTreffen: (ad.treffen || 0) === 0, actDialogLabel: ad.mode === 'cancel' ? 'Absagen' : 'Verschieben',
      actDialogBtnStyle: `flex:1.4;padding:13px;border-radius:12px;border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;background:${ad.mode === 'cancel' ? 'var(--danger)' : 'var(--sidebar)'};`,
      csvStep1Style: `font-family:'Space Grotesk',sans-serif;font-weight:700;color:${s.csvStep === 'upload' ? 'var(--ink)' : 'var(--ink3)'};`,
      csvStep2Style: `font-family:'Space Grotesk',sans-serif;font-weight:700;color:${s.csvStep === 'map' ? 'var(--ink)' : 'var(--ink3)'};`,
      csvStep3Style: `font-family:'Space Grotesk',sans-serif;font-weight:700;color:${s.csvStep === 'preview' ? 'var(--ink)' : 'var(--ink3)'};`,
      csvNextStyle: `padding:13px 20px;border-radius:12px;border:none;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;${(s.csv.text && s.csv.text.trim()) ? 'background:var(--sidebar);color:#fff;' : 'background:var(--panel2);color:var(--ink3);'}`,
      csvConfirmStyle: `padding:13px 20px;border-radius:12px;border:none;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;display:inline-flex;align-items:center;cursor:pointer;${((csvOkCount + csvDupCount) > 0) ? 'background:var(--lime);color:#14300A;' : 'background:var(--panel2);color:var(--ink3);'}`,
      csvOpen: s.csvOpen, csvIsUpload: s.csvStep === 'upload', csvIsMap: s.csvStep === 'map', csvIsPreview: s.csvStep === 'preview',
      csvText: s.csv.text, onCsvText: (e: any) => setCsvText(e.target.value), onCsvFile, csvSample, csvHasText: !!(s.csv.text && s.csv.text.trim()),
      csvToMap, csvMapFields, csvGoPreview, csvBack, closeCsv,
      csvRows, csvOkCount, csvErrCount, csvDupCount, csvHasRows: csvParsedRaw.length > 0, csvConfirm, csvCanConfirm: (csvOkCount + csvDupCount) > 0,
      toast: s.toast,
    }
  })

  return { state, vals }
})
