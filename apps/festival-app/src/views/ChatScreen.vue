<script setup lang="ts">
import { useAppStore } from '@/store/app'
import ChatComposer from '@/components/chat/ChatComposer.vue'

const app = useAppStore()
const quickReplies = ['Passt, komme!', 'Noch da?', 'Wie viel?', 'Wo genau?']
</script>

<template>
  <div class="chat" :style="{ '--accent': app.activeItem.accentVar }">
    <div class="chat__head">
      <button class="back" @click="app.goBack()"><i class="ph-bold ph-arrow-left" /></button>
      <span class="chat__avatar">{{ app.activeItem.sellerInit }}</span>
      <div class="chat__who">
        <div class="chat__name">{{ app.activeItem.seller }}</div>
        <div class="chat__rating"><i class="ph-fill ph-thumbs-up" />{{ app.activeItem.rating }}%</div>
      </div>
      <button class="report" @click="app.reportItem()"><i class="ph-bold ph-flag" /></button>
    </div>

    <div class="pin">
      <i class="ph-fill ph-push-pin" />
      <div><div class="pin__label">TREFFPUNKT</div><div class="pin__zone">{{ app.activeItem.zone }}</div></div>
    </div>

    <div class="chat__scroll scr">
      <div v-for="(m, i) in app.chatMessages" :key="i" class="msg" :class="{ 'msg--me': m.me }">
        <div class="bubble" :class="m.me ? 'bubble--me' : 'bubble--them'">{{ m.text }}</div>
      </div>
      <div class="rate">
        <span class="rate__text">Deal gelaufen? Gib {{ app.activeItem.seller }} einen Daumen.</span>
        <div class="rate__btns">
          <button class="rate__btn rate__btn--up" @click="app.rateUp()"><i class="ph-fill ph-thumbs-up" />Passt</button>
          <button class="rate__btn" @click="app.rateDown()"><i class="ph-bold ph-thumbs-down" />Naja</button>
        </div>
      </div>
    </div>

    <div class="chat__foot">
      <ChatComposer
        :quick-replies="quickReplies"
        :draft="app.chatDraft"
        accent="biete"
        @quick="app.quickReply"
        @update:draft="app.setChatDraft"
        @send="app.sendMsg()"
      />
    </div>
  </div>
</template>

<style scoped>
.chat { display: flex; flex-direction: column; height: 100%; }
.chat__head { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 12px; padding: 8px 16px 12px; background: var(--bg); border-bottom: 1px solid var(--line); }
.back, .report { width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.back { background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 19px; }
.report { background: transparent; border: 1px solid var(--line); color: var(--muted); font-size: 17px; }
.chat__avatar { width: 40px; height: 40px; border-radius: 12px; background: var(--accent); color: var(--ink); display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; flex-shrink: 0; }
.chat__who { flex: 1; min-width: 0; }
.chat__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.chat__rating { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
.chat__rating i { color: var(--biete); font-size: 13px; }
.pin { margin: 12px 16px 0; padding: 12px 14px; border-radius: 14px; background: color-mix(in oklab, var(--suche) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 30%, transparent); display: flex; align-items: center; gap: 11px; }
.pin > i { font-size: 19px; color: var(--suche); }
.pin__label { font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
.pin__zone { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; }
.chat__scroll { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.msg { display: flex; justify-content: flex-start; }
.msg--me { justify-content: flex-end; }
.bubble { max-width: 78%; padding: 12px 15px; font-size: 14.5px; line-height: 1.4; }
.bubble--me { border-radius: 18px 18px 5px 18px; background: var(--biete); color: var(--ink); font-weight: 500; }
.bubble--them { border-radius: 18px 18px 18px 5px; background: var(--card2); color: var(--text); }
.rate { align-self: center; margin-top: 8px; display: flex; flex-direction: column; align-items: center; gap: 9px; padding: 14px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); width: 100%; }
.rate__text { font-size: 13px; color: var(--muted); }
.rate__btns { display: flex; gap: 10px; }
.rate__btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; border-radius: 12px; background: var(--card2); border: 1px solid var(--line); color: var(--muted); font-weight: 700; font-size: 14px; cursor: pointer; }
.rate__btn i { font-size: 18px; }
.rate__btn--up { background: color-mix(in oklab, var(--biete) 18%, transparent); border-color: var(--biete); color: var(--text); }
.rate__btn--up i { color: var(--biete); }
.chat__foot { padding: 10px 14px calc(14px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); background: var(--bg); }
</style>
