<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <!-- ===== Drawer (report / user) ===== -->
  <div v-if="app.vals.drawerOpen" @click="app.vals.closeDrawer" style="position:absolute;inset:0;background:rgba(20,22,26,.32);z-index:70;display:flex;justify-content:flex-end;animation:fadeIn .18s ease both;">
    <div @click.stop class="adminscroll" style="width:440px;height:100%;background:var(--panel);border-left:1px solid var(--line);animation:drawerIn .24s cubic-bezier(.2,.9,.3,1) both;">

      <!-- Report drawer -->
      <div v-if="app.vals.isReportDrawer" style="padding:22px 24px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <span style="display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);"><i :class="app.vals.dReport.icon" style="font-size:16px;color:var(--ink2);"></i><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;">Meldung · {{ app.vals.dReport.typeLabel }}</span></span>
          <button @click="app.vals.closeDrawer" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button>
        </div>
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:16px;"><span :style="app.vals.dReport.statusStyle">{{ app.vals.dReport.statusLabel }}</span><span style="font-size:12.5px;color:var(--ink3);">{{ app.vals.dReport.time }} · {{ app.vals.dReport.festName }}</span></div>
        <div style="background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:16px;">
          <div style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-bottom:8px;">GEMELDETER INHALT</div>
          <div style="font-size:15px;font-weight:600;line-height:1.4;margin-bottom:10px;">{{ app.vals.dReport.preview }}</div>
          <div style="font-size:13px;color:var(--ink2);line-height:1.5;">{{ app.vals.dReport.body }}</div>
          <div v-if="app.vals.dReport.hasTargetUser" style="display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line);"><i class="ph-fill ph-user" style="font-size:15px;color:var(--ink3);"></i><span style="font-size:13px;color:var(--ink2);">Von <b style="color:var(--ink);">{{ app.vals.dReport.targetUser }}</b></span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px;">
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:13px;"><div style="font-size:11.5px;color:var(--ink3);margin-bottom:4px;">Melder</div><div style="font-size:13.5px;font-weight:600;">{{ app.vals.dReport.reporter }}</div></div>
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:13px;"><div style="font-size:11.5px;color:var(--ink3);margin-bottom:4px;">Grund</div><div style="font-size:13.5px;font-weight:600;">{{ app.vals.dReport.reason }}</div></div>
        </div>
        <div style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-bottom:11px;">AKTIONEN</div>
        <button @click="app.vals.dReport.delContent" style="width:100%;display:flex;align-items:center;gap:11px;padding:13px 15px;border-radius:12px;background:color-mix(in oklab,var(--danger) 8%,#fff);border:1px solid color-mix(in oklab,var(--danger) 30%,transparent);color:var(--danger);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;cursor:pointer;margin-bottom:9px;"><i class="ph-bold ph-trash" style="font-size:17px;"></i>Inhalt löschen<i class="ph-bold ph-caret-right" style="font-size:14px;margin-left:auto;opacity:.5;"></i></button>
        <div v-if="app.vals.dReport.hasTargetUser" style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px;">
          <button @click="app.vals.dReport.warn" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:11px;background:var(--panel);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;"><i class="ph-bold ph-warning" style="font-size:15px;color:#B57500;"></i>Verwarnen</button>
          <button @click="app.vals.dReport.restrict" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:11px;background:var(--panel);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;"><i class="ph-bold ph-hand-palm" style="font-size:15px;color:#B57500;"></i>Einschränken</button>
          <button @click="app.vals.dReport.suspend" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:11px;background:var(--panel);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;"><i class="ph-bold ph-clock-countdown" style="font-size:15px;color:var(--magenta);"></i>Sperren</button>
          <button @click="app.vals.dReport.ban" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:11px;background:var(--panel);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;cursor:pointer;"><i class="ph-bold ph-prohibit" style="font-size:15px;color:var(--danger);"></i>Bannen</button>
        </div>
        <div style="height:1px;background:var(--line);margin:16px 0;"></div>
        <button @click="app.vals.dReport.resolveOk" style="width:100%;display:flex;align-items:center;gap:11px;padding:13px 15px;border-radius:12px;background:var(--lime);border:none;color:#14300A;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;cursor:pointer;margin-bottom:9px;"><i class="ph-bold ph-check-circle" style="font-size:17px;"></i>Meldung schließen (erledigt)</button>
        <button @click="app.vals.dReport.resolveDismiss" style="width:100%;display:flex;align-items:center;gap:11px;padding:13px 15px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;cursor:pointer;"><i class="ph-bold ph-x-circle" style="font-size:17px;"></i>Schließen (unbegründet)</button>
      </div>

      <!-- User drawer -->
      <div v-if="app.vals.isUserDrawer" style="padding:22px 24px;">
        <div style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:8px;"><button @click="app.vals.closeDrawer" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
          <span :style="`width:56px;height:56px;border-radius:15px;background:${app.vals.dUser.avBg};color:${app.vals.dUser.avInk};display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;flex-shrink:0;`">{{ app.vals.dUser.init }}</span>
          <div><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0 0 5px;">{{ app.vals.dUser.username }}</h3><span :style="app.vals.dUser.badgeStyle"><span :style="`width:6px;height:6px;border-radius:50%;background:${app.vals.dUser.dot};`"></span>{{ app.vals.dUser.badgeLabel }}</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px;">
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:13px;text-align:center;"><div :style="`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:${app.vals.dUser.scoreCol};`">{{ app.vals.dUser.score }}</div><div style="font-size:11px;color:var(--ink2);margin-top:3px;">Score</div></div>
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:13px;text-align:center;"><div :style="`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:${app.vals.dUser.repCol};`">{{ app.vals.dUser.reports }}</div><div style="font-size:11px;color:var(--ink2);margin-top:3px;">Meldungen</div></div>
          <div style="background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:13px;text-align:center;"><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;">{{ app.vals.dUser.joined }}</div><div style="font-size:11px;color:var(--ink2);margin-top:3px;">Beitritt</div></div>
        </div>
        <div style="font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);margin-bottom:5px;">GESTUFTE MASSNAHMEN</div>
        <div style="font-size:12.5px;color:var(--ink2);margin-bottom:13px;line-height:1.45;">Von mild nach hart. Aktueller Stand: <b style="color:var(--ink);">{{ app.vals.dUser.badgeLabel }}</b>.</div>
        <button @click="app.vals.dUser.warn" style="width:100%;display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:12px;background:var(--panel);border:1px solid var(--line);color:var(--ink);cursor:pointer;margin-bottom:9px;text-align:left;">
          <span style="width:34px;height:34px;border-radius:9px;background:color-mix(in oklab,var(--amber) 16%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph-bold ph-warning" style="font-size:16px;color:#B57500;"></i></span>
          <span style="flex:1;"><span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">Verwarnen</span><span style="font-size:12px;color:var(--ink2);">Hinweis senden, keine Einschränkung</span></span>
        </button>
        <button @click="app.vals.dUser.restrict" style="width:100%;display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:12px;background:var(--panel);border:1px solid var(--line);color:var(--ink);cursor:pointer;margin-bottom:9px;text-align:left;">
          <span style="width:34px;height:34px;border-radius:9px;background:color-mix(in oklab,#E07B0A 16%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph-bold ph-hand-palm" style="font-size:16px;color:#C26A00;"></i></span>
          <span style="flex:1;"><span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">Einschränken</span><span style="font-size:12px;color:var(--ink2);">Posten &amp; Chatten temporär sperren</span></span>
        </button>
        <div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:13px 15px;margin-bottom:9px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:11px;"><span style="width:34px;height:34px;border-radius:9px;background:color-mix(in oklab,var(--magenta) 15%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph-bold ph-clock-countdown" style="font-size:16px;color:var(--magenta);"></i></span><span style="flex:1;"><span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">Befristet sperren</span><span style="font-size:12px;color:var(--ink2);">Dauer wählen</span></span></div>
          <div style="display:flex;gap:7px;">
            <button v-for="(d, i) in app.vals.suspendOptions" :key="i" @click="d.on" :style="d.style">{{ d.label }}</button>
          </div>
        </div>
        <button @click="app.vals.dUser.ban" style="width:100%;display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:12px;background:color-mix(in oklab,var(--danger) 7%,#fff);border:1px solid color-mix(in oklab,var(--danger) 28%,transparent);color:var(--danger);cursor:pointer;text-align:left;">
          <span style="width:34px;height:34px;border-radius:9px;background:color-mix(in oklab,var(--danger) 15%,#fff);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph-bold ph-prohibit" style="font-size:16px;color:var(--danger);"></i></span>
          <span style="flex:1;"><span style="display:block;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;">Dauerhaft bannen / löschen</span><span style="font-size:12px;color:color-mix(in oklab,var(--danger) 75%,var(--ink2));">Konto entfernen, IP-Sperre</span></span>
        </button>
      </div>
    </div>
  </div>

  <!-- ===== Confirm modal ===== -->
  <div v-if="app.vals.confirmOpen" @click="app.vals.closeConfirm" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:90;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop style="width:400px;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <span :style="`width:52px;height:52px;border-radius:14px;background:${app.vals.confirmIconBg};display:flex;align-items:center;justify-content:center;margin-bottom:16px;`"><i :class="app.vals.confirmIcon" :style="`font-size:26px;color:${app.vals.confirmIconCol};`"></i></span>
      <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0 0 8px;">{{ app.vals.confirmTitle }}</h3>
      <p style="font-size:14px;color:var(--ink2);line-height:1.5;margin:0 0 22px;">{{ app.vals.confirmBody }}</p>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeConfirm" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.runConfirm" :style="app.vals.confirmBtnStyle">{{ app.vals.confirmLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== Festival form ===== -->
  <div v-if="app.vals.festivalFormOpen" @click="app.vals.closeFestivalForm" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:90;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop class="adminscroll" style="width:480px;max-height:86%;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0;">{{ app.vals.festivalFormTitle }}</h3><button @click="app.vals.closeFestivalForm" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">NAME</label>
      <input :value="app.vals.ffName" @input="app.vals.onFfName" placeholder="z. B. SummerBeats 2026" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:15px;" />
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">ORT</label>
      <input :value="app.vals.ffPlace" @input="app.vals.onFfPlace" placeholder="z. B. Wien · Donauinsel" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:15px;" />
      <div style="display:flex;gap:12px;margin-bottom:15px;">
        <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">VON</label><input :value="app.vals.ffFrom" @input="app.vals.onFfFrom" placeholder="24.07." style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;" /></div>
        <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">BIS</label><input :value="app.vals.ffTo" @input="app.vals.onFfTo" placeholder="26.07.2026" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;" /></div>
      </div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 8px;">STATUS</label>
      <div style="display:flex;gap:8px;margin-bottom:24px;">
        <button v-for="(o, i) in app.vals.ffStatusOptions" :key="i" @click="o.on" :style="o.style">{{ o.label }}</button>
      </div>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeFestivalForm" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.saveFestival" style="flex:1.4;padding:13px;border-radius:12px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;">{{ app.vals.festivalSaveLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== Zone form ===== -->
  <div v-if="app.vals.zoneFormOpen" @click="app.vals.closeZoneForm" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:90;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop style="width:440px;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0;">{{ app.vals.zoneFormTitle }}</h3><button @click="app.vals.closeZoneForm" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">NAME</label>
      <input :value="app.vals.zfName" @input="app.vals.onZfName" placeholder="z. B. Camp E" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:15px;" />
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">MARKER / BESCHREIBUNG</label>
      <input :value="app.vals.zfMarker" @input="app.vals.onZfMarker" placeholder="z. B. beim See, blaue Flagge" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:15px;" />
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 8px;">MARKER-FARBE</label>
      <div style="display:flex;gap:9px;margin-bottom:24px;">
        <button v-for="(c, i) in app.vals.zfColorOptions" :key="i" @click="c.on" :style="c.style"><i v-if="c.active" class="ph-bold ph-check" style="font-size:15px;color:#fff;"></i></button>
      </div>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeZoneForm" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.saveZone" style="flex:1.4;padding:13px;border-radius:12px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;">{{ app.vals.zoneSaveLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== Stage form ===== -->
  <div v-if="app.vals.stageFormOpen" @click="app.vals.closeStageForm" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:90;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop class="adminscroll" style="width:480px;max-height:88%;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0;">{{ app.vals.stageFormTitle }}</h3><button @click="app.vals.closeStageForm" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">BÜHNENNAME</label>
      <input :value="app.vals.stfName" @input="app.vals.onStfName" placeholder="z. B. Main Stage" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:18px;" />
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">POSITION AM GELÄNDEPLAN <span style="font-weight:500;color:var(--ink3);">· optional</span></label>
      <template v-if="app.vals.stfHasPlan">
        <div @click="app.vals.stagePlace" style="position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;cursor:crosshair;background:repeating-linear-gradient(135deg,#EEF0EA,#EEF0EA 15px,#E5E8E0 15px,#E5E8E0 30px);">
          <span style="position:absolute;top:10px;left:12px;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--ink3);background:color-mix(in oklab,#fff 72%,transparent);padding:3px 7px;border-radius:6px;pointer-events:none;">{{ app.vals.stfPlanName }}</span>
          <div :style="`position:absolute;${app.vals.stfPinStyle}transform:translate(-50%,-100%);pointer-events:none;`"><i class="ph-fill ph-map-pin" style="font-size:30px;color:#A01062;filter:drop-shadow(0 2px 3px rgba(20,22,26,.35));"></i></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px;margin-bottom:22px;">
          <span style="font-size:12px;color:var(--ink2);"><template v-if="app.vals.stfHasPos">Position gesetzt — dient als Treffpunkt-Vorschlag.</template><template v-if="app.vals.stfNoPos">Auf den Plan tippen, um die Bühne zu verorten.</template></span>
          <button v-if="app.vals.stfHasPos" @click="app.vals.clearStagePos" style="padding:6px 11px;border-radius:8px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12px;cursor:pointer;flex-shrink:0;">Zurücksetzen</button>
        </div>
      </template>
      <div v-if="app.vals.stfNoPlan" style="display:flex;align-items:center;gap:9px;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);margin-bottom:22px;"><i class="ph-fill ph-info" style="font-size:17px;color:var(--ink3);flex-shrink:0;"></i><span style="font-size:12.5px;color:var(--ink2);line-height:1.45;">Kein Geländeplan hinterlegt. Lade unter <b>Zonen</b> einen Plan hoch, um die Bühne verorten zu können.</span></div>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeStageForm" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.saveStage" style="flex:1.4;padding:13px;border-radius:12px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;">{{ app.vals.stageSaveLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== Act form ===== -->
  <div v-if="app.vals.actFormOpen" @click="app.vals.closeActForm" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:90;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop class="adminscroll" style="width:490px;max-height:88%;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0;">{{ app.vals.actFormTitle }}</h3><button @click="app.vals.closeActForm" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
      <div v-if="app.vals.afNoStages" style="display:flex;align-items:center;gap:9px;padding:12px 14px;border-radius:11px;background:color-mix(in oklab,var(--amber) 12%,#fff);border:1px solid color-mix(in oklab,var(--amber) 40%,transparent);margin-bottom:16px;"><i class="ph-fill ph-warning" style="font-size:17px;color:#B57500;flex-shrink:0;"></i><span style="font-size:12.5px;color:var(--ink);line-height:1.45;">Leg zuerst eine <b>Bühne</b> an — Acts brauchen eine Bühne.</span></div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">ACT-NAME</label>
      <input :value="app.vals.afName" @input="app.vals.onAfName" placeholder="z. B. Nachtsirene" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-size:14px;outline:none;margin-bottom:15px;" />
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 8px;">BÜHNE</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px;"><button v-for="(o, i) in app.vals.afStageOptions" :key="i" @click="o.on" :style="o.style">{{ o.label }}</button></div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 8px;">TAG</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px;"><button v-for="(o, i) in app.vals.afDayOptions" :key="i" @click="o.on" :style="o.style">{{ o.label }}</button></div>
      <div style="display:flex;gap:12px;margin-bottom:15px;">
        <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">START</label><input :value="app.vals.afStart" @input="app.vals.onAfStart" placeholder="21:30" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;outline:none;" /></div>
        <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">ENDE</label><input :value="app.vals.afEnd" @input="app.vals.onAfEnd" placeholder="23:00" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;outline:none;" /></div>
      </div>
      <label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 8px;">STATUS</label>
      <div style="display:flex;gap:8px;margin-bottom:24px;"><button v-for="(o, i) in app.vals.afStatusOptions" :key="i" @click="o.on" :style="o.style">{{ o.label }}</button></div>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeActForm" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.saveAct" style="flex:1.4;padding:13px;border-radius:12px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;cursor:pointer;">{{ app.vals.actSaveLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== Act shift/cancel dialog ===== -->
  <div v-if="app.vals.actDialogOpen" @click="app.vals.closeActDialog" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:92;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop style="width:430px;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <template v-if="app.vals.actDialogShift">
        <span style="width:52px;height:52px;border-radius:14px;background:color-mix(in oklab,var(--amber) 16%,#fff);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><i class="ph-fill ph-clock-clockwise" style="font-size:26px;color:#B57500;"></i></span>
        <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0 0 8px;">„{{ app.vals.adName }}" verschieben</h3>
        <p style="font-size:14px;color:var(--ink2);line-height:1.5;margin:0 0 16px;">Neue Zeit eintragen. Der Act wird als <b>verschoben</b> markiert.</p>
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">NEUER START</label><input :value="app.vals.adStart" @input="app.vals.onAdStart" placeholder="22:30" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;outline:none;" /></div>
          <div style="flex:1;"><label style="display:block;font-size:12px;font-weight:600;color:var(--ink2);margin:0 0 7px;">NEUES ENDE</label><input :value="app.vals.adEnd" @input="app.vals.onAdEnd" placeholder="00:00" style="width:100%;padding:12px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;outline:none;" /></div>
        </div>
      </template>
      <template v-if="app.vals.actDialogCancel">
        <span style="width:52px;height:52px;border-radius:14px;background:color-mix(in oklab,var(--danger) 13%,#fff);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><i class="ph-fill ph-x-circle" style="font-size:26px;color:var(--danger);"></i></span>
        <h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0 0 8px;">„{{ app.vals.adName }}" absagen?</h3>
        <p style="font-size:14px;color:var(--ink2);line-height:1.5;margin:0 0 16px;">Der Act wird als <b>abgesagt</b> markiert und im Programm durchgestrichen.</p>
      </template>
      <div style="display:flex;align-items:flex-start;gap:10px;padding:13px 15px;border-radius:12px;background:color-mix(in oklab,var(--magenta) 8%,#fff);border:1px solid color-mix(in oklab,var(--magenta) 26%,transparent);margin-bottom:22px;">
        <i class="ph-fill ph-bell-ringing" style="font-size:18px;color:#A01062;flex-shrink:0;margin-top:1px;"></i>
        <span style="font-size:12.5px;color:var(--ink);line-height:1.45;"><template v-if="app.vals.adHasTreffen">Die Teilnehmer der <b>{{ app.vals.adTreffen }} betroffenen Act-Treffen</b> werden automatisch benachrichtigt.</template><template v-if="app.vals.adNoTreffen">Aktuell gibt es keine Begleit-Treffen zu diesem Act — es wird niemand benachrichtigt.</template></span>
      </div>
      <div style="display:flex;gap:10px;">
        <button @click="app.vals.closeActDialog" style="flex:1;padding:13px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;cursor:pointer;">Abbrechen</button>
        <button @click="app.vals.confirmActDialog" :style="app.vals.actDialogBtnStyle">{{ app.vals.actDialogLabel }}</button>
      </div>
    </div>
  </div>

  <!-- ===== CSV import ===== -->
  <div v-if="app.vals.csvOpen" @click="app.vals.closeCsv" style="position:absolute;inset:0;background:rgba(20,22,26,.42);z-index:92;display:flex;align-items:center;justify-content:center;animation:fadeIn .16s ease both;">
    <div @click.stop class="adminscroll" style="width:640px;max-height:90%;background:var(--panel);border-radius:20px;padding:26px;box-shadow:0 30px 70px -25px rgba(20,22,26,.5);animation:popIn .2s ease both;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;"><h3 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;margin:0;">Line-up importieren</h3><button @click="app.vals.closeCsv" style="width:34px;height:34px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);color:var(--ink2);cursor:pointer;"><i class="ph-bold ph-x" style="font-size:16px;"></i></button></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;font-size:12.5px;color:var(--ink2);">
        <span :style="app.vals.csvStep1Style">1 · Datei</span><i class="ph-bold ph-caret-right" style="font-size:12px;color:var(--ink3);"></i>
        <span :style="app.vals.csvStep2Style">2 · Zuordnung</span><i class="ph-bold ph-caret-right" style="font-size:12px;color:var(--ink3);"></i>
        <span :style="app.vals.csvStep3Style">3 · Vorschau</span>
      </div>

      <template v-if="app.vals.csvIsUpload">
        <label style="display:flex;flex-direction:column;align-items:center;gap:10px;border:2px dashed var(--line);border-radius:14px;background:var(--panel2);padding:28px 24px;cursor:pointer;text-align:center;margin-bottom:14px;">
          <span style="width:48px;height:48px;border-radius:13px;background:var(--panel);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;"><i class="ph-bold ph-file-csv" style="font-size:24px;color:var(--ink2);"></i></span>
          <span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;color:var(--ink);">CSV-Datei wählen</span>
          <span style="font-size:12px;color:var(--ink2);">Spalten: Act, Bühne, Tag, Start, Ende · Trennzeichen , oder ;</span>
          <input type="file" accept=".csv,text/csv" @change="app.vals.onCsvFile" style="display:none;" />
        </label>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="flex:1;height:1px;background:var(--line);"></span><span style="font-size:12px;color:var(--ink3);">oder einfügen</span><span style="flex:1;height:1px;background:var(--line);"></span></div>
        <textarea :value="app.vals.csvText" @input="app.vals.onCsvText" placeholder="Act;Bühne;Tag;Start;Ende&#10;Aurora Skies;Main Stage;Sa 25.;20:00;21:30" class="adminscroll" style="width:100%;height:120px;padding:13px 15px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.5;outline:none;resize:none;margin-bottom:14px;"></textarea>
        <div style="display:flex;gap:10px;">
          <button @click="app.vals.csvSample" style="padding:13px 16px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;">Beispiel einfügen</button>
          <span style="flex:1;"></span>
          <button @click="app.vals.csvToMap" :style="app.vals.csvNextStyle">Weiter<i class="ph-bold ph-arrow-right" style="font-size:14px;margin-left:6px;"></i></button>
        </div>
      </template>

      <template v-if="app.vals.csvIsMap">
        <p style="font-size:13px;color:var(--ink2);line-height:1.5;margin:0 0 16px;">Ordne die Spalten deiner Datei den Feldern zu. Automatisch erkannt — bei Bedarf anpassen.</p>
        <div style="display:flex;flex-direction:column;gap:11px;margin-bottom:22px;">
          <div v-for="(f, i) in app.vals.csvMapFields" :key="i" style="display:flex;align-items:center;gap:14px;">
            <span style="width:90px;flex-shrink:0;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">{{ f.label }}</span>
            <i class="ph-bold ph-arrow-right" style="font-size:14px;color:var(--ink3);"></i>
            <select :value="f.value" @change="f.on" style="flex:1;padding:11px 13px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);font-size:13.5px;color:var(--ink);outline:none;cursor:pointer;">
              <option v-for="(o, oi) in f.options" :key="oi" :value="o.v">{{ o.l }}</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button @click="app.vals.csvBack" style="padding:13px 16px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-arrow-left" style="font-size:14px;margin-right:6px;"></i>Zurück</button>
          <span style="flex:1;"></span>
          <button @click="app.vals.csvGoPreview" style="padding:13px 20px;border-radius:12px;background:var(--sidebar);border:none;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Vorschau<i class="ph-bold ph-arrow-right" style="font-size:14px;margin-left:6px;"></i></button>
        </div>
      </template>

      <template v-if="app.vals.csvIsPreview">
        <div style="display:flex;gap:10px;margin-bottom:14px;">
          <span style="flex:1;display:flex;flex-direction:column;gap:2px;padding:11px 14px;border-radius:11px;background:color-mix(in oklab,#C7FF3C 14%,#fff);border:1px solid color-mix(in oklab,#C7FF3C 40%,transparent);"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:#2E7D00;">{{ app.vals.csvOkCount }}</span><span style="font-size:11.5px;color:var(--ink2);">importierbar</span></span>
          <span style="flex:1;display:flex;flex-direction:column;gap:2px;padding:11px 14px;border-radius:11px;background:color-mix(in oklab,#FFB020 16%,#fff);border:1px solid color-mix(in oklab,#FFB020 40%,transparent);"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:#8A5A00;">{{ app.vals.csvDupCount }}</span><span style="font-size:11.5px;color:var(--ink2);">Dopplungen</span></span>
          <span style="flex:1;display:flex;flex-direction:column;gap:2px;padding:11px 14px;border-radius:11px;background:color-mix(in oklab,#FF4D4D 10%,#fff);border:1px solid color-mix(in oklab,#FF4D4D 30%,transparent);"><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;color:#B3001B;">{{ app.vals.csvErrCount }}</span><span style="font-size:11.5px;color:var(--ink2);">mit Fehler</span></span>
        </div>
        <div class="adminscroll" style="max-height:280px;overflow-y:auto;border:1px solid var(--line);border-radius:12px;margin-bottom:20px;">
          <div style="display:grid;grid-template-columns:1.3fr 1fr 84px 74px 74px 104px;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11px;font-weight:600;letter-spacing:.04em;color:var(--ink3);position:sticky;top:0;"><span>ACT</span><span>BÜHNE</span><span>TAG</span><span>START</span><span>ENDE</span><span>STATUS</span></div>
          <div v-for="(r, i) in app.vals.csvRows" :key="i" :style="r.rowStyle">
            <span style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px;">{{ r.act }}</span>
            <span style="font-size:12.5px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px;">{{ r.stage }}</span>
            <span style="font-size:12px;color:var(--ink2);">{{ r.day }}</span>
            <span style="font-size:12px;">{{ r.start }}</span>
            <span style="font-size:12px;color:var(--ink3);">{{ r.end }}</span>
            <span><span :style="r.statusStyle">{{ r.status }}</span></span>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button @click="app.vals.csvBack" style="padding:13px 16px;border-radius:12px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;cursor:pointer;"><i class="ph-bold ph-arrow-left" style="font-size:14px;margin-right:6px;"></i>Zurück</button>
          <span style="flex:1;font-size:12px;color:var(--ink3);">Zeilen mit Fehler werden übersprungen.</span>
          <button @click="app.vals.csvConfirm" :style="app.vals.csvConfirmStyle"><i class="ph-bold ph-check" style="font-size:15px;margin-right:6px;"></i>{{ app.vals.csvOkCount }} + {{ app.vals.csvDupCount }} importieren</button>
        </div>
      </template>
    </div>
  </div>

  <!-- ===== Toast ===== -->
  <div v-if="app.vals.toast" style="position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:95;display:flex;align-items:center;gap:10px;padding:13px 20px;background:var(--sidebar);color:#fff;border-radius:12px;box-shadow:0 16px 40px -12px rgba(20,22,26,.5);animation:popIn .2s ease both;"><i class="ph-fill ph-check-circle" style="font-size:19px;color:var(--lime);"></i><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14px;">{{ app.vals.toast }}</span></div>
</template>
