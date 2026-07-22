<script setup lang="ts">
/** Centred modal dialog, rendered inline within `.frame` (see BottomSheet note).
 *  The panel pops in on mount; closing unmounts directly. */
const props = withDefaults(defineProps<{ open: boolean; z?: number; dismissible?: boolean; center?: boolean }>(), {
  z: 85, dismissible: true, center: false,
})
const emit = defineEmits<{ close: [] }>()
function onBackdrop() { if (props.dismissible) emit('close') }
</script>

<template>
  <div v-if="open" class="backdrop" :style="{ zIndex: z }" @click="onBackdrop">
    <div class="modal-panel" :class="{ 'modal-panel--center': center }" @click.stop>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.backdrop { position: absolute; inset: 0; background: rgba(6, 6, 8, 0.72); display: flex; align-items: center; justify-content: center; padding: 22px; }
.modal-panel {
  width: 100%;
  background: var(--card);
  border-radius: 24px;
  padding: 22px;
  border: 1px solid var(--line);
  animation: popIn 0.2s ease both;
}
.modal-panel--center { text-align: center; border-radius: 26px; }
</style>
