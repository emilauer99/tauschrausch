<script setup lang="ts">
import { useAppStore } from '@/store/app'
import ScreenHeader from '@/components/ui/ScreenHeader.vue'
import FormSection from '@/components/ui/FormSection.vue'
import TileButton from '@/components/ui/TileButton.vue'
import AppButton from '@/components/ui/AppButton.vue'
import MapPreview from '@/components/map/MapPreview.vue'

const app = useAppStore()
</script>

<template>
  <div class="create">
    <ScreenHeader leading="close" :title="app.createTitle" @back="app.cancelCreate()">
      <template #end><span class="timer"><i class="ph-fill ph-timer" />&lt;60s</span></template>
    </ScreenHeader>

    <div class="create__body">
      <div class="toggle">
        <button class="toggle__btn" :class="{ 'toggle__btn--active toggle__btn--suche': app.cType === 'suche' }" @click="app.setCType('suche')"><i class="ph-fill ph-magnifying-glass" /><span>SUCHE</span></button>
        <button class="toggle__btn" :class="{ 'toggle__btn--active toggle__btn--biete': app.cType === 'biete' }" @click="app.setCType('biete')"><i class="ph-fill ph-tag" /><span>BIETE</span></button>
      </div>

      <div>
        <h2 class="heading">{{ app.createHeading }}</h2>
        <p class="hint">Ein Icon, ein Titel, fertig. Der Rest ist optional.</p>
      </div>

      <FormSection label="KATEGORIE">
        <div class="grid3">
          <TileButton
            v-for="c in app.createCategories"
            :key="c.key"
            :icon="c.icon"
            :label="c.label"
            :active="c.active"
            :accent="app.createAccentVar"
            :icon-size="27"
            @click="app.setCCat(c.key)"
          />
        </div>
      </FormSection>

      <FormSection label="TITEL">
        <input class="input input--grotesk" :placeholder="app.titlePlaceholder" :value="app.cTitle" @input="app.setCTitle(($event.target as HTMLInputElement).value)" />
      </FormSection>

      <FormSection label="PREIS">
        <div class="price-row">
          <button
            v-for="p in app.priceOptions"
            :key="p.key"
            class="price-opt"
            :class="{ 'price-opt--active': p.active }"
            :style="{ '--accent': app.createAccentVar }"
            @click="app.setCPrice(p.key as any)"
          ><i :class="p.icon" /><span>{{ p.label }}</span></button>
        </div>
        <input v-if="app.cPrice === 'verhandlung'" class="input input--gap" placeholder="Wunschpreis in € (Verhandlungsbasis)" :value="app.cPriceVal" @input="app.setCPriceVal(($event.target as HTMLInputElement).value)" />
      </FormSection>

      <FormSection label="ZONE">
        <div class="zone-pill"><i class="ph-fill ph-map-pin" /><span>{{ app.zone }}</span><span class="zone-pill__hint">vorausgefüllt</span></div>
      </FormSection>

      <FormSection v-if="app.hasPlan" label="STANDORT AM PLAN">
        <div v-if="app.cMarker" class="marker-box">
          <button class="marker-box__map" @click="app.openPlaceListing()">
            <MapPreview :x="app.cMarker.x" :y="app.cMarker.y" :color="app.createAccentVar" :icon="app.cMarkerIcon" />
          </button>
          <div class="marker-box__actions">
            <button class="marker-btn" @click="app.openPlaceListing()">Ändern</button>
            <button class="marker-btn marker-btn--ghost" @click="app.removeListingMarker()">Entfernen</button>
          </div>
        </div>
        <button v-else class="marker-add pressable" @click="app.openPlaceListing()">
          <span class="marker-add__icon"><i class="ph-fill ph-map-pin-plus" /></span>
          <div class="marker-add__meta"><div class="marker-add__title">Standort am Plan setzen</div><div class="marker-add__hint">Optional — hilft beim Treffen</div></div>
          <i class="ph-bold ph-caret-right" />
        </button>
      </FormSection>

      <button class="photo" :class="{ 'photo--set': app.cPhoto }" @click="app.toggleCPhoto()">
        <template v-if="app.cPhoto"><i class="ph-fill ph-check-circle photo__icon photo__icon--ok" /><span class="photo__label">Foto hinzugefügt</span><span class="photo__hint">Tippen zum Entfernen</span></template>
        <template v-else><i class="ph-bold ph-camera photo__icon" /><span class="photo__label">Foto hinzufügen</span><span class="photo__hint">optional · stark komprimiert</span></template>
      </button>
    </div>

    <div class="create__foot">
      <AppButton icon="ph-bold ph-rocket-launch" @click="app.submitCreate()">{{ app.submitLabel }}</AppButton>
    </div>
  </div>
</template>

<style scoped>
.timer { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--games); }
.create__body { padding: 18px 20px 130px; display: flex; flex-direction: column; gap: 22px; }
.toggle { display: flex; gap: 11px; }
.toggle__btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 8px; border-radius: 18px; cursor: pointer; border: 2px solid var(--line); background: var(--card); color: var(--muted); font-size: 24px; transition: all 0.15s; }
.toggle__btn span { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.toggle__btn--active { border-color: transparent; color: var(--ink); }
.toggle__btn--suche { background: var(--suche); }
.toggle__btn--biete { background: var(--biete); }
.heading { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; margin: 0 0 4px; }
.hint { font-size: 14px; color: var(--muted); margin: 0; }
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.grid3 :deep(.tile__label) { font-size: 12px; font-weight: 600; }
.input { width: 100%; padding: 15px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 16px; outline: none; }
.input--grotesk { padding: 17px 18px; border: 2px solid var(--line); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 18px; }
.input--gap { margin-top: 11px; }
.price-row { display: flex; gap: 9px; }
.price-opt { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 4px; border-radius: 14px; cursor: pointer; background: var(--card); border: 2px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; transition: all 0.15s; }
.price-opt i { font-size: 20px; }
.price-opt--active { background: color-mix(in oklab, var(--accent) 14%, var(--card)); border-color: var(--accent); }
.zone-pill { display: flex; align-items: center; gap: 8px; padding: 15px 16px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.zone-pill i { color: var(--suche); font-size: 19px; }
.zone-pill__hint { font-size: 12px; color: var(--muted); margin-left: auto; font-weight: 400; }
.marker-box { border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: var(--card); }
.marker-box__map { display: block; width: 100%; height: 130px; border: none; background: var(--card2); cursor: pointer; overflow: hidden; padding: 0; position: relative; }
.marker-box__actions { display: flex; gap: 8px; padding: 10px; }
.marker-btn { flex: 1; padding: 11px; border-radius: 11px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
.marker-btn--ghost { background: transparent; color: var(--muted); }
.marker-add { width: 100%; display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; background: var(--card); border: 2px dashed var(--line); color: var(--text); cursor: pointer; text-align: left; }
.marker-add__icon { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; background: var(--card2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--suche); }
.marker-add__meta { flex: 1; }
.marker-add__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.marker-add__hint { font-size: 12px; color: var(--muted); margin-top: 2px; }
.marker-add > i { color: var(--muted); font-size: 16px; }
.photo { display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: 24px; border-radius: 18px; cursor: pointer; background: var(--card); border: 2px dashed var(--line); color: var(--text); transition: all 0.15s; }
.photo--set { border-color: var(--biete); }
.photo__icon { font-size: 30px; color: var(--muted); }
.photo__icon--ok { color: var(--biete); }
.photo__label { font-weight: 600; font-size: 15px; }
.photo__hint { font-size: 12px; color: var(--muted); }
.create__foot { position: sticky; bottom: 0; padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 26%); }
</style>
