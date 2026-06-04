<template>
  <q-page class="login-page">
    <!-- Animated background layers -->
    <div class="bg-grid"></div>
    <div class="bg-orb orb-gold"></div>
    <div class="bg-orb orb-purple"></div>
    <div class="bg-scanline"></div>

    <div class="login-shell">
      <!-- ===== Left hero / branding panel ===== -->
      <div class="hero-panel">
        <div class="hero-logo">
          <img src="/avc-logo.svg" alt="AVC" style="height: 56px;" />
        </div>

        <div class="hero-content">
          <span class="hero-kicker font-orbitron">TU AVENTURA. TU LEYENDA.</span>
          <h1 class="hero-title font-orbitron">
            FORJA TU<br /><span class="hero-title-gold">DESTINO</span>
          </h1>
          <p class="hero-sub">
            Únete a miles de jugadores en AventuraCraftLatin, donde cada decisión
            define tu camino.
          </p>

          <div class="hero-features">
            <div class="hero-feature">
              <span class="hf-icon">⚔️</span>
              <div>
                <div class="hf-title">Survival Towny</div>
                <div class="hf-desc">Construye, protege, conquista.</div>
              </div>
            </div>
            <div class="hero-feature">
              <span class="hf-icon">🐉</span>
              <div>
                <div class="hf-title">RPG Épico</div>
                <div class="hf-desc">Elige tu camino: Héroe o Villano.</div>
              </div>
            </div>
            <div class="hero-feature">
              <span class="hf-icon">🏰</span>
              <div>
                <div class="hf-title">Comunidad Activa</div>
                <div class="hf-desc">Eventos, misiones y mucho más.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Right form panel ===== -->
      <div class="login-container">
        <div class="login-card">
          <div class="card-glow"></div>

          <!-- Mobile-only logo -->
          <div class="login-logo-mobile">
            <img src="/avc-logo.svg" alt="AVC" style="height: 44px;" />
          </div>

          <h2 class="login-title font-orbitron">INICIAR SESIÓN</h2>
          <p class="login-subtitle">Conéctate y continúa tu leyenda</p>

          <q-form @submit="onSubmit" @reset="onReset" class="login-form q-mt-lg">
            <div class="q-mb-md">
              <label class="input-label">USUARIO</label>
              <q-input
                v-model="email"
                filled
                dense
                dark
                placeholder="Tu nombre de usuario"
                class="avc-input"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Ingresa un nombre de usuario']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" class="text-grey-6" />
                </template>
              </q-input>
            </div>

            <div class="q-mb-lg">
              <label class="input-label">CONTRASEÑA</label>
              <q-input
                v-model="password"
                filled
                dense
                dark
                :type="showPassword ? 'text' : 'password'"
                placeholder="Tu contraseña"
                class="avc-input"
                lazy-rules
                :rules="[(val) => (val !== null && val !== '') || 'Ingresa una contraseña']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" class="text-grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer text-grey-6"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <q-btn type="submit" class="full-width avc-login-btn" no-caps>
              <q-icon name="sports_esports" size="20px" class="q-mr-sm" />
              <span class="font-orbitron" style="letter-spacing: 2px;">CONECTAR</span>
            </q-btn>
          </q-form>

          <!-- Store highlight banner -->
          <a href="https://shop.avclatin.com/" target="_blank" rel="noopener" class="store-banner">
            <div class="store-banner-icon">
              <q-icon name="shopping_bag" size="22px" />
            </div>
            <div class="store-banner-text">
              <div class="store-banner-title">TIENDA OFICIAL</div>
              <div class="store-banner-desc">Rangos, llaves y cosméticos exclusivos</div>
            </div>
            <q-icon name="arrow_forward" size="18px" class="store-banner-arrow" />
          </a>

          <div class="divider-or"><span>o conéctate al servidor</span></div>

          <!-- Server info cards -->
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

          <div class="q-mt-lg text-center">
            <span class="text-grey-6" style="font-size: 13px;">¿No tienes cuenta? </span>
            <router-link to="/register" class="text-gold register-link">Regístrate</router-link>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useGlobal } from "../stores/global";
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/userStore";

export default {
  setup() {
    const global = useGlobal();
    const router = useRouter();
    const $q = useQuasar();
    const email = ref(null);
    const password = ref(null);
    const showPassword = ref(false);
    const userStore = useUserStore();

    return {
      email,
      password,
      showPassword,

      async onSubmit() {
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          url: `${global.url_api}/login`,
          data: {
            username: email.value,
            password: password.value,
          }
        };

        try {
          const res = await axios(config);
          if (res.data.success) {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user", JSON.stringify(res.data.user));
            userStore.setUser(res.data.user);
            router.push("/dashboard");
            $q.notify({
              color: "green-5",
              textColor: "white",
              icon: "home",
              message: 'Bienvenido a AvCLatin!',
            });
          } else {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: res.data.message,
            });
          }
        } catch (error) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "error",
            message: "Error al logear el usuario.",
          });
        }
      },

      copyIP() {
        let ipServer = "play.avclatin.com";
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(ipServer).then(() => {
            $q.notify({
              progress: true,
              message: "IP Copiada con éxito!",
              color: "primary",
            });
          });
        } else {
          let textArea = document.createElement("textarea");
          textArea.value = ipServer;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            $q.notify({
              progress: true,
              message: "IP Copiada con éxito!",
              color: "primary",
            });
          } catch (err) {
            console.error("Error al copiar la IP: ", err);
          }
          document.body.removeChild(textArea);
        }
      },

      openDiscord() {
        window.open("https://discord.gg/sBRVvZ4r2d", "_blank");
      },

      openStore() {
        window.open("https://shop.avclatin.com/", "_blank");
      },

      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.login-page {
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

/* ===== Shell layout ===== */
.login-shell {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
  gap: 0;
}

/* ===== Hero panel ===== */
.hero-panel {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 44px;
  background:
    linear-gradient(155deg, rgba(124, 58, 237, 0.10), rgba(22, 21, 46, 0.4) 60%),
    rgba(13, 12, 24, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 20px 0 0 20px;
  position: relative;
  overflow: hidden;
}

.hero-panel::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(212, 168, 67, 0.4), transparent);
}

.hero-logo img {
  filter: drop-shadow(0 0 16px rgba(212, 168, 67, 0.35));
}

.hero-content {
  margin: 32px 0;
}

.hero-kicker {
  display: block;
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--gold);
  margin-bottom: 14px;
  opacity: 0.9;
}

.hero-title {
  font-size: 46px;
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: 2px;
  color: var(--text-primary);
  margin: 0 0 18px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-title-gold {
  background: linear-gradient(135deg, #f5d98a, #d4a843 50%, #b8922e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 24px rgba(212, 168, 67, 0.4));
}

.hero-sub {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 340px;
  margin: 0 0 28px;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: 14px;

  .hf-icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border-radius: 10px;
    background: rgba(212, 168, 67, 0.08);
    border: 1px solid var(--border-color);
  }
  .hf-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .hf-desc {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.hero-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);

  .status-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent-green);
    box-shadow: 0 0 10px var(--accent-green);
    animation: pulse 1.8s ease-in-out infinite;
  }
  .status-text {
    color: var(--accent-green);
    font-weight: 700;
    letter-spacing: 1px;
  }
  .status-count {
    color: var(--text-primary);
    font-weight: 800;
    font-size: 15px;
  }
  .status-label {
    color: var(--text-muted);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

/* ===== Form panel ===== */
.login-container {
  flex: 1;
  display: flex;
  width: 100%;
  max-width: 440px;
}

.login-card {
  position: relative;
  width: 100%;
  background: rgba(22, 21, 46, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border-color);
  border-radius: 0 20px 20px 0;
  padding: 48px 40px;
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

.login-logo-mobile {
  display: none;
  text-align: center;
  margin-bottom: 20px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 4px;
  margin: 0;
}

.login-subtitle {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  margin: 8px 0 0;
}

.input-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.avc-input {
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(212, 168, 67, 0.3);
    }
  }

  :deep(.q-field__control.q-field__control--focus) {
    border-color: #d4a843;
    box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.12);
  }
}

.avc-login-btn {
  background: linear-gradient(135deg, #b8922e, #d4a843) !important;
  color: #0a0914 !important;
  border-radius: 10px;
  padding: 13px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #d4a843, #f5d98a) !important;
    box-shadow: 0 6px 28px rgba(212, 168, 67, 0.4);
    transform: translateY(-1px);
  }
}

/* ===== Store banner ===== */
.store-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.18), rgba(212, 168, 67, 0.10));
  border: 1px solid rgba(124, 58, 237, 0.35);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%);
    transform: translateX(-120%);
    transition: transform 0.6s ease;
  }

  &:hover {
    border-color: rgba(124, 58, 237, 0.6);
    box-shadow: 0 6px 24px rgba(124, 58, 237, 0.22);
    transform: translateY(-1px);
  }

  &:hover::before {
    transform: translateX(120%);
  }

  .store-banner-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: #fff;
    box-shadow: 0 0 16px rgba(124, 58, 237, 0.4);
  }
  .store-banner-text {
    flex: 1;
    min-width: 0;
  }
  .store-banner-title {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1px;
    color: var(--gold-light);
    font-family: 'Orbitron', sans-serif;
  }
  .store-banner-desc {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 2px;
  }
  .store-banner-arrow {
    color: var(--gold-light);
    transition: transform 0.25s ease;
  }
  &:hover .store-banner-arrow {
    transform: translateX(4px);
  }
}

/* ===== Divider ===== */
.divider-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 14px;
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

.register-link {
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.2s;

  &:hover {
    color: #f5d98a !important;
  }
}

/* ===== Responsive ===== */
@media (max-width: 860px) {
  .login-shell {
    max-width: 460px;
    padding: 16px;
  }
  .hero-panel {
    display: none;
  }
  .login-container {
    max-width: 100%;
  }
  .login-card {
    border-radius: 20px;
    border: 1px solid var(--border-color);
  }
  .login-logo-mobile {
    display: block;
  }
}
</style>
