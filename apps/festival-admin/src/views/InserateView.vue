<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
      <div style="position:relative;flex:1;min-width:220px;max-width:320px;"><i class="ph ph-magnifying-glass" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:16px;"></i><input :value="app.vals.listingQuery" @input="app.vals.onListingQuery" placeholder="Titel oder Autor suchen…" style="width:100%;padding:10px 12px 10px 38px;border-radius:11px;background:var(--panel);border:1px solid var(--line);font-size:13.5px;outline:none;" /></div>
      <button v-for="(c, i) in app.vals.listingCatChips" :key="'c' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
      <span style="width:1px;height:22px;background:var(--line);margin:0 4px;"></span>
      <button v-for="(c, i) in app.vals.listingTypeChips" :key="'t' + i" @click="c.on" :style="c.style">{{ c.label }}</button>
    </div>
    <div v-if="app.vals.hasSelection" style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;margin-bottom:12px;background:var(--sidebar);border-radius:12px;animation:rowIn .18s ease both;">
      <span style="color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">{{ app.vals.selCount }} ausgewählt</span>
      <div style="display:flex;gap:8px;"><button @click="app.vals.clearSelection" style="padding:8px 13px;border-radius:9px;background:rgba(255,255,255,.12);border:none;color:#fff;font-weight:600;font-size:12.5px;cursor:pointer;">Aufheben</button><button @click="app.vals.askDeleteSelected" style="padding:8px 13px;border-radius:9px;background:var(--danger);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12.5px;cursor:pointer;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-trash" style="font-size:14px;"></i>Löschen</button></div>
    </div>
    <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:46px 1fr 150px 140px 130px 96px 64px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);align-items:center;">
        <button @click="app.vals.toggleAllListings" :style="`width:19px;height:19px;border-radius:5px;border:1.5px solid ${app.vals.allBoxBorder};background:${app.vals.allBoxBg};cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;`"><i v-if="app.vals.allSelected" class="ph-bold ph-check" style="font-size:12px;color:#14300A;"></i></button>
        <span>TITEL</span><span>KATEGORIE</span><span>AUTOR</span><span>ZONE</span><span>TYP</span><span style="text-align:right;">AKTION</span>
      </div>
      <div v-for="(l, i) in app.vals.listingRows" :key="l.id" :style="l.rowStyle">
        <button @click="l.toggle" :style="`width:19px;height:19px;border-radius:5px;border:1.5px solid ${l.boxBorder};background:${l.boxBg};cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;`"><i v-if="l.checked" class="ph-bold ph-check" style="font-size:12px;color:#14300A;"></i></button>
        <span style="display:flex;align-items:center;gap:10px;min-width:0;"><span style="width:30px;height:30px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i :class="l.catIcon" style="font-size:15px;color:var(--ink2);"></i></span><span style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ l.title }}</span><span v-if="l.flagged" style="font-size:10px;font-weight:700;color:var(--danger);background:color-mix(in oklab,var(--danger) 12%,#fff);padding:2px 6px;border-radius:5px;flex-shrink:0;">gemeldet</span></span>
        <span style="font-size:13px;color:var(--ink2);">{{ l.catLabel }}</span>
        <span style="font-size:13px;">{{ l.author }}</span>
        <span style="font-size:13px;color:var(--ink2);">{{ l.zone }}</span>
        <span><span :style="l.typeStyle">{{ l.typeLabel }}</span></span>
        <span style="text-align:right;"><button @click="l.del" style="width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink3);cursor:pointer;"><i class="ph-bold ph-trash" style="font-size:15px;"></i></button></span>
      </div>
    </div>
  </div>
</template>
