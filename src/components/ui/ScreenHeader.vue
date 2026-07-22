<script setup lang="ts">
import IconButton from '@/components/ui/IconButton.vue'

withDefaults(defineProps<{ title?: string; leading?: 'back' | 'close' | 'none'; sticky?: boolean }>(), {
  leading: 'back', sticky: true,
})
const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div class="sheet-header" :class="{ 'sheet-header--sticky': sticky }">
    <IconButton
      v-if="leading !== 'none'"
      :icon="leading === 'close' ? 'ph-bold ph-x' : 'ph-bold ph-arrow-left'"
      @click="emit('back')"
    />
    <span v-if="title" class="sheet-header__title">{{ title }}</span>
    <div class="sheet-header__end"><slot name="end" /></div>
  </div>
</template>

<style scoped>
.sheet-header {
  z-index: 30;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 20px 12px;
  border-bottom: 1px solid var(--line);
}
.sheet-header--sticky { position: sticky; top: 0; }
.sheet-header__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; flex: 1; }
.sheet-header__end { display: flex; align-items: center; gap: 8px; }
</style>
