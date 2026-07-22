<script setup lang="ts">
/** Bottom-anchored sheet. Rendered by OverlaysHost, which already lives directly
 *  inside `.frame`, so `position:absolute` covers the frame without Teleport.
 *  The panel slides up on mount; closing unmounts directly. */
withDefaults(defineProps<{ open: boolean; z?: number; scroll?: boolean; handle?: boolean }>(), {
  z: 70, scroll: false, handle: true,
})
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div v-if="open" class="backdrop" :style="{ zIndex: z }" @click="emit('close')">
    <div class="sheet-panel" :class="{ 'sheet-panel--scroll': scroll, scr: scroll }" @click.stop>
      <div v-if="handle" class="grip" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.backdrop { position: absolute; inset: 0; background: rgba(6, 6, 8, 0.6); display: flex; align-items: flex-end; }
.sheet-panel {
  width: 100%;
  background: var(--card);
  border-radius: 28px 28px 0 0;
  padding: 12px 20px calc(24px + env(safe-area-inset-bottom));
  animation: slideUp 0.28s cubic-bezier(0.2, 0.9, 0.3, 1) both;
}
.sheet-panel--scroll { max-height: 80%; overflow-y: auto; }
.grip { width: 44px; height: 5px; border-radius: 3px; background: var(--line); margin: 4px auto 16px; }
</style>
