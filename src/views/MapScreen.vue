<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useAppStore } from '@/store/app'
import { useMapGestures } from '@/composables/useMapGestures'
import IconButton from '@/components/ui/IconButton.vue'
import ChipRail from '@/components/ui/ChipRail.vue'
import PlanCanvas from '@/components/ui/PlanCanvas.vue'
import MarkerPin from '@/components/ui/MarkerPin.vue'

const app = useAppStore()
const planLayer = useTemplateRef<HTMLElement>('planLayer')
const { onPointerDown, zoomIn, zoomOut } = useMapGestures(app, planLayer)

const transform = computed(() => `translate(${app.mapPanX}px, ${app.mapPanY}px) scale(${app.mapZoom})`)
</script>

<template>
  <div class="map">
    <div class="map__head">
      <IconButton icon="ph-bold ph-arrow-left" @click="app.mapHeaderBack()" />
      <div class="map__titles"><div class="map__title">{{ app.mapTitle }}</div><div class="map__fest">{{ app.meFestival }}</div></div>
      <button v-if="app.mapMode === 'place'" class="skip" @click="app.skipPlaceMap()">Überspringen</button>
    </div>

    <ChipRail v-if="app.mapMode === 'overview'" class="map__cats" :chips="app.mapCategories" @select="app.setMapFilter" />

    <div class="map__area" @pointerdown="onPointerDown">
      <div ref="planLayer" class="map__layer" :style="{ transform }">
        <PlanCanvas show-labels grid />
        <template v-if="app.mapMode === 'overview'">
          <button v-for="p in app.planPins" :key="p.key" class="pin-btn pressable" :style="{ left: `${p.x}%`, top: `${p.y}%` }" @click="app.openMapSheet(p.kind, p.id)">
            <MarkerPin :color="p.colorVar" :icon="p.icon" :size="32" />
          </button>
        </template>
        <div v-else-if="app.mapMode === 'place' && app.draftMarker" class="pin-wrap" :style="{ left: `${app.draftMarker.x}%`, top: `${app.draftMarker.y}%` }">
          <MarkerPin :color="app.placeColorVar" :icon="app.placeIcon" :size="40" />
        </div>
        <div v-else-if="app.mapMode === 'view' && app.viewMarker" class="pin-wrap" :style="{ left: `${app.viewMarker.x}%`, top: `${app.viewMarker.y}%` }">
          <MarkerPin :color="app.viewMarker.color" :icon="app.viewMarker.icon" :size="40" />
        </div>
      </div>

      <div class="zoom">
        <button @click="zoomIn"><i class="ph-bold ph-plus" /></button>
        <button @click="zoomOut"><i class="ph-bold ph-minus" /></button>
      </div>

      <template v-if="app.mapMode === 'place'">
        <div class="tip"><i class="ph-fill ph-info" /><span>Setz den Marker lieber an eine <b>Landmarke in der Nähe</b> — nicht direkt auf deinen Schlafplatz.</span></div>
        <div v-if="!app.draftMarker" class="hint"><i class="ph-fill ph-hand-tap" />Tippen, um den Standort zu setzen</div>
      </template>
    </div>

    <div v-if="app.mapMode === 'place'" class="map__foot">
      <button class="confirm pressable" :style="{ background: app.placeColorVar }" @click="app.confirmMarker()"><i class="ph-fill ph-check-circle" />Standort bestätigen</button>
    </div>

    <!-- pin detail sheet -->
    <div v-if="app.mapSheetData" class="sheet-backdrop" @click="app.closeMapSheet()">
      <div class="sheet" :style="{ '--accent': app.mapSheetData.colorVar }" @click.stop>
        <div class="sheet__row">
          <span class="sheet__icon"><i :class="app.mapSheetData.icon" /></span>
          <div class="sheet__meta">
            <span class="sheet__tag">{{ app.mapSheetData.typeLabel }}</span>
            <div class="sheet__title">{{ app.mapSheetData.title }}</div>
            <div class="sheet__sub"><i class="ph-fill ph-map-pin" /><span>{{ app.mapSheetData.sub }}</span></div>
          </div>
          <span class="sheet__meta-val">{{ app.mapSheetData.meta }}</span>
        </div>
        <button class="sheet__cta pressable" @click="app.mapSheetView()"><i class="ph-fill ph-arrow-right" />Ansehen</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map { position: absolute; inset: 0; display: flex; flex-direction: column; background: var(--bg); }
.map__head { flex-shrink: 0; display: flex; align-items: center; gap: 11px; padding: 8px 14px 12px; border-bottom: 1px solid var(--line); }
.map__titles { flex: 1; min-width: 0; }
.map__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; }
.map__fest { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.skip { flex-shrink: 0; padding: 10px 15px; border-radius: 12px; background: var(--card); border: 1px solid var(--line); color: var(--muted); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
.map__cats { flex-shrink: 0; padding: 12px 14px; }
.map__area { flex: 1; min-height: 0; position: relative; overflow: hidden; background: var(--card2); touch-action: none; }
.map__layer { position: absolute; inset: 0; transform-origin: center; transition: transform 0.1s ease; }
.pin-btn { position: absolute; transform: translate(-50%, -100%); border: none; background: none; cursor: pointer; padding: 0; display: block; }
.pin-wrap { position: absolute; transform: translate(-50%, -100%); z-index: 6; }
.zoom { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 8; }
.zoom button { width: 40px; height: 40px; border-radius: 11px; background: var(--card); border: 1px solid var(--line); color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); font-size: 18px; }
.tip { position: absolute; left: 12px; right: 64px; top: 12px; z-index: 7; display: flex; align-items: flex-start; gap: 9px; padding: 11px 13px; border-radius: 13px; background: color-mix(in oklab, var(--games) 16%, var(--card)); border: 1px solid color-mix(in oklab, var(--games) 34%, transparent); }
.tip i { font-size: 18px; color: var(--games); flex-shrink: 0; margin-top: 1px; }
.tip span { font-size: 12.5px; line-height: 1.4; color: var(--text); }
.hint { position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 7; display: flex; align-items: center; gap: 8px; padding: 11px 17px; border-radius: 999px; background: rgba(10, 10, 12, 0.72); color: #f5f7fa; font-weight: 600; font-size: 13px; pointer-events: none; white-space: nowrap; }
.hint i { font-size: 16px; color: var(--games); }
.map__foot { flex-shrink: 0; padding: 14px 20px calc(16px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); background: var(--card); }
.confirm { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 18px; border: none; border-radius: 16px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; cursor: pointer; }
.sheet-backdrop { position: absolute; inset: 0; background: rgba(6, 6, 8, 0.5); z-index: 20; display: flex; align-items: flex-end; }
.sheet { width: 100%; background: var(--card); border-radius: 24px 24px 0 0; padding: 16px 18px calc(20px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); animation: slideUp 0.26s cubic-bezier(0.2, 0.9, 0.3, 1) both; }
.sheet__row { display: flex; align-items: center; gap: 13px; margin-bottom: 14px; }
.sheet__icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 15px; background: color-mix(in oklab, var(--accent) 18%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 27px; color: var(--accent); }
.sheet__meta { flex: 1; min-width: 0; }
.sheet__tag { display: inline-block; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 6px; background: var(--accent); color: var(--ink); margin-bottom: 5px; }
.sheet__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; line-height: 1.15; }
.sheet__sub { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); margin-top: 3px; }
.sheet__sub span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sheet__meta-val { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--accent); flex-shrink: 0; }
.sheet__cta { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 16px; border: none; border-radius: 15px; background: var(--accent); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; }
</style>
