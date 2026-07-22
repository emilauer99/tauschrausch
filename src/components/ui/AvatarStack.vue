<script setup lang="ts">
import { avatarColor, initials } from '@/utils/format'

withDefaults(defineProps<{ members: string[]; size?: number }>(), { size: 30 })
</script>

<template>
  <div class="stack">
    <span
      v-for="(m, i) in members"
      :key="i"
      class="avatar"
      :style="{ width: `${size}px`, height: `${size}px`, background: avatarColor(i) }"
    >{{ initials(m) }}</span>
  </div>
</template>

<style scoped>
.stack { display: flex; align-items: center; }
.avatar {
  flex-shrink: 0;
  margin-right: -8px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 11px;
  color: var(--ink);
  border: 2px solid var(--card);
}
</style>
