<script setup lang="ts">
/** Decorative festival status bar (weak signal, wifi off, low battery). */
</script>

<template>
  <div class="status">
    <span class="status__clock">16:32</span>
    <div class="status__right">
      <i class="ph-bold ph-cell-signal-low" />
      <i class="ph-bold ph-wifi-slash status__wifi" />
      <span class="status__battery"><i class="ph-fill ph-battery-low" />17%</span>
    </div>
  </div>
</template>

<style scoped>
.status { height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 26px 0 30px; flex-shrink: 0; font-family: 'Space Grotesk', sans-serif; z-index: 40; }
.status__clock { font-weight: 700; font-size: 15px; color: var(--text); }
.status__right { display: flex; align-items: center; gap: 9px; color: var(--text); font-size: 16px; }
.status__wifi { opacity: 0.8; }
.status__battery { display: inline-flex; align-items: center; gap: 3px; color: var(--games); font-weight: 700; font-size: 13px; }
.status__battery i { font-size: 19px; }
</style>
