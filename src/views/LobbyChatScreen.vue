<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'
import ChatComposer from '@/components/chat/ChatComposer.vue'

const app = useAppStore()
const quickReplies = ['Bin dabei!', 'Wann genau?', 'Wer bringt Bier?', 'Bin gleich da 🏃']
const lobby = computed(() => app.activeLobby)
const accentVar = computed(() => (lobby.value.isAct ? 'var(--suche)' : 'var(--games)'))
const accentName = computed(() => (lobby.value.isAct ? 'suche' : 'games') as 'suche' | 'games')
</script>

<template>
  <div class="lc" :style="{ '--accent': accentVar }">
    <div class="lc__head">
      <IconButton icon="ph-bold ph-arrow-left" @click="app.goBack()" />
      <span class="lc__thumb"><i :class="lobby.icon" /></span>
      <div class="lc__titles">
        <div class="lc__title">{{ lobby.title }}</div>
        <div class="lc__sub">Gruppenchat · {{ lobby.isAct ? lobby.count : lobby.headCount }}</div>
      </div>
      <IconButton v-if="lobby.isAct" icon="ph-bold ph-flag" variant="ghost" title="Melden" @click="app.openTreffenReport()" />
      <IconButton icon="ph-bold ph-sign-out" variant="ghost" title="Verlassen" @click="app.openLeave()" />
    </div>

    <div class="lc__scroll scr" data-lobbyscroll>
      <div class="lc__body">
        <div v-if="lobby.isAct" class="notice"><i class="ph-fill ph-users-three" /><span>Gruppenchat — keine privaten Nachrichten. <button class="notice__link" @click="app.openTreffenReport()">Melden</button></span></div>
        <div class="pinned"><i class="ph-fill ph-push-pin" /><div><div class="pinned__label">TREFFPUNKT</div><div class="pinned__spot">{{ lobby.spot }} · {{ lobby.time }}</div></div></div>
        <div v-for="(m, i) in app.lobbyMessages" :key="i">
          <div v-if="m.sys" class="sys">{{ m.text }}</div>
          <div v-else class="gmsg" :class="{ 'gmsg--me': m.me }">
            <span v-if="!m.me" class="gmsg__name">{{ m.who }}</span>
            <div class="gbubble" :class="m.me ? 'gbubble--me' : 'gbubble--them'">{{ m.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="lc__foot">
      <ChatComposer
        :quick-replies="quickReplies"
        :draft="app.lobbyDraft"
        :accent="accentName"
        :placeholder="lobby.isAct ? 'An die Gruppe schreiben…' : 'An die Runde schreiben…'"
        @quick="app.quickLobby"
        @update:draft="app.setLobbyDraft"
        @send="app.sendLobby()"
      />
    </div>
  </div>
</template>

<style scoped>
.lc { position: absolute; inset: 0; display: flex; flex-direction: column; }
.lc__head { flex-shrink: 0; display: flex; align-items: center; gap: 11px; padding: 8px 12px 12px; border-bottom: 1px solid var(--line); }
.lc__thumb { width: 40px; height: 40px; flex-shrink: 0; border-radius: 12px; background: color-mix(in oklab, var(--accent) 18%, var(--card2)); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 22px; }
.lc__titles { flex: 1; min-width: 0; }
.lc__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lc__sub { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lc__scroll { flex: 1; min-height: 0; overflow-y: auto; }
.lc__body { padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; min-height: 100%; justify-content: flex-end; box-sizing: border-box; }
.notice { padding: 10px 13px; border-radius: 13px; background: color-mix(in oklab, var(--suche) 10%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 26%, transparent); display: flex; align-items: center; gap: 9px; }
.notice > i { font-size: 16px; color: var(--suche); flex-shrink: 0; }
.notice span { flex: 1; font-size: 11.5px; color: var(--muted); line-height: 1.4; }
.notice__link { background: none; border: none; padding: 0; color: var(--suche); font-weight: 700; font-size: 11.5px; cursor: pointer; text-decoration: underline; }
.pinned { padding: 11px 13px; border-radius: 14px; background: color-mix(in oklab, var(--accent) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent); display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }
.pinned > i { font-size: 18px; color: var(--accent); }
.pinned__label { font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
.pinned__spot { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; }
.sys { width: fit-content; margin: 2px auto; font-size: 12px; color: var(--muted); background: var(--card2); padding: 7px 13px; border-radius: 999px; text-align: center; }
.gmsg { display: flex; flex-direction: column; gap: 2px; align-items: flex-start; }
.gmsg--me { align-items: flex-end; }
.gmsg__name { font-size: 10px; color: var(--muted); padding: 0 4px; font-weight: 600; }
.gbubble { max-width: 82%; padding: 11px 14px; font-size: 14px; line-height: 1.4; }
.gbubble--me { border-radius: 16px 16px 4px 16px; background: var(--biete); color: var(--ink); font-weight: 500; }
.gbubble--them { border-radius: 16px 16px 16px 4px; background: var(--card2); color: var(--text); }
.lc__foot { flex-shrink: 0; padding: 10px 20px calc(14px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); background: var(--card); }
</style>
