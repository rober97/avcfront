<template>
  <q-page class="map-page">
    <!-- Barra superior -->
    <div class="map-toolbar">
      <div class="map-title">
        <q-icon name="map" size="20px" class="text-gold" />
        <span class="font-orbitron">MAPA DEL MUNDO</span>
        <span class="map-live">
          <span class="live-dot"></span> EN VIVO
        </span>
      </div>
      <div class="map-actions">
        <q-btn
          flat
          dense
          round
          icon="refresh"
          class="map-btn"
          @click="reload"
        >
          <q-tooltip>Recargar</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="fullscreen"
          class="map-btn"
          @click="goFullscreen"
        >
          <q-tooltip>Pantalla completa</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          round
          icon="open_in_new"
          class="map-btn"
          @click="openInNewTab"
        >
          <q-tooltip>Abrir en pestaña nueva</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="map-frame-wrap" ref="frameWrap">
      <!-- Overlay de carga -->
      <div v-if="loading" class="map-overlay">
        <q-spinner-gears size="56px" color="amber" />
        <p class="q-mt-md text-grey-4">Cargando mapa del servidor...</p>
      </div>

      <iframe
        :key="iframeKey"
        :src="mapUrl"
        class="map-iframe"
        title="Mapa del servidor AvC"
        allowfullscreen
        @load="onLoad"
      ></iframe>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobal } from 'stores/global'

const globalStore = useGlobal()

const mapUrl = computed(() => globalStore.url_map)
const loading = ref(true)
const iframeKey = ref(0)
const frameWrap = ref(null)

function onLoad() {
  loading.value = false
}

function reload() {
  loading.value = true
  // Forzar recarga del iframe cambiando su key
  iframeKey.value++
}

function goFullscreen() {
  const el = frameWrap.value
  if (el?.requestFullscreen) el.requestFullscreen()
  else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen()
}

function openInNewTab() {
  window.open(mapUrl.value, '_blank', 'noopener')
}
</script>

<style lang="scss" scoped>
.map-page {
  // 56px = alto del header del GameLayout
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.map-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.map-live {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent-green);
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 4px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-green);
  animation: live-pulse 2s infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.map-btn {
  color: var(--text-secondary);
  &:hover { color: var(--gold); }
}

.map-frame-wrap {
  position: relative;
  flex: 1;
  background: var(--bg-primary);
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.map-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>
