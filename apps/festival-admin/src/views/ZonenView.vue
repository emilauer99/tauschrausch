<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;max-width:820px;">
    <div style="display:flex;align-items:center;gap:11px;padding:14px 16px;margin-bottom:18px;border-radius:13px;background:color-mix(in oklab,var(--lime) 14%,#fff);border:1px solid color-mix(in oklab,var(--lime) 45%,transparent);">
      <i class="ph-fill ph-info" style="font-size:20px;color:#5C7A00;flex-shrink:0;"></i>
      <span style="font-size:13px;color:var(--ink);line-height:1.45;">Diese Zonen speisen die <b>Zonen-Auswahl im Onboarding</b> und die <b>Feed-Filter</b> der App. Reihenfolge = Anzeige-Reihenfolge (per Drag &amp; Drop änderbar).</span>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;margin:0;">Zonen · {{ app.vals.curFestName }}</h3><div style="font-size:12.5px;color:var(--ink2);margin-top:2px;">{{ app.vals.zoneCount }} Zonen</div></div>
      <button @click="app.vals.openNewZone" style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-radius:11px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;"><i class="ph-bold ph-plus" style="font-size:15px;"></i>Zone hinzufügen</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div v-for="(z, i) in app.vals.zoneRows" :key="i" draggable="true" @dragstart="z.dragStart" @dragover="z.dragOver" @dragend="z.dragEnd" :style="z.rowStyle">
        <i class="ph-bold ph-dots-six-vertical" style="font-size:20px;color:var(--ink3);cursor:grab;flex-shrink:0;"></i>
        <span :style="`width:14px;height:14px;border-radius:4px;background:${z.color};flex-shrink:0;`"></span>
        <span style="width:30px;height:30px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;color:var(--ink2);">{{ z.pos }}</span>
        <div style="flex:1;min-width:0;"><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;">{{ z.name }}</div><div style="font-size:12.5px;color:var(--ink2);">{{ z.marker }}</div></div>
        <button @click="z.edit" title="Bearbeiten" style="width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-pencil-simple" style="font-size:15px;"></i></button>
        <button @click="z.remove" title="Entfernen" style="width:32px;height:32px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink3);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-trash" style="font-size:15px;"></i></button>
      </div>
    </div>

    <div style="margin-top:30px;padding-top:24px;border-top:1px solid var(--line2);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
        <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px;margin:0;">Geländeplan · {{ app.vals.curFestName }}</h3>
        <button v-if="app.vals.hasPlan" @click="app.vals.togglePlanActive" :style="app.vals.planStatusStyle" title="Sichtbarkeit in der App umschalten"><i :class="app.vals.planStatusIcon" style="font-size:14px;"></i>{{ app.vals.planStatusLabel }}</button>
      </div>
      <div style="font-size:12.5px;color:var(--ink2);margin-bottom:14px;line-height:1.45;">Besucher setzen auf diesem Plan ihre Treffpunkt-Marker. Hier siehst du sie zur Moderation.</div>

      <template v-if="app.vals.hasPlan">
        <div style="position:relative;border-radius:14px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;background:repeating-linear-gradient(135deg,#EEF0EA,#EEF0EA 15px,#E5E8E0 15px,#E5E8E0 30px);">
          <span style="position:absolute;top:12px;left:14px;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--ink3);background:color-mix(in oklab,#fff 72%,transparent);padding:4px 8px;border-radius:6px;">{{ app.vals.planName }}</span>
          <div v-for="(m, i) in app.vals.planMarkers" :key="i" :style="`position:absolute;${m.pinStyle}transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;`" :title="m.label">
            <i class="ph-fill ph-map-pin" :style="`font-size:28px;color:${m.color};filter:drop-shadow(0 2px 3px rgba(20,22,26,.35));`"></i>
          </div>
          <span v-if="app.vals.planNoMarkers" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:13px;color:var(--ink3);background:color-mix(in oklab,#fff 78%,transparent);padding:8px 14px;border-radius:10px;">Noch keine Marker gesetzt</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <div style="display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink2);"><i class="ph-fill ph-map-pin" style="font-size:15px;color:#A01062;"></i>{{ app.vals.planMarkerCount }} Marker von Nutzern gesetzt</div>
          <div style="display:flex;gap:8px;">
            <button @click="app.vals.replacePlan" style="display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-arrows-clockwise" style="font-size:15px;"></i>Plan ersetzen</button>
            <button @click="app.vals.askRemovePlan" style="display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;background:transparent;border:1px solid var(--line);color:var(--ink2);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-trash" style="font-size:15px;"></i>Plan entfernen</button>
          </div>
        </div>
        <div v-if="app.vals.planHasMarkers" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;">
          <span v-for="(m, i) in app.vals.planMarkers" :key="i" style="display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);font-size:12px;color:var(--ink2);"><span :style="`width:9px;height:9px;border-radius:50%;background:${m.color};flex-shrink:0;`"></span>{{ m.label }}</span>
        </div>
      </template>

      <button v-if="app.vals.noPlan" @click="app.vals.uploadPlan" style="width:100%;border:2px dashed var(--line);border-radius:14px;background:var(--panel2);padding:40px 24px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;text-align:center;">
        <span style="width:56px;height:56px;border-radius:15px;background:var(--panel);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;"><i class="ph-bold ph-upload-simple" style="font-size:26px;color:var(--ink2);"></i></span>
        <div><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;color:var(--ink);">Geländeplan hochladen (Bild)</div><div style="font-size:12.5px;color:var(--ink2);margin-top:4px;max-width:380px;line-height:1.45;">PNG oder JPG. Nutzer können anschließend darauf ihre Treffpunkt-Marker setzen.</div></div>
      </button>
    </div>
  </div>
</template>
