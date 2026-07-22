<script setup lang="ts">
import { useAppStore } from '@/store/app'
import ScreenHeader from '@/components/ui/ScreenHeader.vue'
import FormSection from '@/components/ui/FormSection.vue'
import AppButton from '@/components/ui/AppButton.vue'
import MapPreview from '@/components/map/MapPreview.vue'

const app = useAppStore()
</script>

<template>
  <div class="ac">
    <ScreenHeader leading="close" :title="app.actCreateTitle" @back="app.cancelTreffenCreate()" />
    <div class="ac__body">
      <div v-if="!app.actRulesSeen" class="rules">
        <i class="ph-fill ph-users-three rules__icon" />
        <div>
          <div class="rules__title">Gemeinsam zum Act — als Gruppe</div>
          <p class="rules__text">Kein Dating. Ihr schreibt euch nur im Gruppenchat, trefft euch an einem öffentlichen Ort — und Melden ist jederzeit möglich.</p>
          <button class="rules__ok" @click="app.dismissActRules()">Verstanden</button>
        </div>
      </div>

      <FormSection v-if="app.hasLineup" label="ACT">
        <template v-if="app.actPickView">
          <div class="picked">
            <span class="picked__icon"><i class="ph-fill ph-music-notes" /></span>
            <div class="picked__meta"><div class="picked__act">{{ app.actPickView.act }}</div><div class="picked__sub"><span class="picked__stage"><i class="ph-fill ph-map-pin-area" />{{ app.actPickView.stage }}</span>· {{ app.actPickView.day }} {{ app.actPickView.time }}</div></div>
            <button class="picked__clear" @click="app.clearActPick()"><i class="ph-bold ph-x" /></button>
          </div>
          <div class="picked__note"><i class="ph-fill ph-check-circle" />Bühne &amp; Startzeit aus dem Line-up übernommen</div>
        </template>
        <template v-else>
          <div class="ac-search">
            <i class="ph-bold ph-magnifying-glass ac-search__icon" />
            <input class="ac-search__input" placeholder="Act im Line-up suchen…" :value="app.actQuery" @input="app.setActQuery(($event.target as HTMLInputElement).value)" />
          </div>
          <div v-if="app.actSearch.length" class="results">
            <button v-for="a in app.actSearch" :key="a.id" class="result" @click="app.pickAct(a.pick)">
              <i class="ph-fill ph-music-notes result__icon" />
              <div class="result__meta"><div class="result__act">{{ a.act }}</div><div class="result__sub">{{ a.stage }} · {{ a.day }} {{ a.time }}</div></div>
              <i class="ph-bold ph-plus result__add" />
            </button>
          </div>
        </template>
      </FormSection>

      <div v-else class="freeform">
        <div class="freeform__info"><i class="ph-fill ph-info" /><span>Für dieses Festival gibt's kein hinterlegtes Line-up — trag Act, Bühne und Zeit einfach selbst ein.</span></div>
        <FormSection label="ACT"><input class="input" placeholder="z. B. Nachtsirene" :value="app.actQuery" @input="app.setActQuery(($event.target as HTMLInputElement).value)" /></FormSection>
        <div class="split">
          <FormSection label="BÜHNE" class="split__col"><input class="input" placeholder="Main Stage" :value="app.actStageFree" @input="app.setActStageFree(($event.target as HTMLInputElement).value)" /></FormSection>
          <FormSection label="START" class="split__col"><input class="input input--grotesk" placeholder="21:30" :value="app.actTimeFree" @input="app.setActTimeFree(($event.target as HTMLInputElement).value)" /></FormSection>
        </div>
      </div>

      <FormSection label="TREFFPUNKT">
        <input class="input" placeholder="z. B. beim Getränkestand links vor der Bühne" :value="app.actSpot" @input="app.setActSpot(($event.target as HTMLInputElement).value)" />
        <div class="safe-note"><i class="ph-fill ph-shield-check" />Immer ein gut sichtbarer, öffentlicher Ort.</div>
      </FormSection>

      <FormSection v-if="app.hasPlan" label="TREFFPUNKT AM PLAN">
        <div v-if="app.aMarker" class="marker-box">
          <button class="marker-box__map" @click="app.openPlaceAct()">
            <MapPreview :x="app.aMarker.x" :y="app.aMarker.y" color="var(--suche)" icon="ph-fill ph-music-notes" />
          </button>
          <div class="marker-box__actions">
            <button class="marker-btn" @click="app.openPlaceAct()">Ändern</button>
            <button class="marker-btn marker-btn--ghost" @click="app.removeActMarker()">Entfernen</button>
          </div>
        </div>
        <button v-else class="marker-add pressable" @click="app.openPlaceAct()">
          <span class="marker-add__icon"><i class="ph-fill ph-map-pin-plus" /></span>
          <div class="marker-add__meta"><div class="marker-add__title">Treffpunkt am Plan setzen</div><div class="marker-add__hint">Bühne ist schon vorausgewählt</div></div>
          <i class="ph-bold ph-caret-right" />
        </button>
      </FormSection>

      <FormSection label="NOTIZ · OPTIONAL">
        <textarea class="textarea" placeholder="z. B. Wir stehen eher hinten, tanzen aber gern vor." :value="app.actNote" @input="app.setActNote(($event.target as HTMLTextAreaElement).value)" />
      </FormSection>
    </div>
    <div class="ac__foot">
      <AppButton color="suche" icon="ph-fill ph-flag-banner" @click="app.submitAct()">{{ app.actSubmitLabel }}</AppButton>
    </div>
  </div>
</template>

<style scoped>
.ac__body { padding: 16px 20px 130px; display: flex; flex-direction: column; gap: 20px; }
.rules { display: flex; gap: 11px; padding: 14px; border-radius: 16px; background: color-mix(in oklab, var(--suche) 10%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 26%, transparent); }
.rules__icon { font-size: 22px; color: var(--suche); flex-shrink: 0; margin-top: 1px; }
.rules__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
.rules__text { font-size: 12.5px; color: var(--muted); line-height: 1.5; margin: 0 0 10px; }
.rules__ok { padding: 7px 13px; border-radius: 9px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; cursor: pointer; }
.picked { display: flex; align-items: center; gap: 12px; padding: 15px; border-radius: 16px; background: color-mix(in oklab, var(--suche) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 34%, transparent); }
.picked__icon { width: 46px; height: 46px; flex-shrink: 0; border-radius: 13px; background: color-mix(in oklab, var(--suche) 22%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 23px; color: var(--suche); }
.picked__meta { flex: 1; min-width: 0; }
.picked__act { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; }
.picked__sub { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); margin-top: 2px; }
.picked__stage { display: inline-flex; align-items: center; gap: 4px; color: var(--suche); font-weight: 700; }
.picked__clear { width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.picked__note { display: flex; align-items: center; gap: 6px; margin-top: 9px; font-size: 12px; color: var(--muted); }
.picked__note i { color: var(--suche); font-size: 14px; }
.ac-search { position: relative; }
.ac-search__icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--muted); }
.ac-search__input { width: 100%; padding: 16px 18px 16px 46px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 16px; outline: none; }
.results { margin-top: 9px; display: flex; flex-direction: column; gap: 7px; }
.result { display: flex; align-items: center; gap: 11px; text-align: left; padding: 13px 14px; border-radius: 14px; background: var(--card); border: 1px solid var(--line); cursor: pointer; color: var(--text); }
.result__icon { font-size: 19px; color: var(--suche); flex-shrink: 0; }
.result__meta { flex: 1; min-width: 0; }
.result__act { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.result__sub { font-size: 12px; color: var(--muted); }
.result__add { font-size: 16px; color: var(--suche); }
.freeform { display: flex; flex-direction: column; gap: 16px; }
.freeform__info { display: flex; align-items: flex-start; gap: 9px; padding: 12px 13px; border-radius: 13px; background: var(--card2); }
.freeform__info i { font-size: 17px; color: var(--muted); flex-shrink: 0; margin-top: 1px; }
.freeform__info span { font-size: 12.5px; color: var(--muted); line-height: 1.45; }
.input { width: 100%; padding: 16px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-size: 16px; outline: none; }
.input--grotesk { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
.split { display: flex; gap: 12px; }
.split__col { flex: 1; }
.safe-note { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; color: var(--muted); }
.safe-note i { font-size: 14px; color: var(--suche); }
.textarea { width: 100%; height: 76px; padding: 14px 16px; border-radius: 16px; background: var(--card); border: 1px solid var(--line); color: var(--text); font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.5; outline: none; resize: none; }
.marker-box { border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: var(--card); }
.marker-box__map { display: block; width: 100%; height: 130px; border: none; background: var(--card2); cursor: pointer; overflow: hidden; padding: 0; position: relative; }
.marker-box__actions { display: flex; gap: 8px; padding: 10px; }
.marker-btn { flex: 1; padding: 11px; border-radius: 11px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
.marker-btn--ghost { background: transparent; color: var(--muted); }
.marker-add { width: 100%; display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; background: var(--card); border: 2px dashed var(--line); color: var(--text); cursor: pointer; text-align: left; }
.marker-add__icon { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; background: var(--card2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--suche); }
.marker-add__meta { flex: 1; }
.marker-add__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.marker-add__hint { font-size: 12px; color: var(--muted); margin-top: 2px; }
.marker-add > i { color: var(--muted); font-size: 16px; }
.ac__foot { position: sticky; bottom: 0; padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); background: linear-gradient(transparent, var(--bg) 26%); }
</style>
