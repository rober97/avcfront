<template>
  <q-page class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-logo q-mb-lg">
          <img src="/avc-logo.svg" alt="AVC" style="height: 48px;" />
          <p class="text-grey-6 q-mt-sm" style="font-size: 13px;">AventuraCraftLatin</p>
        </div>

        <h2 class="login-title font-orbitron q-mb-md">CREAR CUENTA</h2>

        <q-form @submit="onSubmit" @reset="onReset" class="login-form">
          <div class="q-mb-md">
            <label class="input-label">CORREO ELECTRÓNICO</label>
            <q-input
              v-model="email"
              filled dense dark
              placeholder="tu@email.com"
              class="avc-input"
              lazy-rules
              :rules="[emailRules]"
            >
              <template v-slot:prepend><q-icon name="email" class="text-grey-6" /></template>
            </q-input>
          </div>

          <div class="q-mb-md">
            <label class="input-label">USUARIO</label>
            <q-input
              v-model="username"
              filled dense dark
              placeholder="Elige un nombre"
              class="avc-input"
              lazy-rules
              :rules="[usernameRules]"
            >
              <template v-slot:prepend><q-icon name="person" class="text-grey-6" /></template>
            </q-input>
          </div>

          <div class="q-mb-lg">
            <label class="input-label">CONTRASEÑA</label>
            <q-input
              v-model="password"
              filled dense dark
              :type="showPassword ? 'text' : 'password'"
              placeholder="Crea una contraseña"
              class="avc-input"
              lazy-rules
              :rules="[passwordRules]"
            >
              <template v-slot:prepend><q-icon name="lock" class="text-grey-6" /></template>
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
            <span class="font-orbitron" style="letter-spacing: 2px;">REGISTRARSE</span>
          </q-btn>
        </q-form>

        <div class="q-mt-lg text-center">
          <span class="text-grey-6" style="font-size: 13px;">¿Ya tienes cuenta? </span>
          <router-link to="/login" class="text-gold register-link">Inicia sesión</router-link>
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

export default {
  setup() {
    const global = useGlobal();
    const router = useRouter();
    const email = ref(null);
    const username = ref(null);
    const password = ref(null);
    const showPassword = ref(false);
    const $q = useQuasar();

    const emailRules = (val) =>
      (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) || "Correo no válido";

    const usernameRules = (val) =>
      (val && val.length >= 3) || "El usuario debe tener al menos 3 caracteres";

    const passwordRules = (val) => {
      if (!val) return "Ingresa una contraseña";
      if (val.length < 8) return "La contraseña debe tener al menos 8 caracteres";
      if (!/[A-Z]/.test(val)) return "La contraseña debe tener al menos una letra mayúscula";
      if (!/\d/.test(val)) return "La contraseña debe tener al menos un número";
      if (!/[!@#$%^&*]/.test(val)) return "La contraseña debe tener al menos un carácter especial (!@#$%^&*)";
      return true;
    };

    return {
      email,
      username,
      password,
      showPassword,
      emailRules,
      usernameRules,
      passwordRules,

      async onSubmit() {
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          url: `${global.url_api}/register`,
          data: {
            username: username.value,
            mail: email.value,
            password: password.value,
          },
        };

        try {
          const res = await axios(config);
          if (res.data.success) {
            router.push("/login");
            $q.notify({
              color: "green-5",
              textColor: "white",
              icon: "check",
              message: "Cuenta creada con éxito!",
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
            message: "Error al registrar el usuario.",
          });
        }
      },

      onReset() {
        email.value = null;
        username.value = null;
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

.login-logo { text-align: center; }

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
    &:hover { border-color: rgba(212, 168, 67, 0.3); }
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

.text-gold { color: #d4a843 !important; }

.register-link {
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  &:hover { color: #f5d98a !important; }
}
</style>
