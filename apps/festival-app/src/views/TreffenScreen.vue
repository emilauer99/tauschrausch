<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import LobbyCard from '@/components/treffen/LobbyCard.vue'
import MyGameCard from '@/components/treffen/MyGameCard.vue'

const app = useAppStore()
</script>

<template>
  <div class="treffen">
    <div class="treffen__top">
      <div class="treffen__bar">
        <div class="treffen__brand"><span class="treffen__icon"><i class="ph-fill ph-users-three" /></span><span class="treffen__heading">Treffen</span></div>
        <div class="treffen__actions">
          <IconButton icon="ph-fill ph-bell" @click="app.openBell()">
            <span v-if="app.bellCount > 0" class="badge">{{ app.bellCount }}</span>
          </IconButton>
          <IconButton
            v-if="app.gameTab === 'entdecken'"
            icon="ph-bold ph-sliders-horizontal"
            title="Filter"
            :accent="app.treffenFiltersActive ? 'var(--games)' : undefined"
            @click="app.openTreffenSheet()"
          >
            <span v-if="app.treffenFiltersActive" class="filter-dot" />
          </IconButton>
        </div>
      </div>
      <SegmentedControl :segments="app.gameTabs" @select="(k) => (k === 'meine' ? app.setMeine() : app.setEntdecken())" />
    </div>

    <!-- ENTDECKEN -->
    <div v-if="app.gameTab === 'entdecken'" class="list">
      <button v-if="app.hasLineup" class="lineup-banner pressable" @click="app.openLineup()">
        <span class="lineup-banner__icon"><i class="ph-fill ph-music-notes" /></span>
        <div class="lineup-banner__meta"><div class="lineup-banner__title">Line-up ansehen</div><div class="lineup-banner__hint">Wer geht mit? Finde eine Gruppe für deinen Act.</div></div>
        <i class="ph-bold ph-caret-right lineup-banner__caret" />
      </button>
      <LobbyCard v-for="l in app.lobbyList" :key="l.id" :lobby="l" @open="app.openLobby(l.id)" />
      <div v-if="app.discoverEmpty" class="empty">Hier ist noch nichts.<br>Eröffne unten selbst ein Treffen 👇</div>
    </div>

    <!-- MEINE TREFFEN -->
    <div v-else class="list">
      <template v-if="app.hasMyGames">
        <MyGameCard v-for="g in app.myGames" :key="g.id" :game="g" @open="app.openLobby(g.id)" @open-chat="app.openLobbyChatById(g.id)" @leave="app.leaveFromCard(g.id)" />
      </template>
      <div v-else class="none">
        <span class="none__icon"><i class="ph-fill ph-users-three" /></span>
        <div class="none__title">Noch bei keinem Treffen dabei</div>
        <p class="none__text">Schau bei „Entdecken" vorbei — bei einem Spiel oder Act.</p>
        <button class="none__cta" @click="app.setEntdecken()"><i class="ph-bold ph-compass" />Zu Entdecken</button>
      </div>
    </div>

    <div class="treffen__fab">
      <button class="fab pressable" @click="app.openCreateChooser()"><i class="ph-bold ph-plus" />Treffen eröffnen</button>
    </div>
  </div>
</template>

<style scoped>
.treffen__top { position: sticky; top: 0; z-index: 30; background: var(--bg); padding: 8px 20px 14px; border-bottom: 1px solid var(--line); }
.treffen__bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.treffen__brand { display: flex; align-items: center; gap: 9px; }
.treffen__icon { width: 36px; height: 36px; border-radius: 11px; background: color-mix(in oklab, var(--games) 20%, transparent); display: flex; align-items: center; justify-content: center; color: var(--games); font-size: 21px; }
.treffen__heading { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; }
.treffen__actions { display: flex; gap: 8px; align-items: center; }
.badge { position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 3px; border-radius: 9px; background: var(--games); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg); }
.filter-dot { position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; border-radius: 50%; background: var(--games); border: 2px solid var(--bg); }
.list { padding: 14px 20px 100px; display: flex; flex-direction: column; gap: 13px; }
.lineup-banner { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; padding: 15px; border-radius: 18px; background: linear-gradient(120deg, color-mix(in oklab, var(--suche) 26%, var(--card)), var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 34%, transparent); cursor: pointer; color: var(--text); }
.lineup-banner__icon { width: 46px; height: 46px; flex-shrink: 0; border-radius: 14px; background: color-mix(in oklab, var(--suche) 22%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--suche); }
.lineup-banner__meta { flex: 1; min-width: 0; }
.lineup-banner__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.lineup-banner__hint { font-size: 12.5px; color: var(--muted); }
.lineup-banner__caret { font-size: 17px; color: var(--muted); flex-shrink: 0; }
.empty { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 14px; line-height: 1.5; }
.none { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 54px 30px; }
.none__icon { width: 66px; height: 66px; border-radius: 19px; background: var(--card2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 33px; color: var(--muted); }
.none__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px; margin-bottom: 6px; }
.none__text { font-size: 14px; color: var(--muted); margin: 0 0 18px; line-height: 1.5; }
.none__cta { display: inline-flex; align-items: center; gap: 8px; padding: 13px 20px; border-radius: 14px; background: var(--games); color: var(--ink); border: none; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; }
.treffen__fab { position: sticky; bottom: 0; padding: 14px 20px calc(14px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 30%); pointer-events: none; }
.fab { pointer-events: auto; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 18px; border: none; border-radius: 18px; background: linear-gradient(100deg, var(--games), var(--suche)); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; cursor: pointer; box-shadow: 0 12px 30px -8px color-mix(in oklab, var(--suche) 60%, var(--games)); }
</style>
