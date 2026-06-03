<template>
  <div class="rankings-board">
    <!-- Stats globales del servidor -->
    <div class="global-stats">
      <div class="gstat">
        <span class="gstat-value font-orbitron">{{ fmtCompact(global.totalPlayers) }}</span>
        <span class="gstat-label">Jugadores</span>
      </div>
      <div class="gstat-divider"></div>
      <div class="gstat">
        <span class="gstat-value font-orbitron text-gold">{{ fmtCompact(global.totalKills) }}</span>
        <span class="gstat-label">Kills totales</span>
      </div>
      <div class="gstat-divider"></div>
      <div class="gstat">
        <span class="gstat-value font-orbitron">{{ fmtCompact(global.totalMobsKilled) }}</span>
        <span class="gstat-label">Mobs cazados</span>
      </div>
      <div class="gstat-divider"></div>
      <div class="gstat">
        <span class="gstat-value font-orbitron">{{ fmtCompact(global.totalBlocksBroken) }}</span>
        <span class="gstat-label">Bloques minados</span>
      </div>
    </div>

    <!-- Tabs de categorías -->
    <div class="avc-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['avc-tab', { active: activeTab === tab.id }]"
        @click="selectTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <q-spinner-gears size="48px" color="amber" />
      <p class="q-mt-md text-grey-5">Cargando ranking...</p>
    </div>

    <!-- Vacío -->
    <div v-else-if="!players.length" class="state-box">
      <div class="empty-icon">🏆</div>
      <p class="text-grey-5">Aún no hay estadísticas registradas.</p>
    </div>

    <template v-else>
      <!-- Podio Top 3 -->
      <div class="podium">
        <div
          v-for="spot in podium"
          :key="spot.player.uuid"
          :class="['podium-spot', `place-${spot.place}`]"
        >
          <div class="podium-card">
            <div class="podium-medal">{{ spot.place === 1 ? '👑' : spot.place === 2 ? '🥈' : '🥉' }}</div>
            <div class="podium-avatar-wrap">
              <img :src="avatar(spot.player)" class="podium-avatar" :alt="spot.player.playerName" />
            </div>
            <div class="podium-name">{{ spot.player.playerName }}</div>
            <div class="podium-value font-orbitron">{{ formatValue(spot.player) }}</div>
            <div class="podium-rank font-orbitron">#{{ spot.place }}</div>
          </div>
          <div class="podium-base font-orbitron">{{ spot.place }}</div>
        </div>
      </div>

      <!-- Lista del resto -->
      <div class="avc-card ranking-card" v-if="rest.length">
        <div class="ranking-list">
          <div class="ranking-row ranking-header">
            <span class="rank-col">#</span>
            <span class="player-col">JUGADOR</span>
            <span class="value-col">{{ currentTab.label }}</span>
          </div>
          <div
            v-for="player in rest"
            :key="player.uuid"
            class="ranking-row"
          >
            <span class="rank-col font-orbitron">{{ player.rank }}</span>
            <span class="player-col">
              <img :src="avatar(player)" class="pixel-avatar" :alt="player.playerName" />
              <span class="player-name">{{ player.playerName }}</span>
            </span>
            <span class="value-col font-orbitron text-gold">{{ formatValue(player) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useGlobal } from 'stores/global'

const globalStore = useGlobal()

const tabs = [
  { id: 'kills', label: 'KILLS', icon: '⚔️', format: 'int' },
  { id: 'money', label: 'DINERO', icon: '💰', format: 'money' },
  { id: 'mobsKilled', label: 'MOBS', icon: '👹', format: 'int' },
  { id: 'blocksBroken', label: 'MINADO', icon: '⛏️', format: 'int' },
  { id: 'blocksPlaced', label: 'CONSTRUIDO', icon: '🧱', format: 'int' },
  { id: 'distanceWalked', label: 'DISTANCIA', icon: '👣', format: 'distance' },
  { id: 'timePlayed', label: 'TIEMPO', icon: '⏱️', format: 'time' },
  { id: 'kdr', label: 'KDR', icon: '🎯', format: 'decimal' },
]

const activeTab = ref('kills')
const loading = ref(false)
const players = ref([])
const global = ref({
  totalPlayers: 0,
  totalKills: 0,
  totalMobsKilled: 0,
  totalBlocksBroken: 0,
})

const currentTab = computed(() => tabs.find((t) => t.id === activeTab.value))

// Top 3 reordenado para el podio: 2º - 1º - 3º
const podium = computed(() => {
  const top = players.value.slice(0, 3)
  const order = [
    top[1] && { player: top[1], place: 2 },
    top[0] && { player: top[0], place: 1 },
    top[2] && { player: top[2], place: 3 },
  ]
  return order.filter(Boolean)
})

const rest = computed(() => players.value.slice(3))

function avatar(player) {
  const id = player.uuid || player.playerName || 'steve'
  return `https://mc-heads.net/avatar/${id}/64`
}

function formatValue(player) {
  const v = player[activeTab.value] || 0
  switch (currentTab.value.format) {
    case 'money':
      return '$' + fmtInt(v)
    case 'decimal':
      return Number(v).toFixed(2)
    case 'distance':
      return fmtDistance(v)
    case 'time':
      return fmtTime(v)
    default:
      return fmtInt(v)
  }
}

function fmtInt(v) {
  return Math.round(v).toLocaleString('es-ES')
}

function fmtCompact(v) {
  const n = Number(v) || 0
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return n.toLocaleString('es-ES')
}

function fmtDistance(v) {
  if (v >= 1000) return (v / 1000).toFixed(1) + ' km'
  return Math.round(v).toLocaleString('es-ES') + ' bloques'
}

// timePlayed viene en segundos desde el plugin. Ajusta el divisor si tu plugin usa otra unidad.
function fmtTime(v) {
  const totalMin = Math.floor(v / 60)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

async function fetchRankings() {
  loading.value = true
  try {
    const { data } = await axios.get(`${globalStore.url_api}/rankings`, {
      params: { category: activeTab.value, limit: 50 },
    })
    players.value = data?.players || []
  } catch (e) {
    console.error('Error cargando rankings', e)
    players.value = []
  } finally {
    loading.value = false
  }
}

async function fetchGlobal() {
  try {
    const { data } = await axios.get(`${globalStore.url_api}/rankings/stats`)
    if (data?.stats) global.value = data.stats
  } catch (e) {
    console.error('Error cargando stats globales', e)
  }
}

function selectTab(id) {
  if (id === activeTab.value) return
  activeTab.value = id
  fetchRankings()
}

onMounted(() => {
  fetchGlobal()
  fetchRankings()
})
</script>

<style lang="scss" scoped>
.rankings-board {
  width: 100%;
}

// Stats globales
.global-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 28px;
}

.gstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  padding: 0 12px;
}

.gstat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
}

.gstat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.gstat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
}

// Tabs
.avc-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.avc-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 22px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;

  .tab-icon { font-size: 14px; }

  &:hover {
    border-color: rgba(212, 168, 67, 0.4);
    color: var(--text-primary);
  }

  &.active {
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    border-color: var(--gold);
    color: #0a0914;
    box-shadow: 0 4px 18px rgba(212, 168, 67, 0.35);
  }
}

// Podio
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  margin-bottom: 36px;
}

.podium-spot {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 220px;
}

.podium-card {
  position: relative;
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 16px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover { transform: translateY(-4px); }
}

.podium-medal {
  font-size: 28px;
  margin-bottom: 6px;
}

.podium-avatar-wrap {
  display: inline-block;
  padding: 3px;
  border-radius: 14px;
  margin-bottom: 10px;
}

.podium-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: block;
  image-rendering: pixelated;
}

.podium-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.podium-value {
  font-weight: 800;
  font-size: 18px;
  color: var(--gold);
  margin-top: 4px;
}

.podium-rank {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 700;
}

.podium-base {
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  color: #0a0914;
  border-radius: 0 0 10px 10px;
  padding: 6px 0;
}

// 1er lugar
.place-1 {
  .podium-card {
    border-color: var(--gold);
    box-shadow: 0 0 40px rgba(212, 168, 67, 0.25);
    background: linear-gradient(180deg, rgba(212, 168, 67, 0.12), var(--bg-card));
  }
  .podium-avatar-wrap {
    background: linear-gradient(135deg, #d4a843, #f5d98a);
    box-shadow: 0 0 24px rgba(212, 168, 67, 0.6);
  }
  .podium-base {
    height: 64px;
    background: linear-gradient(180deg, #f5d98a, #d4a843);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 2º lugar
.place-2 {
  .podium-avatar-wrap { background: linear-gradient(135deg, #cbd5e1, #94a3b8); }
  .podium-base {
    height: 44px;
    background: linear-gradient(180deg, #cbd5e1, #94a3b8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 3er lugar
.place-3 {
  .podium-avatar-wrap { background: linear-gradient(135deg, #f0a868, #d97706); }
  .podium-base {
    height: 32px;
    background: linear-gradient(180deg, #f0a868, #d97706);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// Lista
.ranking-card {
  padding: 8px 8px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
}

.ranking-row {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.2s ease;

  &:not(.ranking-header):hover {
    background: rgba(212, 168, 67, 0.06);
  }

  &.ranking-header {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 1px;
    border-bottom: 1px solid var(--border-color);
    border-radius: 0;
  }
}

.rank-col {
  width: 48px;
  font-weight: 700;
  font-size: 15px;
  color: var(--text-secondary);
}

.player-col {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 0;
}

.player-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pixel-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  image-rendering: pixelated;
  border: 1px solid var(--border-color);
}

.value-col {
  width: 140px;
  text-align: right;
  font-weight: 800;
  font-size: 15px;
}

// Estados
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 12px;
  opacity: 0.5;
}

// Responsive
@media (max-width: 600px) {
  .podium { gap: 8px; }
  .podium-avatar { width: 48px; height: 48px; }
  .podium-name { font-size: 13px; }
  .podium-value { font-size: 15px; }
  .value-col { width: 100px; font-size: 13px; }
  .gstat { min-width: 70px; padding: 0 6px; }
  .gstat-value { font-size: 18px; }
}
</style>
