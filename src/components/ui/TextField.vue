<script setup lang="ts">
const model = defineModel<string>()
withDefaults(defineProps<{
  label?: string
  placeholder?: string
  type?: string
  grotesk?: boolean
}>(), { type: 'text' })
</script>

<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <input
      v-model="model"
      class="field__input"
      :class="{ 'field__input--grotesk': grotesk }"
      :type="type"
      :placeholder="placeholder"
    />
  </label>
</template>

<style scoped>
.field { display: block; }
.field__label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin: 0 0 7px 2px;
}
.field__input {
  width: 100%;
  padding: 16px 18px;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--text);
  font-size: 16px;
  outline: none;
}
.field__input--grotesk { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
</style>
