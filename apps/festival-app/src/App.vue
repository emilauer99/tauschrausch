<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { useDragScroll } from '@/composables/useDragScroll'
import { useReminderTicker } from '@/composables/useReminderTicker'
import StatusBar from '@/components/shell/StatusBar.vue'
import ReminderBanner from '@/components/shell/ReminderBanner.vue'
import BottomNav from '@/components/shell/BottomNav.vue'
import OverlaysHost from '@/components/OverlaysHost.vue'
import WelcomeScreen from '@/views/WelcomeScreen.vue'
import AuthScreens from '@/views/AuthScreens.vue'
import FestivalScreen from '@/views/FestivalScreen.vue'
import ZoneScreen from '@/views/ZoneScreen.vue'
import FeedScreen from '@/views/FeedScreen.vue'
import CreateScreen from '@/views/CreateScreen.vue'
import DetailScreen from '@/views/DetailScreen.vue'
import ChatScreen from '@/views/ChatScreen.vue'
import TreffenScreen from '@/views/TreffenScreen.vue'
import LobbyCreateScreen from '@/views/LobbyCreateScreen.vue'
import LobbyDetailScreen from '@/views/LobbyDetailScreen.vue'
import LobbyChatScreen from '@/views/LobbyChatScreen.vue'
import ActCreateScreen from '@/views/ActCreateScreen.vue'
import LineupScreen from '@/views/LineupScreen.vue'
import MapScreen from '@/views/MapScreen.vue'
import ProfileScreen from '@/views/ProfileScreen.vue'

const app = useAppStore()
useDragScroll()
useReminderTicker(app)

const screens = {
  welcome: WelcomeScreen, register: AuthScreens, login: AuthScreens, reset: AuthScreens,
  festival: FestivalScreen, zone: ZoneScreen, feed: FeedScreen, create: CreateScreen,
  detail: DetailScreen, chat: ChatScreen, lobbies: TreffenScreen, lobbyCreate: LobbyCreateScreen,
  lobbyDetail: LobbyDetailScreen, actCreate: ActCreateScreen, actDetail: LobbyDetailScreen,
  lobbyChat: LobbyChatScreen, lineup: LineupScreen, map: MapScreen, profile: ProfileScreen,
} as const

const currentScreen = computed(() => screens[app.screen as keyof typeof screens] || WelcomeScreen)
</script>

<template>
  <div class="frame scr" :data-theme="app.themeName">
    <div class="notch" />
    <StatusBar />
    <ReminderBanner v-if="app.banner" :banner="app.banner" @open="app.openLobby(app.banner.id)" />

    <main class="body scr" data-appbody>
      <component :is="currentScreen" :key="app.screen" class="screen-anim" />
    </main>

    <BottomNav
      v-if="app.isTopLevel"
      :active="app.screen"
      @navigate="(t) => (t === 'feed' ? app.goFeed() : t === 'lobbies' ? app.goLobbies() : app.goProfile())"
    />

    <OverlaysHost />
  </div>
</template>

<style scoped>
.frame {
  position: relative;
  width: min(100vw, 440px);
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
}
.notch {
  position: absolute;
  top: 13px;
  left: 50%;
  transform: translateX(-50%);
  width: 116px;
  height: 33px;
  background: #000;
  border-radius: 19px;
  z-index: 60;
}
.body { flex: 1; overflow-y: auto; overflow-x: hidden; position: relative; }
</style>
