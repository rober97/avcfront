<template>
  <q-page class="dashboard-page q-pa-lg">
    <!-- Welcome Header -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-8">
        <div class="welcome-card avc-card">
          <div class="flex items-center gap-lg">
            <img
              :src="playerSkin"
              class="pixel-avatar welcome-avatar"
            />
            <div class="welcome-info">
              <h2 class="welcome-title">¡BIENVENIDO DE NUEVO!</h2>
              <div class="flex items-center gap-sm q-mb-xs">
                <span class="welcome-name font-orbitron">{{ username }}</span>
                <q-icon name="verified" class="text-blue" size="20px" />
              </div>
              <p class="welcome-subtitle">El destino te espera, guerrero.</p>
              <div class="flex gap-sm q-mt-sm">
                <span class="avc-badge hero">
                  <q-icon name="shield" size="12px" />
                  HÉROE
                </span>
                <span class="avc-badge vip">
                  <q-icon name="star" size="12px" />
                  VIP ORO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 col-md-4">
        <div class="row q-col-gutter-sm full-height">
          <div class="col-4">
            <div class="stat-card full-height">
              <div class="stat-label">NIVEL</div>
              <div class="stat-value">{{ stats.level }}</div>
              <div class="stat-sub">{{ stats.xp | 0 }} / {{ stats.xpMax | 0 }} xp</div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card full-height">
              <div class="stat-label">JUGADO</div>
              <div class="stat-value text-gold">{{ stats.playedTime }}</div>
              <div class="stat-sub">{{ stats.playedTimeMinutes }}</div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card full-height">
              <div class="stat-label">RANGO</div>
              <div class="stat-value" style="font-size: 18px;">{{ stats.rank }}</div>
              <div class="stat-sub">{{ stats.rankTier }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress & Path -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- General Progress -->
      <div class="col-12 col-md-8">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">PROGRESO GENERAL</h3>
          <div class="row q-col-gutter-md">
            <!-- Health -->
            <div class="col-6">
              <div class="progress-item">
                <div class="flex justify-between q-mb-xs">
                  <span class="progress-label">SALUD</span>
                  <span class="progress-value">{{ stats.health }}/{{ stats.healthMax }}</span>
                </div>
                <div class="avc-progress">
                  <div class="avc-progress-bar red" :style="{ width: (stats.health / stats.healthMax * 100) + '%' }"></div>
                </div>
              </div>
            </div>
            <!-- Money -->
            <div class="col-6">
              <div class="progress-item">
                <div class="flex justify-between q-mb-xs">
                  <span class="progress-label">DINERO</span>
                  <span class="progress-value text-gold">{{ formatNumber(stats.money) }}</span>
                </div>
                <div class="avc-progress">
                  <div class="avc-progress-bar gold" style="width: 75%"></div>
                </div>
              </div>
            </div>
            <!-- Alignment -->
            <div class="col-6">
              <div class="progress-item">
                <div class="flex justify-between q-mb-xs">
                  <span class="progress-label">ALINEACIÓN</span>
                  <span class="progress-value">{{ stats.alignment }}%</span>
                </div>
                <div class="flex items-center gap-sm">
                  <span class="avc-badge hero" style="font-size: 10px; padding: 2px 8px;">{{ stats.alignment }}%</span>
                  <span class="text-grey-5 text-caption">{{ stats.alignmentPath }}</span>
                </div>
              </div>
            </div>
            <!-- Time -->
            <div class="col-6">
              <div class="progress-item">
                <div class="flex justify-between q-mb-xs">
                  <span class="progress-label">TIEMPO JUGADO</span>
                  <span class="progress-value">20</span>
                </div>
                <div class="flex items-center gap-sm">
                  <span class="font-orbitron text-gold" style="font-size: 14px;">{{ stats.playedTime }}</span>
                  <span class="text-grey-5 text-caption">{{ stats.playedTimeMinutes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Your Path -->
      <div class="col-12 col-md-4">
        <div class="avc-card path-card full-height">
          <h3 class="section-title q-mb-md">TU CAMINO</h3>
          <div class="path-content">
            <div class="path-badge-container">
              <div class="path-badge font-orbitron">
                HÉROE
              </div>
            </div>
            <p class="path-desc text-center q-mt-md">Tu reputación brilla en la oscuridad.</p>
            <button class="avc-btn-outline full-width q-mt-md" style="font-size: 11px;">
              VER MI CAMINO
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission & Event -->
    <div class="row q-col-gutter-lg">
      <!-- Active Mission -->
      <div class="col-12 col-md-6">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">MISIÓN ACTIVA</h3>
          <div class="mission-card" v-if="activeMission">
            <div class="mission-icon">{{ activeMission.icon }}</div>
            <div class="mission-info">
              <div class="mission-title">{{ activeMission.title }}</div>
              <div class="mission-desc">{{ activeMission.description }}</div>
              <div class="q-mt-sm">
                <div class="avc-progress" style="height: 6px;">
                  <div class="avc-progress-bar blue" :style="{ width: (activeMission.progress / activeMission.total * 100) + '%' }"></div>
                </div>
                <div class="flex justify-between q-mt-xs">
                  <span class="text-caption text-grey-6">{{ activeMission.progress }} / {{ activeMission.total }}</span>
                </div>
              </div>
            </div>
            <div class="mission-reward">
              <div class="reward-label">RECOMPENSA</div>
              <div class="reward-value">
                <span class="coin-icon">{{ formatNumber(activeMission.reward) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Event -->
      <div class="col-12 col-md-6">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">PRÓXIMO EVENTO</h3>
          <div class="event-card">
            <div class="event-icon">⚔️</div>
            <div class="event-info">
              <div class="event-title font-orbitron">{{ nextEvent.title }}</div>
              <div class="event-time">Comienza en: {{ nextEvent.timeRemaining }}</div>
              <div class="event-desc">{{ nextEvent.description }}</div>
            </div>
            <button class="avc-btn-outline" style="font-size: 11px; white-space: nowrap;">
              VER EVENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from 'stores/userStore'
import { useGameStore } from 'stores/gameStore'

const userStore = useUserStore()
const gameStore = useGameStore()

const username = computed(() => userStore.user?.username || 'Jugador')
const playerSkin = computed(() => {
  const uuid = userStore.user?.uuid
  if (uuid) return `https://mc-heads.net/body/${uuid}/120`
  return 'https://mc-heads.net/body/steve/120'
})

const stats = computed(() => gameStore.playerStats)
const activeMission = computed(() => gameStore.missions.active[0])
const nextEvent = computed(() => gameStore.nextEvent)

function formatNumber(num) {
  return num?.toLocaleString('es-ES') || '0'
}

onMounted(() => {
  gameStore.fetchPlayerStats()
  gameStore.fetchMissions()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(42, 31, 78, 0.4));
}

.welcome-avatar {
  width: 80px;
  height: 100px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  image-rendering: pixelated;
}

.welcome-title {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 2px;
  font-weight: 600;
  margin: 0 0 4px;
}

.welcome-name {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.welcome-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  margin: 0;
}

.progress-label {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  font-weight: 600;
}

.progress-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.path-card {
  display: flex;
  flex-direction: column;
}

.path-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.path-badge-container {
  position: relative;
}

.path-badge {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: white;
  padding: 16px 40px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 4px;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
}

.path-desc {
  color: var(--text-secondary);
  font-size: 13px;
  font-style: italic;
}

// Event card
.event-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  padding: 16px;
}

.event-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 67, 0.08);
  border-radius: 10px;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.event-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.event-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.gap-lg { gap: 20px; }
.gap-sm { gap: 8px; }
.full-width { width: 100%; }
.full-height { height: 100%; }
.text-gold { color: #d4a843 !important; }
</style>
