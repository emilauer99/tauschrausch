import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import {
  AV, CAT, CAT_KEYS, FEED_ZONES, GAMES, LINEUPS, NICKS, STAGE_POS, ZONE_DESCS, freshState,
} from '@/data/seed'
import type { AppState } from '@/data/seed'
import {
  avatarColor, catIcon, catLabel, countdownLong, countdownShort, initials, lobbyIcon, lobbyKind, lobbyTitle, priceInfo,
} from '@/utils/format'
import type {
  CatKey, Festival, Item, LineupAct, Lobby, ListingType, Marker, Screen, ViewMarker,
} from '@/types'

/**
 * Tauschrausch state hub. Single source of truth (Pinia). Every mutation goes
 * through the internal `setState` helper so persistence stays consistent.
 * Getters return plain typed view-models (data only) — all styling lives in the
 * components' scoped CSS.
 */

const PERSIST_KEY = 'tauschrausch:v1'
const PERSIST_FIELDS = [
  'dark', 'user', 'isGuest', 'accounts', 'festival', 'zone', 'treffpunkt',
  'remindersOptIn', 'actRulesSeen', 'items', 'lobbies', 'joined', 'lobbyChats', 'chatSeen',
] as const

function loadState(): AppState {
  const s = freshState()
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      for (const k of PERSIST_FIELDS) if (saved[k] !== undefined) (s as any)[k] = saved[k]
    }
  } catch { /* ignore corrupt storage */ }
  s.lobbies.forEach((l) => { if (!l.owner) l.owner = l.members[0] })
  s.screen = s.user && s.festival ? 'feed' : 'welcome'
  s.stack = []
  return s
}

const accentVar = (type: ListingType) => (type === 'biete' ? 'var(--biete)' : 'var(--suche)')

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>(loadState())

  let hasPlanFlag = false
  let toastTimer: ReturnType<typeof setTimeout> | undefined

  function persist() {
    try {
      const out: Record<string, unknown> = {}
      for (const k of PERSIST_FIELDS) out[k] = (state as any)[k]
      localStorage.setItem(PERSIST_KEY, JSON.stringify(out))
    } catch { /* storage unavailable */ }
  }
  function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>), cb?: () => void) {
    Object.assign(state, typeof patch === 'function' ? patch(state) : patch)
    persist()
    cb?.()
  }

  // ---- internal helpers -----------------------------------------------------
  const curFestId = () => state.festival?.id || 'summerbeats'
  const curPlan = () => state.plans[curFestId()] || null
  const curLineup = () => LINEUPS[curFestId()] || null
  const stagePos = (stage: string): Marker | null => {
    const m = STAGE_POS[curFestId()] || {}
    return m[stage] || m['Main Stage'] || null
  }
  const findItem = (id: number) => state.items.find((x) => x.id === id)
  const findLobby = (id: number) => state.lobbies.find((x) => x.id === id)
  const myName = () => (state.user ? state.user.username : state.nickname) || ''
  const isMineItem = (it: Item) => !!state.user && it.seller === myName()
  const isMineLobby = (l: Lobby) => !!state.user && (l.owner === myName() || l.owner === 'DU')
  const actStageName = () => (state.actPick ? state.actPick.stage : state.actStageFree || '')

  function flash(msg: string) {
    setState({ toast: msg })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setState({ toast: null }), 2400)
  }
  function go(screen: Screen) { setState((s) => ({ stack: [...s.stack, s.screen], screen, zoneSheet: false })) }
  function back() { setState((s) => { const st = [...s.stack]; const prev = st.pop() || 'feed'; return { screen: prev, stack: st } }) }
  function scrollLobby() {
    const g = () => { const el = document.querySelector('[data-lobbyscroll]'); if (el) el.scrollTop = el.scrollHeight }
    requestAnimationFrame(g); setTimeout(g, 140)
  }
  const markChatRead = (id: number) => setState((s) => ({ chatSeen: { ...s.chatSeen, [id]: (s.lobbyChats[id] || []).length } }))
  function unreadOf(id: number) {
    const seen = state.chatSeen[id] || 0
    return (state.lobbyChats[id] || []).slice(seen).filter((m) => m.who !== 'DU' && !m.sys).length
  }

  // ---- navigation & theme ---------------------------------------------------
  const goFeed = () => setState({ screen: 'feed', stack: [], zoneSheet: false })
  const goLobbies = () => setState({ screen: 'lobbies', stack: [] })
  const goProfile = () => setState({ screen: 'profile', stack: [] })
  const goWelcome = () => setState({ screen: 'welcome', stack: [] })
  const goBack = () => back()
  const toggleTheme = () => setState((s) => ({ dark: !s.dark }))
  const finishOnboarding = () => setState({ screen: 'feed', stack: [], viewZone: 'alle' })
  const switchFestival = () => setState({ screen: 'festival', stack: ['profile'], festivalSearch: '' })

  // ---- auth -----------------------------------------------------------------
  const setAuthUser = (v: string) => setState({ authUser: v })
  const setAuthPass = (v: string) => setState({ authPass: v })
  const setAuthPass2 = (v: string) => setState({ authPass2: v })
  const setAuthEmail = (v: string) => setState({ authEmail: v })
  const setResetUser = (v: string) => setState({ resetUser: v })
  function startRegister() {
    setState((s) => ({ screen: 'register', stack: [(['register', 'login', 'reset'] as string[]).includes(s.screen) ? 'welcome' : s.screen], authGateOpen: false, authUser: '', authPass: '', authPass2: '', authEmail: '', authError: '' }))
  }
  function startLogin() {
    setState((s) => ({ screen: 'login', stack: [(['register', 'login', 'reset'] as string[]).includes(s.screen) ? 'welcome' : s.screen], authGateOpen: false, authUser: '', authPass: '', authError: '' }))
  }
  const browseGuest = () => setState({ isGuest: true, user: null, screen: 'festival', stack: ['welcome'] })
  function submitRegister() {
    const u = state.authUser.trim()
    if (!u || !state.authPass) { setState({ authError: 'Bitte Username und Passwort ausfüllen.' }); return }
    if (state.accounts.some((a) => a.username.toLowerCase() === u.toLowerCase())) { setState({ authError: `„${u}" ist schon vergeben — nimm einen anderen.` }); return }
    if (state.authPass !== state.authPass2) { setState({ authError: 'Passwörter stimmen nicht überein.' }); return }
    const acc = { username: u, password: state.authPass, email: state.authEmail.trim() }
    setState((s) => ({ accounts: [...s.accounts, acc], user: { username: u }, nickname: u, isGuest: false, authError: '', screen: s.festival ? 'feed' : 'festival', stack: [] }))
    flash('Konto erstellt 🎉')
  }
  function submitLogin() {
    const acc = state.accounts.find((a) => a.username.toLowerCase() === state.authUser.trim().toLowerCase() && a.password === state.authPass)
    if (!acc) { setState({ authError: 'Username oder Passwort passt nicht.' }); return }
    setState((s) => ({ user: { username: acc.username }, nickname: acc.username, isGuest: false, authError: '', screen: s.festival ? 'feed' : 'festival', stack: [] }))
    flash('Willkommen zurück 👋')
  }
  const goReset = () => setState((s) => ({ screen: 'reset', stack: ['login'], resetUser: s.authUser, resetDone: null }))
  function submitReset() {
    const key = state.resetUser.trim().toLowerCase()
    if (!key) { setState({ resetDone: 'noaccount' }); return }
    const acc = state.accounts.find((a) => a.username.toLowerCase() === key || (a.email && a.email.toLowerCase() === key))
    setState({ resetDone: acc && acc.email ? 'sent' : acc ? 'noemail' : 'noaccount' })
  }
  const randomAuthUser = () => setState({ authUser: NICKS[Math.floor(Math.random() * NICKS.length)] + Math.floor(10 + Math.random() * 89), authError: '' })
  const closeAuthGate = () => setState({ authGateOpen: false })
  const openLogout = () => setState({ logoutOpen: true })
  const closeLogout = () => setState({ logoutOpen: false })
  function confirmLogout() {
    setState({ logoutOpen: false, user: null, isGuest: false, nickname: '', festival: null, screen: 'welcome', stack: [] })
    flash('Ausgeloggt — bis bald!')
  }

  // ---- festival & zone ------------------------------------------------------
  const setFestivalSearch = (v: string) => setState({ festivalSearch: v })
  function pickFestival(f: Festival) { setState((s) => ({ festival: f, zone: f.zones?.[0] || '', screen: 'zone', stack: [...s.stack, 'festival'] })) }
  function confirmQr() { const f = state.festivals.find((x) => x.name === state.qrFestival); if (f) pickFestival(f) }
  const setZone = (z: string) => setState({ zone: z })
  const setTreffpunkt = (v: string) => setState({ treffpunkt: v })

  // ---- feed -----------------------------------------------------------------
  const setViewZone = (z: string) => setState({ viewZone: z, zoneSheet: false })
  const openZoneSheet = () => setState({ zoneSheet: true })
  const closeZoneSheet = () => setState({ zoneSheet: false })
  const openFilterSheet = () => setState({ filterSheet: true })
  const closeFilterSheet = () => setState({ filterSheet: false })
  const setTypeFilter = (t: string) => setState({ typeFilter: t })
  const setCatFilter = (k: string) => setState({ catFilter: k })
  const setFeedVariant = (v: string) => setState({ feedVariant: v as AppState['feedVariant'], feedTouched: true })
  const openOverviewMap = () => setState({ screen: 'map', mapMode: 'overview', mapFilter: 'alle', mapSheet: null, mapZoom: 1, mapPanX: 0, mapPanY: 0 })

  // ---- listing detail / chat ------------------------------------------------
  function openItem(id: number) { setState((s) => ({ stack: [...s.stack, 'feed'], screen: 'detail', activeItemId: id, chatMsgs: null })) }
  const reportItem = () => setState({ reportOpen: true, reportText: '' })
  const setReportText = (v: string) => setState({ reportText: v })
  const closeReport = () => setState({ reportOpen: false })
  const submitReport = () => { setState({ reportOpen: false, reportText: '' }); flash('Danke — wir schauen es uns an') }
  function openChat() {
    if (!state.user) { setState({ authGateOpen: true }); return }
    const it = findItem(state.activeItemId) || state.items[0]
    const msgs = [
      { me: true, text: `Servus! Ist „${it.title}" noch zu haben?` },
      { me: false, text: 'Jup, steht bereit. Komm einfach vorbei 🍺' },
      { me: true, text: 'Top. Bin in 10 Minuten da.' },
      { me: false, text: `Passt. ${it.zone} — kannst nicht verfehlen.` },
    ]
    setState((s) => ({ stack: [...s.stack, 'detail'], screen: 'chat', chatMsgs: msgs }))
  }
  const quickReply = (text: string) => setState((s) => ({ chatMsgs: [...(s.chatMsgs || []), { me: true, text }] }))
  const setChatDraft = (v: string) => setState({ chatDraft: v })
  function sendMsg() {
    const d = state.chatDraft.trim(); if (!d) return
    setState((s) => ({ chatMsgs: [...(s.chatMsgs || []), { me: true, text: d }], chatDraft: '' }))
  }
  const rateUp = () => flash('Daumen hoch abgeschickt 👍')
  const rateDown = () => flash('Danke fürs Feedback')

  // ---- create listing -------------------------------------------------------
  function startCreate() {
    if (!state.user) { setState({ authGateOpen: true }); return }
    setState((s) => ({ stack: [...s.stack, s.screen === 'create' ? 'feed' : s.screen], screen: 'create', editItemId: null, cType: 'biete', cCat: '', cTitle: '', cPrice: 'gratis', cPriceVal: '', cPhoto: false, cMarker: null }))
  }
  function startEditItem(id: number) {
    const it = findItem(id); if (!it) return
    setState((s) => ({ stack: [...s.stack, s.screen], screen: 'create', editItemId: id, cType: it.type, cCat: it.cat, cTitle: it.title, cPrice: it.priceKind, cPriceVal: it.priceKind === 'verhandlung' && it.price ? it.price.replace(' €', '') : '', cPhoto: !!it.photo, cMarker: it.mx != null ? { x: it.mx, y: it.my as number } : null }))
  }
  const cancelCreate = () => { if (state.editItemId != null) { setState({ editItemId: null }); back() } else goFeed() }
  const setCType = (t: ListingType) => setState({ cType: t })
  const setCCat = (k: CatKey) => setState({ cCat: k })
  const setCTitle = (v: string) => setState({ cTitle: v })
  const setCPrice = (k: AppState['cPrice']) => setState({ cPrice: k })
  const setCPriceVal = (v: string) => setState({ cPriceVal: v })
  const toggleCPhoto = () => setState((s) => ({ cPhoto: !s.cPhoto }))
  function submitCreate() {
    if (!state.cTitle.trim()) { flash('Gib noch kurz einen Titel ein'); return }
    if (!state.cCat) { flash('Wähl noch eine Kategorie'); return }
    if (state.editItemId != null) {
      const id = state.editItemId
      setState((s) => ({
        items: s.items.map((it) => (it.id === id
          ? { ...it, type: s.cType, cat: s.cCat as CatKey, title: s.cTitle.trim(), priceKind: s.cPrice, price: s.cPriceVal ? `${s.cPriceVal} €` : 'VB', photo: s.cPhoto ? (it.photo || 'Dein Foto') : null, mx: s.cMarker?.x ?? null, my: s.cMarker?.y ?? null }
          : it)),
        screen: 'detail', activeItemId: id, editItemId: null, cMarker: null, stack: ['feed'],
      }))
      flash('Änderungen gespeichert ✏️')
      return
    }
    const it: Item = {
      id: Date.now(), type: state.cType, cat: state.cCat as CatKey, title: state.cTitle.trim(),
      zone: state.zone + (state.treffpunkt ? ` · ${state.treffpunkt}` : ''), time: 'gerade eben',
      priceKind: state.cPrice, price: state.cPriceVal ? `${state.cPriceVal} €` : 'VB',
      desc: 'Frisch reingestellt. Schreib mir einfach.', photo: state.cPhoto ? 'Dein Foto' : null,
      seller: state.nickname || 'Lenerl', rating: 100, deals: 12,
      mx: state.cMarker?.x ?? null, my: state.cMarker?.y ?? null,
    }
    setState((s) => ({ items: [it, ...s.items], screen: 'feed', stack: [], typeFilter: 'alle', catFilter: 'alle', viewZone: 'alle', cMarker: null }))
    flash('Passt, drin! 🎉')
  }
  const askDeleteItem = (id: number) => setState({ confirmDelete: { kind: 'item', id } })
  const askDeleteLobby = (id: number) => setState({ confirmDelete: { kind: 'lobby', id } })
  const cancelDelete = () => setState({ confirmDelete: null })
  function confirmDeleteAction() {
    const d = state.confirmDelete; if (!d) return
    if (d.kind === 'item') {
      setState((s) => ({ items: s.items.filter((it) => it.id !== d.id), confirmDelete: null, ...(s.screen === 'detail' ? { screen: 'feed' as Screen, stack: [] } : {}) }))
      flash('Inserat gelöscht')
    } else {
      const id = d.id
      setState((s) => { const j = { ...s.joined }; delete j[id]; const chats = { ...s.lobbyChats }; delete chats[id]; return { lobbies: s.lobbies.filter((l) => l.id !== id), joined: j, lobbyChats: chats, confirmDelete: null, screen: 'lobbies' as Screen, stack: [] } })
      flash('Treffen gelöscht')
    }
  }
  function startEditLobby(id: number) {
    const l = findLobby(id); if (!l) return
    if (lobbyKind(l) === 'act') {
      const lu = curLineup()
      const pick = l.actId && lu ? lu.acts.find((a) => a.id === l.actId) || null : null
      setState((s) => ({ stack: [...s.stack, s.screen], screen: 'actCreate', editLobbyId: id, actPick: pick, actQuery: pick ? '' : (l.act || ''), actStageFree: l.stage || '', actTimeFree: l.time || '', actSpot: l.spot || '', actNote: l.note || '', aMarker: l.mx != null ? { x: l.mx, y: l.my as number } : null, actRulesSeen: true }))
    } else {
      setState((s) => ({ stack: [...s.stack, s.screen], screen: 'lobbyCreate', editLobbyId: id, lobbyGame: l.game || 'Flunkyball', lobbySpot: l.spot || '', lobbyTime: (['Jetzt', 'jetzt', 'gleich'].includes(l.time)) ? '' : (l.time || ''), lobbySlots: l.need || 6, lMarker: l.mx != null ? { x: l.mx, y: l.my as number } : null }))
    }
  }
  const cancelTreffenCreate = () => { setState({ editLobbyId: null }); back() }

  // ---- lobbies / treffen ----------------------------------------------------
  const setEntdecken = () => setState({ gameTab: 'entdecken' })
  const setMeine = () => setState({ gameTab: 'meine' })
  const setTreffenFilter = (k: string) => setState({ treffenFilter: k, actFilter: '', actFilterQuery: '', gameFilter: 'alle' })
  const setActFilterQuery = (v: string) => setState({ actFilterQuery: v })
  const selectActFilter = (name: string) => setState({ actFilter: name, actFilterQuery: '' })
  const clearActFilter = () => setState({ actFilter: '', actFilterQuery: '' })
  const setGameFilter = (k: string) => setState({ gameFilter: k })
  const openTreffenSheet = () => setState({ treffenSheet: true })
  const closeTreffenSheet = () => setState({ treffenSheet: false })
  function openLobby(id: number) {
    const l = findLobby(id); if (!l) return
    setState((s) => ({ stack: [...s.stack, s.screen === 'lineup' ? 'lineup' : 'lobbies'], screen: lobbyKind(l) === 'act' ? 'actDetail' : 'lobbyDetail', activeLobbyId: id, actSheet: null, bellOpen: false }))
  }
  const openLobbyChat = () => { markChatRead(state.activeLobbyId); go('lobbyChat'); scrollLobby() }
  function openLobbyChatById(id: number) {
    const l = findLobby(id); if (!l) return
    const detail = (lobbyKind(l) === 'act' ? 'actDetail' : 'lobbyDetail') as Screen
    markChatRead(id)
    setState((s) => ({ stack: [...s.stack, s.screen, detail], screen: 'lobbyChat', activeLobbyId: id, bellOpen: false }))
    scrollLobby()
  }
  const openCreateChooser = () => { if (!state.user) { setState({ authGateOpen: true }); return } setState({ createChooser: true }) }
  const closeCreateChooser = () => setState({ createChooser: false })
  const chooseSpiel = () => { setState({ createChooser: false, lMarker: null }); go('lobbyCreate') }
  const chooseAct = () => startActCreate(null)
  const openLineup = () => go('lineup')
  function joinLobby() {
    if (!state.user) { setState({ authGateOpen: true }); return }
    const id = state.activeLobbyId
    if (state.joined[id]) return
    setState((s) => ({
      lobbies: s.lobbies.map((l) => (l.id === id ? { ...l, members: [...l.members, 'DU'] } : l)),
      joined: { ...s.joined, [id]: true },
      lobbyChats: { ...s.lobbyChats, [id]: [...(s.lobbyChats[id] || []), { who: 'System', sys: true, text: 'Du bist der Runde beigetreten 🎉' }] },
    }))
    flash(lobbyKind(findLobby(id)) === 'act' ? 'Du gehst mit 🎶' : 'Du bist dabei! 🍻')
    scrollLobby()
    if (state.remindersOptIn === null) setState({ optInOpen: true })
  }
  const openLeave = () => setState({ leaveOpen: true, leaveText: '' })
  const leaveFromCard = (id: number) => setState({ activeLobbyId: id, leaveOpen: true, leaveText: '' })
  const closeLeave = () => setState({ leaveOpen: false })
  const setLeaveText = (v: string) => setState({ leaveText: v })
  function confirmLeave() {
    const id = state.activeLobbyId
    const reason = state.leaveText.trim()
    const fromChat = state.screen === 'lobbyChat'
    setState((s) => {
      const j = { ...s.joined }; delete j[id]
      return {
        lobbies: s.lobbies.map((l) => (l.id === id ? { ...l, members: l.members.filter((m) => m !== 'DU') } : l)),
        joined: j,
        lobbyChats: { ...s.lobbyChats, [id]: [...(s.lobbyChats[id] || []), { who: 'System', sys: true, text: `Du hast die Lobby verlassen${reason ? ` — „${reason}"` : ''}` }] },
        leaveOpen: false, leaveText: '',
      }
    })
    flash('Lobby verlassen')
    if (fromChat) back() // return from the group chat to the detail page
  }
  const setLobbyDraft = (v: string) => setState({ lobbyDraft: v })
  function sendLobby() {
    const d = state.lobbyDraft.trim(); if (!d) return
    const id = state.activeLobbyId
    setState((s) => ({ lobbyChats: { ...s.lobbyChats, [id]: [...(s.lobbyChats[id] || []), { who: 'DU', me: true, text: d }] }, lobbyDraft: '' }))
    scrollLobby()
  }
  function quickLobby(text: string) {
    const id = state.activeLobbyId
    setState((s) => ({ lobbyChats: { ...s.lobbyChats, [id]: [...(s.lobbyChats[id] || []), { who: 'DU', me: true, text }] } }))
    scrollLobby()
  }
  const setLobbyGame = (g: string) => setState({ lobbyGame: g })
  const setLobbySpot = (v: string) => setState({ lobbySpot: v })
  const setLobbyTime = (v: string) => setState({ lobbyTime: v })
  const slotsMinus = () => setState((s) => ({ lobbySlots: Math.max(2, s.lobbySlots - 1) }))
  const slotsPlus = () => setState((s) => ({ lobbySlots: Math.min(20, s.lobbySlots + 1) }))
  function submitLobby() {
    if (!state.lobbySpot.trim()) { flash('Wo trefft ihr euch?'); return }
    const g = state.lobbyGame
    const icon = GAMES.find((x) => x.label === g)?.icon || 'ph-fill ph-game-controller'
    if (state.editLobbyId != null) {
      const id = state.editLobbyId
      setState((s) => ({ lobbies: s.lobbies.map((l) => (l.id === id ? { ...l, game: g, icon, spot: s.lobbySpot.trim(), time: s.lobbyTime || 'Jetzt', need: s.lobbySlots, mx: s.lMarker?.x ?? null, my: s.lMarker?.y ?? null } : l)), screen: 'lobbyDetail', activeLobbyId: id, editLobbyId: null, lMarker: null, stack: ['lobbies'] }))
      flash('Änderungen gespeichert ✏️'); return
    }
    const id = Date.now()
    const l: Lobby = { id, game: g, icon, spot: state.lobbySpot.trim(), time: state.lobbyTime || 'Jetzt', need: state.lobbySlots, members: [state.nickname || 'DU'], owner: state.nickname || 'DU', startMin: state.lobbyTime ? 45 : 5, mx: state.lMarker?.x ?? null, my: state.lMarker?.y ?? null }
    setState((s) => ({ lobbies: [l, ...s.lobbies], screen: 'lobbies', stack: [], activeLobbyId: id, joined: { ...s.joined, [id]: true }, lMarker: null, lobbyChats: { ...s.lobbyChats, [id]: [{ who: 'System', sys: true, text: 'Lobby eröffnet 🎉 Sag Hallo!' }] } }))
    flash('Lobby ist offen 🎉')
  }

  // ---- lineup / act treffen -------------------------------------------------
  const setLineupDay = (i: number) => setState({ lineupDay: i })
  const openActSheet = (id: string) => setState({ actSheet: id })
  const closeActSheet = () => setState({ actSheet: null })
  function startActCreate(pick: LineupAct | null) {
    if (!state.user) { setState({ authGateOpen: true }); return }
    setState((s) => ({ stack: [...s.stack, s.screen === 'lineup' ? 'lineup' : 'lobbies'], screen: 'actCreate', createChooser: false, actSheet: null, actPick: pick || null, actQuery: '', actStageFree: '', actTimeFree: '', actSpot: '', actNote: '', aMarker: null }))
  }
  function openActCreateFromSheet() { const a = curLineup()?.acts.find((x) => x.id === state.actSheet); startActCreate(a || null) }
  const pickAct = (a: LineupAct) => setState({ actPick: a, actQuery: '' })
  const clearActPick = () => setState({ actPick: null, actQuery: '' })
  const setActQuery = (v: string) => setState({ actQuery: v })
  const setActStageFree = (v: string) => setState({ actStageFree: v })
  const setActTimeFree = (v: string) => setState({ actTimeFree: v })
  const setActSpot = (v: string) => setState({ actSpot: v })
  const setActNote = (v: string) => setState({ actNote: v })
  function submitAct() {
    const pick = state.actPick
    const name = pick ? pick.act : state.actQuery.trim()
    if (!name) { flash('Welchen Act begleitest du?'); return }
    if (!state.actSpot.trim()) { flash('Wo trefft ihr euch?'); return }
    if (state.editLobbyId != null) {
      const id = state.editLobbyId
      setState((st) => ({ lobbies: st.lobbies.map((l) => (l.id === id ? { ...l, actId: pick ? pick.id : null, act: name, stage: pick ? pick.stage : (st.actStageFree.trim() || '—'), time: pick ? pick.time : (st.actTimeFree.trim() || 'bald'), startMin: pick ? pick.min : l.startMin, spot: st.actSpot.trim(), note: st.actNote.trim(), mx: st.aMarker?.x ?? null, my: st.aMarker?.y ?? null } : l)), screen: 'actDetail', activeLobbyId: id, editLobbyId: null, aMarker: null, actPick: null, actQuery: '', actStageFree: '', actTimeFree: '', actSpot: '', actNote: '', stack: ['lobbies'] }))
      flash('Änderungen gespeichert ✏️'); return
    }
    const id = Date.now()
    const l: Lobby = { id, kind: 'act', actId: pick ? pick.id : null, act: name, icon: 'ph-fill ph-music-notes', stage: pick ? pick.stage : state.actStageFree.trim() || '—', time: pick ? pick.time : state.actTimeFree.trim() || 'bald', startMin: pick ? pick.min : 60, spot: state.actSpot.trim(), note: state.actNote.trim(), members: [state.nickname || 'DU'], owner: state.nickname || 'DU', mx: state.aMarker?.x ?? null, my: state.aMarker?.y ?? null }
    setState((s) => ({ lobbies: [l, ...s.lobbies], screen: 'actDetail', stack: [], activeLobbyId: id, joined: { ...s.joined, [id]: true }, aMarker: null, actPick: null, actQuery: '', actStageFree: '', actTimeFree: '', actSpot: '', actNote: '', treffenFilter: 'acts', lobbyChats: { ...s.lobbyChats, [id]: [{ who: 'System', sys: true, text: 'Treffen eröffnet 🎶 Sag der Gruppe kurz Hallo!' }] } }))
    flash('Dein Treffen ist offen 🎶')
    if (state.remindersOptIn === null) setState({ optInOpen: true })
  }
  const dismissActRules = () => setState({ actRulesSeen: true })
  const openTreffenReport = () => setState({ treffenReport: true, reportText: '' })
  const closeTreffenReport = () => setState({ treffenReport: false })
  const submitTreffenReport = () => { setState({ treffenReport: false, reportText: '' }); flash('Danke — wir kümmern uns darum') }

  // ---- map ------------------------------------------------------------------
  function openPlaceMap(ctx: 'listing' | 'lobby' | 'act') {
    const cur = ctx === 'listing' ? state.cMarker : ctx === 'lobby' ? state.lMarker : state.aMarker
    let draft: Marker | null = cur ? { ...cur } : null
    if (ctx === 'act' && !draft) { const p = stagePos(actStageName()); if (p) draft = { ...p } }
    setState({ screen: 'map', mapMode: 'place', mapCtx: ctx, draftMarker: draft, mapZoom: 1, mapPanX: 0, mapPanY: 0, mapSheet: null })
  }
  const openPlaceListing = () => openPlaceMap('listing')
  const openPlaceLobby = () => openPlaceMap('lobby')
  const openPlaceAct = () => openPlaceMap('act')
  const removeListingMarker = () => { setState({ cMarker: null }); flash('Marker entfernt') }
  const removeLobbyMarker = () => { setState({ lMarker: null }); flash('Marker entfernt') }
  const removeActMarker = () => { setState({ aMarker: null }); flash('Marker entfernt') }
  function confirmMarker() {
    const m = state.draftMarker
    const c = state.mapCtx
    if (c === 'listing') setState({ cMarker: m, screen: 'create', mapMode: null })
    else if (c === 'lobby') setState({ lMarker: m, screen: 'lobbyCreate', mapMode: null })
    else setState({ aMarker: m, screen: 'actCreate', mapMode: null })
    if (m) flash('Standort gesetzt 📍')
  }
  function skipPlaceMap() {
    const c = state.mapCtx
    setState({ screen: c === 'listing' ? 'create' : c === 'lobby' ? 'lobbyCreate' : 'actCreate', mapMode: null })
  }
  const closeOverview = () => setState({ screen: 'feed', mapMode: null, mapSheet: null })
  const mapHeaderBack = () => { const m = state.mapMode; if (m === 'place') skipPlaceMap(); else if (m === 'overview') closeOverview(); else back() }
  function openViewMarker(m: ViewMarker) { setState((s) => ({ stack: [...s.stack, s.screen], screen: 'map', mapMode: 'view', viewMarker: m, mapZoom: 1, mapPanX: 0, mapPanY: 0, mapSheet: null })) }
  const setDraftMarker = (m: Marker) => setState({ draftMarker: m })
  const setPan = (x: number, y: number) => setState({ mapPanX: x, mapPanY: y })
  const mapZoomIn = () => setState((s) => ({ mapZoom: Math.min(2.6, +(s.mapZoom + 0.4).toFixed(2)) }))
  const mapZoomOut = () => setState((s) => { const z = Math.max(1, +(s.mapZoom - 0.4).toFixed(2)); return { mapZoom: z, mapPanX: z <= 1 ? 0 : s.mapPanX, mapPanY: z <= 1 ? 0 : s.mapPanY } })
  const setMapFilter = (k: string) => setState({ mapFilter: k, mapSheet: null })
  const openMapSheet = (kind: 'item' | 'lobby', id: number) => setState({ mapSheet: { kind, id } })
  const closeMapSheet = () => setState({ mapSheet: null })
  function mapSheetView() {
    const sheet = state.mapSheet; if (!sheet) return
    if (sheet.kind === 'item') setState((s) => ({ screen: 'detail', mapMode: null, mapSheet: null, activeItemId: sheet.id, chatMsgs: null, stack: [...s.stack, 'feed'] }))
    else setState((s) => ({ screen: 'lobbyDetail', mapMode: null, mapSheet: null, activeLobbyId: sheet.id, stack: [...s.stack, 'feed'] }))
  }
  function openActiveMarker() {
    const it = findItem(state.activeItemId) || state.items[0]
    if (it && it.mx != null) openViewMarker({ x: it.mx, y: it.my as number, color: accentVar(it.type), icon: catIcon(it.cat), label: it.title })
  }
  function openLobbyMarker() {
    const l = findLobby(state.activeLobbyId) || state.lobbies[0]
    if (l && l.mx != null) { const a = lobbyKind(l) === 'act'; openViewMarker({ x: l.mx, y: l.my as number, color: a ? 'var(--suche)' : 'var(--games)', icon: lobbyIcon(l), label: a ? (l.act as string) : (l.game as string) }) }
  }

  // ---- reminders ------------------------------------------------------------
  const openBell = () => setState({ bellOpen: true })
  const closeBell = () => setState({ bellOpen: false })
  const openOptIn = () => setState({ optInOpen: true })
  const optInAllow = () => { setState({ remindersOptIn: true, optInOpen: false }); flash('Erinnerungen aktiv 🔔') }
  const optInLater = () => setState({ remindersOptIn: false, optInOpen: false })
  function checkReminders() {
    if (state.remindersOptIn !== true || state.reminderModal || state.optInOpen) return
    for (const l of state.lobbies) {
      if (!state.joined[l.id]) continue
      const mins = l.startMin - state.tick / 60
      if (mins <= -1) continue
      for (const thr of [5, 30]) {
        const key = `${l.id}-${thr}`
        if (mins <= thr && !state.firedReminders[key] && (state.snoozeUntil[l.id] || 0) <= state.tick) {
          const f = { ...state.firedReminders, [key]: true }
          if (thr === 5) f[`${l.id}-30`] = true
          setState({ reminderModal: { lobbyId: l.id, threshold: thr }, firedReminders: f })
          return
        }
      }
    }
  }
  const SIM_TEXTS = ['Bin auf dem Weg 🙌', 'Wer bringt was mit?', 'Kurze Verspätung, sorry!', 'Sind schon da 🎉', 'Passt das noch bei euch?', 'Wo genau trefft ihr euch?']
  function maybeSimulateChat() {
    // occasionally deliver a message to a joined group chat you are not currently viewing
    const viewing = state.screen === 'lobbyChat' ? state.activeLobbyId : -1
    const candidates = state.lobbies.filter((l) => state.joined[l.id] && l.id !== viewing && l.members.some((m) => m !== 'DU'))
    if (!candidates.length || Math.random() > 0.04) return
    const l = candidates[Math.floor(Math.random() * candidates.length)]
    const others = l.members.filter((m) => m !== 'DU')
    const who = others[Math.floor(Math.random() * others.length)]
    const text = SIM_TEXTS[Math.floor(Math.random() * SIM_TEXTS.length)]
    setState((s) => ({ lobbyChats: { ...s.lobbyChats, [l.id]: [...(s.lobbyChats[l.id] || []), { who, text }] } }))
  }
  function tickSecond() { state.tick += 1; checkReminders(); maybeSimulateChat() }
  function rmGoLobby() { const id = state.reminderModal?.lobbyId; setState({ reminderModal: null }); if (id != null) openLobby(id) }
  function rmSnooze() {
    const id = state.reminderModal?.lobbyId; if (id == null) return
    setState((s) => { const f = { ...s.firedReminders }; delete f[`${id}-5`]; delete f[`${id}-30`]; return { reminderModal: null, snoozeUntil: { ...s.snoozeUntil, [id]: s.tick + 600 }, firedReminders: f } })
    flash('Erinnerung in 10 Min ⏱')
  }
  function rmDismiss() { const id = state.reminderModal?.lobbyId; setState({ reminderModal: null }); if (id != null) setState({ activeLobbyId: id, leaveOpen: true, leaveText: '' }) }

  // =========================================================================
  // Getters — plain typed view-models (no styling)
  // =========================================================================

  const dark = computed(() => state.dark)
  const themeName = computed(() => (state.dark ? 'dark' : 'light'))
  const themeIcon = computed(() => (state.dark ? 'ph-fill ph-sun' : 'ph-fill ph-moon-stars'))
  const isTopLevel = computed(() => (['feed', 'lobbies', 'profile'] as string[]).includes(state.screen))
  const hasPlan = computed(() => { const v = !!curPlan(); hasPlanFlag = v; return v })
  const hasLineup = computed(() => !!curLineup())
  const feedVariant = computed(() => (state.feedTouched ? state.feedVariant : 'poster'))

  function decorateCard(it: Item) {
    return {
      id: it.id, type: it.type, typeLabel: it.type === 'biete' ? 'BIETE' : 'SUCHE',
      typeIcon: it.type === 'biete' ? 'ph-fill ph-tag' : 'ph-fill ph-magnifying-glass',
      accentVar: accentVar(it.type), catIcon: catIcon(it.cat), title: it.title, zone: it.zone, time: it.time,
      priceLabel: priceInfo(it).label, priceShort: priceInfo(it).short, priceIcon: priceInfo(it).icon,
      hasPhoto: !!it.photo, photoLabel: it.photo || '', hasMarker: hasPlanFlag && it.mx != null,
    }
  }

  const feedItems = computed(() => state.items.filter((it) => {
    if (state.typeFilter !== 'alle' && it.type !== state.typeFilter) return false
    if (state.catFilter !== 'alle' && it.cat !== state.catFilter) return false
    if (state.viewZone !== 'alle' && !it.zone.startsWith(state.viewZone)) return false
    return true
  }))
  const feedCards = computed(() => feedItems.value.map(decorateCard))
  const feedCount = computed(() => feedCards.value.length)
  const feedFiltersActive = computed(() => state.typeFilter !== 'alle' || feedVariant.value !== 'poster')
  const zoneLabel = computed(() => (state.viewZone === 'alle' ? 'Alle Zonen' : state.viewZone))

  const typeSegments = computed(() => [
    { key: 'alle', label: 'Alles', active: state.typeFilter === 'alle', color: 'text' as const },
    { key: 'suche', label: 'Gesuche', active: state.typeFilter === 'suche', color: 'suche' as const },
    { key: 'biete', label: 'Angebote', active: state.typeFilter === 'biete', color: 'biete' as const },
  ])
  const gameTabs = computed(() => [
    { key: 'entdecken', label: 'Entdecken', active: state.gameTab === 'entdecken', color: 'games' as const },
    { key: 'meine', label: 'Meine Treffen', active: state.gameTab === 'meine', color: 'games' as const },
  ])
  const variantSegments = computed(() => (['poster', 'kompakt', 'foto'] as const).map((k, i) => ({
    key: k, title: ['Poster', 'Kompakt', 'Foto'][i], icon: ['ph-bold ph-rows', 'ph-bold ph-list', 'ph-bold ph-image'][i], active: feedVariant.value === k,
  })))
  const categoryFilters = computed(() => [
    { key: 'alle', label: 'Alles', icon: 'ph-bold ph-squares-four', active: state.catFilter === 'alle' },
    ...CAT_KEYS.map((k) => ({ key: k, label: CAT[k].label, icon: CAT[k].icon, active: state.catFilter === k })),
  ])
  const zoneOptions = computed(() => FEED_ZONES.map((z) => ({ key: z, label: z === 'alle' ? 'Alle Zonen' : z, active: state.viewZone === z })))

  const createCategories = computed(() => CAT_KEYS.map((k) => ({ key: k, label: CAT[k].label, icon: CAT[k].icon, active: state.cCat === k })))
  const priceOptions = computed(() => [
    { key: 'verhandlung', label: 'Preis / VB', icon: 'ph-bold ph-currency-eur', active: state.cPrice === 'verhandlung' },
    { key: 'tausch', label: 'Tausch', icon: 'ph-bold ph-arrows-left-right', active: state.cPrice === 'tausch' },
    { key: 'gratis', label: 'Gratis', icon: 'ph-bold ph-gift', active: state.cPrice === 'gratis' },
  ])
  const createHeading = computed(() => (state.cType === 'suche' ? 'Was brauchst du?' : 'Was gibst du ab?'))
  const titlePlaceholder = computed(() => (state.cType === 'suche' ? 'z. B. Luftpumpe, dringend!' : 'z. B. Kaltes Bier, halbe Palette'))
  const createTitle = computed(() => (state.editItemId != null ? 'Inserat bearbeiten' : 'Inserat erstellen'))
  const submitLabel = computed(() => (state.editItemId != null ? 'Änderungen speichern' : state.cType === 'suche' ? 'Gesuch reinstellen' : 'Angebot reinstellen'))
  const lobbyCreateTitle = computed(() => (state.editLobbyId != null ? 'Lobby bearbeiten' : 'Lobby eröffnen'))
  const lobbySubmitLabel = computed(() => (state.editLobbyId != null ? 'Änderungen speichern' : 'Lobby starten'))
  const actCreateTitle = computed(() => (state.editLobbyId != null ? 'Act-Treffen bearbeiten' : 'Act-Treffen eröffnen'))
  const actSubmitLabel = computed(() => (state.editLobbyId != null ? 'Änderungen speichern' : 'Treffen eröffnen'))
  const createAccentVar = computed(() => accentVar(state.cType))
  const cMarkerIcon = computed(() => (state.cCat ? catIcon(state.cCat as CatKey) : 'ph-fill ph-map-pin'))

  const activeItem = computed(() => {
    const it = findItem(state.activeItemId) || state.items[0]
    return {
      ...decorateCard(it), catLabel: catLabel(it.cat), desc: it.desc, seller: it.seller, sellerInit: initials(it.seller),
      rating: it.rating, deals: it.deals, expiry: 'Läuft in 23 Std ab',
      hasMarker: hasPlanFlag && it.mx != null, marker: it.mx != null ? { x: it.mx, y: it.my as number } : null,
      markerColor: accentVar(it.type), markerIcon: catIcon(it.cat), isMine: isMineItem(it),
    }
  })
  const chatMessages = computed(() => state.chatMsgs || [])

  // -- lobbies / treffen
  function decorateLobbyList(l: Lobby) {
    const isAct = lobbyKind(l) === 'act'
    const cd = countdownShort(l.startMin, state.tick)
    return {
      id: l.id, isAct, accent: isAct ? 'suche' : 'games', accentVar: isAct ? 'var(--suche)' : 'var(--games)',
      icon: lobbyIcon(l), title: lobbyTitle(l), stage: l.stage || '', hasStage: isAct, spot: l.spot, timeClock: l.time,
      countLabel: isAct ? `${l.members.length} gehen mit` : `${l.members.length}/${l.need} dabei`,
      countdown: cd.label, status: cd.status, members: l.members.slice(0, 4),
      cta: isAct ? 'Ich geh mit' : 'Details', ctaIcon: isAct ? 'ph-fill ph-hand-waving' : 'ph-bold ph-caret-right',
    }
  }
  const lobbyList = computed(() => state.lobbies
    .filter((l) => state.treffenFilter === 'alle' || (state.treffenFilter === 'acts' ? lobbyKind(l) === 'act' : lobbyKind(l) === 'spiel'))
    .filter((l) => {
      if (state.treffenFilter === 'acts' && state.actFilter) return l.act === state.actFilter
      if (state.treffenFilter === 'spiele' && state.gameFilter !== 'alle') return (l.game || '').toLowerCase().includes(state.gameFilter.toLowerCase())
      return true
    })
    .slice().sort((a, b) => a.startMin - b.startMin)
    .map(decorateLobbyList))
  const discoverEmpty = computed(() => lobbyList.value.length === 0)
  const treffenFilterSegments = computed(() => [
    { key: 'alle', label: 'Alle', active: state.treffenFilter === 'alle', color: 'text' as const },
    { key: 'spiele', label: 'Spiele', active: state.treffenFilter === 'spiele', color: 'games' as const },
    { key: 'acts', label: 'Acts', active: state.treffenFilter === 'acts', color: 'suche' as const },
  ])
  const showActFilter = computed(() => state.treffenFilter === 'acts')
  const actFilterSelected = computed(() => state.actFilter)
  const actArtistCounts = computed(() => {
    const counts = new Map<string, number>()
    state.lobbies.filter((l) => lobbyKind(l) === 'act').forEach((l) => counts.set(l.act as string, (counts.get(l.act as string) || 0) + 1))
    return Array.from(counts, ([name, count]) => ({ name, count }))
  })
  const actSuggestions = computed(() => {
    const q = state.actFilterQuery.trim().toLowerCase()
    if (!q) return []
    return actArtistCounts.value.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 8)
  })
  const showGameFilter = computed(() => state.treffenFilter === 'spiele')
  const gameFilterOptions = computed(() => [
    { key: 'alle', label: 'Alle', icon: 'ph-bold ph-squares-four', active: state.gameFilter === 'alle' },
    ...GAMES.map((g) => ({ key: g.label, label: g.label, icon: g.icon, active: state.gameFilter === g.label })),
  ])
  const treffenFiltersActive = computed(() => state.treffenFilter !== 'alle' || !!state.actFilter || state.gameFilter !== 'alle')

  const now = () => state.tick / 60
  function decorateMyGame(l: Lobby) {
    const isAct = lobbyKind(l) === 'act'
    const cd = countdownLong(l.startMin, state.tick)
    return {
      id: l.id, isAct, accentVar: isAct ? 'var(--suche)' : 'var(--games)', kindLabel: isAct ? 'ACT' : 'SPIEL',
      title: lobbyTitle(l), icon: lobbyIcon(l), spot: l.spot,
      count: isAct ? `${l.members.length} gehen mit` : `${l.members.length}/${l.need}`,
      members: l.members.slice(0, 4), countdown: cd.label, status: cd.status, isLive: cd.status === 'live',
    }
  }
  const myList = computed(() => state.lobbies.filter((l) => state.joined[l.id] && l.startMin - now() > -60).sort((a, b) => a.startMin - b.startMin))
  const myGames = computed(() => myList.value.map(decorateMyGame))
  const hasMyGames = computed(() => myGames.value.length > 0)
  const unreadChats = computed(() => state.lobbies
    .filter((l) => state.joined[l.id] && unreadOf(l.id) > 0)
    .map((l) => {
      const msgs = state.lobbyChats[l.id] || []
      const last = [...msgs].reverse().find((m) => !m.sys)
      const isAct = lobbyKind(l) === 'act'
      return { id: l.id, title: lobbyTitle(l), icon: lobbyIcon(l), accentVar: isAct ? 'var(--suche)' : 'var(--games)', preview: last ? `${last.who === 'DU' ? 'Du' : last.who}: ${last.text}` : '', count: unreadOf(l.id) }
    }))

  const activeLobby = computed(() => {
    const l = findLobby(state.activeLobbyId) || state.lobbies[0]
    const isAct = lobbyKind(l) === 'act'
    const cd = countdownLong(l.startMin, state.tick)
    const emptyCount = Math.max(0, (l.need || 0) - l.members.length)
    return {
      id: l.id, isAct, title: lobbyTitle(l), icon: lobbyIcon(l), stage: l.stage || '', spot: l.spot, time: l.time,
      note: l.note || '', hasNote: !!(l.note && `${l.note}`.trim()), countdown: cd.label, status: cd.status,
      count: isAct ? `${l.members.length} gehen mit` : `${l.members.length}/${l.need} dabei`,
      headCount: isAct ? `${l.members.length} dabei` : `${l.members.length}/${l.need} dabei`,
      members: l.members, empty: Math.min(emptyCount, 6),
      hasMarker: hasPlanFlag && l.mx != null, marker: l.mx != null ? { x: l.mx, y: l.my as number } : null,
      markerIcon: lobbyIcon(l), markerColorVar: isAct ? 'var(--suche)' : 'var(--games)',
      joined: !!state.joined[l.id], isMine: isMineLobby(l),
    }
  })
  const lobbyMessages = computed(() => (state.lobbyChats[state.activeLobbyId] || []).map((m) => ({
    who: m.who, text: m.text, me: m.me || m.who === 'DU', sys: !!m.sys,
  })))
  const activeLobbyJoined = computed(() => !!state.joined[state.activeLobbyId])

  // -- lineup / act create
  const lineupDays = computed(() => (curLineup()?.days || []))
  const lineupDayIndex = computed(() => Math.min(state.lineupDay, Math.max(0, lineupDays.value.length - 1)))
  const actCompanions = (aid: string) => state.lobbies.filter((l) => lobbyKind(l) === 'act' && l.actId === aid)
  const lineupStages = computed(() => {
    const lu = curLineup(); if (!lu) return []
    const dayActs = lu.acts.filter((a) => a.day === lineupDayIndex.value)
    const stages: string[] = []
    dayActs.forEach((a) => { if (!stages.includes(a.stage)) stages.push(a.stage) })
    return stages.map((stage) => ({
      stage,
      rows: dayActs.filter((a) => a.stage === stage).sort((a, b) => (a.time > b.time ? 1 : -1)).map((a) => {
        const comp = actCompanions(a.id)
        return { id: a.id, time: a.time, act: a.act, hasComp: comp.length > 0, compLabel: `${comp.length}${comp.length === 1 ? ' sucht' : ' suchen'} Begleitung` }
      }),
    }))
  })
  const actSheetData = computed(() => {
    const lu = curLineup()
    if (!state.actSheet || !lu) return null
    const a = lu.acts.find((x) => x.id === state.actSheet); if (!a) return null
    const comp = actCompanions(a.id)
    return {
      actId: a.id, act: a.act, stage: a.stage, time: a.time, day: lu.days[a.day], hasComp: comp.length > 0,
      companions: comp.map((l) => ({ id: l.id, spot: l.spot, count: `${l.members.length} gehen mit`, members: l.members.slice(0, 4) })),
    }
  })
  const actPickView = computed(() => (state.actPick ? { act: state.actPick.act, stage: state.actPick.stage, time: state.actPick.time, day: curLineup()?.days[state.actPick.day] || '' } : null))
  const actSearch = computed(() => {
    const lu = curLineup(); const q = state.actQuery.trim().toLowerCase()
    if (!lu || state.actPick || !q) return []
    return lu.acts.filter((a) => a.act.toLowerCase().includes(q) || a.stage.toLowerCase().includes(q)).slice(0, 6)
      .map((a) => ({ id: a.id, act: a.act, stage: a.stage, time: a.time, day: lu.days[a.day], pick: a }))
  })

  // -- map
  const planPins = computed(() => {
    const pins: { key: string; x: number; y: number; colorVar: string; icon: string; kind: 'item' | 'lobby'; id: number }[] = []
    state.items.filter((it) => it.mx != null && (state.mapFilter === 'alle' || (state.mapFilter !== 'spiele' && state.mapFilter !== 'acts' && it.cat === state.mapFilter)))
      .forEach((it) => pins.push({ key: `i${it.id}`, x: it.mx as number, y: it.my as number, colorVar: accentVar(it.type), icon: catIcon(it.cat), kind: 'item', id: it.id }))
    state.lobbies.filter((l) => l.mx != null && (state.mapFilter === 'alle' || (state.mapFilter === 'spiele' && lobbyKind(l) === 'spiel') || (state.mapFilter === 'acts' && lobbyKind(l) === 'act')))
      .forEach((l) => pins.push({ key: `l${l.id}`, x: l.mx as number, y: l.my as number, colorVar: lobbyKind(l) === 'act' ? 'var(--suche)' : 'var(--games)', icon: lobbyIcon(l), kind: 'lobby', id: l.id }))
    return pins
  })
  const mapCategories = computed(() => [
    { key: 'alle', label: 'Alles', icon: 'ph-bold ph-squares-four', active: state.mapFilter === 'alle' },
    ...CAT_KEYS.map((k) => ({ key: k, label: CAT[k].label, icon: CAT[k].icon, active: state.mapFilter === k })),
    { key: 'spiele', label: 'Spiele', icon: 'ph-fill ph-game-controller', active: state.mapFilter === 'spiele' },
    { key: 'acts', label: 'Acts', icon: 'ph-fill ph-music-notes', active: state.mapFilter === 'acts' },
  ])
  const mapSheetData = computed(() => {
    const sheet = state.mapSheet; if (!sheet) return null
    if (sheet.kind === 'item') {
      const it = findItem(sheet.id); if (!it) return null
      return { title: it.title, sub: it.zone, icon: catIcon(it.cat), colorVar: accentVar(it.type), typeLabel: it.type === 'biete' ? 'BIETE' : 'SUCHE', meta: priceInfo(it).label }
    }
    const l = findLobby(sheet.id); if (!l) return null
    const isAct = lobbyKind(l) === 'act'
    return { title: lobbyTitle(l), sub: l.spot, icon: lobbyIcon(l), colorVar: isAct ? 'var(--suche)' : 'var(--games)', typeLabel: isAct ? 'ACT' : 'SPIEL', meta: isAct ? `${l.members.length} gehen mit` : `${l.members.length}/${l.need} dabei` }
  })
  const mapTitle = computed(() => (state.mapMode === 'place' ? 'Standort setzen' : state.mapMode === 'overview' ? 'Geländeplan' : 'Standort'))
  const placeColorVar = computed(() => (state.mapCtx === 'lobby' ? 'var(--games)' : state.mapCtx === 'act' ? 'var(--suche)' : accentVar(state.cType)))
  const placeIcon = computed(() => (state.mapCtx === 'lobby' ? GAMES.find((g) => g.label === state.lobbyGame)?.icon || 'ph-fill ph-game-controller' : state.mapCtx === 'act' ? 'ph-fill ph-music-notes' : state.cCat ? catIcon(state.cCat as CatKey) : state.cType === 'biete' ? 'ph-fill ph-tag' : 'ph-fill ph-magnifying-glass'))
  const lobbyGameIcon = computed(() => GAMES.find((g) => g.label === state.lobbyGame)?.icon || 'ph-fill ph-game-controller')
  const gamePicks = computed(() => GAMES.map((g) => ({ label: g.label, icon: g.icon, active: state.lobbyGame === g.label })))

  // -- profile
  const me = computed(() => ({ name: state.user ? state.user.username : state.nickname || 'Gast', init: initials(state.user ? state.user.username : state.nickname || 'Ga'), zone: state.zone }))
  const myItems = computed(() => {
    if (!state.user) return []
    const name = myName()
    return state.items.filter((it) => it.seller === name).map((it) => ({
      id: it.id, title: it.title, typeLabel: it.type === 'biete' ? 'BIETE' : 'SUCHE',
      accentVar: accentVar(it.type), catIcon: catIcon(it.cat), zone: it.zone.split(' · ')[0],
    }))
  })
  const meFestival = computed(() => (state.festival ? state.festival.name : 'Kein Festival gewählt'))
  const meFestivalSub = computed(() => `Aktives Festival${state.festival ? ` · ${state.festival.date}` : ''}`)
  const remindersStatus = computed(() => (state.remindersOptIn === true ? 'Erlaubt – wir stupsen dich an' : state.remindersOptIn === false ? 'Aus' : 'Noch nicht eingerichtet'))
  const remindersBtnLabel = computed(() => (state.remindersOptIn === true ? 'Verwalten' : 'Einrichten'))
  const isLoggedIn = computed(() => !!state.user)

  // -- festival picker / reset messages
  const festivalCards = computed(() => {
    const q = state.festivalSearch.trim().toLowerCase()
    return state.festivals.filter((f) => !q || f.name.toLowerCase().includes(q) || f.place.toLowerCase().includes(q))
      .map((f) => ({ id: f.id, name: f.name, place: f.place, date: f.date, status: f.status, selected: state.festival?.id === f.id, raw: f }))
  })
  const hasQr = computed(() => !!state.festivals.find((f) => f.name === state.qrFestival) && !state.festivalSearch.trim())
  const zoneTiles = computed(() => {
    const names = state.festival?.zones || ['Camp A', 'Camp B', 'Camp C', 'Camp D']
    return names.map((z) => ({ label: z, desc: ZONE_DESCS[z] || 'Campingzone', active: state.zone === z }))
  })
  const resetMsg = computed(() => (state.resetDone === 'sent' ? 'Reset-Link ist unterwegs — schau in dein Postfach.' : state.resetDone === 'noemail' ? 'Für dieses Konto ist keine E-Mail hinterlegt. Reset leider nicht möglich.' : state.resetDone === 'noaccount' ? 'Kein Konto mit diesem Namen gefunden.' : ''))

  // -- banner + reminder modal + bell
  const banner = computed(() => {
    if (state.remindersOptIn !== true) return null
    const soon = myList.value.map((l) => ({ l, mins: Math.round(l.startMin - now()) })).filter((x) => x.mins <= 30).sort((a, b) => a.mins - b.mins)
    if (!soon.length) return null
    const { l, mins } = soon[0]
    const live = mins <= 0
    return { id: l.id, game: l.game || l.act || '', text: `${live ? 'läuft jetzt' : `startet in ${mins} Min`} · ${l.spot}`, icon: live ? 'ph-fill ph-broadcast' : 'ph-fill ph-timer', tone: live ? 'live' : mins <= 5 ? 'urgent' : 'soon' }
  })
  const reminderModalData = computed(() => {
    if (!state.reminderModal) return null
    const l = findLobby(state.reminderModal.lobbyId); if (!l) return null
    const cd = countdownLong(l.startMin, state.tick)
    const isAct = lobbyKind(l) === 'act'
    return { tone: cd.status === 'live' ? 'live' : 'soon', game: isAct ? l.act : l.game, icon: lobbyIcon(l), spot: l.spot, count: isAct ? `${l.members.length} gehen mit` : `${l.members.length}/${l.need} dabei`, label: cd.label }
  })
  const bellCount = computed(() => myGames.value.length + unreadChats.value.length)
  const accountRow = computed(() => (state.user
    ? { label: 'Ausloggen', icon: 'ph-bold ph-sign-out', tone: 'danger' as const }
    : { label: 'Konto erstellen', icon: 'ph-bold ph-user-plus', tone: 'biete' as const }))
  const accountRowAction = () => (state.user ? openLogout() : startRegister())

  return {
    ...toRefs(state),
    // getters
    dark, themeName, themeIcon, isTopLevel, hasPlan, hasLineup, feedVariant,
    feedCards, feedCount, feedFiltersActive, zoneLabel, typeSegments, gameTabs, variantSegments, categoryFilters, zoneOptions,
    createCategories, priceOptions, createHeading, titlePlaceholder, createTitle, submitLabel, lobbyCreateTitle, lobbySubmitLabel, actCreateTitle, actSubmitLabel, createAccentVar, cMarkerIcon,
    activeItem, chatMessages,
    lobbyList, discoverEmpty, treffenFilterSegments, showActFilter, actFilterSelected, actSuggestions, showGameFilter, gameFilterOptions, treffenFiltersActive, myGames, hasMyGames, unreadChats, activeLobby, lobbyMessages, activeLobbyJoined,
    lineupDays, lineupDayIndex, lineupStages, actSheetData, actPickView, actSearch,
    planPins, mapCategories, mapSheetData, mapTitle, placeColorVar, placeIcon, lobbyGameIcon, gamePicks,
    me, myItems, meFestival, meFestivalSub, remindersStatus, remindersBtnLabel, isLoggedIn,
    festivalCards, hasQr, zoneTiles, resetMsg, banner, reminderModalData, bellCount, accountRow,
    // actions
    goFeed, goLobbies, goProfile, goWelcome, goBack, toggleTheme, finishOnboarding, switchFestival,
    setAuthUser, setAuthPass, setAuthPass2, setAuthEmail, setResetUser, startRegister, startLogin, browseGuest,
    submitRegister, submitLogin, goReset, submitReset, randomAuthUser, closeAuthGate, openLogout, closeLogout, confirmLogout,
    setFestivalSearch, pickFestival, confirmQr, setZone, setTreffpunkt,
    setViewZone, openZoneSheet, closeZoneSheet, openFilterSheet, closeFilterSheet, setTypeFilter, setCatFilter, setFeedVariant, openOverviewMap,
    openItem, reportItem, setReportText, closeReport, submitReport, openChat, quickReply, setChatDraft, sendMsg, rateUp, rateDown,
    startCreate, startEditItem, cancelCreate, setCType, setCCat, setCTitle, setCPrice, setCPriceVal, toggleCPhoto, submitCreate,
    askDeleteItem, askDeleteLobby, cancelDelete, confirmDeleteAction, startEditLobby, cancelTreffenCreate,
    setEntdecken, setMeine, setTreffenFilter, setActFilterQuery, selectActFilter, clearActFilter, setGameFilter, openTreffenSheet, closeTreffenSheet, openLobby, openLobbyChat, openLobbyChatById, openCreateChooser, closeCreateChooser, chooseSpiel, chooseAct, openLineup,
    joinLobby, openLeave, leaveFromCard, closeLeave, setLeaveText, confirmLeave, setLobbyDraft, sendLobby, quickLobby,
    setLobbyGame, setLobbySpot, setLobbyTime, slotsMinus, slotsPlus, submitLobby,
    setLineupDay, openActSheet, closeActSheet, startActCreate, openActCreateFromSheet, pickAct, clearActPick,
    setActQuery, setActStageFree, setActTimeFree, setActSpot, setActNote, submitAct,
    dismissActRules, openTreffenReport, closeTreffenReport, submitTreffenReport,
    openPlaceListing, openPlaceLobby, openPlaceAct, removeListingMarker, removeLobbyMarker, removeActMarker,
    confirmMarker, skipPlaceMap, closeOverview, mapHeaderBack, setDraftMarker, setPan, mapZoomIn, mapZoomOut,
    setMapFilter, openMapSheet, closeMapSheet, mapSheetView, openActiveMarker, openLobbyMarker,
    openBell, closeBell, openOptIn, optInAllow, optInLater, tickSecond, rmGoLobby, rmSnooze, rmDismiss,
    accountRowAction,
  }
})
