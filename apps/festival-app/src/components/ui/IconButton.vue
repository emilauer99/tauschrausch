<script setup lang="ts">
/** Square icon button used across headers (back, bell, theme, map, report). */
withDefaults(defineProps<{
  icon: string
  /** CSS color for the glyph (e.g. 'var(--suche)'); defaults to text color. */
  accent?: string
  variant?: 'card' | 'ghost'
  title?: string
}>(), { variant: 'card' })
</script>

<template>
  <button class="icon-btn" :class="`icon-btn--${variant}`" :title="title">
    <i :class="icon" class="icon-btn__glyph" :style="accent ? { color: accent } : undefined" />
    <slot />
  </button>
</template>

<style scoped>
.icon-btn {
  position: relative;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.icon-btn--card { background: var(--card); border: 1px solid var(--line); }
.icon-btn--ghost { background: transparent; border: 1px solid var(--line); color: var(--muted); }
.icon-btn__glyph { font-size: 19px; }
</style>
