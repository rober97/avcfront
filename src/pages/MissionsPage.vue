<template>
  <q-page class="missions-page q-pa-lg">
    <!-- Header -->
    <div class="flex items-center gap-sm q-mb-lg">
      <q-btn flat round dense icon="arrow_back" class="text-grey-4" @click="$router.back()" />
      <h1 class="page-title font-orbitron">MISIONES</h1>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Main content -->
      <div class="col-12 col-md-8">
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

        <!-- Mission List -->
        <div class="missions-list">
          <div
            v-for="mission in currentMissions"
            :key="mission.id"
            class="mission-card"
          >
            <div class="mission-icon">{{ mission.icon }}</div>
            <div class="mission-info">
              <div class="mission-title">{{ mission.title }}</div>
              <div class="mission-desc">{{ mission.description }}</div>
              <div class="q-mt-sm" v-if="activeTab !== 'completed'">
                <div class="avc-progress" style="height: 6px;">
                  <div
                    class="avc-progress-bar blue"
                    :style="{ width: (mission.progress / mission.total * 100) + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between q-mt-xs">
                  <span class="text-caption text-grey-6">
                    {{ mission.progress }} / {{ mission.total }}
                  </span>
                </div>
              </div>
              <div v-else class="q-mt-xs">
                <span class="avc-badge" style="background: #22c55e; color: white; font-size: 10px;">
                  <q-icon name="check" size="12px" />
                  COMPLETADA
                </span>
              </div>
            </div>
            <div class="mission-reward">
              <div class="reward-label">RECOMPENSA</div>
              <div class="reward-value">
                <span class="coin-icon">{{ formatNumber(mission.reward) }}</span>
              </div>
              <div class="reward-items q-mt-sm">
                <div class="reward-item-icons">
                  <span class="reward-mini-icon">⚔️</span>
                  <span class="reward-mini-icon">🛡️</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentMissions.length === 0" class="empty-state avc-card">
            <q-icon name="assignment" size="48px" class="text-grey-7 q-mb-md" />
            <p class="text-grey-5">No hay misiones en esta categoría.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-12 col-md-4">
        <!-- Daily Missions -->
        <div class="avc-card q-mb-lg">
          <div class="flex justify-between items-center q-mb-md">
            <h3 class="section-title">MISIONES DIARIAS</h3>
            <span class="daily-timer">
              <q-icon name="schedule" size="14px" class="text-grey-6 q-mr-xs" />
              <span class="text-grey-5 text-caption">23:45m restante</span>
            </span>
          </div>

          <div class="daily-list">
            <div
              v-for="daily in dailyMissions"
              :key="daily.id"
              :class="['daily-item', { completed: daily.completed }]"
            >
              <div class="daily-check">
                <q-icon
                  :name="daily.completed ? 'check_circle' : 'radio_button_unchecked'"
                  :class="daily.completed ? 'text-green' : 'text-grey-7'"
                  size="20px"
                />
              </div>
              <div class="daily-info">
                <div class="daily-name" :class="{ 'text-grey-6': daily.completed }">
                  {{ daily.title }}
                </div>
                <div class="daily-progress text-caption text-grey-6" v-if="!daily.completed">
                  {{ daily.progress }} / {{ daily.total }}
                </div>
              </div>
              <div class="daily-reward">
                <button
                  v-if="daily.completed"
                  class="avc-btn"
                  style="font-size: 10px; padding: 4px 12px;"
                >
                  RECLAMAR
                </button>
                <span v-else class="coin-icon" style="font-size: 13px;">{{ daily.reward }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Reward -->
        <div class="avc-card weekly-card">
          <h3 class="section-title q-mb-md">RECOMPENSA SEMANAL</h3>
          <p class="text-grey-5 text-caption">Completa 5 misiones diarias</p>
          <div class="weekly-progress q-mt-md">
            <div class="avc-progress" style="height: 8px;">
              <div class="avc-progress-bar gold" style="width: 60%"></div>
            </div>
            <div class="text-right q-mt-xs">
              <span class="text-caption text-grey-6">3 / 5</span>
            </div>
          </div>
          <div class="weekly-reward-box q-mt-md">
            <div class="flex items-center justify-center gap-sm">
              <span style="font-size: 24px;">🏆</span>
              <span class="text-gold font-orbitron" style="font-size: 18px;">COFRE ÉPICO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from 'stores/gameStore'

const gameStore = useGameStore()

const activeTab = ref('active')

const tabs = [
  { id: 'active', label: 'ACTIVAS' },
  { id: 'available', label: 'DISPONIBLES' },
  { id: 'completed', label: 'COMPLETADAS' },
  { id: 'daily', label: 'DIARIAS' },
]

const currentMissions = computed(() => {
  switch (activeTab.value) {
    case 'active': return gameStore.missions.active
    case 'available': return gameStore.missions.available
    case 'completed': return gameStore.missions.completed
    default: return gameStore.missions.active
  }
})

const dailyMissions = computed(() => gameStore.missions.daily)

function formatNumber(num) {
  return num?.toLocaleString('es-ES') || '0'
}

onMounted(() => {
  gameStore.fetchMissions()
})
</script>

<style lang="scss" scoped>
.missions-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.missions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  margin: 0;
}

.reward-item-icons {
  display: flex;
  gap: 4px;
}

.reward-mini-icon {
  font-size: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color-light);
  border-radius: 6px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

// Daily missions
.daily-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.daily-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  transition: all 0.2s;

  &.completed {
    opacity: 0.8;
    border-color: rgba(34, 197, 94, 0.2);
  }
}

.daily-check {
  flex-shrink: 0;
}

.daily-info {
  flex: 1;
  min-width: 0;
}

.daily-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.daily-progress {
  margin-top: 2px;
}

.daily-reward {
  flex-shrink: 0;
}

.daily-timer {
  display: flex;
  align-items: center;
}

// Weekly
.weekly-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(42, 31, 78, 0.3));
}

.weekly-reward-box {
  background: rgba(212, 168, 67, 0.08);
  border: 1px solid rgba(212, 168, 67, 0.2);
  border-radius: 10px;
  padding: 16px;
}

.gap-sm { gap: 8px; }
.text-gold { color: #d4a843 !important; }
</style>
