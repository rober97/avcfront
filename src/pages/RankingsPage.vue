<template>
  <q-page class="rankings-page">
    <LandingNav />
    <div class="bg-glow"></div>
    <div class="rankings-header">
      <p class="header-kicker font-orbitron">SALÓN DE LA FAMA</p>
      <h1 class="page-title font-orbitron">
        <span class="text-gold-gradient">RANKINGS</span>
      </h1>
      <p class="header-sub">Los mejores aventureros de AventuraCraftLatin</p>
    </div>
    <RankingsBoard />
  </q-page>
</template>

<script setup>
import RankingsBoard from 'components/RankingsBoard.vue'
import LandingNav from 'components/LandingNav.vue'
</script>

<style lang="scss" scoped>
.rankings-page {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  padding: 96px 20px 64px;
}

.bg-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(circle, rgba(212, 168, 67, 0.18) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.rankings-header {
  position: relative;
  z-index: 1;
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

.page-title {
  font-size: clamp(40px, 7vw, 64px);
  font-weight: 900;
  letter-spacing: 4px;
  margin: 0;
  line-height: 1;
}

.text-gold-gradient {
  background: linear-gradient(135deg, #d4a843, #f5d98a, #d4a843);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s linear infinite;
}

@keyframes shine {
  to { background-position: 200% center; }
}

.header-sub {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 8px 0 0;
}
</style>
