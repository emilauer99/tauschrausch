<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <!-- Empty state -->
    <div v-if="app.vals.lineupEmpty" style="max-width:560px;margin:36px auto;text-align:center;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:44px 34px;">
      <span style="width:64px;height:64px;border-radius:17px;background:color-mix(in oklab,var(--magenta) 12%,#fff);display:inline-flex;align-items:center;justify-content:center;margin-bottom:18px;"><i class="ph-fill ph-microphone-stage" style="font-size:32px;color:#A01062;"></i></span>
      <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0 0 8px;">Noch kein Line-up gepflegt</h3>
      <p style="font-size:14px;color:var(--ink2);line-height:1.55;margin:0 0 22px;">Optional — die App läuft ohne Line-up ganz normal weiter. Besucher legen ihre Act-Treffen dann per <b>Freitext</b> an (Act, Bühne &amp; Zeit selbst eingetippt). Sobald du hier Bühnen und Acts pflegst, wählen sie stattdessen direkt aus dem Programm.</p>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button @click="app.vals.openNewStage" style="display:flex;align-items:center;gap:8px;padding:11px 16px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-plus" style="font-size:15px;"></i>Bühne anlegen</button>
        <button @click="app.vals.openCsv" style="display:flex;align-items:center;gap:8px;padding:11px 16px;border-radius:11px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;"><i class="ph-bold ph-upload-simple" style="font-size:15px;"></i>Line-up importieren (CSV)</button>
      </div>
    </div>

    <template v-if="app.vals.lineupNotEmpty">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
        <div style="display:flex;gap:8px;">
          <button v-for="(t, i) in app.vals.lineupTabs" :key="i" @click="t.on" :style="t.style"><i :class="t.icon" style="font-size:15px;"></i>{{ t.label }}</button>
        </div>
        <div style="display:flex;gap:8px;">
          <button @click="app.vals.openCsv" style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-upload-simple" style="font-size:15px;"></i>Importieren (CSV)</button>
          <button @click="app.vals.openNewAct" style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-radius:11px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;"><i class="ph-bold ph-plus" style="font-size:15px;"></i>Act anlegen</button>
        </div>
      </div>

      <!-- Acts sub-tab -->
      <template v-if="app.vals.isLineupActs">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;"><span style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-right:2px;">TAG</span><button v-for="(c, i) in app.vals.dayChips" :key="'d' + i" @click="c.on" :style="c.style">{{ c.label }}</button></div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;"><span style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-right:2px;">BÜHNE</span><button v-for="(c, i) in app.vals.stageFilterChips" :key="'sf' + i" @click="c.on" :style="c.style">{{ c.label }}</button></div>
        <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:1.4fr 1fr 84px 132px 128px 88px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);"><span>ACT</span><span>BÜHNE</span><span>ZEIT</span><span>STATUS</span><span>BEGLEIT-TREFFEN</span><span style="text-align:right;">AKTION</span></div>
          <div v-for="(a, i) in app.vals.actRows" :key="i" :style="a.rowStyle">
            <span :style="`${a.nameStyle}white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:10px;`">{{ a.name }}</span>
            <span style="font-size:13px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:10px;">{{ a.stage }}</span>
            <span style="font-size:12.5px;">{{ a.start }}<span style="color:var(--ink3);">–{{ a.end }}</span></span>
            <span><span :style="a.statusStyle">{{ a.statusLabel }}</span></span>
            <span style="display:flex;align-items:center;gap:6px;"><i class="ph-fill ph-users-three" style="font-size:14px;color:var(--ink3);"></i><span :style="a.treffenStyle">{{ a.treffen }}</span></span>
            <span style="text-align:right;display:flex;gap:5px;justify-content:flex-end;">
              <button @click="a.edit" title="Bearbeiten" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-pencil-simple" style="font-size:14px;"></i></button>
              <template v-if="a.canShift">
                <button @click="a.shift" title="Verschieben" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-clock-clockwise" style="font-size:14px;"></i></button>
                <button @click="a.cancel" title="Absagen" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-x-circle" style="font-size:14px;"></i></button>
              </template>
              <button @click="a.del" title="Löschen" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink3);cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-trash" style="font-size:14px;"></i></button>
            </span>
          </div>
          <div v-if="app.vals.noActsDay" style="padding:40px;text-align:center;color:var(--ink3);font-size:13.5px;">Für {{ app.vals.actDayLabel }} sind keine Acts eingetragen.</div>
        </div>
      </template>

      <!-- Bühnen sub-tab -->
      <template v-if="app.vals.isLineupStages">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;">
          <div style="font-size:12.5px;color:var(--ink2);line-height:1.45;max-width:580px;">Die Marker-Position dient in der App als <b>vorausgefüllter Treffpunkt</b>, wenn Besucher ein Act-Treffen für diese Bühne eröffnen.</div>
          <button @click="app.vals.openNewStage" style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-radius:11px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;flex-shrink:0;"><i class="ph-bold ph-plus" style="font-size:15px;"></i>Bühne hinzufügen</button>
        </div>
        <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:1fr 200px 110px 88px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);"><span>BÜHNE</span><span>MARKER-POSITION</span><span>ACTS</span><span style="text-align:right;">AKTION</span></div>
          <div v-for="(st, i) in app.vals.stageRows" :key="i" style="display:grid;grid-template-columns:1fr 200px 110px 88px;align-items:center;padding:13px 18px;border-bottom:1px solid var(--line2);">
            <span style="display:flex;align-items:center;gap:10px;"><span style="width:30px;height:30px;border-radius:8px;background:color-mix(in oklab,var(--magenta) 12%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph-fill ph-microphone-stage" style="font-size:15px;color:#A01062;"></i></span><span style="font-size:13.5px;font-weight:600;">{{ st.name }}</span></span>
            <span style="display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--ink2);"><i v-if="st.hasPos" class="ph-fill ph-map-pin" style="font-size:14px;color:#A01062;flex-shrink:0;"></i>{{ st.posLabel }}</span>
            <span style="font-size:13px;"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;">{{ st.cnt }}</span></span>
            <span style="text-align:right;display:flex;gap:5px;justify-content:flex-end;">
              <button @click="st.edit" title="Bearbeiten" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-pencil-simple" style="font-size:14px;"></i></button>
              <button @click="st.remove" title="Entfernen" style="width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--line);color:var(--ink3);cursor:pointer;"><i class="ph-bold ph-trash" style="font-size:14px;"></i></button>
            </span>
          </div>
          <div v-if="app.vals.noStages" style="padding:40px;text-align:center;color:var(--ink3);font-size:13.5px;">Noch keine Bühnen. Leg die erste an.</div>
        </div>
      </template>

      <!-- Timetable sub-tab -->
      <template v-if="app.vals.isLineupTimetable">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;"><span style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-right:2px;">TAG</span><button v-for="(c, i) in app.vals.dayChips" :key="'td' + i" @click="c.on" :style="c.style">{{ c.label }}</button></div>
        <div v-if="app.vals.timetableNoStages" style="background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:40px;text-align:center;color:var(--ink3);font-size:13.5px;">Erst Bühnen anlegen, dann erscheint hier das Raster.</div>
        <template v-if="app.vals.hasTimetable">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;font-size:12px;color:var(--ink2);">
            <span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:3px;background:color-mix(in oklab,#C7FF3C 20%,#fff);border:1px solid color-mix(in oklab,#C7FF3C 55%,#fff);"></span>geplant</span>
            <span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:3px;background:color-mix(in oklab,#FFB020 18%,#fff);border:1px solid color-mix(in oklab,#FFB020 55%,#fff);"></span>verschoben</span>
            <span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:3px;background:#F1F2EE;border:1px solid var(--line);"></span><span style="text-decoration:line-through;">abgesagt</span></span>
          </div>
          <div class="adminscroll" style="background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px;overflow-x:auto;">
            <div style="display:flex;min-width:520px;">
              <div :style="`width:56px;flex-shrink:0;position:relative;${app.vals.timetableHeightStyle}`">
                <div v-for="(h, i) in app.vals.timetable.hours" :key="i" :style="`position:absolute;left:0;width:100%;text-align:right;padding-right:10px;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--ink3);${h.topStyle}`">{{ h.label }}</div>
              </div>
              <div style="flex:1;display:flex;gap:8px;">
                <div v-for="(col, ci) in app.vals.timetable.cols" :key="ci" style="flex:1;min-width:120px;">
                  <div style="height:34px;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12.5px;color:var(--ink);border-bottom:1px solid var(--line);text-align:center;">{{ col.name }}</div>
                  <div :style="`position:relative;${app.vals.timetable.bodyStyle}background:repeating-linear-gradient(transparent,transparent 77px,var(--line2) 77px,var(--line2) 78px);`">
                    <div v-for="(b, bi) in col.blocks" :key="bi" :style="b.style"><div :style="b.nameStyle">{{ b.name }}</div><div style="font-size:10.5px;color:var(--ink2);margin-top:2px;"><span v-if="b.shift" style="color:#8A5A00;font-weight:700;">↷ </span>{{ b.time }}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="app.vals.timetableNoActs" style="text-align:center;color:var(--ink3);font-size:13px;margin-top:12px;">Für {{ app.vals.actDayLabel }} sind noch keine Acts geplant.</div>
        </template>
      </template>
    </template>
  </div>
</template>
