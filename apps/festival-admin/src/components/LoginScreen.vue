<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
const app = useAdminStore()
</script>

<template>
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(1100px 500px at 70% -10%,rgba(199,255,60,.10),transparent),var(--bg);animation:fadeIn .3s ease both;z-index:10;">
    <div style="width:412px;background:var(--panel);border:1px solid var(--line);border-radius:22px;padding:40px 38px;box-shadow:0 30px 60px -30px rgba(20,22,26,.25);">
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:28px;">
        <span style="width:38px;height:38px;border-radius:10px;background:var(--sidebar);display:flex;align-items:center;justify-content:center;transform:rotate(45deg);"><span style="width:13px;height:13px;background:var(--lime);"></span></span>
        <div><div style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;letter-spacing:.02em;">TAUSCHRAUSCH</div><div style="font-size:12px;color:var(--ink2);letter-spacing:.14em;font-weight:600;">ADMIN&nbsp;·&nbsp;MODERATION</div></div>
      </div>
      <h1 style="font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:26px;margin:0 0 6px;">Anmelden</h1>
      <p style="font-size:14px;color:var(--ink2);margin:0 0 26px;">Getrennt vom Besucher-Login. Nur für Crew &amp; Moderation.</p>
      <label style="display:block;font-size:12px;font-weight:600;letter-spacing:.03em;color:var(--ink2);margin:0 0 7px;">USERNAME</label>
      <input :value="app.vals.adminUser" @input="app.vals.onAdminUser" placeholder="admin" style="width:100%;padding:13px 15px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-size:15px;outline:none;margin-bottom:16px;" @keyup.enter="app.vals.submitAdminLogin" />
      <label style="display:block;font-size:12px;font-weight:600;letter-spacing:.03em;color:var(--ink2);margin:0 0 7px;">PASSWORT</label>
      <input :value="app.vals.adminPass" @input="app.vals.onAdminPass" type="password" placeholder="••••••••" style="width:100%;padding:13px 15px;border-radius:11px;background:var(--panel2);border:1px solid var(--line);color:var(--ink);font-size:15px;outline:none;" @keyup.enter="app.vals.submitAdminLogin" />
      <div v-if="app.vals.hasLoginErr" style="display:flex;align-items:center;gap:8px;margin-top:14px;padding:11px 13px;border-radius:11px;background:color-mix(in oklab,var(--danger) 10%,#fff);border:1px solid color-mix(in oklab,var(--danger) 32%,transparent);"><i class="ph-fill ph-warning-circle" style="color:var(--danger);font-size:17px;"></i><span style="font-size:13px;">{{ app.vals.loginErr }}</span></div>
      <button @click="app.vals.submitAdminLogin" style="width:100%;padding:14px;margin-top:24px;border:none;border-radius:12px;background:var(--sidebar);color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;">Ins Backend<i class="ph-bold ph-arrow-right" style="font-size:17px;"></i></button>
      <p style="text-align:center;font-size:12.5px;color:var(--ink3);margin:18px 0 0;">Demo-Zugang: <b style="color:var(--ink2);">admin</b> / <b style="color:var(--ink2);">admin</b></p>
    </div>
  </div>
</template>
