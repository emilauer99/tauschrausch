<script setup lang="ts">
/** Teardrop map pin with a centred icon. */
withDefaults(defineProps<{ color: string; icon: string; size?: number }>(), { size: 32 })
</script>

<template>
  <span class="pin" :style="{ width: `${size}px`, height: `${size}px`, background: color }">
    <i :class="icon" class="pin__icon" :style="{ fontSize: `${Math.round(size / 2)}px` }" />
  </span>
</template>

<style scoped>
.pin {
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.45);
  border: 2px solid var(--bg);
}
.pin__icon { transform: rotate(45deg); color: var(--ink); }
</style>
