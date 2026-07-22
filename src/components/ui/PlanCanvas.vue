<script setup lang="ts">
import { PLAN_ZONES } from '@/data/seed'

withDefaults(defineProps<{ showLabels?: boolean; grid?: boolean }>(), { showLabels: false, grid: false })
</script>

<template>
  <div class="plan">
    <div v-if="grid" class="plan__grid" />
    <div
      v-for="z in PLAN_ZONES"
      :key="z.label"
      class="plan__zone"
      :class="`plan__zone--${z.role}`"
      :style="{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }"
    >
      <span v-if="showLabels" class="plan__label">{{ z.label }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.plan { position: absolute; inset: 0; }
.plan__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 11% 11%;
  opacity: 0.45;
  pointer-events: none;
}
.plan__zone {
  position: absolute;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2px;
}
.plan__label {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.07em;
  pointer-events: none;
}
.plan__zone--stage { background: color-mix(in oklab, var(--games) 24%, var(--card)); border: 1px solid color-mix(in oklab, var(--games) 45%, transparent); color: var(--games); }
.plan__zone--camp { background: color-mix(in oklab, var(--text) 7%, var(--card)); border: 1px solid var(--line); color: var(--muted); }
.plan__zone--food { background: color-mix(in oklab, var(--suche) 17%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 34%, transparent); color: var(--suche); }
.plan__zone--info { background: color-mix(in oklab, var(--biete) 16%, var(--card)); border: 1px solid color-mix(in oklab, var(--biete) 32%, transparent); color: color-mix(in oklab, var(--biete) 65%, var(--text)); }
.plan__zone--water { background: color-mix(in oklab, #5cc8ff 20%, var(--card)); border: 1px solid color-mix(in oklab, #5cc8ff 40%, transparent); color: #5cc8ff; }
</style>
