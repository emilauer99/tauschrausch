<script setup lang="ts">
/** Selectable tile (icon + label, optional description). Sets --accent when active. */
withDefaults(defineProps<{
  icon: string
  label: string
  desc?: string
  active?: boolean
  accent?: string
  iconSize?: number
}>(), { accent: 'var(--biete)', iconSize: 27 })
</script>

<template>
  <button
    class="tile"
    :class="{ 'tile--active': active }"
    :style="{ '--accent': accent }"
  >
    <i :class="icon" class="tile__icon" :style="{ fontSize: `${iconSize}px`, color: active ? 'var(--accent)' : 'var(--muted)' }" />
    <span class="tile__label">{{ label }}</span>
    <span v-if="desc" class="tile__desc">{{ desc }}</span>
  </button>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--card);
  border: 2px solid var(--line);
  color: var(--text);
}
.tile--active { background: color-mix(in oklab, var(--accent) 14%, var(--card)); border-color: var(--accent); }
.tile__label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.tile__desc { font-size: 12px; color: var(--muted); font-weight: 400; }
</style>
