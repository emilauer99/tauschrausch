<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="animation:fadeIn .25s ease both;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
      <div style="position:relative;flex:1;min-width:220px;max-width:300px;"><i class="ph ph-magnifying-glass" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:16px;"></i><input :value="app.vals.userQuery" @input="app.vals.onUserQuery" placeholder="Username suchen…" style="width:100%;padding:10px 12px 10px 38px;border-radius:11px;background:var(--panel);border:1px solid var(--line);font-size:13.5px;outline:none;" /></div>
      <button v-for="(c, i) in app.vals.userStatusChips" :key="i" @click="c.on" :style="c.style">{{ c.label }}</button>
    </div>
    <div style="background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 160px 120px 120px 96px 150px;padding:13px 18px;border-bottom:1px solid var(--line);background:var(--panel2);font-size:11.5px;font-weight:600;letter-spacing:.05em;color:var(--ink3);">
        <span>NUTZER</span><span>FESTIVAL</span><span>BEITRITT</span><span>MELDUNGEN</span><span>SCORE</span><span>STATUS</span>
      </div>
      <div v-for="(u, i) in app.vals.userRows" :key="i" @click="u.open" :style="u.rowStyle">
        <span style="display:flex;align-items:center;gap:11px;min-width:0;"><span :style="`width:32px;height:32px;border-radius:9px;background:${u.avBg};color:${u.avInk};display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12px;flex-shrink:0;`">{{ u.init }}</span><span style="font-size:13.5px;font-weight:600;">{{ u.username }}</span></span>
        <span style="font-size:13px;color:var(--ink2);">{{ u.festName }}</span>
        <span style="font-size:13px;color:var(--ink2);">{{ u.joined }}</span>
        <span style="font-size:13px;"><span :style="u.repStyle">{{ u.reports }}</span></span>
        <span :style="`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13.5px;color:${u.scoreCol};`">{{ u.score }}</span>
        <span><span :style="u.badgeStyle"><span :style="`width:6px;height:6px;border-radius:50%;background:${u.dot};`"></span>{{ u.badgeLabel }}</span></span>
      </div>
    </div>
  </div>
</template>
