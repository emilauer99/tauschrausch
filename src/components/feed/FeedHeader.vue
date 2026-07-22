<script setup lang="ts">
import IconButton from '@/components/ui/IconButton.vue'

defineProps<{ zoneLabel: string; hasPlan: boolean; bellCount: number; filtersActive: boolean }>()
const emit = defineEmits<{ openZone: []; openMap: []; openBell: []; openFilter: [] }>()
</script>

<template>
  <div class="header">
    <button class="zone" @click="emit('openZone')">
      <i class="ph-fill ph-map-pin zone__pin" />
      <span class="zone__label">{{ zoneLabel }}</span>
      <i class="ph-bold ph-caret-down zone__caret" />
    </button>
    <div class="actions">
      <IconButton v-if="hasPlan" icon="ph-fill ph-map-trifold" accent="var(--suche)" title="Geländeplan" @click="emit('openMap')" />
      <IconButton icon="ph-fill ph-bell" @click="emit('openBell')">
        <span v-if="bellCount > 0" class="badge">{{ bellCount }}</span>
      </IconButton>
      <IconButton
        icon="ph-bold ph-sliders-horizontal"
        title="Filter"
        :accent="filtersActive ? 'var(--biete)' : undefined"
        @click="emit('openFilter')"
      >
        <span v-if="filtersActive" class="filter-dot" />
      </IconButton>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; align-items: center; justify-content: space-between; }
.zone {
  display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 999px;
  background: var(--card); border: 1px solid var(--line); color: var(--text); cursor: pointer;
}
.zone__pin { color: var(--suche); font-size: 18px; }
.zone__label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.zone__caret { font-size: 13px; color: var(--muted); }
.actions { display: flex; gap: 8px; align-items: center; }
.badge {
  position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 3px;
  border-radius: 9px; background: var(--games); color: var(--ink);
  font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px;
  display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg);
}
.filter-dot {
  position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; border-radius: 50%;
  background: var(--biete); border: 2px solid var(--bg);
}
</style>
