<script setup lang="ts">
import AvatarStack from '@/components/ui/AvatarStack.vue'

export interface MyGameVM {
  id: number
  accentVar: string
  kindLabel: string
  title: string
  icon: string
  spot: string
  count: string
  members: string[]
  countdown: string
  status: 'live' | 'soon' | 'planned'
  isLive: boolean
}

defineProps<{ game: MyGameVM }>()
const emit = defineEmits<{ open: []; openChat: []; leave: [] }>()
</script>

<template>
  <div class="mygame" :class="`mygame--${status}`" :style="{ '--accent': game.accentVar }">
    <button class="mygame__main" @click="emit('open')">
      <div class="mygame__top">
        <span class="mygame__thumb"><i :class="game.icon" class="mygame__icon" /></span>
        <div class="mygame__meta">
          <div class="mygame__titles">
            <span class="mygame__title">{{ game.title }}</span>
            <span class="mygame__kind">{{ game.kindLabel }}</span>
            <span v-if="game.isLive" class="mygame__live"><span class="dot" />LÄUFT JETZT</span>
          </div>
          <div class="mygame__spot"><i class="ph-fill ph-map-pin" /><span>{{ game.spot }}</span></div>
        </div>
      </div>
      <div class="mygame__bottom">
        <span class="mygame__countdown"><i class="ph-fill ph-timer" />{{ game.countdown }}</span>
        <div class="mygame__people"><AvatarStack :members="game.members" :size="26" /><span class="mygame__count">{{ game.count }}</span></div>
      </div>
    </button>
    <div class="mygame__actions">
      <button class="mygame__action" @click="emit('openChat')"><i class="ph-fill ph-chat-circle-text chat-icon" />Chat</button>
      <button class="mygame__action mygame__action--ghost" @click="emit('leave')"><i class="ph-bold ph-sign-out" />Verlassen</button>
    </div>
  </div>
</template>

<style scoped>
.mygame { border-radius: 20px; overflow: hidden; border: 1px solid var(--line); background: var(--card); }
.mygame--live { border-color: color-mix(in oklab, var(--biete) 45%, transparent); background: color-mix(in oklab, var(--biete) 9%, var(--card)); }
.mygame--soon { border-color: color-mix(in oklab, var(--games) 45%, transparent); background: color-mix(in oklab, var(--games) 9%, var(--card)); }
.mygame__main { display: block; width: 100%; text-align: left; background: none; border: none; cursor: pointer; color: var(--text); padding: 15px 15px 0; }
.mygame__top { display: flex; align-items: center; gap: 13px; margin-bottom: 12px; }
.mygame__thumb {
  width: 50px; height: 50px; flex-shrink: 0; border-radius: 15px;
  background: color-mix(in oklab, var(--accent) 18%, var(--card2)); display: flex; align-items: center; justify-content: center;
}
.mygame__icon { font-size: 27px; color: var(--accent); }
.mygame__meta { flex: 1; min-width: 0; }
.mygame__titles { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mygame__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.mygame__kind { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 9px; letter-spacing: 0.06em; padding: 3px 7px; border-radius: 6px; color: var(--accent); background: color-mix(in oklab, var(--accent) 20%, var(--card2)); }
.mygame__live { display: inline-flex; align-items: center; gap: 5px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 6px; background: var(--biete); color: var(--ink); animation: glow 1.4s ease-in-out infinite; }
.mygame__live .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
.mygame__spot { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--muted); margin-top: 3px; }
.mygame__spot span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mygame__bottom { display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; }
.mygame__countdown { display: inline-flex; align-items: center; gap: 7px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }
.mygame__people { display: flex; align-items: center; }
.mygame__count { font-size: 12px; color: var(--muted); margin-left: 10px; }
.mygame__actions { display: flex; gap: 8px; padding: 0 15px 15px; }
.mygame__action {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 11px; border-radius: 12px;
  background: var(--card2); border: 1px solid var(--line); color: var(--text);
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer;
}
.mygame__action--ghost { background: transparent; color: var(--muted); }
.chat-icon { color: var(--games); font-size: 16px; }
</style>
