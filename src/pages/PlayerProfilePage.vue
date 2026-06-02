<template>
  <q-page class="profile-page q-pa-lg">
    <!-- Profile Header -->
    <div class="avc-card q-mb-lg">
      <div class="profile-header">
        <div class="flex items-center gap-lg">
          <img :src="playerSkin" class="profile-avatar pixel-avatar" />
          <div class="profile-info">
            <div class="flex items-center gap-sm">
              <h2 class="profile-name font-orbitron">{{ username }}</h2>
              <q-icon name="verified" class="text-blue" size="20px" />
            </div>
            <div class="flex gap-sm q-mt-xs">
              <span class="avc-badge vip">
                <q-icon name="star" size="12px" />
                VIP ORO
              </span>
            </div>
            <p class="profile-since q-mt-sm">Miembro desde: Marzo 2023</p>
          </div>
        </div>
        <div class="profile-alignment gt-sm">
          <div class="alignment-label">TU ALINEACIÓN</div>
          <div class="alignment-badge font-orbitron">HÉROE</div>
          <div class="alignment-rep">Reputación: {{ stats.alignment }}%</div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="avc-tabs q-mb-lg">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['avc-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'resumen'" class="row q-col-gutter-lg">
      <!-- Stats -->
      <div class="col-12 col-md-4">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">ESTADÍSTICAS</h3>
          <div class="stats-list">
            <div class="stat-row" v-for="stat in statsList" :key="stat.label">
              <div class="flex items-center gap-sm">
                <span class="stat-icon">{{ stat.icon }}</span>
                <span class="stat-name">{{ stat.label }}</span>
              </div>
              <span class="stat-val font-orbitron">{{ formatNumber(stat.value) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rankings -->
      <div class="col-12 col-md-4">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">RANKING GLOBAL</h3>
          <div class="rankings-grid">
            <div class="ranking-item">
              <div class="rank-number gold font-orbitron">#{{ rankings.level }}</div>
              <div class="rank-label">Nivel</div>
            </div>
            <div class="ranking-item">
              <div class="rank-number gold font-orbitron">#{{ rankings.money }}</div>
              <div class="rank-label">Dinero</div>
            </div>
            <div class="ranking-item">
              <div class="rank-number gold font-orbitron">#{{ rankings.kills }}</div>
              <div class="rank-label">Kills</div>
            </div>
          </div>

          <h3 class="section-title q-mt-lg q-mb-md">EQUIPO ACTUAL</h3>
          <div class="equipment-grid">
            <div class="equip-slot" v-for="(item, key) in equipment" :key="key" :title="item.name">
              <span style="font-size: 20px;">{{ item.icon }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Achievements -->
      <div class="col-12 col-md-4">
        <div class="avc-card">
          <h3 class="section-title q-mb-md">LOGROS RECIENTES</h3>
          <div class="achievements-list">
            <div class="achievement-item" v-for="ach in recentAchievements" :key="ach.name">
              <div class="achievement-icon">{{ ach.icon }}</div>
              <div class="achievement-info">
                <div class="achievement-name">{{ ach.name }}</div>
                <div class="achievement-desc">{{ ach.description }}</div>
              </div>
              <div class="achievement-points text-gold font-orbitron">+{{ ach.points }} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder for other tabs -->
    <div v-else class="avc-card">
      <div class="text-center q-pa-xl">
        <q-icon name="construction" size="48px" class="text-grey-7 q-mb-md" />
        <p class="text-grey-5">Sección en desarrollo...</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from 'stores/userStore'
import { useGameStore } from 'stores/gameStore'

const userStore = useUserStore()
const gameStore = useGameStore()

const activeTab = ref('resumen')

const tabs = [
  { id: 'resumen', label: 'RESUMEN' },
  { id: 'estadisticas', label: 'ESTADÍSTICAS' },
  { id: 'logros', label: 'LOGROS' },
  { id: 'misiones', label: 'MISIONES' },
  { id: 'galeria', label: 'GALERÍA' },
]

const username = computed(() => userStore.user?.username || 'Jugador')
const playerSkin = computed(() => {
  const uuid = userStore.user?.uuid
  if (uuid) return `https://mc-heads.net/body/${uuid}/120`
  return 'https://mc-heads.net/body/steve/120'
})

const stats = computed(() => gameStore.playerStats)
const rankings = computed(() => gameStore.rankings)
const equipment = computed(() => gameStore.equipment)
const recentAchievements = computed(() => gameStore.recentAchievements)

const statsList = computed(() => [
  { icon: '💰', label: 'DINERO', value: gameStore.profileStats.money },
  { icon: '⚔️', label: 'KILLS', value: gameStore.profileStats.kills },
  { icon: '💀', label: 'MUERTES', value: gameStore.profileStats.deaths },
  { icon: '⛏️', label: 'BLOQUES MINADOS', value: gameStore.profileStats.blocksMined },
  { icon: '🐟', label: 'PECES PESCADOS', value: gameStore.profileStats.fishCaught },
  { icon: '✅', label: 'MISIONES COMPLETADAS', value: gameStore.profileStats.missionsCompleted },
])

function formatNumber(num) {
  return num?.toLocaleString('es-ES') || '0'
}

onMounted(() => {
  gameStore.fetchProfileStats()
})
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.profile-avatar {
  width: 100px;
  height: 120px;
  image-rendering: pixelated;
  border: 2px solid var(--border-color);
  border-radius: 12px;
}

.profile-name {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.profile-since {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.alignment-label {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.alignment-badge {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 4px;
  text-align: center;
  box-shadow: 0 0 24px rgba(124, 58, 237, 0.3);
}

.alignment-rep {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  margin: 0;
}

// Stats list
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child { border-bottom: none; padding-bottom: 0; }
}

.stat-icon {
  font-size: 16px;
}

.stat-name {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-val {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

// Rankings
.rankings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  text-align: center;
}

.ranking-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 16px 8px;
}

.rank-number {
  font-size: 28px;
  font-weight: 800;
}

.rank-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  text-transform: capitalize;
}

// Equipment
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

// Achievements
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
}

.achievement-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 67, 0.08);
  border-radius: 10px;
  flex-shrink: 0;
}

.achievement-info { flex: 1; min-width: 0; }

.achievement-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.achievement-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.achievement-points {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.gap-lg { gap: 20px; }
.gap-sm { gap: 8px; }
.text-gold { color: #d4a843 !important; }
</style>
