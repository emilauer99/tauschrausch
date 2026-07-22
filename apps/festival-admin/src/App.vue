<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
import LoginScreen from '@/components/LoginScreen.vue'
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
import Overlays from '@/components/Overlays.vue'
import DashboardView from '@/views/DashboardView.vue'
import MeldungenView from '@/views/MeldungenView.vue'
import InserateView from '@/views/InserateView.vue'
import LobbysView from '@/views/LobbysView.vue'
import NutzerView from '@/views/NutzerView.vue'
import FestivalsView from '@/views/FestivalsView.vue'
import ZonenView from '@/views/ZonenView.vue'
import LineupView from '@/views/LineupView.vue'

const app = useAdminStore()
</script>

<template>
  <div class="admin-root">
    <LoginScreen v-if="app.vals.isLogin" />

    <template v-if="app.vals.isApp">
      <Sidebar />
      <div class="admin-main-col">
        <Topbar />
        <main class="adminscroll" style="flex:1;padding:26px;position:relative;">
          <DashboardView v-if="app.vals.isDashboard" />
          <MeldungenView v-if="app.vals.isMeldungen" />
          <InserateView v-if="app.vals.isInserate" />
          <LobbysView v-if="app.vals.isLobbys" />
          <NutzerView v-if="app.vals.isNutzer" />
          <FestivalsView v-if="app.vals.isFestivals" />
          <ZonenView v-if="app.vals.isZonen" />
          <LineupView v-if="app.vals.isLineup" />
        </main>
      </div>
    </template>

    <Overlays />
  </div>
</template>

<style scoped>
.admin-root {
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}
.admin-main-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
