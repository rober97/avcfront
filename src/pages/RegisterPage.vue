<template>
  <q-page class="register-page flex flex-center q-pa-md">
    <div class="q-gutter-md register-box">
      <div class="text-h4 text-center q-mb-md">Bienvenido</div>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="email"
          label="Correo electrónico"
          lazy-rules
          :rules="[emailRules]"
        />

        <q-input
          filled
          v-model="username"
          label="Usuario"
          lazy-rules
          :rules="[usernameRules]"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Contraseña"
          lazy-rules
          :rules="[passwordRules]"
        />

        <div class="text-center q-mt-md">
          <q-btn label="Registrarse" type="submit" color="primary" block />
        </div>
      </q-form>

      <div class="text-center q-mt-md">
        ¿Ya tienes una cuenta?
        <router-link to="/">Iniciar sesión</router-link>
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

const global = useGlobal();

export default {
  setup() {
    const router = useRouter();
    const email = ref(null);
    const username = ref(null);
    const password = ref(null);
    const $q = useQuasar();

    // Reglas de validación para el correo electrónico
    const emailRules = (val) =>
      val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Correo no válido";

    // Reglas de validación para el nombre de usuario
    const usernameRules = (val) =>
      (val && val.length >= 3) || "El usuario debe tener al menos 3 caracteres";

    // Reglas de validación para la contraseña
    const passwordRules = (val) => {
      if (!val) {
        return "Ingresa una contraseña";
      }
      if (val.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
      }
      if (!/[A-Z]/.test(val)) {
        return "La contraseña debe tener al menos una letra mayúscula";
      }
      if (!/\d/.test(val)) {
        return "La contraseña debe tener al menos un número";
      }
      if (!/[!@#$%^&*]/.test(val)) {
        return "La contraseña debe tener al menos un carácter especial (!@#$%^&*)";
      }
      return true;
    };

    return {
      email,
      username,
      password,
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
            router.push("/");
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

<style scoped>
.register-page {
  background-color: #fafafa;
  background-image: url("../assets/newfondo.jpg") !important;
  background-size: cover;
  background-repeat: no-repeat;
}

.register-box {
  background-color: white;
  border-radius: 40px;
  width: 500px;
  padding: 10px;
}
</style>
