<template>
  <q-page class="landing-page">
    <!-- Navbar -->
    <header class="landing-nav">
      <div class="nav-inner">
        <img src="/avc-logo.svg" alt="AVC" class="nav-logo" />
        <nav class="nav-links gt-sm">
          <a href="#inicio" class="nav-link active">INICIO</a>
          <a href="#mapa" class="nav-link">MAPA</a>
          <a href="#rankings" class="nav-link">RANKINGS</a>
          <a href="#misiones" class="nav-link">MISIONES</a>
          <a href="#tienda" class="nav-link">TIENDA</a>
          <a href="#comunidad" class="nav-link">COMUNIDAD</a>
        </nav>
        <button class="avc-btn connect-btn" @click="goToLogin">CONECTAR</button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section" id="inicio">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-subtitle font-orbitron">TU AVENTURA. TU LEYENDA.</p>
        <h1 class="hero-title font-orbitron">
          TU <span class="text-gold-gradient">DESTINO</span>
        </h1>
        <p class="hero-desc">
          Únete a miles de jugadores en AventuraCraftLatin,
          donde cada decisión define tu camino.
        </p>
        <div class="hero-buttons">
          <button class="avc-btn" @click="goToLogin">
            <q-icon name="sports_esports" class="q-mr-sm" />
            CONECTAR CON MINECRAFT
          </button>
          <button class="avc-btn-outline" @click="scrollTo('modos')">
            EXPLORAR EL MUNDO
          </button>
        </div>
      </div>

      <!-- Minecraft character art on the right -->
      <div class="hero-art gt-sm">
        <div class="hero-particles"></div>
      </div>
    </section>

    <!-- Game Modes -->
    <section class="modes-section" id="modos">
      <div class="modes-grid">
        <div class="mode-card">
          <div class="mode-icon">⚔️</div>
          <h3 class="mode-title font-orbitron">SURVIVAL TOWNY</h3>
          <p class="mode-desc">Construye, protege, conquista.</p>
        </div>
        <div class="mode-card">
          <div class="mode-icon">🐉</div>
          <h3 class="mode-title font-orbitron">RPG ÉPICO</h3>
          <p class="mode-desc">Elige tu camino: Héroe o Villano.</p>
        </div>
        <div class="mode-card">
          <div class="mode-icon">🏰</div>
          <h3 class="mode-title font-orbitron">COMUNIDAD ACTIVA</h3>
          <p class="mode-desc">Eventos, misiones y mucho más.</p>
        </div>
      </div>
    </section>

    <!-- Rankings -->
    <section class="rankings-section" id="rankings">
      <div class="section-head">
        <p class="header-kicker font-orbitron">SALÓN DE LA FAMA</p>
        <h2 class="section-title font-orbitron">
          <span class="text-gold-gradient">RANKINGS</span>
        </h2>
        <p class="section-sub">Los mejores aventureros de AventuraCraftLatin</p>
      </div>
      <RankingsBoard />
    </section>

    <!-- Server Stats Bar -->
    <section class="stats-bar">
      <div class="stats-bar-inner">
        <div class="server-info">
          <div class="server-ip-box">
            <q-icon name="dns" class="text-gold q-mr-sm" />
            <span class="font-orbitron text-gold server-ip">PLAY.AVCLATIN.COM</span>
          </div>
          <div class="server-players">
            <span class="font-orbitron player-count">19500</span>
          </div>
        </div>
        <div class="server-online">
          <span class="online-dot"></span>
          <span class="online-text">EN LÍNEA</span>
          <span class="font-orbitron online-count">482</span>
          <span class="online-label">JUGADORES</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p class="text-grey-7">&copy; 2024 AventuraCraftLatin. Todos los derechos reservados.</p>
    </footer>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RankingsBoard from 'components/RankingsBoard.vue'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.landing-page {
  background: var(--bg-primary);
  min-height: 100vh;
}

// Navbar
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 9, 20, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(212, 168, 67, 0.1);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  height: 36px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: color 0.2s;

  &:hover, &.active {
    color: #f1f1f1;
  }
}

.connect-btn {
  font-size: 12px;
  padding: 8px 20px;
  border-radius: 20px;
}

// Hero
.hero-section {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 60px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  background: url('/hero-bg.jpg') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(10, 9, 20, 0.95) 0%, rgba(10, 9, 20, 0.7) 50%, rgba(10, 9, 20, 0.4) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.hero-subtitle {
  font-size: 16px;
  color: #d1d5db;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.hero-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  line-height: 1;
  margin: 0 0 24px;
  color: #f1f1f1;
}

.text-gold-gradient {
  background: linear-gradient(135deg, #d4a843, #f5d98a, #d4a843);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 16px;
  color: #9ca3af;
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-art {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 500px;
  height: 500px;
  z-index: 2;
}

// Game Modes
.modes-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.mode-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(212, 168, 67, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(212, 168, 67, 0.1);
  }
}

.mode-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.mode-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: 1px;
}

.mode-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

// Rankings
.rankings-section {
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  scroll-margin-top: 80px;
}

.section-head {
  text-align: center;
  margin-bottom: 28px;
}

.header-kicker {
  font-size: 12px;
  letter-spacing: 4px;
  color: var(--gold);
  margin: 0 0 4px;
  opacity: 0.8;
}

.section-title {
  font-size: clamp(34px, 6vw, 52px);
  font-weight: 900;
  letter-spacing: 4px;
  margin: 0;
  line-height: 1;
}

.section-sub {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 8px 0 0;
}

// Stats Bar
.stats-bar {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.stats-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.server-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.server-ip-box {
  display: flex;
  align-items: center;
  background: rgba(212, 168, 67, 0.08);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(212, 168, 67, 0.2);
}

.server-ip {
  font-size: 14px;
  letter-spacing: 1px;
}

.player-count {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.server-online {
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.online-text {
  font-size: 12px;
  color: #22c55e;
  font-weight: 600;
  letter-spacing: 1px;
}

.online-count {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.online-label {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

// Footer
.landing-footer {
  text-align: center;
  padding: 32px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
