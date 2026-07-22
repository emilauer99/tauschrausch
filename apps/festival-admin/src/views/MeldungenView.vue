<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
      <span style="font-size:12px;font-weight:600;color:var(--ink3);letter-spacing:.04em;margin-right:2px;">TYP</span>
      <button v-for="(c, i) in app.vals.reportTypeChips" :key="'t' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
      <span style="width:1px;height:22px;background:var(--line);margin:0 6px;"></span>
      <span style="font-size:12px;font-weight:600;color:var(--ink3);letter-spacing:.04em;margin-right:2px;">STATUS</span>
      <button v-for="(c, i) in app.vals.reportStatusChips" :key="'s' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
    </div>
    <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:110px 1fr 130px 160px 96px 116px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);">
        <span>TYP</span><span>GEMELDETER INHALT</span><span>MELDER</span><span>GRUND</span><span>ZEIT</span><span>STATUS</span>
      </div>
      <div v-for="(r, i) in app.vals.reportRows" :key="i" @click="r.open" :style="r.rowStyle">
        <span style="display:flex;align-items:center;gap:7px;"><i :class="r.icon" style="font-size:16px;color:var(--ink2);"></i><span style="font-size:12.5px;font-weight:600;color:var(--ink2);">{{ r.typeLabel }}</span></span>
        <span style="font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:14px;">{{ r.preview }}</span>
        <span style="font-size:13px;color:var(--ink2);">{{ r.reporter }}</span>
        <span style="font-size:13px;">{{ r.reason }}</span>
        <span style="font-size:12.5px;color:var(--ink2);">{{ r.time }}</span>
        <span><span :style="r.statusStyle">{{ r.statusLabel }}</span></span>
      </div>
      <div v-if="app.vals.noReports" style="padding:52px;text-align:center;color:var(--ink3);"><i class="ph ph-confetti" style="font-size:34px;"></i><div style="margin-top:10px;font-size:14px;">Keine Meldungen mit diesem Filter. Saubere Sache.</div></div>
    </div>
  </div>
</template>
