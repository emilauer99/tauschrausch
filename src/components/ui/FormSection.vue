<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="section">
    <span v-if="label" class="section__label">{{ label }}</span>
    <slot />
  </div>
</template>

<style scoped>
.section__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 11px;
}
</style>
