<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button v-for="(c, i) in app.vals.lobbyChips" :key="'s' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
      <span style="width:1px;height:22px;background:var(--line);margin:0 2px;"></span>
      <span style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);">TYP</span>
      <button v-for="(c, i) in app.vals.lobbyKindChips" :key="'k' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
    </div>
    <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 1.3fr 120px 118px 140px 104px 132px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);">
        <span>TREFFEN</span><span>TREFFPUNKT</span><span>ZEIT</span><span>TEILNEHMER</span><span>ERSTELLER</span><span>STATUS</span><span style="text-align:right;">AKTION</span>
      </div>
      <div v-for="(l, i) in app.vals.lobbyRows" :key="i" :style="l.rowStyle">
        <span style="display:flex;align-items:center;gap:10px;min-width:0;"><span :style="`width:30px;height:30px;border-radius:8px;background:${l.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;`"><i :class="l.icon" :style="`font-size:15px;color:${l.iconCol};`"></i></span><span style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ l.game }}</span><span :style="l.kindStyle">{{ l.kindLabel }}</span></span>
        <span style="font-size:13px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:12px;">{{ l.spot }}</span>
        <span style="font-size:13px;">{{ l.time }}</span>
        <span style="font-size:13px;font-family:'Space Grotesk',sans-serif;font-weight:700;">{{ l.part }}</span>
        <span style="font-size:13px;">{{ l.creator }}</span>
        <span><span :style="l.statusStyle">{{ l.statusLabel }}</span></span>
        <span style="text-align:right;display:flex;gap:6px;justify-content:flex-end;">
          <button v-if="l.canClose" @click="l.close" title="Schließen" style="width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-lock-simple" style="font-size:15px;"></i></button>
          <button @click="l.del" title="Löschen" style="width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink3);cursor:pointer;"><i class="ph-bold ph-trash" style="font-size:15px;"></i></button>
        </span>
      </div>
    </div>
  </div>
</template>
