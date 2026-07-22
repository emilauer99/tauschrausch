<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <aside :style="`width:250px;flex-shrink:0;background:${app.vals.sbBg};display:flex;flex-direction:column;border-right:1px solid ${app.vals.sbBorder};`">
    <div :style="`padding:22px 22px 18px;display:flex;align-items:center;gap:11px;border-bottom:1px solid ${app.vals.sbLine};`">
      <span :style="`width:34px;height:34px;border-radius:9px;background:${app.vals.sbLogoBg};display:flex;align-items:center;justify-content:center;transform:rotate(45deg);flex-shrink:0;`"><span style="width:11px;height:11px;background:var(--lime);"></span></span>
      <div style="min-width:0;"><div :style="`font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;letter-spacing:.02em;color:${app.vals.sbTitle};`">TAUSCHRAUSCH</div><div :style="`font-size:10.5px;color:${app.vals.sbSub};letter-spacing:.16em;font-weight:600;`">ADMIN-BACKEND</div></div>
    </div>
    <nav style="flex:1;padding:14px 12px;display:flex;flex-direction:column;gap:3px;">
      <button v-for="(n, i) in app.vals.nav" :key="i" @click="n.on" :style="n.style">
        <i :class="n.icon" style="font-size:19px;width:22px;text-align:center;flex-shrink:0;"></i>
        <span style="flex:1;text-align:left;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13.5px;">{{ n.label }}</span>
        <span v-if="n.hasCount" :style="n.countStyle">{{ n.count }}</span>
      </button>
    </nav>
    <div :style="`padding:14px;border-top:1px solid ${app.vals.sbLine};`">
      <div style="display:flex;align-items:center;gap:10px;padding:6px 8px;">
        <span style="width:34px;height:34px;border-radius:9px;background:var(--lime);color:#14300A;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:13px;flex-shrink:0;">{{ app.vals.adminInit }}</span>
        <div style="min-width:0;flex:1;"><div :style="`font-weight:600;font-size:13px;color:${app.vals.sbTitle};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`">{{ app.vals.adminName }}</div><div :style="`font-size:11px;color:${app.vals.sbSub};`">{{ app.vals.adminRole }}</div></div>
      </div>
    </div>
  </aside>
</template>
