<script setup lang="ts">
import { useAppStore } from '@/store/app'
import PlanCanvas from '@/components/ui/PlanCanvas.vue'
import MarkerPin from '@/components/ui/MarkerPin.vue'
import AppButton from '@/components/ui/AppButton.vue'

const app = useAppStore()
</script>

<template>
  <div class="detail" :style="{ '--accent': app.activeItem.accentVar }">
    <div class="hero">
      <i :class="app.activeItem.catIcon" class="hero__icon" />
      <button class="hero__back" @click="app.goBack()"><i class="ph-bold ph-arrow-left" /></button>
      <span class="hero__tag">{{ app.activeItem.photoLabel }}</span>
      <span class="hero__badge"><i :class="app.activeItem.typeIcon" />{{ app.activeItem.typeLabel }}</span>
    </div>

    <div class="detail__body">
      <h1 class="detail__title">{{ app.activeItem.title }}</h1>
      <div class="pills">
        <span class="pill"><i :class="app.activeItem.priceIcon" class="pill__accent" />{{ app.activeItem.priceLabel }}</span>
        <span class="pill pill--muted"><i :class="app.activeItem.catIcon" />{{ app.activeItem.catLabel }}</span>
      </div>
      <div class="info">
        <div class="info__row"><i class="ph-fill ph-map-pin info__pin" /><div><div class="info__title">{{ app.activeItem.zone }}</div><div class="info__hint">Treffpunkt zur Übergabe</div></div></div>
        <div class="info__sep" />
        <div class="info__row"><i class="ph-fill ph-clock-countdown info__clock" /><div><div class="info__title">{{ app.activeItem.expiry }}</div><div class="info__hint">danach verschwindet das Inserat</div></div></div>
      </div>
      <button v-if="app.activeItem.hasMarker && app.activeItem.marker" class="planbtn pressable" @click="app.openActiveMarker()">
        <PlanCanvas />
        <div class="planbtn__pin" :style="{ left: `${app.activeItem.marker.x}%`, top: `${app.activeItem.marker.y}%` }">
          <MarkerPin :color="app.activeItem.markerColor" :icon="app.activeItem.markerIcon" :size="32" />
        </div>
        <span class="planbtn__label">GELÄNDEPLAN</span>
        <span class="planbtn__cta"><i class="ph-fill ph-magnifying-glass-plus" />Auf Plan zeigen</span>
      </button>
      <p class="desc">{{ app.activeItem.desc }}</p>
      <div class="seller">
        <span class="seller__avatar">{{ app.activeItem.sellerInit }}</span>
        <div class="seller__meta">
          <div class="seller__name">{{ app.activeItem.seller }}</div>
          <div class="seller__rating"><i class="ph-fill ph-thumbs-up" />{{ app.activeItem.rating }}% · {{ app.activeItem.deals }} Deals</div>
        </div>
        <button class="seller__report" @click="app.reportItem()"><i class="ph-bold ph-flag" />Melden</button>
      </div>
    </div>

    <div class="detail__foot">
      <div v-if="app.activeItem.isMine" class="own">
        <button class="own__btn" @click="app.startEditItem(app.activeItem.id)"><i class="ph-fill ph-pencil-simple" />Bearbeiten</button>
        <button class="own__btn own__btn--del" @click="app.askDeleteItem(app.activeItem.id)"><i class="ph-fill ph-trash" />Löschen</button>
      </div>
      <AppButton v-else icon="ph-fill ph-chat-circle-text" @click="app.openChat()">Anschreiben</AppButton>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative; height: 270px; display: flex; align-items: center; justify-content: center;
  background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04) 10px, transparent 10px, transparent 20px), linear-gradient(150deg, color-mix(in oklab, var(--accent) 30%, #14151a), #101114);
}
.hero__icon { font-size: 96px; color: var(--accent); }
.hero__back { position: absolute; top: 14px; left: 16px; width: 44px; height: 44px; border-radius: 13px; background: rgba(10, 10, 12, 0.55); backdrop-filter: blur(8px); border: none; color: #f5f7fa; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; }
.hero__tag { position: absolute; top: 14px; right: 16px; font-family: 'Space Grotesk', monospace; font-size: 10px; color: rgba(245, 247, 250, 0.55); background: rgba(0, 0, 0, 0.4); padding: 6px 10px; border-radius: 8px; }
.hero__badge { position: absolute; bottom: 14px; left: 16px; display: inline-flex; align-items: center; gap: 7px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.06em; padding: 8px 13px; border-radius: 9px; background: var(--accent); color: var(--ink); }
.detail__body { padding: 20px 22px 130px; }
.detail__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 28px; line-height: 1.12; margin: 0 0 14px; }
.pills { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 20px; }
.pill { display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 11px; background: var(--card); border: 1px solid var(--line); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.pill--muted { font-size: 14px; font-weight: 600; }
.pill--muted i { color: var(--muted); font-size: 17px; }
.pill__accent { color: var(--accent); font-size: 18px; }
.info { display: flex; flex-direction: column; gap: 11px; padding: 16px; border-radius: 18px; background: var(--card); border: 1px solid var(--line); margin-bottom: 18px; }
.info__row { display: flex; align-items: center; gap: 11px; }
.info__pin { font-size: 20px; color: var(--suche); }
.info__clock { font-size: 20px; color: var(--games); }
.info__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.info__hint { font-size: 12px; color: var(--muted); }
.info__sep { height: 1px; background: var(--line); }
.planbtn { display: block; width: 100%; position: relative; height: 150px; border-radius: 18px; overflow: hidden; border: 1px solid var(--line); background: var(--card2); cursor: pointer; margin-bottom: 18px; padding: 0; }
.planbtn__pin { position: absolute; transform: translate(-50%, -100%); }
.planbtn__label { position: absolute; top: 10px; left: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.08em; padding: 5px 9px; border-radius: 7px; background: rgba(10, 10, 12, 0.55); color: #f5f7fa; }
.planbtn__cta { position: absolute; bottom: 10px; right: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; padding: 7px 11px; border-radius: 9px; background: rgba(10, 10, 12, 0.6); color: #f5f7fa; }
.desc { font-size: 15px; line-height: 1.6; color: var(--text); margin: 0 0 20px; text-wrap: pretty; }
.seller { display: flex; align-items: center; gap: 13px; padding: 14px 16px; border-radius: 18px; background: var(--card); border: 1px solid var(--line); }
.seller__avatar { width: 48px; height: 48px; border-radius: 14px; background: var(--accent); color: var(--ink); display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.seller__meta { flex: 1; }
.seller__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.seller__rating { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.seller__rating i { color: var(--biete); font-size: 15px; }
.seller__report { display: flex; align-items: center; gap: 6px; padding: 9px 12px; border-radius: 10px; background: transparent; border: 1px solid var(--line); color: var(--muted); font-size: 13px; cursor: pointer; }
.detail__foot { position: sticky; bottom: 0; padding: 16px 22px calc(16px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 26%); }
.own { display: flex; gap: 10px; }
.own__btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; }
.own__btn i { font-size: 19px; }
.own__btn--del { color: var(--danger); border-color: color-mix(in oklab, var(--danger) 30%, transparent); }
</style>
