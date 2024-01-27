<template>
  <q-page class="login-page q-pa-md">
    <!-- Parte superior -->
    <div class="top-section row justify-center q-mb-md">
      <!-- Columna: Copiar IP -->
      <div class="col-auto text-center q-px-lg">
        <q-card
          class="my-card"
          style="width: 200px; height: 150px; border-radius: 50px"
          horinzontal
        >
          <q-card-section class="bg-grey-8 text-white">
            <div class="text-h6">Copiar IP</div>
            <div class="text-subtitle2">play.avclatin.com</div>
          </q-card-section>

          <q-card-actions vertical align="center">
            <q-btn flat><i class="fas fa-copy"></i></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <!-- Columna: Nombre -->
      <div class="col-auto text-center q-px-lg"></div>

      <!-- Columna: Discord -->
      <div class="col-auto text-center q-px-lg">
        <q-card
          class="my-card"
          style="width: 200px; height: 150px; border-radius: 50px"
        >
          <q-card-section class="bg-grey-8 text-white">
            <div class="text-h6">Discord</div>
            <div class="text-subtitle2">avclatin</div>
          </q-card-section>

          <q-card-actions vertical align="center">
            <q-btn flat><i class="fas fa-link"></i></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Parte inferior con el formulario -->
    <div class="bottom-section row justify-center">
      <div class="col-12 q-gutter-md">
        <div class="text-h4 text-center q-mb-md">Iniciar</div>

        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            class="inputCustom"
            v-model="email"
            label="Correo electrónico o Usuario"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Ingresa un correo o usuario',
            ]"
          />

          <q-input
            filled
            type="password"
            class="inputCustom"
            v-model="password"
            label="Contraseña"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Ingresa una contraseña',
            ]"
          />

          <div class="text-center q-mt-md">
            <q-btn label="Iniciar sesión" type="submit" color="primary" block />
          </div>
        </q-form>

        <div class="text-center q-mt-md">
          ¿No tienes una cuenta?
          <router-link to="/">Regístrate</router-link>
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

const global = useGlobal();

export default {
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const email = ref(null);
    const password = ref(null);
    const userStore = useUserStore();

    return {
      email,
      password,

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
          },
        };

        try {
          const res = await axios(config);
          if (res.data.success) {
            // Guarda 'obj' donde lo necesites o haz algo con él.
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user", JSON.stringify(res.data.user));
            userStore.setUser(res.data.user);
            router.push("/explorer");
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
            message: "Error al logear el usuario.",
          });
        }
      },

      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>

<style scoped>
.login-page {
  background-image: url("../assets/newfondo.jpg") !important;
  background-size: cover; /* Esto asegura que la imagen cubra todo el espacio disponible */
  background-repeat: no-repeat; /* Esto evita que la imagen se repita */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.top-section {
  width: 100%;
  max-width: 800px; /* Ajusta según necesites */
}

.bottom-section {
  width: 20%;
  margin-top: 50px;
  background-color: white;
  border-radius: 40px;
  padding: 20px;
}
</style>
