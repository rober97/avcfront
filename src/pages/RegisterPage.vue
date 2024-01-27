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
          :rules="[(val) => (val && val.length > 0) || 'Ingresa un correo']"
        />

        <q-input
          filled
          v-model="username"
          label="Usuario"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Ingresa un usuario']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Contraseña"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Ingresa una contraseña',
          ]"
        />

        <div class="text-center q-mt-md">
          <q-btn label="Registrarse" type="submit" color="primary" block />
        </div>
      </q-form>

      <div class="text-center q-mt-md">
        ¿Ya tienes una cuenta?
        <router-link to="/login">Iniciar sesión</router-link>
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

    return {
      email,
      username,
      password,
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
            // Guarda 'obj' donde lo necesites o haz algo con él.
            router.push("/login");
          } else {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: res.data.message,
            });
          }
        } catch (error) {
          // Aquí manejas errores de red o si el servidor retorna un error 500, por ejemplo.
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
  background-size: cover; /* Esto asegura que la imagen cubra todo el espacio disponible */
  background-repeat: no-repeat; /* Esto evita que la imagen se repita */
}

.register-box {
  background-color: white;
  border-radius: 40px;
  width: 500px;
  padding: 10px;
}
</style>
