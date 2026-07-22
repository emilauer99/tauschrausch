<script setup lang="ts">
import { useAppStore } from '@/store/app'
import AppButton from '@/components/ui/AppButton.vue'

const app = useAppStore()
const features = [
  { icon: 'ph-fill ph-storefront', color: 'var(--biete)', text: 'Suchen & bieten in Sekunden' },
  { icon: 'ph-fill ph-game-controller', color: 'var(--games)', text: 'Spiele-Lobbys per Klick' },
  { icon: 'ph-fill ph-shield-check', color: 'var(--suche)', text: 'Anonym — nur Spitzname nötig' },
]
</script>

<template>
  <div class="welcome">
    <div class="blob blob--1" />
    <div class="blob blob--2" />
    <div class="blob blob--3" />
    <div class="welcome__hero">
      <span class="tag"><i class="ph-fill ph-qr-code tag__icon" />ÜBER DEN LINK GELANDET</span>
      <span class="logo"><span class="logo__inner" /></span>
      <h1 class="title">TAUSCH<br>RAUSCH</h1>
      <p class="lead">Bier, Luftpumpe, Schlafplatz, Mitspieler — alles nur ein paar Zeltreihen entfernt.</p>
      <div class="features">
        <div v-for="(f, i) in features" :key="i" class="feature">
          <span class="feature__icon" :style="{ background: `color-mix(in oklab, ${f.color} 18%, transparent)` }"><i :class="f.icon" :style="{ color: f.color }" /></span>
          <span class="feature__text">{{ f.text }}</span>
        </div>
      </div>
    </div>
    <div class="welcome__actions">
      <AppButton icon="ph-bold ph-arrow-right" @click="app.startRegister()">Registrieren</AppButton>
      <button class="ghost-cta pressable" @click="app.startLogin()">Einloggen</button>
      <div class="hint"><i class="ph-fill ph-info" /><p>Feed geht auch ohne Konto — anmelden brauchst du erst zum Inserieren, Chatten oder Mitspielen.</p></div>
      <button class="browse" @click="app.browseGuest()">Erstmal nur stöbern →</button>
    </div>
  </div>
</template>

<style scoped>
.welcome { position: relative; min-height: 790px; display: flex; flex-direction: column; padding: 0 28px 40px; }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); }
.blob--1 { top: -40px; left: -60px; width: 260px; height: 260px; background: var(--biete); opacity: 0.26; animation: glow 5s ease-in-out infinite; }
.blob--2 { top: 200px; right: -70px; width: 230px; height: 230px; background: var(--suche); opacity: 0.24; animation: glow 6s ease-in-out infinite; }
.blob--3 { bottom: 160px; left: 20px; width: 180px; height: 180px; background: var(--games); opacity: 0.14; }
.welcome__hero { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center; z-index: 2; }
.tag {
  display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; font-size: 12px; font-weight: 600;
  letter-spacing: 0.08em; color: var(--muted); background: var(--card); padding: 7px 13px; border-radius: 999px;
  border: 1px solid var(--line); margin-bottom: 24px;
}
.tag__icon { color: var(--biete); font-size: 15px; }
.logo { width: 52px; height: 52px; border-radius: 14px; background: var(--biete); display: flex; align-items: center; justify-content: center; transform: rotate(45deg); margin-bottom: 22px; }
.logo__inner { width: 18px; height: 18px; background: var(--ink); }
.title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 46px; line-height: 0.98; letter-spacing: -0.01em; margin: 0 0 14px; }
.lead { font-size: 17px; line-height: 1.5; color: var(--muted); margin: 0 0 30px; max-width: 300px; text-wrap: pretty; }
.features { display: flex; flex-direction: column; gap: 14px; }
.feature { display: flex; align-items: center; gap: 14px; }
.feature__icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.feature__text { font-size: 15px; font-weight: 500; }
.welcome__actions { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 12px; }
.ghost-cta { width: 100%; padding: 18px; border: 1px solid var(--line); border-radius: 18px; background: var(--card); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; cursor: pointer; }
.hint { display: flex; align-items: flex-start; gap: 8px; margin-top: 6px; padding: 0 2px; color: var(--muted); }
.hint i { font-size: 16px; margin-top: 1px; flex-shrink: 0; }
.hint p { font-size: 12.5px; margin: 0; line-height: 1.45; }
.browse { align-self: center; margin-top: 2px; padding: 8px; background: none; border: none; color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
</style>
