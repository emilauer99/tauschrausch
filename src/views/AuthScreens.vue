<script setup lang="ts">
import { useAppStore } from '@/store/app'
import IconButton from '@/components/ui/IconButton.vue'
import TextField from '@/components/ui/TextField.vue'
import AppButton from '@/components/ui/AppButton.vue'

const app = useAppStore()
</script>

<template>
  <!-- REGISTER -->
  <div v-if="app.screen === 'register'" class="auth">
    <div class="auth__back"><IconButton icon="ph-bold ph-arrow-left" @click="app.goWelcome()" /></div>
    <h2 class="auth__title">Konto erstellen</h2>
    <p class="auth__sub">Kein Klarname, keine E-Mail-Pflicht. In 20 Sekunden dabei.</p>
    <div class="auth__fields">
      <div>
        <div class="label-row">
          <label class="label">USERNAME</label>
          <button class="dice pressable" @click="app.randomAuthUser()"><i class="ph-fill ph-shuffle" />Würfeln</button>
        </div>
        <input class="auth__input auth__input--grotesk" placeholder="z. B. Lenerl" :value="app.authUser" @input="app.setAuthUser(($event.target as HTMLInputElement).value)" />
      </div>
      <TextField label="PASSWORT" type="password" placeholder="••••••••" :model-value="app.authPass" @update:model-value="app.setAuthPass" />
      <TextField label="PASSWORT BESTÄTIGEN" type="password" placeholder="••••••••" :model-value="app.authPass2" @update:model-value="app.setAuthPass2" />
      <div>
        <label class="label label--flex">E-MAIL <span class="opt">optional</span></label>
        <input class="auth__input" placeholder="nur für Passwort-Wiederherstellung" :value="app.authEmail" @input="app.setAuthEmail(($event.target as HTMLInputElement).value)" />
      </div>
    </div>
    <div v-if="app.authError" class="error"><i class="ph-fill ph-warning-circle" /><span>{{ app.authError }}</span></div>
    <AppButton class="auth__submit" icon="ph-bold ph-arrow-right" @click="app.submitRegister()">Konto erstellen</AppButton>
    <p class="auth__foot">Schon dabei? <button class="link" @click="app.startLogin()">Einloggen</button></p>
  </div>

  <!-- LOGIN -->
  <div v-else-if="app.screen === 'login'" class="auth">
    <div class="auth__back"><IconButton icon="ph-bold ph-arrow-left" @click="app.goWelcome()" /></div>
    <h2 class="auth__title">Willkommen zurück</h2>
    <p class="auth__sub">Log dich ein und weiter geht's.</p>
    <div class="auth__fields">
      <div>
        <label class="label">USERNAME</label>
        <input class="auth__input auth__input--grotesk" placeholder="dein Username" :value="app.authUser" @input="app.setAuthUser(($event.target as HTMLInputElement).value)" />
      </div>
      <TextField label="PASSWORT" type="password" placeholder="••••••••" :model-value="app.authPass" @update:model-value="app.setAuthPass" />
    </div>
    <button class="forgot" @click="app.goReset()">Passwort vergessen?</button>
    <div v-if="app.authError" class="error error--tight"><i class="ph-fill ph-warning-circle" /><span>{{ app.authError }}</span></div>
    <AppButton class="auth__submit auth__submit--tight" icon="ph-bold ph-arrow-right" @click="app.submitLogin()">Einloggen</AppButton>
    <p class="auth__foot">Noch kein Konto? <button class="link" @click="app.startRegister()">Registrieren</button></p>
  </div>

  <!-- RESET -->
  <div v-else-if="app.screen === 'reset'" class="auth">
    <div class="auth__back"><IconButton icon="ph-bold ph-arrow-left" @click="app.startLogin()" /></div>
    <span class="reset__icon"><i class="ph-fill ph-key" /></span>
    <h2 class="auth__title auth__title--sm">Passwort zurücksetzen</h2>
    <p class="auth__sub">Gib deinen Username ein — wir schicken den Reset-Link an die hinterlegte E-Mail.</p>
    <div>
      <label class="label">USERNAME</label>
      <input class="auth__input auth__input--grotesk" placeholder="z. B. Lenerl" :value="app.resetUser" @input="app.setResetUser(($event.target as HTMLInputElement).value)" />
    </div>
    <div v-if="app.resetDone === 'sent'" class="note note--ok"><i class="ph-fill ph-check-circle" /><span>{{ app.resetMsg }}</span></div>
    <div v-else-if="app.resetDone === 'noemail'" class="note note--warn"><i class="ph-fill ph-warning" /><span>{{ app.resetMsg }}</span></div>
    <div v-else-if="app.resetDone === 'noaccount'" class="note note--err"><i class="ph-fill ph-warning-circle" /><span>{{ app.resetMsg }}</span></div>
    <AppButton class="auth__submit" icon="ph-bold ph-paper-plane-right" @click="app.submitReset()">Reset-Link anfordern</AppButton>
  </div>
</template>

<style scoped>
.auth { min-height: 790px; display: flex; flex-direction: column; padding: 8px 28px 40px; }
.auth__back { margin-bottom: 24px; }
.auth__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 32px; line-height: 1.08; margin: 0 0 8px; }
.auth__title--sm { font-size: 30px; }
.auth__sub { font-size: 15px; color: var(--muted); margin: 0 0 24px; line-height: 1.5; }
.auth__fields { display: flex; flex-direction: column; gap: 13px; }
.label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--muted); margin: 0 0 7px 2px; }
.label--flex { display: flex; align-items: center; gap: 7px; }
.opt { font-weight: 700; color: var(--games); background: color-mix(in oklab, var(--games) 16%, transparent); padding: 2px 7px; border-radius: 6px; letter-spacing: 0; }
.label-row { display: flex; align-items: center; justify-content: space-between; margin: 0 0 7px 2px; }
.dice { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 8px; background: color-mix(in oklab, var(--biete) 14%, var(--card)); border: 1px solid color-mix(in oklab, var(--biete) 34%, transparent); color: var(--biete); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; cursor: pointer; }
.auth__input { width: 100%; padding: 16px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 15px; outline: none; }
.auth__input--grotesk { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; }
.error { display: flex; align-items: center; gap: 9px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; background: color-mix(in oklab, var(--danger) 14%, transparent); border: 1px solid color-mix(in oklab, var(--danger) 40%, transparent); }
.error--tight { margin-top: 8px; }
.error i { color: var(--danger); font-size: 19px; flex-shrink: 0; }
.error span { font-size: 13.5px; line-height: 1.4; }
.auth__submit { margin-top: 22px; }
.auth__submit--tight { margin-top: 20px; }
.auth__foot { text-align: center; font-size: 13px; color: var(--muted); margin: 16px 0 0; }
.link { background: none; border: none; color: var(--biete); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; padding: 0; }
.forgot { align-self: flex-end; margin-top: 11px; background: none; border: none; color: var(--muted); font-weight: 600; font-size: 13px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.reset__icon { width: 56px; height: 56px; border-radius: 16px; background: color-mix(in oklab, var(--games) 16%, transparent); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; font-size: 28px; color: var(--games); }
.note { display: flex; align-items: center; gap: 9px; margin-top: 16px; padding: 14px 15px; border-radius: 14px; }
.note i { font-size: 20px; flex-shrink: 0; }
.note span { font-size: 13.5px; line-height: 1.4; }
.note--ok { background: color-mix(in oklab, var(--biete) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--biete) 40%, transparent); }
.note--ok i { color: var(--biete); }
.note--warn { background: color-mix(in oklab, var(--games) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--games) 40%, transparent); }
.note--warn i { color: var(--games); }
.note--err { background: color-mix(in oklab, var(--danger) 14%, transparent); border: 1px solid color-mix(in oklab, var(--danger) 40%, transparent); }
.note--err i { color: var(--danger); }
</style>
