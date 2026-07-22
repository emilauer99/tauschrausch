<script setup lang="ts">
interface Chip { key: string; label: string; icon: string; active: boolean }
withDefaults(defineProps<{ chips: Chip[]; bleed?: boolean }>(), { bleed: false })
const emit = defineEmits<{ select: [key: string] }>()
</script>

<template>
  <div class="rail scr" :class="{ 'rail--bleed': bleed }" data-dragscroll>
    <button
      v-for="chip in chips"
      :key="chip.key"
      class="chip"
      :class="{ 'chip--active': chip.active }"
      @click="emit('select', chip.key)"
    >
      <i :class="chip.icon" class="chip__icon" />{{ chip.label }}
    </button>
  </div>
</template>

<style scoped>
.rail {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  cursor: grab;
}
.rail--bleed { margin: 0 -20px; padding: 0 20px; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  padding: 9px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  transition: all 0.15s;
}
.chip--active { border-color: transparent; background: var(--text); color: var(--bg); }
.chip__icon { font-size: 16px; }
</style>
