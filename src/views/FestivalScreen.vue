<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'

const app = useAppStore()
const badge = { live: 'läuft', soon: 'kommt bald', ended: 'beendet' }
</script>

<template>
  <div class="fest">
    <div class="fest__head">
      <IconButton icon="ph-bold ph-arrow-left" @click="app.goBack()" />
      <h2 class="fest__title">Dein Festival</h2>
    </div>
    <div class="search">
      <i class="ph-bold ph-magnifying-glass search__icon" />
      <input class="search__input" placeholder="Festival suchen…" :value="app.festivalSearch" @input="app.setFestivalSearch(($event.target as HTMLInputElement).value)" />
    </div>
    <template v-if="app.hasQr">
      <div class="qr">
        <span class="qr__tag"><i class="ph-fill ph-qr-code" />PER QR ERKANNT</span>
        <div class="qr__row">
          <div class="qr__meta">
            <div class="qr__name">{{ app.qrFestival }}</div>
            <div class="qr__hint">Stimmt das? Dann direkt bestätigen.</div>
          </div>
          <button class="qr__confirm pressable" @click="app.confirmQr()">Bestätigen<i class="ph-bold ph-check" /></button>
        </div>
      </div>
      <span class="or">ODER MANUELL WÄHLEN</span>
    </template>
    <div class="fest__list">
      <button
        v-for="f in app.festivalCards"
        :key="f.id"
        class="fcard"
        :class="[{ 'fcard--selected': f.selected, 'fcard--ended': f.status === 'ended' }]"
        @click="app.pickFestival(f.raw)"
      >
        <div class="fcard__top"><span class="fcard__name">{{ f.name }}</span><span class="fcard__badge" :class="`fcard__badge--${f.status}`">{{ badge[f.status] }}</span></div>
        <div class="fcard__meta"><span><i class="ph-fill ph-map-pin pin" />{{ f.place }}</span><span><i class="ph-fill ph-calendar-dots" />{{ f.date }}</span></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fest { min-height: 790px; display: flex; flex-direction: column; padding: 8px 28px 40px; }
.fest__head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.fest__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; margin: 0; }
.search { position: relative; margin-bottom: 18px; }
.search__icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 18px; }
.search__input { width: 100%; padding: 15px 16px 15px 46px; border-radius: 14px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 15px; outline: none; }
.qr { border-radius: 18px; padding: 16px; margin-bottom: 18px; background: color-mix(in oklab, var(--biete) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--biete) 45%, transparent); }
.qr__tag { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; color: var(--biete); margin-bottom: 10px; }
.qr__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.qr__meta { min-width: 0; }
.qr__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; }
.qr__hint { font-size: 13px; color: var(--muted); }
.qr__confirm { flex-shrink: 0; display: flex; align-items: center; gap: 7px; padding: 13px 17px; border-radius: 14px; background: var(--biete); color: var(--ink); border: none; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; }
.or { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; color: var(--muted); }
.fest__list { display: flex; flex-direction: column; gap: 11px; margin-top: 12px; }
.fcard { border-radius: 18px; padding: 16px; cursor: pointer; text-align: left; width: 100%; background: var(--card); border: 1px solid var(--line); }
.fcard--selected { border-color: var(--biete); }
.fcard--ended { opacity: 0.5; }
.fcard__top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 7px; }
.fcard__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.fcard__badge { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.03em; padding: 4px 9px; border-radius: 7px; flex-shrink: 0; }
.fcard__badge--live { background: var(--biete); color: var(--ink); }
.fcard__badge--soon { background: var(--games); color: var(--ink); }
.fcard__badge--ended { background: var(--card2); color: var(--muted); }
.fcard__meta { display: flex; align-items: center; gap: 14px; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
.fcard__meta span { display: inline-flex; align-items: center; gap: 5px; }
.fcard__meta .pin { color: var(--suche); font-size: 14px; }
.fcard__meta i { font-size: 14px; }
</style>
