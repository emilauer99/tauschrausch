<script setup lang="ts">
import AvatarStack from '@/components/ui/AvatarStack.vue'

export interface LobbyCardVM {
  id: number
  accentVar: string
  icon: string
  title: string
  stage: string
  hasStage: boolean
  spot: string
  timeClock: string
  countLabel: string
  countdown: string
  status: 'live' | 'soon' | 'planned'
  members: string[]
  cta: string
  ctaIcon: string
}

defineProps<{ lobby: LobbyCardVM }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button class="lobby pressable" :style="{ '--accent': lobby.accentVar }" @click="emit('open')">
    <div class="lobby__top">
      <span class="lobby__thumb"><i :class="lobby.icon" class="lobby__icon" /></span>
      <div class="lobby__meta">
        <div class="lobby__title">{{ lobby.title }}</div>
        <div v-if="lobby.hasStage" class="lobby__stage"><i class="ph-fill ph-music-notes" />{{ lobby.stage }} · {{ lobby.timeClock }}</div>
        <div class="lobby__spot"><i class="ph-fill ph-map-pin" /><span>{{ lobby.spot }}</span></div>
      </div>
      <span class="timer" :class="`timer--${lobby.status}`"><i class="ph-fill ph-timer" />{{ lobby.countdown }}</span>
    </div>
    <div class="lobby__bottom">
      <div class="lobby__people"><AvatarStack :members="lobby.members" /><span class="lobby__count">{{ lobby.countLabel }}</span></div>
      <span class="lobby__cta">{{ lobby.cta }}<i :class="lobby.ctaIcon" /></span>
    </div>
  </button>
</template>

<style scoped>
.lobby {
  text-align: left; padding: 16px; border: 1px solid var(--line); border-radius: 20px;
  background: var(--card); cursor: pointer; color: var(--text); width: 100%;
}
.lobby__top { display: flex; align-items: flex-start; gap: 13px; margin-bottom: 12px; }
.lobby__thumb {
  width: 52px; height: 52px; flex-shrink: 0; border-radius: 15px;
  background: color-mix(in oklab, var(--accent) 16%, var(--card2));
  display: flex; align-items: center; justify-content: center;
}
.lobby__icon { font-size: 27px; color: var(--accent); }
.lobby__meta { flex: 1; min-width: 0; }
.lobby__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; line-height: 1.12; }
.lobby__stage { display: flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; margin-top: 3px; color: var(--accent); }
.lobby__spot { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--muted); margin-top: 3px; }
.lobby__spot span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.timer {
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px;
  padding: 6px 10px; border-radius: 9px;
}
.timer--live { background: var(--biete); color: var(--ink); }
.timer--soon { background: var(--games); color: var(--ink); }
.timer--planned { background: var(--card2); color: var(--muted); }
.lobby__bottom { display: flex; align-items: center; justify-content: space-between; }
.lobby__people { display: flex; align-items: center; }
.lobby__count { font-size: 13px; font-weight: 600; color: var(--text); margin-left: 12px; }
.lobby__cta { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: var(--accent); }
</style>
