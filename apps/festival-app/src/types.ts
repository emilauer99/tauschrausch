/* Domain model for Tauschrausch. All app data flows through these types. */

export type Screen =
  | 'welcome' | 'register' | 'login' | 'reset' | 'festival' | 'zone'
  | 'feed' | 'create' | 'detail' | 'chat'
  | 'lobbies' | 'lobbyCreate' | 'lobbyDetail' | 'actCreate' | 'actDetail' | 'lobbyChat' | 'lineup'
  | 'map' | 'profile'

export type CatKey = 'getraenke' | 'camping' | 'hygiene' | 'schlafen' | 'services' | 'mobil' | 'sonst'
export type ListingType = 'biete' | 'suche'
export type PriceKind = 'verhandlung' | 'tausch' | 'gratis'
export type FestivalStatus = 'live' | 'soon' | 'ended'
export type LobbyKind = 'spiel' | 'act'
export type CountdownStatus = 'live' | 'soon' | 'planned'
export type FeedVariant = 'poster' | 'kompakt' | 'foto'
export type ThemeName = 'dark' | 'light'

export interface Category { label: string; icon: string }
export interface GamePick { label: string; icon: string }

export interface Account { username: string; password: string; email: string }
export interface User { username: string }

export interface Festival {
  id: string
  name: string
  place: string
  date: string
  status: FestivalStatus
  zones: string[]
}

export interface Marker { x: number; y: number }

export interface Item {
  id: number
  type: ListingType
  cat: CatKey
  title: string
  zone: string
  time: string
  priceKind: PriceKind
  price?: string
  desc: string
  photo?: string | null
  seller: string
  rating: number
  deals: number
  mx?: number | null
  my?: number | null
}

export interface Lobby {
  id: number
  kind?: LobbyKind
  game?: string
  act?: string
  actId?: string | null
  icon: string
  stage?: string
  spot: string
  time: string
  startMin: number
  need?: number
  members: string[]
  owner?: string
  note?: string
  mx?: number | null
  my?: number | null
}

export interface ChatMessage { me: boolean; text: string }
export interface LobbyMessage { who: string; text: string; me?: boolean; sys?: boolean }

export interface LineupAct {
  id: string
  day: number
  time: string
  stage: string
  act: string
  min: number
}
export interface Lineup { days: string[]; acts: LineupAct[] }

export interface ThemeTokens {
  bg: string; card: string; card2: string; line: string; text: string; muted: string
  biete: string; suche: string; games: string; danger: string
}

/** A marker opened for viewing on the full map. */
export interface ViewMarker { x: number; y: number; color: string; icon: string; label: string }

/** Reminder-modal descriptor. */
export interface ReminderModal { lobbyId: number; threshold: number }
