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
  <div class="lc">
    <ScreenHeader leading="close" :title="app.lobbyCreateTitle" @back="app.cancelTreffenCreate()" />
    <div class="lc__body">
      <FormSection label="SPIEL">
        <div class="grid2">
          <TileButton
            v-for="g in app.gamePicks"
            :key="g.label"
            :icon="g.icon"
            :label="g.label"
            :active="g.active"
            accent="var(--games)"
            :icon-size="26"
            @click="app.setLobbyGame(g.label)"
          />
        </div>
      </FormSection>

      <FormSection label="TREFFPUNKT">
        <input class="input" placeholder="z. B. Wiese hinter Camp B" :value="app.lobbySpot" @input="app.setLobbySpot(($event.target as HTMLInputElement).value)" />
      </FormSection>

      <div class="split">
        <FormSection label="UHRZEIT" class="split__col">
          <input class="input input--grotesk" placeholder="17:00" :value="app.lobbyTime" @input="app.setLobbyTime(($event.target as HTMLInputElement).value)" />
        </FormSection>
        <FormSection label="PLÄTZE" class="split__col">
          <div class="stepper">
            <button @click="app.slotsMinus()">−</button>
            <span>{{ app.lobbySlots }}</span>
            <button @click="app.slotsPlus()">+</button>
          </div>
        </FormSection>
      </div>

      <FormSection v-if="app.hasPlan" label="TREFFPUNKT AM PLAN">
        <div v-if="app.lMarker" class="marker-box">
          <button class="marker-box__map" @click="app.openPlaceLobby()">
            <MapPreview :x="app.lMarker.x" :y="app.lMarker.y" color="var(--games)" :icon="app.lobbyGameIcon" />
          </button>
          <div class="marker-box__actions">
            <button class="marker-btn" @click="app.openPlaceLobby()">Ändern</button>
            <button class="marker-btn marker-btn--ghost" @click="app.removeLobbyMarker()">Entfernen</button>
          </div>
        </div>
        <button v-else class="marker-add pressable" @click="app.openPlaceLobby()">
          <span class="marker-add__icon"><i class="ph-fill ph-map-pin-plus" /></span>
          <div class="marker-add__meta"><div class="marker-add__title">Treffpunkt am Plan setzen</div><div class="marker-add__hint">Optional — dann finden dich alle</div></div>
          <i class="ph-bold ph-caret-right" />
        </button>
      </FormSection>
    </div>
    <div class="lc__foot">
      <AppButton color="games" icon="ph-fill ph-flag-banner" @click="app.submitLobby()">{{ app.lobbySubmitLabel }}</AppButton>
    </div>
  </div>
</template>

<style scoped>
.lc__body { padding: 18px 20px 130px; display: flex; flex-direction: column; gap: 22px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.input { width: 100%; padding: 16px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 16px; outline: none; }
.input--grotesk { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
.split { display: flex; gap: 12px; }
.split__col { flex: 1; }
.stepper { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); }
.stepper button { width: 36px; height: 36px; border-radius: 10px; background: var(--card2); border: none; color: var(--text); font-size: 20px; cursor: pointer; }
.stepper span { flex: 1; text-align: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; }
.marker-box { border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: var(--card); }
.marker-box__map { display: block; width: 100%; height: 130px; border: none; background: var(--card2); cursor: pointer; overflow: hidden; padding: 0; position: relative; }
.marker-box__actions { display: flex; gap: 8px; padding: 10px; }
.marker-btn { flex: 1; padding: 11px; border-radius: 11px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
.marker-btn--ghost { background: transparent; color: var(--muted); }
.marker-add { width: 100%; display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; background: var(--card); border: 2px dashed var(--line); color: var(--text); cursor: pointer; text-align: left; }
.marker-add__icon { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; background: var(--card2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--games); }
.marker-add__meta { flex: 1; }
.marker-add__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.marker-add__hint { font-size: 12px; color: var(--muted); margin-top: 2px; }
.marker-add > i { color: var(--muted); font-size: 16px; }
.lc__foot { position: sticky; bottom: 0; padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 26%); }
</style>
