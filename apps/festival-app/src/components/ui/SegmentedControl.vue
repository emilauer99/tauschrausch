<script setup lang="ts">
interface Segment { key: string; label: string; active: boolean; color?: 'text' | 'biete' | 'suche' | 'games' }
defineProps<{ segments: Segment[] }>()
const emit = defineEmits<{ select: [key: string] }>()

function tone(color: Segment['color'] = 'text') {
  return color === 'text'
    ? { background: 'var(--text)', color: 'var(--bg)' }
    : { background: `var(--${color})`, color: 'var(--ink)' }
}
</script>

<template>
  <div class="segs">
    <button
      v-for="seg in segments"
      :key="seg.key"
      class="seg"
      :class="{ 'seg--active': seg.active }"
      :style="seg.active ? tone(seg.color) : undefined"
      @click="emit('select', seg.key)"
    >{{ seg.label }}</button>
  </div>
</template>

<style scoped>
.segs { display: flex; gap: 8px; }
.seg {
  flex: 1;
  padding: 11px 8px;
  border: 1px solid var(--line);
  border-radius: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  cursor: pointer;
  background: transparent;
  color: var(--muted);
  transition: all 0.15s;
}
.seg--active { border-color: transparent; }
</style>
