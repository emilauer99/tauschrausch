<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <header style="height:66px;flex-shrink:0;background:var(--panel);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 26px;position:relative;z-index:40;">
    <div><h2 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;margin:0;line-height:1.1;">{{ app.vals.viewTitle }}</h2><div style="font-size:12.5px;color:var(--ink2);margin-top:2px;">{{ app.vals.viewSub }}</div></div>
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="position:relative;">
        <button @click="app.vals.toggleSwitch" style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);cursor:pointer;">
          <span :style="`width:8px;height:8px;border-radius:50%;background:${app.vals.curFestDot};`"></span>
          <span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;color:var(--ink);">{{ app.vals.curFestName }}</span>
          <i class="ph-bold ph-caret-down" style="font-size:13px;color:var(--ink2);"></i>
        </button>
        <div v-if="app.vals.fSwitchOpen" style="position:absolute;top:48px;right:0;width:300px;background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 50px -20px rgba(20,22,26,.3);padding:7px;z-index:60;animation:popIn .16s ease both;">
          <div style="font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--ink3);padding:8px 10px 6px;">FESTIVAL WÄHLEN</div>
          <button v-for="(f, i) in app.vals.festSwitch" :key="i" @click="f.on" :style="f.style">
            <span :style="`width:8px;height:8px;border-radius:50%;background:${f.dot};flex-shrink:0;`"></span>
            <div style="flex:1;text-align:left;min-width:0;"><div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ f.name }}</div><div style="font-size:11.5px;color:var(--ink2);">{{ f.place }}</div></div>
            <i v-if="f.current" class="ph-bold ph-check" style="font-size:15px;color:var(--ink);"></i>
          </button>
        </div>
      </div>
      <div style="width:1px;height:26px;background:var(--line);"></div>
      <button @click="app.vals.logout" style="display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:11px;background:transparent;border:1px solid var(--line);color:var(--ink2);cursor:pointer;font-weight:600;font-size:13px;"><i class="ph-bold ph-sign-out" style="font-size:16px;"></i>Logout</button>
    </div>
  </header>
</template>
