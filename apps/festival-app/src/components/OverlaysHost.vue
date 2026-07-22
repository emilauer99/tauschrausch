<script setup lang="ts">
import { useAppStore } from '@/store/app'
import BottomSheet from '@/components/ui/BottomSheet.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AvatarStack from '@/components/ui/AvatarStack.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'

const app = useAppStore()
</script>

<template>
  <!-- zone sheet -->
  <BottomSheet :open="app.zoneSheet" :z="70" @close="app.closeZoneSheet()">
    <h3 class="sheet-title">Zone anzeigen</h3>
    <div class="zone-opts">
      <button v-for="z in app.zoneOptions" :key="z.key" class="zone-opt" :class="{ 'zone-opt--active': z.active }" @click="app.setViewZone(z.key)">
        <i class="ph-fill ph-map-pin" :style="{ color: z.active ? 'var(--biete)' : 'var(--muted)' }" />{{ z.label }}
        <i v-if="z.active" class="ph-bold ph-check zone-opt__check" />
      </button>
    </div>
  </BottomSheet>

  <!-- feed filter sheet -->
  <BottomSheet :open="app.filterSheet" :z="72" @close="app.closeFilterSheet()">
    <h3 class="sheet-title">Filter</h3>
    <span class="sheet-label">TYP</span>
    <SegmentedControl class="filter-seg" :segments="app.typeSegments" @select="app.setTypeFilter" />
    <span class="sheet-label filter-label2">KATEGORIE</span>
    <div class="filter-cats">
      <button v-for="c in app.categoryFilters" :key="c.key" class="filter-cat" :class="{ 'filter-cat--active': c.active }" @click="app.setCatFilter(c.key)">
        <i :class="c.icon" />{{ c.label }}
      </button>
    </div>
    <span class="sheet-label filter-label2">ANSICHT</span>
    <div class="filter-variants">
      <button v-for="v in app.variantSegments" :key="v.key" class="filter-variant" :class="{ 'filter-variant--active': v.active }" @click="app.setFeedVariant(v.key)">
        <i :class="v.icon" /><span>{{ v.title }}</span>
      </button>
    </div>
    <button class="filter-apply pressable" @click="app.closeFilterSheet()">Anwenden</button>
  </BottomSheet>

  <!-- treffen filter sheet -->
  <BottomSheet :open="app.treffenSheet" :z="72" @close="app.closeTreffenSheet()">
    <h3 class="sheet-title">Filter</h3>
    <span class="sheet-label">ANZEIGEN</span>
    <SegmentedControl class="filter-seg" :segments="app.treffenFilterSegments" @select="app.setTreffenFilter" />
    <template v-if="app.showActFilter">
      <span class="sheet-label filter-label2">ACT</span>
      <div v-if="app.actFilterSelected" class="picked-act">
        <i class="ph-fill ph-music-notes" />
        <span class="picked-act__name">{{ app.actFilterSelected }}</span>
        <button class="picked-act__clear" @click="app.clearActFilter()"><i class="ph-bold ph-x" /></button>
      </div>
      <template v-else>
        <div class="filter-search">
          <i class="ph-bold ph-magnifying-glass filter-search__icon" />
          <input class="filter-search__input" placeholder="Act suchen…" :value="app.actFilterQuery" @input="app.setActFilterQuery(($event.target as HTMLInputElement).value)" />
        </div>
        <div v-if="app.actSuggestions.length" class="act-results">
          <button v-for="a in app.actSuggestions" :key="a.name" class="act-result" @click="app.selectActFilter(a.name)">
            <i class="ph-fill ph-music-notes act-result__icon" />
            <div class="act-result__meta"><div class="act-result__name">{{ a.name }}</div><div class="act-result__sub">{{ a.count }} Treffen</div></div>
            <i class="ph-bold ph-plus act-result__add" />
          </button>
        </div>
        <div v-else-if="app.actFilterQuery.trim()" class="filter-hint">Kein Act gefunden</div>
      </template>
    </template>
    <template v-if="app.showGameFilter">
      <span class="sheet-label filter-label2">SPIEL</span>
      <div class="filter-cats">
        <button v-for="g in app.gameFilterOptions" :key="g.key" class="filter-cat" :class="{ 'filter-cat--active': g.active }" @click="app.setGameFilter(g.key)"><i :class="g.icon" />{{ g.label }}</button>
      </div>
    </template>
    <button class="filter-apply pressable" @click="app.closeTreffenSheet()">Anwenden</button>
  </BottomSheet>

  <!-- create chooser -->
  <BottomSheet :open="app.createChooser" :z="84" @close="app.closeCreateChooser()">
    <h3 class="sheet-title sheet-title--tight">Was möchtest du eröffnen?</h3>
    <p class="sheet-sub">Beides sind offene Gruppen — kein Dating, Kontakt läuft nur über den Gruppenchat.</p>
    <div class="chooser">
      <button class="chooser__opt chooser__opt--games pressable" @click="app.chooseSpiel()">
        <span class="chooser__icon"><i class="ph-fill ph-game-controller" /></span>
        <div class="chooser__meta"><div class="chooser__title">Spiel-Treffen</div><div class="chooser__hint">Flunkyball, Beerpong &amp; Co. · feste Plätze</div></div>
        <i class="ph-bold ph-caret-right chooser__caret" />
      </button>
      <button class="chooser__opt chooser__opt--suche pressable" @click="app.chooseAct()">
        <span class="chooser__icon chooser__icon--suche"><i class="ph-fill ph-music-notes" /></span>
        <div class="chooser__meta"><div class="chooser__title">Act-Treffen</div><div class="chooser__hint">Gemeinsam zu einem Konzert · offene Gruppe</div></div>
        <i class="ph-bold ph-caret-right chooser__caret" />
      </button>
    </div>
  </BottomSheet>

  <!-- act sheet -->
  <BottomSheet :open="!!app.actSheetData" :z="84" scroll @close="app.closeActSheet()">
    <template v-if="app.actSheetData">
      <div class="act-sheet__head">
        <span class="act-sheet__icon"><i class="ph-fill ph-music-notes" /></span>
        <div class="act-sheet__meta"><div class="act-sheet__act">{{ app.actSheetData.act }}</div><div class="act-sheet__sub"><span class="act-sheet__stage">{{ app.actSheetData.stage }}</span>· {{ app.actSheetData.day }} {{ app.actSheetData.time }}</div></div>
      </div>
      <template v-if="app.actSheetData.hasComp">
        <span class="sheet-label">GRUPPEN, DIE MITGEHEN</span>
        <div class="companions">
          <button v-for="c in app.actSheetData.companions" :key="c.id" class="companion pressable" @click="app.openLobby(c.id)">
            <div class="companion__meta">
              <div class="companion__spot"><i class="ph-fill ph-map-pin" /><span>{{ c.spot }}</span></div>
              <div class="companion__people"><AvatarStack :members="c.members" :size="28" /><span class="companion__count">{{ c.count }}</span></div>
            </div>
            <span class="companion__cta">Ich geh mit<i class="ph-bold ph-caret-right" /></span>
          </button>
        </div>
      </template>
      <div v-else class="act-sheet__empty">Noch keine Gruppe für diesen Act.<br>Sei die erste — wer geht mit?</div>
      <button class="act-sheet__cta pressable" @click="app.openActCreateFromSheet()"><i class="ph-bold ph-plus" />Eigenes Treffen eröffnen</button>
    </template>
  </BottomSheet>

  <!-- bell / reminders list -->
  <BottomSheet :open="app.bellOpen" :z="82" scroll @close="app.closeBell()">
    <div class="bell-head"><i class="ph-fill ph-bell" /><h3 class="sheet-title sheet-title--inline">Erinnerungen</h3></div>
    <template v-if="app.unreadChats.length">
      <span class="sheet-label">NEUE NACHRICHTEN</span>
      <div class="bell-list bell-list--top">
        <button v-for="c in app.unreadChats" :key="'u' + c.id" class="bell-item" :style="{ '--accent': c.accentVar }" @click="app.openLobbyChatById(c.id)">
          <span class="bell-item__icon"><i :class="c.icon" /></span>
          <div class="bell-item__meta"><div class="bell-item__title">{{ c.title }}</div><div class="bell-item__spot">{{ c.preview }}</div></div>
          <span class="bell-unread">{{ c.count }}</span>
        </button>
      </div>
    </template>
    <template v-if="app.myGames.length">
      <span class="sheet-label" :class="{ 'bell-label2': app.unreadChats.length }">ANSTEHENDE TREFFEN</span>
      <div class="bell-list bell-list--top">
        <button v-for="g in app.myGames" :key="g.id" class="bell-item" :class="`bell-item--${g.status}`" :style="{ '--accent': g.accentVar }" @click="app.openLobby(g.id)">
          <span class="bell-item__icon"><i :class="g.icon" /></span>
          <div class="bell-item__meta"><div class="bell-item__title">{{ g.title }}</div><div class="bell-item__spot">{{ g.spot }}</div></div>
          <span class="bell-item__count">{{ g.countdown }}</span>
        </button>
      </div>
    </template>
    <p v-if="!app.unreadChats.length && !app.myGames.length" class="bell-empty">Keine Erinnerungen.<br>Tritt bei „Entdecken" einer Runde bei.</p>
  </BottomSheet>

  <!-- auth gate -->
  <BottomSheet :open="app.authGateOpen" :z="90" @close="app.closeAuthGate()">
    <span class="gate__icon"><i class="ph-fill ph-lock-key-open" /></span>
    <h3 class="sheet-title sheet-title--tight">Kurz anmelden?</h3>
    <p class="sheet-sub">Zum Inserieren, Chatten und Mitspielen brauchst du ein Konto. Nur schauen geht auch ohne.</p>
    <div class="gate__row">
      <button class="gate__btn" @click="app.startLogin()">Einloggen</button>
      <button class="gate__btn gate__btn--primary pressable" @click="app.startRegister()">Registrieren</button>
    </div>
  </BottomSheet>

  <!-- report listing -->
  <AppModal :open="app.reportOpen" :z="85" @close="app.closeReport()">
    <div class="modal-head"><span class="modal-badge modal-badge--danger"><i class="ph-fill ph-flag" /></span><h3 class="modal-title">Inserat melden?</h3></div>
    <p class="modal-text">Danke, dass du mithilfst. Was stimmt nicht? Details sind optional.</p>
    <textarea class="modal-area" placeholder="z. B. Alkoholverkauf, Spam, unangebrachter Inhalt…" :value="app.reportText" @input="app.setReportText(($event.target as HTMLTextAreaElement).value)" />
    <div class="modal-row">
      <button class="modal-btn" @click="app.closeReport()">Abbrechen</button>
      <button class="modal-btn modal-btn--danger pressable" @click="app.submitReport()">Melden</button>
    </div>
  </AppModal>

  <!-- treffen report -->
  <AppModal :open="app.treffenReport" :z="86" @close="app.closeTreffenReport()">
    <div class="modal-head"><span class="modal-badge modal-badge--danger"><i class="ph-fill ph-shield-warning" /></span><h3 class="modal-title">Melden oder blockieren</h3></div>
    <p class="modal-text">Fühlst du dich unwohl? Wir schauen uns die Gruppe an. Blockierte Personen sehen deine Treffen nicht mehr.</p>
    <textarea class="modal-area" placeholder="Was ist passiert? (optional)" :value="app.reportText" @input="app.setReportText(($event.target as HTMLTextAreaElement).value)" />
    <div class="modal-row">
      <button class="modal-btn" @click="app.closeTreffenReport()">Abbrechen</button>
      <button class="modal-btn modal-btn--danger pressable" @click="app.submitTreffenReport()">Melden</button>
    </div>
  </AppModal>

  <!-- leave lobby -->
  <AppModal :open="app.leaveOpen" :z="85" @close="app.closeLeave()">
    <div class="modal-head"><span class="modal-badge modal-badge--games"><i class="ph-fill ph-sign-out" /></span><h3 class="modal-title">Lobby verlassen?</h3></div>
    <p class="modal-text">Kurze Nachricht an die Runde? (optional)</p>
    <textarea class="modal-area" placeholder="z. B. Doch keine Zeit, sorry! Viel Spaß euch 👋" :value="app.leaveText" @input="app.setLeaveText(($event.target as HTMLTextAreaElement).value)" />
    <div class="modal-row">
      <button class="modal-btn" @click="app.closeLeave()">Bleiben</button>
      <button class="modal-btn modal-btn--games pressable" @click="app.confirmLeave()">Verlassen</button>
    </div>
  </AppModal>

  <!-- delete confirmation -->
  <AppModal :open="!!app.confirmDelete" :z="87" @close="app.cancelDelete()">
    <template v-if="app.confirmDelete">
      <div class="modal-head"><span class="modal-badge modal-badge--danger"><i class="ph-fill ph-trash" /></span><h3 class="modal-title">{{ app.confirmDelete.kind === 'item' ? 'Inserat löschen?' : 'Treffen löschen?' }}</h3></div>
      <p class="modal-text">Das kann nicht rückgängig gemacht werden.</p>
      <div class="modal-row">
        <button class="modal-btn" @click="app.cancelDelete()">Abbrechen</button>
        <button class="modal-btn modal-btn--danger pressable" @click="app.confirmDeleteAction()">Löschen</button>
      </div>
    </template>
  </AppModal>

  <!-- reminder modal -->
  <AppModal :open="!!app.reminderModalData" :z="88" :dismissible="false" center>
    <template v-if="app.reminderModalData">
      <span class="rem__tag" :class="`rem__tag--${app.reminderModalData.tone}`"><i class="ph-fill ph-bell-ringing" />ERINNERUNG</span>
      <div class="rem__label" :class="`rem__label--${app.reminderModalData.tone}`">{{ app.reminderModalData.label }}</div>
      <h3 class="rem__game"><i :class="app.reminderModalData.icon" />{{ app.reminderModalData.game }}</h3>
      <div class="rem__info">
        <div class="rem__row"><i class="ph-fill ph-map-pin rem__pin" /><span>{{ app.reminderModalData.spot }}</span></div>
        <div class="rem__row"><i class="ph-fill ph-users-three rem__users" /><span>{{ app.reminderModalData.count }}</span></div>
      </div>
      <button class="rem__go pressable" @click="app.rmGoLobby()"><i class="ph-fill ph-arrow-right" />Bin dabei – zum Treffen</button>
      <div class="rem__row-btns">
        <button class="rem__sub" @click="app.rmSnooze()">In 10 Min nochmal</button>
        <button class="rem__sub rem__sub--ghost" @click="app.rmDismiss()">Doch nicht dabei</button>
      </div>
    </template>
  </AppModal>

  <!-- opt-in -->
  <AppModal :open="app.optInOpen" :z="90" :dismissible="false" center>
    <span class="optin__icon"><i class="ph-fill ph-bell-ringing" /></span>
    <h3 class="optin__title">Erinnerungen erlauben?</h3>
    <p class="optin__text">Wir stupsen dich rechtzeitig an, bevor deine Spiele starten – 30 und 5 Minuten vorher. Kein Verpassen mehr, auch wenn die App zu ist.</p>
    <button class="optin__allow pressable" @click="app.optInAllow()"><i class="ph-fill ph-bell" />Erinnerungen erlauben</button>
    <button class="optin__later" @click="app.optInLater()">Vielleicht später</button>
  </AppModal>

  <!-- logout -->
  <AppModal :open="app.logoutOpen" :z="90" center @close="app.closeLogout()">
    <span class="logout__icon"><i class="ph-fill ph-sign-out" /></span>
    <h3 class="optin__title">Wirklich ausloggen?</h3>
    <p class="optin__text">Du kommst mit Username und Passwort jederzeit wieder rein.</p>
    <button class="logout__confirm pressable" @click="app.confirmLogout()">Ausloggen</button>
    <button class="logout__stay" @click="app.closeLogout()">Doch bleiben</button>
  </AppModal>

  <!-- toast -->
  <div v-if="app.toast" :key="app.toast" class="toast"><i class="ph-fill ph-check-circle" />{{ app.toast }}</div>
</template>

<style scoped>
.sheet-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; margin: 0 0 14px; }
.sheet-title--tight { margin-bottom: 4px; }
.sheet-title--inline { margin: 0; }
.sheet-sub { font-size: 13px; color: var(--muted); margin: 0 0 16px; line-height: 1.5; }
.sheet-label { font-size: 13px; font-weight: 600; letter-spacing: 0.06em; color: var(--muted); }

/* feed filter sheet */
.filter-seg { margin-top: 11px; }
.filter-label2 { display: block; margin-top: 20px; }
.filter-cats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 11px; }
.filter-cat { display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.15s; }
.filter-cat i { font-size: 16px; }
.filter-cat--active { border-color: transparent; background: var(--text); color: var(--bg); }
.filter-search { position: relative; margin-top: 11px; }
.filter-search__icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--muted); }
.filter-search__input { width: 100%; padding: 15px 16px 15px 46px; border-radius: 14px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-size: 15px; outline: none; }
.filter-hint { font-size: 12.5px; color: var(--muted); margin-top: 9px; padding-left: 2px; }
.picked-act { display: flex; align-items: center; gap: 11px; margin-top: 11px; padding: 14px 15px; border-radius: 14px; background: color-mix(in oklab, var(--suche) 12%, var(--card)); border: 1px solid color-mix(in oklab, var(--suche) 34%, transparent); }
.picked-act > i { font-size: 20px; color: var(--suche); }
.picked-act__name { flex: 1; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.picked-act__clear { width: 34px; height: 34px; flex-shrink: 0; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.act-results { margin-top: 9px; display: flex; flex-direction: column; gap: 7px; }
.act-result { display: flex; align-items: center; gap: 11px; text-align: left; padding: 13px 14px; border-radius: 14px; background: var(--card2); border: 1px solid var(--line); cursor: pointer; color: var(--text); }
.act-result__icon { font-size: 19px; color: var(--suche); flex-shrink: 0; }
.act-result__meta { flex: 1; min-width: 0; }
.act-result__name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.act-result__sub { font-size: 12px; color: var(--muted); }
.act-result__add { font-size: 16px; color: var(--suche); }
.filter-variants { display: flex; gap: 9px; margin-top: 11px; }
.filter-variant { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 4px; border-radius: 14px; cursor: pointer; background: var(--card2); border: 2px solid var(--line); color: var(--muted); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; transition: all 0.15s; }
.filter-variant i { font-size: 22px; }
.filter-variant--active { background: color-mix(in oklab, var(--biete) 14%, var(--card)); border-color: var(--biete); color: var(--text); }
.filter-apply { width: 100%; margin-top: 20px; padding: 16px; border: none; border-radius: 15px; background: var(--biete); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; }

/* zone opts */
.zone-opts { display: flex; flex-direction: column; gap: 8px; }
.zone-opt { display: flex; align-items: center; gap: 12px; width: 100%; padding: 15px 16px; border-radius: 14px; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; text-align: left; background: var(--card2); border: 1px solid var(--line); color: var(--text); }
.zone-opt--active { background: color-mix(in oklab, var(--biete) 12%, var(--card2)); border-color: color-mix(in oklab, var(--biete) 40%, transparent); }
.zone-opt i { font-size: 19px; }
.zone-opt__check { color: var(--biete); font-size: 18px; margin-left: auto; }

/* chooser */
.chooser { display: flex; flex-direction: column; gap: 10px; }
.chooser__opt { display: flex; align-items: center; gap: 13px; text-align: left; padding: 16px; border-radius: 16px; cursor: pointer; color: var(--text); }
.chooser__opt--games { background: color-mix(in oklab, var(--games) 10%, var(--card2)); border: 1px solid color-mix(in oklab, var(--games) 30%, transparent); }
.chooser__opt--suche { background: color-mix(in oklab, var(--suche) 10%, var(--card2)); border: 1px solid color-mix(in oklab, var(--suche) 30%, transparent); }
.chooser__icon { width: 48px; height: 48px; flex-shrink: 0; border-radius: 14px; background: color-mix(in oklab, var(--games) 22%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 25px; color: var(--games); }
.chooser__icon--suche { background: color-mix(in oklab, var(--suche) 22%, var(--card2)); color: var(--suche); }
.chooser__meta { flex: 1; }
.chooser__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; }
.chooser__hint { font-size: 12.5px; color: var(--muted); }
.chooser__caret { font-size: 17px; color: var(--muted); }

/* act sheet */
.act-sheet__head { display: flex; align-items: center; gap: 13px; margin-bottom: 16px; }
.act-sheet__icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 15px; background: color-mix(in oklab, var(--suche) 20%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 26px; color: var(--suche); }
.act-sheet__act { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; line-height: 1.1; }
.act-sheet__sub { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin-top: 3px; }
.act-sheet__stage { color: var(--suche); font-weight: 700; }
.companions { display: flex; flex-direction: column; gap: 9px; margin: 12px 0 18px; }
.companion { display: flex; align-items: center; gap: 12px; text-align: left; padding: 14px; border-radius: 16px; background: var(--card2); border: 1px solid var(--line); cursor: pointer; color: var(--text); }
.companion__meta { flex: 1; min-width: 0; }
.companion__spot { display: flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; }
.companion__spot i { color: var(--suche); font-size: 15px; flex-shrink: 0; }
.companion__spot span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.companion__people { display: flex; align-items: center; margin-top: 9px; }
.companion__count { font-size: 12px; color: var(--muted); margin-left: 12px; }
.companion__cta { display: inline-flex; align-items: center; gap: 5px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--suche); flex-shrink: 0; }
.act-sheet__empty { text-align: center; padding: 20px 10px 22px; color: var(--muted); font-size: 14px; line-height: 1.5; }
.act-sheet__cta { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 17px; border: none; border-radius: 16px; background: var(--suche); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; }

/* bell */
.bell-head { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.bell-head > i { font-size: 20px; color: var(--games); }
.bell-list { display: flex; flex-direction: column; gap: 9px; }
.bell-list--top { margin-top: 11px; }
.bell-label2 { display: block; margin-top: 18px; }
.bell-unread { min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; background: var(--accent); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bell-item { display: flex; align-items: center; gap: 12px; text-align: left; padding: 13px; border-radius: 14px; cursor: pointer; color: var(--text); border: 1px solid var(--line); background: var(--card); }
.bell-item--live { border-color: color-mix(in oklab, var(--biete) 45%, transparent); background: color-mix(in oklab, var(--biete) 9%, var(--card)); }
.bell-item--soon { border-color: color-mix(in oklab, var(--games) 45%, transparent); background: color-mix(in oklab, var(--games) 9%, var(--card)); }
.bell-item__icon { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; background: color-mix(in oklab, var(--accent) 16%, var(--card2)); display: flex; align-items: center; justify-content: center; font-size: 23px; color: var(--accent); }
.bell-item__meta { flex: 1; min-width: 0; }
.bell-item__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
.bell-item__spot { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bell-item__count { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--accent); white-space: nowrap; flex-shrink: 0; }
.bell-empty { text-align: center; color: var(--muted); font-size: 14px; padding: 24px 0; line-height: 1.5; }

/* auth gate */
.gate__icon { width: 56px; height: 56px; border-radius: 16px; background: color-mix(in oklab, var(--biete) 16%, transparent); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 28px; color: var(--biete); }
.gate__row { display: flex; gap: 10px; }
.gate__btn { flex: 1; padding: 16px; border-radius: 15px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; }
.gate__btn--primary { background: var(--biete); border: none; color: var(--ink); }

/* modals (report/leave/treffen) */
.modal-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.modal-badge { width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 23px; }
.modal-badge--danger { background: color-mix(in oklab, var(--danger) 18%, transparent); color: var(--danger); }
.modal-badge--games { background: color-mix(in oklab, var(--games) 18%, transparent); color: var(--games); }
.modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; margin: 0; }
.modal-text { font-size: 14px; color: var(--muted); margin: 0 0 14px; line-height: 1.5; }
.modal-area { width: 100%; height: 96px; padding: 14px; border-radius: 14px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; outline: none; resize: none; margin-bottom: 14px; }
.modal-row { display: flex; gap: 10px; }
.modal-btn { flex: 1; padding: 15px; border-radius: 14px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; }
.modal-btn--danger { background: var(--danger); border: none; color: #fff; }
.modal-btn--games { background: var(--games); border: none; color: var(--ink); }

/* reminder modal */
.rem__tag { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.08em; padding: 6px 12px; border-radius: 8px; color: var(--ink); margin-bottom: 14px; }
.rem__tag--live { background: var(--biete); }
.rem__tag--soon { background: var(--games); }
.rem__label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 40px; line-height: 1; margin-bottom: 10px; }
.rem__label--live { color: var(--biete); }
.rem__label--soon { color: var(--games); }
.rem__game { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 23px; margin: 0 0 14px; }
.rem__game i { font-size: 21px; color: var(--games); margin-right: 6px; }
.rem__info { display: flex; flex-direction: column; gap: 9px; padding: 14px; border-radius: 16px; background: var(--card2); margin-bottom: 18px; text-align: left; }
.rem__row { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; }
.rem__pin { font-size: 18px; color: var(--suche); flex-shrink: 0; }
.rem__users { font-size: 18px; color: var(--biete); flex-shrink: 0; }
.rem__go { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 17px; border: none; border-radius: 15px; background: var(--games); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; cursor: pointer; margin-bottom: 9px; }
.rem__row-btns { display: flex; gap: 9px; }
.rem__sub { flex: 1; padding: 13px 8px; border-radius: 15px; background: var(--card2); border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; }
.rem__sub--ghost { background: transparent; color: var(--muted); }

/* opt-in / logout */
.optin__icon { width: 64px; height: 64px; border-radius: 20px; background: color-mix(in oklab, var(--games) 18%, transparent); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 32px; color: var(--games); }
.optin__title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 23px; margin: 0 0 10px; }
.optin__text { font-size: 14.5px; line-height: 1.55; color: var(--muted); margin: 0 0 20px; }
.optin__allow { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; padding: 17px; border: none; border-radius: 15px; background: var(--games); color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; cursor: pointer; margin-bottom: 9px; }
.optin__later { width: 100%; padding: 14px; border-radius: 15px; background: transparent; border: none; color: var(--muted); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; }
.logout__icon { width: 60px; height: 60px; border-radius: 18px; background: color-mix(in oklab, var(--danger) 16%, transparent); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 30px; color: var(--danger); }
.logout__confirm { width: 100%; padding: 16px; border: none; border-radius: 15px; background: var(--danger); color: #fff; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; cursor: pointer; margin-bottom: 9px; }
.logout__stay { width: 100%; padding: 14px; border-radius: 15px; background: transparent; border: 1px solid var(--line); color: var(--text); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; }

/* toast */
.toast { position: absolute; bottom: 110px; left: 50%; z-index: 80; display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 14px; background: var(--text); color: var(--bg); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.6); animation: toastIn 2.4s ease forwards; white-space: nowrap; }
.toast i { font-size: 20px; color: var(--biete); }
</style>
