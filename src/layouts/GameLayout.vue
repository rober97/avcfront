<template>
  <q-layout view="lHh LpR lff" class="game-layout">
    <!-- Top Bar -->
    <q-header class="game-header">
      <q-toolbar class="game-toolbar">
        <q-btn flat dense round icon="menu" class="lt-md text-grey-4" @click="toggleSidebar" />

        <q-toolbar-title class="flex items-center gap-sm">
          <img src="/avc-logo.svg" alt="AVC" class="header-logo" />
        </q-toolbar-title>

        <div class="flex items-center gap-md">
          <q-btn flat round dense icon="search" class="header-icon" />
          <q-btn flat round dense icon="notifications_none" class="header-icon">
            <q-badge color="red" floating>3</q-badge>
          </q-btn>
          <q-btn flat round dense icon="chat_bubble_outline" class="header-icon" />

          <div class="flex items-center gap-sm cursor-pointer user-menu" @click="goToProfile">
            <img
              :src="playerSkin"
              class="pixel-avatar"
              style="width: 32px; height: 32px;"
            />
            <span class="username-text gt-sm">{{ username }}</span>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="sidebarOpen"
      :width="220"
      :breakpoint="1024"
      bordered
      class="game-sidebar"
    >
      <div class="sidebar-content">
        <!-- Logo -->
        <div class="sidebar-logo">
          <img src="/avc-logo.svg" alt="AVC" style="height: 40px;" />
        </div>

        <!-- Navigation -->
        <q-list class="sidebar-nav">
          <q-item
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            clickable
            :class="['nav-item', { 'nav-item-active': isActive(item.path) }]"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" :class="isActive(item.path) ? 'text-gold' : 'text-grey-6'" size="20px" />
            </q-item-section>
            <q-item-section>
              <span :class="['nav-label', isActive(item.path) ? 'text-gold' : 'text-grey-4']">
                {{ item.label }}
              </span>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Logout -->
        <div class="sidebar-footer">
          <q-item clickable class="nav-item logout-item" @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" class="text-red-4" size="20px" />
            </q-item-section>
            <q-item-section>
              <span class="nav-label text-red-4">CERRAR SESIÓN</span>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container class="game-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from 'stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const sidebarOpen = ref(true)

const username = computed(() => userStore.user?.username || 'Jugador')
const playerSkin = computed(() => {
  const uuid = userStore.user?.uuid
  if (uuid) return `https://mc-heads.net/avatar/${uuid}/32`
  return 'https://mc-heads.net/avatar/steve/32'
})

const navItems = [
  { label: 'DASHBOARD', icon: 'dashboard', path: '/dashboard' },
  { label: 'MI PERFIL', icon: 'person', path: '/mi-perfil' },
  { label: 'MISIONES', icon: 'assignment', path: '/misiones' },
  { label: 'LOGROS', icon: 'emoji_events', path: '/logros' },
  { label: 'MAPA', icon: 'map', path: '/mapa' },
  { label: 'RANKINGS', icon: 'leaderboard', path: '/rankings' },
  { label: 'TIENDA', icon: 'storefront', path: '/tienda' },
  { label: 'EVENTOS', icon: 'celebration', path: '/eventos' },
  { label: 'COMUNIDAD', icon: 'groups', path: '/comunidad' },
]

function isActive(path) {
  return route.path === path
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function goToProfile() {
  router.push('/mi-perfil')
}

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.game-layout {
  background: #0a0914;
}

.game-header {
  background: #0d0c18;
  border-bottom: 1px solid rgba(212, 168, 67, 0.08);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

.game-toolbar {
  min-height: 56px;
  padding: 0 24px;
}

.header-logo {
  height: 32px;
}

.header-icon {
  color: #6b7280;
  transition: color 0.2s;
  &:hover { color: #d1d5db; }
}

.username-text {
  color: #d1d5db;
  font-weight: 500;
  font-size: 14px;
}

.user-menu {
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.04); }
}

.game-sidebar {
  background: #0d0c18 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.04) !important;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0d0c18;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: 56px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  overflow-y: auto;
}

.nav-item {
  border-radius: 10px;
  margin-bottom: 2px;
  min-height: 44px;
  padding: 0 12px;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.nav-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-item-active {
  background: rgba(212, 168, 67, 0.08) !important;
  border-color: rgba(212, 168, 67, 0.15);

  .nav-label {
    font-weight: 700;
  }
}

.text-gold {
  color: #d4a843 !important;
}

.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.logout-item {
  &:hover {
    background: rgba(239, 68, 68, 0.06);
  }
}

// Force dark background on page container
.game-page-container {
  background: #0f0e1a;
}

.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
</style>

<style lang="scss">
// Global overrides for pages inside GameLayout
.game-layout {
  .q-page {
    background: #0f0e1a !important;
  }

  .q-page-container {
    background: #0f0e1a !important;
  }

  .q-drawer {
    background: #0d0c18 !important;
  }

  // Fix Quasar default dark backgrounds
  .q-drawer--bordered {
    border-color: rgba(255, 255, 255, 0.04) !important;
  }
}
</style>
