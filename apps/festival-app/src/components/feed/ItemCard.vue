<script setup lang="ts">
import type { FeedVariant } from '@/types'

export interface FeedCard {
  id: number
  typeLabel: string
  typeIcon: string
  accentVar: string
  catIcon: string
  title: string
  zone: string
  time: string
  priceLabel: string
  priceShort: string
  priceIcon: string
  hasPhoto: boolean
  photoLabel: string
  hasMarker: boolean
}

defineProps<{ card: FeedCard; variant: FeedVariant }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button
    class="card pressable"
    :class="`card--${variant}`"
    :style="{ '--accent': card.accentVar }"
    @click="emit('open')"
  >
    <!-- POSTER -->
    <template v-if="variant === 'poster'">
      <div class="poster__head">
        <span class="badge"><i :class="card.typeIcon" />{{ card.typeLabel }}</span>
        <span class="time">{{ card.time }}</span>
      </div>
      <div class="poster__body">
        <span class="thumb"><i :class="card.catIcon" class="thumb__icon" /></span>
        <div class="poster__meta">
          <div class="title">{{ card.title }}</div>
          <div class="zone"><i class="ph-fill ph-map-pin" />{{ card.zone }}<span v-if="card.hasMarker" class="plan-tag"><i class="ph-fill ph-map-trifold" />Plan</span></div>
        </div>
        <span v-if="card.hasPhoto" class="photo">{{ card.photoLabel }}</span>
      </div>
      <div class="poster__foot"><span class="price"><i :class="card.priceIcon" class="price__icon" />{{ card.priceLabel }}</span></div>
    </template>

    <!-- KOMPAKT -->
    <template v-else-if="variant === 'kompakt'">
      <span class="thumb thumb--sm"><i :class="card.catIcon" class="thumb__icon thumb__icon--sm" /></span>
      <div class="kompakt__meta">
        <div class="kompakt__top"><span class="kompakt__type">{{ card.typeLabel }}</span><span class="kompakt__time">· {{ card.time }}</span></div>
        <div class="title title--sm">{{ card.title }}</div>
        <div class="zone zone--sm"><i class="ph-fill ph-map-pin" />{{ card.zone }}<i v-if="card.hasMarker" class="ph-fill ph-map-trifold plan-icon" /></div>
      </div>
      <div class="kompakt__end"><span class="kompakt__price">{{ card.priceShort }}</span><i class="ph-bold ph-caret-right" /></div>
    </template>

    <!-- FOTO -->
    <template v-else>
      <div class="foto__bg"><i :class="card.catIcon" class="foto__icon" /></div>
      <span class="badge foto__badge"><i :class="card.typeIcon" />{{ card.typeLabel }}</span>
      <span class="foto__tag">{{ card.photoLabel }}</span>
      <div class="foto__overlay">
        <div class="title title--foto">{{ card.title }}</div>
        <div class="foto__row"><span class="foto__zone"><i class="ph-fill ph-map-pin" />{{ card.zone }}<i v-if="card.hasMarker" class="ph-fill ph-map-trifold plan-icon" /></span><span class="foto__price"><i :class="card.priceIcon" />{{ card.priceLabel }}</span></div>
      </div>
    </template>
  </button>
</template>

<style scoped>
.card {
  text-align: left;
  border: 1px solid var(--line);
  background: var(--card);
  cursor: pointer;
  overflow: hidden;
  color: var(--text);
  padding: 0;
}
.card--poster { border-radius: 22px; display: block; width: 100%; }
.card--kompakt { border-radius: 16px; border-left: 5px solid var(--accent); display: flex; align-items: center; gap: 13px; padding: 13px 15px; }
.card--foto { border-radius: 22px; border: none; position: relative; height: 210px; color: #f5f7fa; display: block; width: 100%; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  padding: 6px 11px;
  border-radius: 8px;
  color: var(--ink);
  background: var(--accent);
}
.time { font-size: 12px; color: var(--muted); }
.title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; line-height: 1.15; }
.title--sm { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.title--foto { font-size: 20px; line-height: 1.1; margin-bottom: 7px; }
.zone { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.zone--sm { font-size: 12px; margin-top: 2px; }
.plan-tag { display: inline-flex; align-items: center; gap: 3px; margin-left: 4px; font-size: 11px; font-weight: 700; color: var(--accent); }
.plan-icon { margin-left: 3px; color: var(--accent); font-size: 12px; }
.thumb {
  width: 56px; height: 56px; flex-shrink: 0; border-radius: 16px;
  background: color-mix(in oklab, var(--accent) 16%, var(--card2));
  display: flex; align-items: center; justify-content: center;
}
.thumb--sm { width: 44px; height: 44px; border-radius: 12px; background: color-mix(in oklab, var(--accent) 15%, var(--card2)); }
.thumb__icon { font-size: 28px; color: var(--accent); }
.thumb__icon--sm { font-size: 23px; }

/* poster */
.poster__head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 0; }
.poster__body { display: flex; gap: 14px; padding: 12px 16px 16px; align-items: center; }
.poster__meta { flex: 1; min-width: 0; }
.poster__meta .title { margin-bottom: 5px; }
.photo {
  width: 56px; height: 56px; flex-shrink: 0; border-radius: 14px;
  background: repeating-linear-gradient(45deg, var(--card2), var(--card2) 7px, transparent 7px, transparent 14px), var(--bg);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px;
  font-family: 'Space Grotesk', monospace; font-size: 8px; color: var(--muted);
}
.poster__foot { padding: 0 16px 14px; }
.price {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 13px; border-radius: 10px;
  background: var(--card2); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px;
}
.price__icon { font-size: 16px; color: var(--accent); }

/* kompakt */
.kompakt__meta { flex: 1; min-width: 0; }
.kompakt__top { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
.kompakt__type { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.06em; color: var(--accent); }
.kompakt__time { font-size: 11px; color: var(--muted); }
.kompakt__end { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; color: var(--muted); }
.kompakt__price { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: var(--text); }

/* foto */
.foto__bg {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04) 9px, transparent 9px, transparent 18px), linear-gradient(150deg, color-mix(in oklab, var(--accent) 34%, #14151a), #101114);
}
.foto__icon { font-size: 78px; color: var(--accent); opacity: 0.9; }
.foto__badge { position: absolute; top: 14px; left: 14px; }
.foto__tag { position: absolute; top: 14px; right: 14px; font-family: 'Space Grotesk', monospace; font-size: 9px; color: rgba(245, 247, 250, 0.5); background: rgba(0, 0, 0, 0.35); padding: 5px 8px; border-radius: 7px; }
.foto__overlay { position: absolute; left: 0; right: 0; bottom: 0; padding: 36px 16px 15px; background: linear-gradient(transparent, rgba(8, 8, 10, 0.92)); }
.foto__row { display: flex; align-items: center; justify-content: space-between; }
.foto__zone { display: inline-flex; align-items: center; gap: 5px; font-size: 13px; color: rgba(245, 247, 250, 0.8); }
.foto__price { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }
</style>
