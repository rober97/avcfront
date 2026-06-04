<template>
  <q-page class="profile-page q-pa-lg">
    <!-- ===== HERO ===== -->
    <div class="profile-hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-left">
          <div class="avatar-frame" :class="{ 'is-online': isOnline }">
            <img :src="playerSkin" class="profile-avatar" :alt="username" />
            <span class="status-pill" :class="isOnline ? 'on' : 'off'">
              <span class="dot"></span>{{ isOnline ? 'EN LÍNEA' : 'DESCONECTADO' }}
            </span>
          </div>

          <div class="profile-info">
            <div class="name-row">
              <h2 class="profile-name font-orbitron">{{ username }}</h2>
              <q-icon v-if="linked" name="verified" class="text-blue" size="22px">
                <q-tooltip>Cuenta de Minecraft vinculada</q-tooltip>
              </q-icon>
            </div>

            <div class="badge-row">
              <span class="rank-badge" v-html="rankHtml"></span>
              <span v-if="stats.gameMode" class="avc-badge mode">
                <q-icon name="sports_esports" size="13px" />
                {{ gameModeLabel }}
              </span>
            </div>

            <!-- Barra de XP -->
            <div class="xp-wrap">
              <div class="xp-top">
                <span class="xp-level font-orbitron">NIVEL {{ stats.xpLevel || 0 }}</span>
                <span class="xp-total">{{ fmt(stats.totalExpPoints) }} XP total</span>
              </div>
              <div class="xp-bar">
                <div class="xp-fill" :style="{ width: xpPct + '%' }"></div>
              </div>
            </div>

            <p class="profile-since">
              <q-icon name="event" size="13px" class="q-mr-xs" />
              Miembro desde {{ memberSince }}
              <span v-if="lastSeenText" class="dot-sep">•</span>
              <span v-if="lastSeenText">{{ lastSeenText }}</span>
            </p>
          </div>
        </div>

        <div class="hero-right">
          <div class="alignment-card">
            <div class="alignment-label">TU ALINEACIÓN</div>
            <div class="alignment-badge font-orbitron">{{ alignment }}</div>
            <div class="kdr-mini">
              <span class="kdr-val font-orbitron">{{ kdr }}</span>
              <span class="kdr-label">K/D RATIO</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== HIGHLIGHTS ===== -->
    <div class="highlights">
      <div class="highlight-card hl-kills">
        <div class="hl-icon">⚔️</div>
        <div class="hl-value font-orbitron">{{ fmt(p.kills) }}</div>
        <div class="hl-label">Kills</div>
      </div>
      <div class="highlight-card hl-money">
        <div class="hl-icon">💰</div>
        <div class="hl-value font-orbitron">${{ fmt(p.money) }}</div>
        <div class="hl-label">Dinero</div>
      </div>
      <div class="highlight-card hl-mobs">
        <div class="hl-icon">👹</div>
        <div class="hl-value font-orbitron">{{ fmt(p.mobsKilled) }}</div>
        <div class="hl-label">Mobs cazados</div>
      </div>
      <div class="highlight-card hl-blocks">
        <div class="hl-icon">⛏️</div>
        <div class="hl-value font-orbitron">{{ fmt(p.blocksBroken) }}</div>
        <div class="hl-label">Bloques minados</div>
      </div>
    </div>

    <!-- ===== Tabs ===== -->
    <div class="avc-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['avc-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ===== RESUMEN ===== -->
    <div v-if="activeTab === 'resumen'" class="row q-col-gutter-lg">
      <!-- Estado en vivo -->
      <div class="col-12 col-md-6">
        <div class="avc-card stat-card">
          <h3 class="section-title">❤️ ESTADO EN VIVO</h3>

          <div class="vital">
            <div class="vital-head">
              <span>Salud</span>
              <span class="font-orbitron">{{ Math.round(stats.health || 0) }} / {{ stats.maxHealth || 20 }}</span>
            </div>
            <div class="vital-bar"><div class="vital-fill health" :style="{ width: healthPct + '%' }"></div></div>
          </div>

          <div class="vital">
            <div class="vital-head">
              <span>Comida</span>
              <span class="font-orbitron">{{ Math.round(stats.foodLevel || 0) }} / 20</span>
            </div>
            <div class="vital-bar"><div class="vital-fill food" :style="{ width: foodPct + '%' }"></div></div>
          </div>

          <div class="state-row">
            <div class="state-chip">
              <span class="chip-label">Saturación</span>
              <span class="chip-val font-orbitron">{{ Math.round(stats.saturation || 0) }}</span>
            </div>
            <div class="state-chip">
              <span class="chip-label">Inventario</span>
              <span class="chip-val font-orbitron">{{ stats.inventoryUsed || 0 }}/36</span>
            </div>
            <div class="state-chip">
              <span class="chip-label">Modo</span>
              <span class="chip-val font-orbitron">{{ gameModeLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="col-12 col-md-6">
        <div class="avc-card stat-card">
          <h3 class="section-title">📍 ÚLTIMA UBICACIÓN</h3>
          <div class="loc-world">
            <q-icon name="public" size="18px" class="text-gold" />
            <span>{{ stats.lastWorld || 'Desconocido' }}</span>
          </div>
          <div class="coords">
            <div class="coord"><span class="axis x">X</span><span class="font-orbitron">{{ round1(stats.lastX) }}</span></div>
            <div class="coord"><span class="axis y">Y</span><span class="font-orbitron">{{ round1(stats.lastY) }}</span></div>
            <div class="coord"><span class="axis z">Z</span><span class="font-orbitron">{{ round1(stats.lastZ) }}</span></div>
          </div>
        </div>
      </div>

      <!-- Combate -->
      <div class="col-12 col-md-6">
        <div class="avc-card stat-card">
          <h3 class="section-title">⚔️ COMBATE</h3>
          <div class="stats-list">
            <div class="stat-row" v-for="s in combatStats" :key="s.label">
              <span class="stat-name">{{ s.label }}</span>
              <span class="stat-val font-orbitron">{{ s.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mundo -->
      <div class="col-12 col-md-6">
        <div class="avc-card stat-card">
          <h3 class="section-title">🌍 MUNDO</h3>
          <div class="stats-list">
            <div class="stat-row" v-for="s in worldStats" :key="s.label">
              <span class="stat-name">{{ s.label }}</span>
              <span class="stat-val font-orbitron">{{ s.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== ESTADÍSTICAS (todo) ===== -->
    <div v-else-if="activeTab === 'estadisticas'" class="avc-card">
      <div v-if="loading" class="state-box">
        <q-spinner-gears size="42px" color="amber" />
        <p class="q-mt-md text-grey-5">Cargando estadísticas...</p>
      </div>
      <div v-else-if="notFound" class="state-box">
        <q-icon name="person_off" size="42px" class="text-grey-7 q-mb-sm" />
        <p class="text-grey-5">No encontramos estadísticas para esta cuenta.</p>
        <p class="text-grey-7" style="font-size:12px">Juega en el servidor para empezar a registrar tus datos.</p>
      </div>
      <div v-else class="all-stats-grid">
        <div class="mini-stat" v-for="s in allStats" :key="s.label">
          <div class="mini-icon">{{ s.icon }}</div>
          <div>
            <div class="mini-value font-orbitron">{{ s.value }}</div>
            <div class="mini-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MISIONES ===== -->
    <div v-else class="avc-card">
      <div class="state-box">
        <q-icon name="construction" size="42px" class="text-grey-7 q-mb-md" />
        <p class="text-grey-5">Sección en desarrollo...</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from 'stores/userStore'
import { useGlobal } from 'stores/global'

const userStore = useUserStore()
const globalStore = useGlobal()

const activeTab = ref('resumen')
const loading = ref(true)
const notFound = ref(false)
const stats = ref({})

const tabs = [
  { id: 'resumen', label: 'RESUMEN' },
  { id: 'estadisticas', label: 'ESTADÍSTICAS' },
  { id: 'misiones', label: 'MISIONES' },
]

// ---- Datos de usuario ----
const username = computed(() => stats.value.playerName || userStore.user?.username || 'Jugador')
const mcUuid = computed(() => userStore.user?.minecraftUUID || userStore.user?.uuid || null)
const linked = computed(() => !!mcUuid.value)
const isOnline = computed(() => !!stats.value.online)

const playerSkin = computed(() => {
  const id = mcUuid.value || stats.value.uuid || stats.value.playerName
  if (id) return `https://mc-heads.net/body/${id}/140`
  return 'https://mc-heads.net/body/steve/140'
})

const alignment = computed(() =>
  (userStore.user?.alignment || stats.value.rank || 'HÉROE').toUpperCase()
)

// ---- Rango con colores de Minecraft (&-codes) ----
const MC_COLORS = {
  '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
  '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
  '8': '#555555', '9': '#5555FF', a: '#55FF55', b: '#55FFFF',
  c: '#FF5555', d: '#FF55FF', e: '#FFFF55', f: '#FFFFFF',
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}
function parseMcColors(text) {
  if (!text) return ''
  const parts = text.split(/(?:&|§)([0-9a-fk-or])/i)
  let html = ''
  let color = '#e8e8ec'
  let bold = false
  // parts: [text, code, text, code, ...]
  html += `<span style="color:${color}">${escapeHtml(parts[0])}</span>`
  for (let i = 1; i < parts.length; i += 2) {
    const code = (parts[i] || '').toLowerCase()
    const seg = parts[i + 1] || ''
    if (MC_COLORS[code]) { color = MC_COLORS[code]; bold = false }
    else if (code === 'l') bold = true
    else if (code === 'r') { color = '#e8e8ec'; bold = false }
    if (seg) {
      html += `<span style="color:${color};${bold ? 'font-weight:800;' : ''}">${escapeHtml(seg)}</span>`
    }
  }
  return html
}
const rankHtml = computed(() => {
  if (stats.value.rankDisplay) return parseMcColors(stats.value.rankDisplay)
  const r = stats.value.rank || userStore.user?.rango || 'Aventurero'
  return `<span style="color:var(--gold-light);font-weight:700">${escapeHtml(r.toUpperCase())}</span>`
})

const gameModeLabel = computed(() => {
  const map = { SURVIVAL: 'Survival', CREATIVE: 'Creativo', ADVENTURE: 'Aventura', SPECTATOR: 'Espectador' }
  return map[stats.value.gameMode] || stats.value.gameMode || '—'
})

// ---- Stats numéricas ----
const p = computed(() => ({
  kills: stats.value.kills || 0,
  deaths: stats.value.deaths || 0,
  mobsKilled: stats.value.mobsKilled || 0,
  money: stats.value.money || 0,
  blocksBroken: stats.value.blocksBroken || 0,
  blocksPlaced: stats.value.blocksPlaced || 0,
  timePlayed: stats.value.timePlayed || 0,
  distanceWalked: stats.value.distanceWalked || 0,
  itemsCrafted: stats.value.itemsCrafted || 0,
}))

const kdr = computed(() => {
  if (stats.value.kdr) return Number(stats.value.kdr).toFixed(2)
  const d = p.value.deaths || 1
  return (p.value.kills / d).toFixed(2)
})

const xpPct = computed(() => Math.min(100, Math.round((Number(stats.value.xpProgress) || 0) * 100)))
const healthPct = computed(() => {
  const max = stats.value.maxHealth || 20
  return Math.min(100, Math.round(((stats.value.health || 0) / max) * 100))
})
const foodPct = computed(() => Math.min(100, Math.round(((stats.value.foodLevel || 0) / 20) * 100)))

const combatStats = computed(() => [
  { label: 'Kills', value: fmt(p.value.kills) },
  { label: 'Muertes', value: fmt(p.value.deaths) },
  { label: 'K/D Ratio', value: kdr.value },
  { label: 'Mobs cazados', value: fmt(p.value.mobsKilled) },
])

const worldStats = computed(() => [
  { label: 'Bloques minados', value: fmt(p.value.blocksBroken) },
  { label: 'Bloques colocados', value: fmt(p.value.blocksPlaced) },
  { label: 'Distancia recorrida', value: fmtDistance(p.value.distanceWalked) },
  { label: 'Tiempo jugado', value: fmtTime(p.value.timePlayed) },
])

const allStats = computed(() => [
  { icon: '⚔️', label: 'Kills', value: fmt(p.value.kills) },
  { icon: '💀', label: 'Muertes', value: fmt(p.value.deaths) },
  { icon: '🎯', label: 'K/D Ratio', value: kdr.value },
  { icon: '👹', label: 'Mobs cazados', value: fmt(p.value.mobsKilled) },
  { icon: '💰', label: 'Dinero', value: '$' + fmt(p.value.money) },
  { icon: '⛏️', label: 'Bloques minados', value: fmt(p.value.blocksBroken) },
  { icon: '🧱', label: 'Bloques colocados', value: fmt(p.value.blocksPlaced) },
  { icon: '🛠️', label: 'Ítems crafteados', value: fmt(p.value.itemsCrafted) },
  { icon: '👣', label: 'Distancia', value: fmtDistance(p.value.distanceWalked) },
  { icon: '⏱️', label: 'Tiempo jugado', value: fmtTime(p.value.timePlayed) },
  { icon: '⭐', label: 'Nivel XP', value: fmt(stats.value.xpLevel) },
  { icon: '✨', label: 'XP total', value: fmt(stats.value.totalExpPoints) },
])

// ---- Fechas ----
const memberSince = computed(() => fmtDate(stats.value.firstJoin) || '—')
const lastSeenText = computed(() => {
  if (isOnline.value) return 'Jugando ahora'
  if (!stats.value.lastSeen) return ''
  return 'Visto ' + fmtRelative(stats.value.lastSeen)
})

// ---- Helpers ----
function fmt(v) {
  return Math.round(Number(v) || 0).toLocaleString('es-ES')
}
function round1(v) {
  return (Number(v) || 0).toFixed(1)
}
function fmtDistance(v) {
  v = Number(v) || 0
  if (v >= 1000) return (v / 1000).toFixed(1) + ' km'
  return Math.round(v).toLocaleString('es-ES') + ' bloques'
}
function fmtTime(v) {
  // timePlayed en segundos (ajusta el divisor si tu plugin usa otra unidad)
  const totalMin = Math.floor((Number(v) || 0) / 60)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
function fmtDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts))
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}
function fmtRelative(ts) {
  const diff = Date.now() - Number(ts)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h}h`
  const days = Math.floor(h / 24)
  return `hace ${days} día${days > 1 ? 's' : ''}`
}

async function fetchStats() {
  const id = mcUuid.value || userStore.user?.username
  if (!id) {
    loading.value = false
    notFound.value = true
    return
  }
  loading.value = true
  notFound.value = false
  try {
    const { data } = await axios.get(`${globalStore.url_api}/player-stats/${encodeURIComponent(id)}`)
    if (data?.player) stats.value = data.player
    else notFound.value = true
  } catch (e) {
    if (e?.response?.status === 404) notFound.value = true
    else console.error('Error cargando stats del jugador', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== HERO ===== */
.profile-hero {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(212, 168, 67, 0.18), transparent 45%),
    radial-gradient(circle at 85% 30%, rgba(124, 58, 237, 0.20), transparent 50%),
    linear-gradient(135deg, #16152e, #0f0e1a);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  padding: 28px 32px;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-frame {
  position: relative;
  padding: 4px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  box-shadow: 0 0 30px rgba(212, 168, 67, 0.35);

  &.is-online {
    background: linear-gradient(135deg, #22c55e, #86efac);
    box-shadow: 0 0 34px rgba(34, 197, 94, 0.4);
  }
}

.profile-avatar {
  width: 90px;
  height: 110px;
  display: block;
  image-rendering: pixelated;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.25);
}

.status-pill {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 10px;
  white-space: nowrap;
  border: 1px solid var(--bg-primary);

  .dot { width: 6px; height: 6px; border-radius: 50%; }
  &.on { background: #14532d; color: #86efac; .dot { background: #22c55e; } }
  &.off { background: #334155; color: #cbd5e1; .dot { background: #94a3b8; } }
}

.name-row { display: flex; align-items: center; gap: 8px; }

.profile-name {
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 1px;
}

.badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
  align-items: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-color);
  letter-spacing: 0.5px;
}

.avc-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;

  &.mode {
    background: rgba(59, 130, 246, 0.12);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
}

/* XP */
.xp-wrap { margin-top: 14px; max-width: 340px; }
.xp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.xp-level { font-size: 12px; font-weight: 800; color: var(--accent-green); letter-spacing: 1px; }
.xp-total { font-size: 11px; color: var(--text-muted); }
.xp-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
}
.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #4ade80);
  border-radius: 6px;
  transition: width 0.6s ease;
}

.profile-since {
  font-size: 12px;
  color: var(--text-muted);
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.dot-sep { opacity: 0.5; }

.hero-right { display: flex; }

.alignment-card {
  text-align: center;
  background: rgba(10, 9, 20, 0.45);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px 24px;
}
.alignment-label { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; font-weight: 700; margin-bottom: 8px; }
.alignment-badge {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: white;
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 3px;
  box-shadow: 0 0 24px rgba(124, 58, 237, 0.4);
}
.kdr-mini { margin-top: 12px; display: flex; flex-direction: column; }
.kdr-val { font-size: 22px; font-weight: 900; color: var(--gold); }
.kdr-label { font-size: 10px; color: var(--text-muted); letter-spacing: 1px; }

/* ===== HIGHLIGHTS ===== */
.highlights {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.highlight-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
  &:hover { transform: translateY(-3px); border-color: rgba(212, 168, 67, 0.4); }
}
.hl-icon { font-size: 24px; margin-bottom: 10px; }
.hl-value { font-size: 26px; font-weight: 900; color: var(--text-primary); }
.hl-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.hl-kills::after, .hl-money::after, .hl-mobs::after, .hl-blocks::after {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 120px; height: 120px; border-radius: 50%; opacity: 0.12;
}
.hl-kills::after { background: var(--accent-red); }
.hl-money::after { background: var(--gold); }
.hl-mobs::after { background: var(--accent-purple); }
.hl-blocks::after { background: var(--accent-blue); }

/* ===== Tabs ===== */
.avc-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.avc-tab {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: var(--text-primary); }
  &.active {
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    border-color: var(--gold);
    color: #0a0914;
  }
}

/* ===== Stat cards ===== */
.stat-card { height: 100%; }
.section-title { font-size: 13px; font-weight: 800; color: var(--text-secondary); letter-spacing: 1.5px; margin: 0 0 16px; }
.stats-list { display: flex; flex-direction: column; }
.stat-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  &:last-child { border-bottom: none; }
}
.stat-name { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.stat-val { font-size: 17px; font-weight: 800; color: var(--text-primary); }

/* ===== Vitales (salud/comida) ===== */
.vital { margin-bottom: 18px; }
.vital-head {
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;
}
.vital-bar { height: 10px; background: rgba(255, 255, 255, 0.06); border-radius: 6px; overflow: hidden; }
.vital-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; }
.vital-fill.health { background: linear-gradient(90deg, #b91c1c, #ef4444); }
.vital-fill.food { background: linear-gradient(90deg, #b45309, #f59e0b); }

.state-row { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
.state-chip {
  flex: 1;
  min-width: 90px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
.chip-label { display: block; font-size: 10px; color: var(--text-muted); letter-spacing: 0.5px; }
.chip-val { display: block; font-size: 16px; font-weight: 800; color: var(--text-primary); margin-top: 2px; }

/* ===== Ubicación ===== */
.loc-world {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: var(--text-primary);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 14px;
}
.coords { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.coord {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 14px 8px;
  font-size: 18px;
}
.axis {
  font-size: 11px; font-weight: 800; letter-spacing: 1px;
  width: 22px; height: 22px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
}
.axis.x { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
.axis.y { background: rgba(34, 197, 94, 0.15); color: #86efac; }
.axis.z { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }

/* ===== All stats grid ===== */
.all-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
.mini-stat {
  display: flex; align-items: center; gap: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color-light);
  border-radius: 12px; padding: 16px;
}
.mini-icon {
  font-size: 22px; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(212, 168, 67, 0.08); border-radius: 10px; flex-shrink: 0;
}
.mini-value { font-size: 18px; font-weight: 800; color: var(--text-primary); }
.mini-label { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

/* ===== States ===== */
.state-box { display: flex; flex-direction: column; align-items: center; padding: 56px 20px; text-align: center; }
.text-gold { color: var(--gold) !important; }
.text-blue { color: var(--accent-blue) !important; }

/* ===== Responsive ===== */
@media (max-width: 900px) { .highlights { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) {
  .hero-content { padding: 20px; }
  .profile-name { font-size: 24px; }
  .hero-right, .alignment-card, .xp-wrap { width: 100%; max-width: none; }
}
</style>
