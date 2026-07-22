<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'
import MemberGrid from '@/components/ui/MemberGrid.vue'
import PlanCanvas from '@/components/ui/PlanCanvas.vue'
import MarkerPin from '@/components/ui/MarkerPin.vue'

const app = useAppStore()
const lobby = computed(() => app.activeLobby)
const accentVar = computed(() => (lobby.value.isAct ? 'var(--suche)' : 'var(--games)'))
const accentName = computed(() => (lobby.value.isAct ? 'suche' : 'games') as 'suche' | 'games')
</script>

<template>
  <div class="ld" :style="{ '--accent': accentVar }">
    <div class="ld__head">
      <IconButton icon="ph-bold ph-arrow-left" @click="app.goLobbies()" />
      <span class="ld__thumb"><i :class="lobby.icon" /></span>
      <div class="ld__titles">
        <div class="ld__title">{{ lobby.title }}</div>
        <div class="ld__sub">{{ lobby.isAct ? `${lobby.stage} · ${lobby.count}` : `${lobby.headCount} · ${lobby.time}` }}</div>
      </div>
      <template v-if="lobby.isMine">
        <IconButton icon="ph-fill ph-pencil-simple" variant="ghost" title="Bearbeiten" @click="app.startEditLobby(lobby.id)" />
        <IconButton icon="ph-fill ph-trash" variant="ghost" title="Löschen" @click="app.askDeleteLobby(lobby.id)" />
      </template>
      <template v-else>
        <IconButton v-if="lobby.isAct" icon="ph-bold ph-flag" variant="ghost" title="Melden" @click="app.openTreffenReport()" />
        <IconButton v-if="lobby.joined" icon="ph-bold ph-sign-out" variant="ghost" title="Verlassen" @click="app.openLeave()" />
      </template>
    </div>

    <div class="ld__scroll scr">
      <div class="ld__intro">
        <div class="ld__hero">
          <i :class="lobby.icon" class="ld__hero-icon" />
          <span v-if="lobby.isAct" class="ld__hero-timer"><i class="ph-fill ph-timer" />{{ lobby.countdown }}</span>
        </div>
        <div class="ld__info">
          <template v-if="lobby.isAct">
            <div class="ld__row"><i class="ph-fill ph-map-pin-area" /><span>{{ lobby.stage }}</span></div>
            <div class="ld__row"><i class="ph-fill ph-clock ld__clock" /><span>Start um {{ lobby.time }}</span></div>
            <div class="ld__sep" />
            <div class="ld__row"><i class="ph-fill ph-map-pin" /><span>{{ lobby.spot }}</span></div>
          </template>
          <template v-else>
            <div class="ld__row"><i class="ph-fill ph-map-pin" /><span>{{ lobby.spot }}</span></div>
            <div class="ld__row"><i class="ph-fill ph-clock ld__clock" /><span>Heute um {{ lobby.time }}</span></div>
          </template>
        </div>
        <div v-if="lobby.isAct && lobby.hasNote" class="ld__note">„{{ lobby.note }}"</div>
        <button v-if="lobby.hasMarker && lobby.marker" class="planbtn pressable" @click="app.openLobbyMarker()">
          <PlanCanvas />
          <div class="planbtn__pin" :style="{ left: `${lobby.marker.x}%`, top: `${lobby.marker.y}%` }">
            <MarkerPin :color="lobby.markerColorVar" :icon="lobby.markerIcon" :size="32" />
          </div>
          <span class="planbtn__label">TREFFPUNKT AM PLAN</span>
          <span class="planbtn__cta"><i class="ph-fill ph-magnifying-glass-plus" />Auf Plan zeigen</span>
        </button>
        <span class="ld__section">{{ lobby.isAct ? 'WER GEHT MIT' : 'WER MITSPIELT' }}</span>
        <MemberGrid class="ld__members" :members="lobby.members" :empty="lobby.isAct ? 0 : lobby.empty" />
      </div>
    </div>

    <div class="ld__foot">
      <button v-if="lobby.joined" class="join pressable" :class="`join--${accentName}`" @click="app.openLobbyChat()">
        <i class="ph-fill ph-chat-circle-text" />Zum Gruppenchat
      </button>
      <button v-else class="join pressable" :class="`join--${accentName}`" @click="app.joinLobby()">
        <i :class="lobby.isAct ? 'ph-fill ph-hand-waving' : 'ph-fill ph-sign-in'" />{{ lobby.isAct ? 'Ich geh mit' : 'Beitreten' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ld { position: absolute; inset: 0; display: flex; flex-direction: column; }
.ld__head { flex-shrink: 0; display: flex; align-items: center; gap: 11px; padding: 8px 12px 12px; border-bottom: 1px solid var(--line); }
.ld__thumb { width: 40px; height: 40px; flex-shrink: 0; border-radius: 12px; background: color-mix(in oklab, var(--accent) 18%, var(--card2)); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 22px; }
.ld__titles { flex: 1; min-width: 0; }
.ld__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ld__sub { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ld__scroll { flex: 1; min-height: 0; overflow-y: auto; }
.ld__intro { padding: 18px 20px 20px; }
.ld__hero { position: relative; height: 150px; border-radius: 20px; overflow: hidden; margin-bottom: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04) 10px, transparent 10px, transparent 20px), linear-gradient(150deg, color-mix(in oklab, var(--accent) 32%, #14151a), #101114); }
.ld__hero-icon { font-size: 60px; color: var(--accent); }
.ld__hero-timer { display: inline-flex; align-items: center; gap: 7px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; padding: 6px 13px; border-radius: 9px; background: rgba(10, 10, 12, 0.5); color: #f5f7fa; }
.ld__hero-timer i { color: var(--accent); }
.ld__info { display: flex; flex-direction: column; gap: 11px; padding: 16px; border-radius: 18px; background: var(--card); border: 1px solid var(--line); margin-bottom: 16px; }
.ld__row { display: flex; align-items: center; gap: 11px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; }
.ld__row i { font-size: 19px; color: var(--accent); }
.ld__row .ld__clock { color: var(--games); }
.ld__sep { height: 1px; background: var(--line); }
.ld__note { padding: 13px 15px; border-radius: 14px; background: var(--card2); font-size: 14px; line-height: 1.5; color: var(--text); margin-bottom: 16px; }
.planbtn { display: block; width: 100%; position: relative; height: 140px; border-radius: 18px; overflow: hidden; border: 1px solid var(--line); background: var(--card2); cursor: pointer; margin-bottom: 18px; padding: 0; }
.planbtn__pin { position: absolute; transform: translate(-50%, -100%); }
.planbtn__label { position: absolute; top: 10px; left: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.08em; padding: 5px 9px; border-radius: 7px; background: rgba(10, 10, 12, 0.55); color: #f5f7fa; }
.planbtn__cta { position: absolute; bottom: 10px; right: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; padding: 7px 11px; border-radius: 9px; background: rgba(10, 10, 12, 0.6); color: #f5f7fa; }
.ld__section { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; color: var(--muted); }
.ld__members { margin-top: 14px; }
.ld__foot { flex-shrink: 0; padding: 10px 20px calc(14px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); background: var(--card); }
.join { display: flex; align-items: center; justify-content: center; gap: 11px; width: 100%; padding: 20px; border: none; border-radius: 18px; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px; color: var(--ink); }
.join--games { background: var(--games); box-shadow: 0 12px 32px -8px var(--games); }
.join--suche { background: var(--suche); box-shadow: 0 12px 32px -8px var(--suche); }
</style>
