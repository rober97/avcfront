<template>
  <q-page class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo -->
        <div class="login-logo q-mb-lg">
          <img src="/avc-logo.svg" alt="AVC" style="height: 48px;" />
          <p class="text-grey-6 q-mt-sm" style="font-size: 13px;">AventuraCraftLatin</p>
        </div>

        <h2 class="login-title font-orbitron q-mb-md">INICIAR SESIÓN</h2>

        <q-form @submit="onSubmit" @reset="onReset" class="login-form">
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

          <q-btn
            type="submit"
            class="full-width avc-login-btn"
            no-caps
          >
            <span class="font-orbitron" style="letter-spacing: 2px;">CONECTAR</span>
          </q-btn>
        </q-form>

        <!-- Server info cards -->
        <div class="server-cards q-mt-lg">
          <div class="server-card" @click="copyIP">
            <q-icon name="dns" class="text-gold" size="20px" />
            <div>
              <div class="text-caption text-grey-5">IP del Servidor</div>
              <div class="text-gold text-weight-bold" style="font-size: 12px;">play.avclatin.com</div>
            </div>
            <q-icon name="content_copy" class="text-grey-7" size="16px" />
          </div>
          <div class="server-card" @click="openDiscord">
            <q-icon name="forum" class="text-indigo-4" size="20px" />
            <div>
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
  background: var(--bg-primary);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(212, 168, 67, 0.06) 0%, transparent 50%);
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
}

.login-logo {
  text-align: center;
}

.login-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 3px;
  margin: 0;
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

    &:hover {
      border-color: rgba(212, 168, 67, 0.3);
    }
  }

  :deep(.q-field__control.q-field__control--focus) {
    border-color: #d4a843;
  }
}

.avc-login-btn {
  background: linear-gradient(135deg, #b8922e, #d4a843) !important;
  color: #0a0914 !important;
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #d4a843, #f5d98a) !important;
    box-shadow: 0 4px 20px rgba(212, 168, 67, 0.3);
  }
}

// Server cards
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

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
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
</style>
