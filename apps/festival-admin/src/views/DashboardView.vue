<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
      <div v-for="(k, i) in app.vals.kpis" :key="i" style="background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><span :style="`width:38px;height:38px;border-radius:10px;background:${k.iconBg};display:flex;align-items:center;justify-content:center;`"><i :class="k.icon" :style="`font-size:20px;color:${k.iconcol};`"></i></span><span :style="k.trendStyle">{{ k.trend }}</span></div>
        <div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:34px;line-height:1;">{{ k.value }}</div>
        <div style="font-size:13px;color:var(--ink2);margin-top:6px;">{{ k.label }}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:16px;">
      <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--line);"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;margin:0;">Neueste Meldungen</h3><button @click="app.vals.goMeldungen" style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;color:var(--ink2);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;">Alle ansehen<i class="ph-bold ph-arrow-right" style="font-size:13px;"></i></button></div>
        <div v-for="(r, i) in app.vals.latestReports" :key="i" @click="r.open" style="display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid var(--line2);cursor:pointer;">
          <span style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i :class="r.icon" style="font-size:17px;color:var(--ink2);"></i></span>
          <div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ r.preview }}</div><div style="font-size:12px;color:var(--ink2);margin-top:2px;">{{ r.reason }} · {{ r.time }}</div></div>
          <span :style="r.statusStyle">{{ r.statusLabel }}</span>
        </div>
      </div>
      <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;">
        <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;margin:0 0 4px;">{{ app.vals.curFestName }}</h3>
        <div style="font-size:12.5px;color:var(--ink2);margin-bottom:18px;">{{ app.vals.curFestPlace }} · {{ app.vals.curFestDates }}</div>
        <div v-for="(m, i) in app.vals.dashMeta" :key="i" style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line2);"><span style="font-size:13px;color:var(--ink2);">{{ m.label }}</span><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;">{{ m.value }}</span></div>
        <button @click="app.vals.goZonen" style="width:100%;margin-top:18px;padding:12px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;"><i class="ph-bold ph-map-pin-area" style="font-size:16px;"></i>Zonen verwalten</button>
      </div>
    </div>
  </div>
</template>
