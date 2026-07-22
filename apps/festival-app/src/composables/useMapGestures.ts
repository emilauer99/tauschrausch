import type { Ref } from 'vue'
import type { useAppStore } from '@/store/app'

/**
 * Pointer gestures for the site-plan canvas: tap/drag to place a marker in
 * "place" mode, drag to pan when zoomed in, plus zoom in/out. Map state
 * (zoom/pan/draft marker/mode) lives in the store; this composable is the
 * behavior operating on a template ref to the plan layer.
 */
export function useMapGestures(
  store: ReturnType<typeof useAppStore>,
  planLayer: Ref<HTMLElement | null>,
) {
  /** Convert a pointer event to a clamped 0–100 fraction of the plan layer. */
  function toFraction(e: PointerEvent) {
    const el = planLayer.value
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(4, Math.min(96, ((e.clientY - r.top) / r.height) * 100)),
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (store.mapMode === 'place') {
      if (e.cancelable) e.preventDefault()
      const f0 = toFraction(e)
      if (f0) store.setDraftMarker(f0)
      const move = (ev: PointerEvent) => { const f = toFraction(ev); if (f) store.setDraftMarker(f) }
      const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up) }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
      return
    }
    if (store.mapZoom > 1) {
      const sx = e.clientX, sy = e.clientY
      const px = store.mapPanX, py = store.mapPanY
      const move = (ev: PointerEvent) => store.setPan(px + (ev.clientX - sx), py + (ev.clientY - sy))
      const up = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up) }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    }
  }

  return { onPointerDown, zoomIn: store.mapZoomIn, zoomOut: store.mapZoomOut }
}
