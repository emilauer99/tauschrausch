<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'

const app = useAppStore()
</script>

<template>
  <div class="profile">
    <div class="profile__head">
      <span class="profile__heading">Profil</span>
      <div class="profile__actions">
        <IconButton icon="ph-fill ph-bell" @click="app.openBell()">
          <span v-if="app.bellCount > 0" class="badge">{{ app.bellCount }}</span>
        </IconButton>
        <IconButton :icon="app.themeIcon" accent="var(--games)" @click="app.toggleTheme()" />
      </div>
    </div>

    <div class="hero">
      <span class="hero__avatar">{{ app.me.init }}</span>
      <h1 class="hero__name">{{ app.me.name }}</h1>
      <div class="hero__zone"><i class="ph-fill ph-map-pin" />{{ app.me.zone }} · seit Freitag dabei</div>
      <div class="stats">
        <div class="stat"><div class="stat__val"><i class="ph-fill ph-thumbs-up thumb" />100%</div><div class="stat__label">Daumen-Score</div></div>
        <div class="stat"><div class="stat__val">12</div><div class="stat__label">Deals</div></div>
        <div class="stat"><div class="stat__val">{{ app.myItems.length }}</div><div class="stat__label">Inserate</div></div>
      </div>
    </div>

    <div class="rows">
      <div class="setting">
        <div class="setting__left"><i class="ph-fill ph-sun setting__icon" /><div><div class="setting__title">Sonnen-Modus</div><div class="setting__hint">Hoher Kontrast für pralle Sonne</div></div></div>
        <button class="switch" @click="app.toggleTheme()"><span class="switch__knob" /></button>
      </div>
      <div class="setting">
        <div class="setting__left"><i class="ph-fill ph-bell-ringing setting__icon" /><div><div class="setting__title">Treffen-Erinnerungen</div><div class="setting__hint">{{ app.remindersStatus }}</div></div></div>
        <button class="setting__btn" @click="app.openOptIn()">{{ app.remindersBtnLabel }}</button>
      </div>
      <div class="setting">
        <div class="setting__left setting__left--tight"><i class="ph-fill ph-ticket setting__icon setting__icon--suche" /><div class="ellip"><div class="setting__title ellip__t">{{ app.meFestival }}</div><div class="setting__hint ellip__t">{{ app.meFestivalSub }}</div></div></div>
        <button class="setting__btn" @click="app.switchFestival()">Wechseln</button>
      </div>

      <span class="rows__label">MEINE INSERATE</span>
      <div class="mine">
        <div v-for="it in app.myItems" :key="it.id" class="mine__item" :style="{ '--accent': it.accentVar }">
          <button class="mine__main" @click="app.openItem(it.id)">
            <i :class="it.catIcon" class="mine__icon" />
            <div class="mine__meta"><div class="mine__title">{{ it.title }}</div><div class="mine__sub">{{ it.typeLabel }} · {{ it.zone }}</div></div>
          </button>
          <button class="mine__act" title="Bearbeiten" @click="app.startEditItem(it.id)"><i class="ph-fill ph-pencil-simple" /></button>
          <button class="mine__act mine__act--del" title="Löschen" @click="app.askDeleteItem(it.id)"><i class="ph-fill ph-trash" /></button>
        </div>
        <div v-if="!app.myItems.length" class="mine__empty">Noch keine eigenen Inserate. Tipp unten auf „Inserat erstellen".</div>
      </div>

      <div class="links">
        <div class="link"><i class="ph-bold ph-scroll" /><span>Community-Regeln</span><i class="ph-bold ph-caret-right link__caret" /></div>
        <div class="link"><i class="ph-bold ph-lifebuoy" /><span>Melden & Hilfe</span><i class="ph-bold ph-caret-right link__caret" /></div>
      </div>

      <button class="account" :class="`account--${app.accountRow.tone}`" @click="app.accountRowAction()">
        <i :class="app.accountRow.icon" />{{ app.accountRow.label }}<i class="ph-bold ph-caret-right account__caret" />
      </button>

      <div class="privacy"><i class="ph-fill ph-lock-key" /><span>Alles wird nach dem Festival gelöscht — kein Klarname, keine Bewegungsprofile.</span></div>
    </div>
  </div>
</template>

<style scoped>
.profile { padding-bottom: 100px; }
.profile__head { position: sticky; top: 0; z-index: 30; background: var(--bg); display: flex; align-items: center; justify-content: space-between; padding: 8px 20px 12px; border-bottom: 1px solid var(--line); }
.profile__heading { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; }
.profile__actions { display: flex; gap: 8px; align-items: center; }
.badge { position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; padding: 0 3px; border-radius: 9px; background: var(--games); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg); }
.hero { padding: 22px 20px 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.hero__avatar { width: 88px; height: 88px; border-radius: 26px; background: var(--biete); color: var(--ink); display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 34px; margin-bottom: 14px; }
.hero__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; margin: 0 0 4px; }
.hero__zone { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--muted); margin-bottom: 18px; }
.hero__zone i { color: var(--suche); font-size: 15px; }
.stats { display: flex; gap: 10px; width: 100%; margin-bottom: 22px; }
.stat { flex: 1; padding: 16px; border-radius: 18px; background: var(--card); border: 1px solid var(--line); }
.stat__val { display: flex; align-items: center; justify-content: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; }
.stat__val .thumb { color: var(--biete); font-size: 22px; }
.stat__label { font-size: 12px; color: var(--muted); margin-top: 3px; }
.rows { padding: 0 20px; }
.setting { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); margin-bottom: 20px; }
.setting__left { display: flex; align-items: center; gap: 12px; }
.setting__left--tight { min-width: 0; }
.setting__icon { font-size: 22px; color: var(--games); flex-shrink: 0; }
.setting__icon--suche { color: var(--suche); }
.setting__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; text-align: left; }
.setting__hint { font-size: 12px; color: var(--muted); text-align: left; }
.ellip { min-width: 0; }
.ellip__t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.setting__btn { padding: 9px 14px; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; flex-shrink: 0; }
.switch { width: 52px; height: 30px; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: all 0.2s; background: var(--switch-track); flex-shrink: 0; }
.switch__knob { position: absolute; top: 3px; left: var(--switch-x); width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); }
.rows__label { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; color: var(--muted); }
.mine { display: flex; flex-direction: column; gap: 10px; margin: 12px 0 20px; }
.mine__item { display: flex; align-items: stretch; border-radius: 16px; background: var(--card); border: 1px solid var(--line); border-left: 5px solid var(--accent); overflow: hidden; }
.mine__main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 13px 15px; background: none; border: none; cursor: pointer; color: var(--text); text-align: left; }
.mine__icon { font-size: 24px; color: var(--accent); }
.mine__meta { flex: 1; min-width: 0; }
.mine__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mine__sub { font-size: 12px; color: var(--muted); }
.mine__act { width: 46px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: none; border: none; border-left: 1px solid var(--line); color: var(--muted); font-size: 18px; cursor: pointer; }
.mine__act--del { color: var(--danger); }
.mine__empty { font-size: 14px; color: var(--muted); line-height: 1.5; padding: 4px 2px; }
.links { display: flex; flex-direction: column; gap: 2px; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); margin: 16px 0; }
.link { display: flex; align-items: center; gap: 12px; padding: 15px; background: var(--card); font-weight: 600; font-size: 15px; }
.link i { font-size: 20px; color: var(--muted); }
.link__caret { margin-left: auto; font-size: 15px; }
.account { display: flex; align-items: center; gap: 12px; width: 100%; padding: 15px 16px; border-radius: 16px; background: var(--card); cursor: pointer; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.account--danger { border: 1px solid color-mix(in oklab, var(--danger) 30%, transparent); color: var(--danger); }
.account--biete { border: 1px solid color-mix(in oklab, var(--biete) 30%, transparent); color: var(--biete); }
.account i:first-child { font-size: 20px; }
.account__caret { margin-left: auto; opacity: 0.55; }
.privacy { display: flex; align-items: center; gap: 11px; padding: 14px 16px; border-radius: 16px; background: color-mix(in oklab, var(--biete) 9%, var(--card)); border: 1px solid color-mix(in oklab, var(--biete) 22%, transparent); }
.privacy i { font-size: 20px; color: var(--biete); }
.privacy span { font-size: 13px; color: var(--text); line-height: 1.4; }
</style>
