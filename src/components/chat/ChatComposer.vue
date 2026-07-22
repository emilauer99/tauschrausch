<script setup lang="ts">
withDefaults(defineProps<{
  quickReplies: string[]
  draft: string
  accent?: 'biete' | 'games' | 'suche'
  placeholder?: string
}>(), { accent: 'biete', placeholder: 'Nachricht schreiben…' })
const emit = defineEmits<{ quick: [text: string]; 'update:draft': [value: string]; send: [] }>()
</script>

<template>
  <div class="composer" :style="{ '--accent': `var(--${accent})` }">
    <div class="composer__quick scr" data-dragscroll>
      <button v-for="(q, i) in quickReplies" :key="i" class="quick" @click="emit('quick', q)">{{ q }}</button>
    </div>
    <div class="composer__row">
      <input
        class="composer__input"
        :value="draft"
        :placeholder="placeholder"
        @input="emit('update:draft', ($event.target as HTMLInputElement).value)"
        @keyup.enter="emit('send')"
      />
      <button class="composer__send" @click="emit('send')"><i class="ph-fill ph-paper-plane-right" /></button>
    </div>
  </div>
</template>

<style scoped>
.composer__quick { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 10px; cursor: grab; }
.quick {
  white-space: nowrap; padding: 9px 13px; border-radius: 999px; background: var(--card2);
  border: 1px solid var(--line); color: var(--text); font-weight: 600; font-size: 13px; cursor: pointer; flex-shrink: 0;
}
.composer__row { display: flex; align-items: center; gap: 9px; }
.composer__input {
  flex: 1; padding: 14px 16px; border-radius: 999px; background: var(--card);
  border: 1px solid var(--line); color: var(--text); font-size: 15px; outline: none;
}
.composer__send {
  width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; background: var(--accent);
  color: var(--ink); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px;
}
</style>
