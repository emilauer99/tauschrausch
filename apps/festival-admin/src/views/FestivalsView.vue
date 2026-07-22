<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <p style="font-size:13.5px;color:var(--ink2);margin:0;max-width:560px;">Jedes Festival ist ein eigener Mandant mit eigenem Link/QR-Satz. Nach dem Event werden alle Daten gelöscht.</p>
      <button @click="app.vals.openNewFestival" style="display:flex;align-items:center;gap:8px;padding:11px 16px;border-radius:11px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-plus" style="font-size:16px;"></i>Neues Festival</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
      <div v-for="(f, i) in app.vals.festivalCards" :key="i" :style="`background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px;${f.dim}`">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px;">
          <div><div style="display:flex;align-items:center;gap:9px;margin-bottom:4px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:17px;margin:0;">{{ f.name }}</h3><span :style="f.badgeStyle">{{ f.badgeLabel }}</span></div><div style="font-size:12.5px;color:var(--ink2);">{{ f.place }} · {{ f.dates }}</div></div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button @click="f.edit" title="Bearbeiten" style="width:32px;height:32px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-pencil-simple" style="font-size:15px;"></i></button>
            <button @click="f.archive" title="Archivieren" style="width:32px;height:32px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-archive" style="font-size:15px;"></i></button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:12px;"><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;">{{ f.users }}</div><div style="font-size:11.5px;color:var(--ink2);margin-top:2px;">aktive Nutzer</div></div>
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:12px;"><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;">{{ f.listings }}</div><div style="font-size:11.5px;color:var(--ink2);margin-top:2px;">Inserate</div></div>
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:12px;"><div :style="`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;color:${f.repCol};`">{{ f.reports }}</div><div style="font-size:11.5px;color:var(--ink2);margin-top:2px;">offene Meldungen</div></div>
        </div>
        <div style="display:flex;gap:8px;">
          <button @click="f.manage" style="flex:1;padding:10px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;">Als Kontext wählen</button>
          <button @click="f.zones" style="flex:1;padding:10px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><i class="ph-bold ph-map-pin-area" style="font-size:14px;"></i>Zonen ({{ f.zoneCount }})</button>
        </div>
      </div>
    </div>
  </div>
</template>
