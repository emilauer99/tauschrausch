<script setup lang="ts">
interface Banner { game: string; text: string; icon: string; tone: 'live' | 'urgent' | 'soon' }
defineProps<{ banner: Banner }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button class="banner" :class="`banner--${banner.tone}`" @click="emit('open')">
    <i :class="banner.icon" class="banner__icon" />
    <span class="banner__text">{{ banner.game }} {{ banner.text }}</span>
    <i class="ph-bold ph-caret-right banner__caret" />
  </button>
</template>

<style scoped>
.banner {
  flex-shrink: 0; display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 18px;
  border: none; border-bottom: 1px solid rgba(0, 0, 0, 0.15); cursor: pointer; text-align: left;
  font-family: 'Space Grotesk', sans-serif; z-index: 38;
}
.banner--live { background: var(--biete); color: var(--ink); }
.banner--urgent { background: var(--games); color: var(--ink); animation: glow 1.1s ease-in-out infinite; }
.banner--soon { background: color-mix(in oklab, var(--games) 24%, var(--card2)); color: var(--text); }
.banner__icon { font-size: 20px; flex-shrink: 0; }
.banner__text { flex: 1; min-width: 0; font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.banner__caret { font-size: 15px; flex-shrink: 0; }
</style>
