<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'

const app = useAppStore()
</script>

<template>
  <div class="lineup">
    <div class="lineup__head">
      <div class="lineup__bar">
        <IconButton icon="ph-bold ph-arrow-left" @click="app.goBack()" />
        <div class="lineup__titles"><div class="lineup__title">Line-up</div><div class="lineup__fest">{{ app.meFestival }}</div></div>
        <span class="lineup__icon"><i class="ph-fill ph-music-notes" /></span>
      </div>
      <div class="tabs">
        <button
          v-for="(d, i) in app.lineupDays"
          :key="i"
          class="tab"
          :class="{ 'tab--active': i === app.lineupDayIndex }"
          @click="app.setLineupDay(i)"
        >{{ d }}</button>
      </div>
    </div>
    <div class="lineup__body scr">
      <div v-for="st in app.lineupStages" :key="st.stage" class="stage">
        <div class="stage__head"><span class="stage__dot" /><span class="stage__name">{{ st.stage }}</span></div>
        <div class="stage__rows">
          <button v-for="r in st.rows" :key="r.id" class="row pressable" @click="app.openActSheet(r.id)">
            <span class="row__time">{{ r.time }}</span>
            <div class="row__meta">
              <div class="row__act">{{ r.act }}</div>
              <span v-if="r.hasComp" class="row__comp"><i class="ph-fill ph-users-three" />{{ r.compLabel }}</span>
            </div>
            <i class="ph-bold ph-caret-right row__caret" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lineup { position: absolute; inset: 0; display: flex; flex-direction: column; background: var(--bg); }
.lineup__head { flex-shrink: 0; padding: 8px 14px 12px; border-bottom: 1px solid var(--line); }
.lineup__bar { display: flex; align-items: center; gap: 11px; margin-bottom: 12px; }
.lineup__titles { flex: 1; min-width: 0; }
.lineup__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 19px; }
.lineup__fest { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lineup__icon { width: 40px; height: 40px; flex-shrink: 0; border-radius: 12px; background: color-mix(in oklab, var(--suche) 18%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 21px; color: var(--suche); }
.tabs { display: flex; gap: 6px; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 4px; }
.tab { flex: 1; padding: 10px 6px; border-radius: 11px; border: none; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; background: transparent; color: var(--muted); transition: all 0.15s; }
.tab--active { background: var(--text); color: var(--bg); }
.lineup__body { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 20px calc(30px + env(safe-area-inset-bottom)); }
.stage { margin-bottom: 22px; }
.stage__head { display: flex; align-items: center; gap: 8px; margin-bottom: 11px; }
.stage__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--suche); }
.stage__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; color: var(--muted); text-transform: uppercase; }
.stage__rows { display: flex; flex-direction: column; gap: 8px; }
.row { display: flex; align-items: center; gap: 13px; text-align: left; padding: 14px 15px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); cursor: pointer; color: var(--text); }
.row__time { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; width: 52px; flex-shrink: 0; }
.row__meta { flex: 1; min-width: 0; }
.row__act { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; line-height: 1.15; }
.row__comp { display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; padding: 4px 9px; border-radius: 7px; background: color-mix(in oklab, var(--suche) 20%, var(--card2)); color: var(--suche); }
.row__caret { font-size: 16px; color: var(--muted); flex-shrink: 0; }
</style>
