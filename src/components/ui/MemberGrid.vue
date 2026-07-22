<script setup lang="ts">
import { avatarColor, initials } from '@/utils/format'

withDefaults(defineProps<{ members: string[]; empty?: number }>(), { empty: 0 })
</script>

<template>
  <div class="grid">
    <div v-for="(m, i) in members" :key="`m${i}`" class="cell">
      <span class="cell__avatar" :style="{ background: avatarColor(i) }">{{ initials(m) }}</span>
      <span class="cell__name">{{ m }}</span>
    </div>
    <div v-for="i in empty" :key="`e${i}`" class="cell">
      <span class="cell__empty"><i class="ph-bold ph-plus" /></span>
      <span class="cell__name">frei</span>
    </div>
  </div>
</template>

<style scoped>
.grid { display: flex; flex-wrap: wrap; gap: 12px; }
.cell { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 60px; }
.cell__avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--ink);
}
.cell__empty {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 2px dashed var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 18px;
}
.cell__name {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}
</style>
