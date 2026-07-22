/* Pure formatting/derivation helpers — no Vue, no state. */

import type { CountdownStatus, Item, Lobby, LobbyKind, PriceKind } from '@/types'
import { AV, CAT } from '@/data/seed'

/** Two-letter uppercase initials for an avatar. */
export function initials(name?: string, fallback = '?'): string {
  return (name ? name.slice(0, 2) : fallback.slice(0, 2)).toUpperCase()
}

/** Deterministic avatar background color by index. */
export function avatarColor(index: number): string {
  return AV[index % AV.length]
}

export interface PriceInfo { label: string; short: string; icon: string }
export function priceInfo(it: Pick<Item, 'priceKind' | 'price'>): PriceInfo {
  if (it.priceKind === 'tausch') return { label: 'Tausch', short: 'Tausch', icon: 'ph-bold ph-arrows-left-right' }
  if (it.priceKind === 'gratis') return { label: 'Gratis', short: 'Gratis', icon: 'ph-bold ph-gift' }
  return { label: it.price || 'VB', short: it.price || 'VB', icon: 'ph-bold ph-currency-eur' }
}

export function catIcon(cat: keyof typeof CAT): string {
  return (CAT[cat] || CAT.sonst).icon
}
export function catLabel(cat: keyof typeof CAT): string {
  return (CAT[cat] || CAT.sonst).label
}

export function lobbyKind(l?: Pick<Lobby, 'kind'>): LobbyKind {
  return (l && l.kind) || 'spiel'
}
export function lobbyIcon(l?: Lobby): string {
  return (l && l.icon) || (lobbyKind(l) === 'act' ? 'ph-fill ph-music-notes' : 'ph-fill ph-game-controller')
}
export function lobbyTitle(l: Lobby): string {
  return lobbyKind(l) === 'act' ? (l.act || l.game || '') : (l.game || '')
}

export interface Countdown { mins: number; status: CountdownStatus; label: string }

/** Short countdown for feed/lobby list chips ("in 5 Min"). */
export function countdownShort(startMin: number, tick: number): Countdown {
  const mins = Math.round(startMin - tick / 60)
  if (mins <= 0) return { mins, status: 'live', label: 'läuft jetzt' }
  if (mins <= 30) return { mins, status: 'soon', label: `in ${mins} Min` }
  const label = mins >= 60
    ? `in ${Math.floor(mins / 60)} Std${mins % 60 ? ` ${mins % 60} Min` : ''}`
    : `in ${mins} Min`
  return { mins, status: 'planned', label }
}

/** Verbose countdown for detail views ("startet in 5 Min"). */
export function countdownLong(startMin: number, tick: number): Countdown {
  const mins = Math.round(startMin - tick / 60)
  if (mins <= 0) return { mins, status: 'live', label: 'Läuft jetzt' }
  if (mins <= 30) return { mins, status: 'soon', label: `startet in ${mins} Min` }
  const label = mins >= 60
    ? `startet in ${Math.floor(mins / 60)} Std${mins % 60 ? ` ${mins % 60} Min` : ''}`
    : `startet in ${mins} Min`
  return { mins, status: 'planned', label }
}
