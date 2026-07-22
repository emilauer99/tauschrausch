import { onMounted, onUnmounted } from 'vue'
import type { useAppStore } from '@/store/app'

/**
 * Drives the 1-second frame tick that powers countdowns, the reminder banner
 * and the reminder modal. Kept as a composable so App.vue stays a thin shell.
 */
export function useReminderTicker(store: ReturnType<typeof useAppStore>) {
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => { timer = setInterval(() => store.tickSecond(), 1000) })
  onUnmounted(() => { if (timer) clearInterval(timer) })
}
