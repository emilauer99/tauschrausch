<script setup lang="ts">
defineProps<{ active: string }>()
const emit = defineEmits<{ navigate: [target: 'feed' | 'lobbies' | 'profile'] }>()

const items = [
  { key: 'feed', label: 'FEED', icon: 'ph-fill ph-storefront', accent: 'var(--biete)' },
  { key: 'lobbies', label: 'TREFFEN', icon: 'ph-fill ph-users-three', accent: 'var(--games)' },
  { key: 'profile', label: 'PROFIL', icon: 'ph-fill ph-user', accent: 'var(--biete)' },
] as const
</script>

<template>
  <nav class="nav">
    <button
      v-for="item in items"
      :key="item.key"
      class="nav__item"
      :style="{ color: active === item.key ? item.accent : 'var(--muted)' }"
      @click="emit('navigate', item.key)"
    >
      <i :class="item.icon" class="nav__icon" />
      <span class="nav__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.nav { flex-shrink: 0; display: flex; align-items: center; justify-content: space-around; padding: 10px 12px calc(12px + env(safe-area-inset-bottom)); background: var(--card); border-top: 1px solid var(--line); z-index: 35; }
.nav__item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; }
.nav__icon { font-size: 24px; }
.nav__label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.03em; }
</style>
