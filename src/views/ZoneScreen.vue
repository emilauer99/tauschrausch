<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'
import TileButton from '@/components/ui/TileButton.vue'
import AppButton from '@/components/ui/AppButton.vue'

const app = useAppStore()
</script>

<template>
  <div class="zone">
    <div class="zone__head">
      <IconButton icon="ph-bold ph-arrow-left" @click="app.goBack()" />
      <div class="dots"><span /><span /><span /></div>
      <span class="spacer" />
    </div>
    <span class="step">LETZTER SCHRITT</span>
    <h2 class="zone__title">Wo campst du?</h2>
    <p class="zone__sub">Zonen von {{ app.meFestival }} — kein GPS, nur die Zone.</p>
    <div class="zone__grid">
      <TileButton
        v-for="(z, i) in app.zoneTiles"
        :key="i"
        icon="ph-fill ph-tent"
        :label="z.label"
        :desc="z.desc"
        :active="z.active"
        :icon-size="30"
        @click="app.setZone(z.label)"
      />
    </div>
    <input class="spot" placeholder="Genauer Treffpunkt (optional) — z. B. Reihe 12, blaue Piratenflagge" :value="app.treffpunkt" @input="app.setTreffpunkt(($event.target as HTMLInputElement).value)" />
    <AppButton class="zone__cta" icon="ph-bold ph-arrow-right" @click="app.finishOnboarding()">Rein ins Getümmel</AppButton>
  </div>
</template>

<style scoped>
.zone { min-height: 790px; display: flex; flex-direction: column; padding: 8px 28px 40px; }
.zone__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; }
.dots { display: flex; gap: 7px; }
.dots span { width: 26px; height: 6px; border-radius: 3px; background: var(--biete); }
.spacer { width: 44px; }
.step { font-size: 13px; font-weight: 600; letter-spacing: 0.1em; color: var(--biete); }
.zone__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 32px; line-height: 1.08; margin: 12px 0 10px; }
.zone__sub { font-size: 15px; color: var(--muted); margin: 0 0 24px; }
.zone__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.spot { width: 100%; padding: 16px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 14px; outline: none; margin-bottom: auto; }
.zone__cta { margin-top: 24px; }
</style>
