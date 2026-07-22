import { onMounted, onUnmounted } from 'vue'

/**
 * Enables click-and-drag horizontal scrolling for any element carrying a
 * `data-dragscroll` attribute (the chip rails and quick-reply bars). A single
 * delegated document listener covers whichever rails are currently mounted.
 * After a real drag it swallows the trailing click so cards behind the rail
 * don't fire.
 */
export function useDragScroll() {
  function onDown(e: PointerEvent) {
    const el = (e.target as HTMLElement).closest?.('[data-dragscroll]') as HTMLElement | null
    if (!el) return
    const startX = e.clientX
    const startScroll = el.scrollLeft
    let moved = false

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      el.style.cursor = ''
      if (moved) {
        const swallow = (ce: Event) => {
          ce.stopPropagation()
          ce.preventDefault()
          document.removeEventListener('click', swallow, true)
        }
        document.addEventListener('click', swallow, true)
      }
    }

    el.style.cursor = 'grabbing'
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  onMounted(() => document.addEventListener('pointerdown', onDown))
  onUnmounted(() => document.removeEventListener('pointerdown', onDown))
}
