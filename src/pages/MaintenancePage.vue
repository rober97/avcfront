<template>
  <q-page class="maintenance-page">
    <!-- Animated background layers -->
    <div class="bg-grid"></div>
    <div class="bg-orb orb-gold"></div>
    <div class="bg-orb orb-purple"></div>
    <div class="bg-scanline"></div>

    <div class="maintenance-card">
      <div class="card-glow"></div>

      <div class="logo-wrap">
        <img src="/avc-logo.svg" alt="AVC" style="height: 52px;" />
      </div>

      <div class="gear-icon">
        <q-icon name="construction" size="56px" />
      </div>

      <span class="kicker font-orbitron">PRÓXIMAMENTE</span>
      <h1 class="title font-orbitron">ESTAMOS<br /><span class="title-gold">TRABAJANDO EN ELLO</span></h1>
      <p class="subtitle">
        El inicio de sesión y el registro están temporalmente deshabilitados
        mientras preparamos algo grande. ¡Vuelve pronto!
      </p>

      <q-btn flat no-caps class="back-btn" @click="$router.push('/')">
        <q-icon name="arrow_back" size="18px" class="q-mr-sm" />
        <span class="font-orbitron" style="letter-spacing: 1px;">VOLVER AL INICIO</span>
      </q-btn>

      <div class="divider-or"><span>mientras tanto, conéctate al servidor</span></div>

      <div class="server-cards">
        <div class="server-card" @click="copyIP">
          <q-icon name="dns" class="text-gold" size="20px" />
          <div class="server-card-info">
            <div class="text-caption text-grey-5">IP del Servidor</div>
            <div class="text-gold text-weight-bold" style="font-size: 12px;">play.avclatin.com</div>
          </div>
          <q-icon name="content_copy" class="text-grey-7" size="16px" />
        </div>
        <div class="server-card" @click="openDiscord">
          <q-icon name="forum" class="text-indigo-4" size="20px" />
          <div class="server-card-info">
            <div class="text-caption text-grey-5">Discord</div>
            <div class="text-indigo-4 text-weight-bold" style="font-size: 12px;">AvCLatin</div>
          </div>
          <q-icon name="open_in_new" class="text-grey-7" size="16px" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    return {
      copyIP() {
        const ipServer = "play.avclatin.com";
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(ipServer).then(() => {
            $q.notify({ progress: true, message: "IP Copiada con éxito!", color: "primary" });
          });
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = ipServer;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            $q.notify({ progress: true, message: "IP Copiada con éxito!", color: "primary" });
          } catch (err) {
            console.error("Error al copiar la IP: ", err);
          }
          document.body.removeChild(textArea);
        }
      },

      openDiscord() {
        window.open("https://discord.gg/sBRVvZ4r2d", "_blank");
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.10) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(212, 168, 67, 0.08) 0%, transparent 55%);
}

/* ===== Animated background ===== */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(212, 168, 67, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 168, 67, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  animation: gridDrift 30s linear infinite;
  z-index: 0;
}

@keyframes gridDrift {
  from { background-position: 0 0, 0 0; }
  to { background-position: 44px 44px, 44px 44px; }
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
  pointer-events: none;
}

.orb-gold {
  width: 480px;
  height: 480px;
  background: rgba(212, 168, 67, 0.16);
  top: -120px;
  right: -80px;
  animation: orbFloat1 14s ease-in-out infinite;
}

.orb-purple {
  width: 520px;
  height: 520px;
  background: rgba(124, 58, 237, 0.18);
  bottom: -160px;
  left: -120px;
  animation: orbFloat2 18s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 60px) scale(1.1); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, -40px) scale(1.08); }
}

.bg-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.012) 3px,
    transparent 4px
  );
  z-index: 0;
  pointer-events: none;
}

/* ===== Card ===== */
.maintenance-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 40px;
  text-align: center;
  background: rgba(22, 21, 46, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(212, 168, 67, 0.18), transparent 70%);
  pointer-events: none;
}

.logo-wrap img {
  filter: drop-shadow(0 0 16px rgba(212, 168, 67, 0.35));
}

.gear-icon {
  margin: 24px 0 8px;
  color: var(--gold);
  filter: drop-shadow(0 0 18px rgba(212, 168, 67, 0.4));
  animation: spin 6s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.kicker {
  display: block;
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--gold);
  margin-bottom: 12px;
  opacity: 0.9;
}

.title {
  font-size: 30px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin: 0 0 16px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.title-gold {
  background: linear-gradient(135deg, #f5d98a, #d4a843 50%, #b8922e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(212, 168, 67, 0.4));
}

.subtitle {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 auto 28px;
  max-width: 360px;
}

.back-btn {
  color: var(--gold-light) !important;
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: 10px;
  padding: 10px 22px;
  font-weight: 700;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(212, 168, 67, 0.1) !important;
    border-color: rgba(212, 168, 67, 0.6);
  }
}

/* ===== Divider ===== */
.divider-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 14px;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.5px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
}

/* ===== Server cards ===== */
.server-cards {
  display: flex;
  gap: 8px;
}

.server-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  .server-card-info {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(212, 168, 67, 0.25);
    transform: translateY(-1px);
  }
}

.text-gold {
  color: #d4a843 !important;
}

@media (max-width: 520px) {
  .maintenance-card {
    margin: 16px;
    padding: 36px 24px;
  }
  .title {
    font-size: 24px;
  }
}
</style>
