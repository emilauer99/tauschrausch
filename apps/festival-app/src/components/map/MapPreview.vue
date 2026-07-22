<script setup lang="ts">
import PlanCanvas from '@/components/ui/PlanCanvas.vue'
import MarkerPin from '@/components/ui/MarkerPin.vue'

/** Small non-interactive site-plan thumbnail with a single marker. */
withDefaults(defineProps<{ x: number; y: number; color: string; icon: string; pinSize?: number }>(), { pinSize: 28 })
</script>

<template>
  <div class="preview">
    <PlanCanvas />
    <div class="preview__pin" :style="{ left: `${x}%`, top: `${y}%` }">
      <MarkerPin :color="color" :icon="icon" :size="pinSize" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.preview { position: relative; width: 100%; height: 100%; background: var(--card2); }
.preview__pin { position: absolute; transform: translate(-50%, -100%); }
</style>
