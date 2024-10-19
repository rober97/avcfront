<template>
  <q-page class="login-page q-pa-md">
    <!-- Parte superior -->
    <div class="top-section row justify-center q-mb-md">
      <div class="col-auto text-center q-px-lg">
        <q-card
          class="my-card"
          style="width: 200px; height: 150px; border-radius: 50px"
          horinzontal
        >
          <q-card-section class="card-ip text-white">
            <div class="text-h6">IP</div>
            <div class="text-subtitle2">play.avclatin.com</div>
          </q-card-section>

          <q-card-actions vertical align="center">
            <q-btn flat @click="copyIP"
              ><i class="fas fa-copy" title="Copiar"></i
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <!-- Columna: Discord -->
      <div class="col-auto text-center q-px-lg">
        <q-card
          class="my-card"
          style="width: 200px; height: 150px; border-radius: 50px"
        >
          <q-card-section class="card-ip text-white">
            <div class="text-h6">Discord</div>
            <div class="text-subtitle2">AvCLatin</div>
          </q-card-section>

          <q-card-actions vertical align="center">
            <q-btn flat @click="openDiscord"
              ><i class="fas fa-link" title="Click"></i
            ></q-btn>
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
            label="Nombre de usuario"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Ingresa un nombre de usuario',
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
        debugger
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
          // Aquí manejas errores de red o si el servidor retorna un error 500, por ejemplo.
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

        // Usar la API del Portapapeles para copiar el texto
        if (navigator.clipboard && window.isSecureContext) {
          // Navegador soporta la API del portapapeles y está en un contexto seguro (HTTPS)
          navigator.clipboard
            .writeText(ipServer)
            .then(() => {
              // Notificación de éxito
              $q.notify({
                progress: true,
                message: "IP Copiada con éxito!",
                color: "primary",
                multiLine: true,
              });
            })
            .catch((err) => {
              // Manejar errores (por ejemplo, si el usuario no da permiso para acceder al portapapeles)
              console.error("No se pudo copiar la IP: ", err);
            });
        } else {
          // Método alternativo para navegadores que no soportan navigator.clipboard.writeText
          // Crear un elemento de texto temporal
          let textArea = document.createElement("textarea");
          textArea.value = ipServer;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            // Intentar copiar el contenido del textarea al portapapeles
            let successful = document.execCommand("copy");
            if (successful) {
              // Notificación de éxito
              $q.notify({
                progress: true,
                message: "IP Copiada con éxito!",
                color: "primary",
                multiLine: true,
              });
            } else {
              console.error("No se pudo copiar la IP usando execCommand.");
            }
          } catch (err) {
            console.error("Error al copiar la IP: ", err);
          }

          // Limpiar al finalizar
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
  min-width: 50%;
  margin-top: 50px;
  background-color: white;
  border-radius: 40px;
  padding: 20px;
}

.card-ip {
  background-color: #03a70e;
}
</style>
