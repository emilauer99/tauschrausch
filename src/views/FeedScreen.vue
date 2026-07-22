<script setup lang="ts">
import { useAppStore } from '@/store/app'
import FeedHeader from '@/components/feed/FeedHeader.vue'
import ItemCard from '@/components/feed/ItemCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const app = useAppStore()
</script>

<template>
  <div class="feed">
    <div class="feed__top">
      <FeedHeader
        :zone-label="app.zoneLabel"
        :has-plan="app.hasPlan"
        :bell-count="app.bellCount"
        :filters-active="app.feedFiltersActive"
        @open-zone="app.openZoneSheet()"
        @open-map="app.openOverviewMap()"
        @open-bell="app.openBell()"
        @open-filter="app.openFilterSheet()"
      />
    </div>

    <div class="feed__body">
      <div class="feed__status">
        <span class="feed__count"><b>{{ app.feedCount }}</b> Inserate in Reichweite</span>
        <span class="feed__live"><span class="dot" />live</span>
      </div>
      <div class="feed__list" :class="`feed__list--${app.feedVariant}`">
        <ItemCard
          v-for="card in app.feedCards"
          :key="card.id"
          :card="card"
          :variant="app.feedVariant"
          @open="app.openItem(card.id)"
        />
      </div>
    </div>

    <div class="feed__fab">
      <AppButton icon="ph-bold ph-plus" @click="app.startCreate()">Inserat erstellen</AppButton>
    </div>
  </div>
</template>

<style scoped>
.feed__top { position: sticky; top: 0; z-index: 30; background: var(--bg); padding: 6px 20px 12px; border-bottom: 1px solid var(--line); }
.feed__body { padding: 16px 20px 96px; display: flex; flex-direction: column; gap: 14px; }
.feed__status { display: flex; align-items: center; justify-content: space-between; }
.feed__count { font-size: 13px; color: var(--muted); }
.feed__count b { color: var(--text); }
.feed__live { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
.feed__live .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--biete); animation: glow 1.6s ease-in-out infinite; }
.feed__list { display: flex; flex-direction: column; }
.feed__list--poster { gap: 14px; }
.feed__list--kompakt { gap: 9px; }
.feed__list--foto { gap: 16px; }
.feed__fab { position: sticky; bottom: 0; padding: 14px 20px calc(14px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 30%); pointer-events: none; }
.feed__fab > * { pointer-events: auto; }
</style>
