<script setup lang="ts">
/** Primary call-to-action button. Native click falls through to the parent. */
withDefaults(defineProps<{
  icon?: string
  color?: 'biete' | 'suche' | 'games' | 'danger'
  block?: boolean
}>(), { color: 'biete', block: true })
</script>

<template>
  <button class="cta pressable" :class="[`cta--${color}`, { 'cta--block': block }]">
    <i v-if="icon" :class="icon" class="cta__icon" />
    <span class="cta__label"><slot /></span>
  </button>
</template>

<style scoped>
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 19px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 18px;
}
.cta--block { width: 100%; }
.cta--biete { background: var(--biete); color: var(--ink); box-shadow: 0 12px 32px -8px var(--biete); }
.cta--suche { background: var(--suche); color: var(--ink); box-shadow: 0 12px 30px -8px var(--suche); }
.cta--games { background: var(--games); color: var(--ink); box-shadow: 0 12px 30px -8px var(--games); }
.cta--danger { background: var(--danger); color: #fff; }
.cta__icon { font-size: 21px; }
</style>
