<template>
  <q-page class="rankings-page q-pa-lg">
    <h1 class="page-title font-orbitron q-mb-lg">RANKINGS</h1>

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

    <div class="avc-card">
      <div class="ranking-list">
        <div class="ranking-row ranking-header">
          <span class="rank-col">#</span>
          <span class="player-col">JUGADOR</span>
          <span class="value-col">{{ activeTab === 'level' ? 'NIVEL' : activeTab === 'money' ? 'DINERO' : 'KILLS' }}</span>
        </div>
        <div
          v-for="(player, index) in mockPlayers"
          :key="index"
          :class="['ranking-row', { 'top-3': index < 3 }]"
        >
          <span :class="['rank-col', 'font-orbitron', index === 0 ? 'text-gold' : index === 1 ? 'text-silver' : index === 2 ? 'text-bronze' : '']">
            {{ index + 1 }}
          </span>
          <span class="player-col">
            <img :src="`https://mc-heads.net/avatar/steve/${24}`" class="pixel-avatar" style="width: 24px; height: 24px; margin-right: 8px;" />
            {{ player.name }}
          </span>
          <span class="value-col font-orbitron text-gold">{{ player.value.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('level')
const tabs = [
  { id: 'level', label: 'NIVEL' },
  { id: 'money', label: 'DINERO' },
  { id: 'kills', label: 'KILLS' },
  { id: 'blocks', label: 'BLOQUES' },
]

const mockPlayers = [
  { name: 'NotchLV', value: 45 },
  { name: 'DragonSlayer', value: 42 },
  { name: 'CraftMaster', value: 38 },
  { name: 'SteveX', value: 35 },
  { name: 'MinerPro', value: 31 },
  { name: 'BuildKing', value: 28 },
  { name: 'PvPLord', value: 26 },
  { name: 'FishermanX', value: 24 },
  { name: 'ExplorerMax', value: 22 },
  { name: 'RedstoneGod', value: 20 },
]
</script>

<style lang="scss" scoped>
.rankings-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
}

.ranking-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &.ranking-header {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 1px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  &.top-3 {
    background: rgba(212, 168, 67, 0.03);
  }
}

.rank-col {
  width: 50px;
  font-weight: 700;
  font-size: 16px;
}

.player-col {
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: var(--text-primary);
}

.value-col {
  width: 120px;
  text-align: right;
  font-weight: 700;
}

.text-gold { color: #d4a843 !important; }
.text-silver { color: #94a3b8 !important; }
.text-bronze { color: #d97706 !important; }
</style>
