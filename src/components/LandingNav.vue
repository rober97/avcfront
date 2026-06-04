<template>
  <header class="landing-nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo-link">
        <img src="/avc-logo.svg" alt="AVC" class="nav-logo" />
      </router-link>
      <nav class="nav-links gt-sm">
        <router-link to="/" class="nav-link" exact-active-class="active">INICIO</router-link>
        <router-link to="/mapa" class="nav-link" active-class="active">MAPA</router-link>
        <router-link to="/rankings" class="nav-link" active-class="active">RANKINGS</router-link>
        <router-link to="/misiones" class="nav-link" active-class="active">MISIONES</router-link>
        <a href="https://shop.avclatin.com/" class="nav-link" target="_blank" rel="noopener">TIENDA</a>
        <router-link to="/comunidad" class="nav-link" active-class="active">COMUNIDAD</router-link>
      </nav>
      <button class="avc-btn connect-btn" @click="$router.push('/login')">CONECTAR</button>
    </div>
  </header>
</template>

<script setup>
</script>

<style lang="scss" scoped>
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

.nav-logo-link {
  display: flex;
  align-items: center;
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
</style>
