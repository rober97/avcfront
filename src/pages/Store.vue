<template>
  <q-page>
    <AsideLayout />
    <div class="achievement-section-container">
      <h1>store</h1>
    </div>

  </q-page>
</template>

<script>
import { io } from "socket.io-client";
import AsideLayout from "layouts/AsideLayout.vue";
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/userStore";
import { useQuasar } from "quasar";
import defaultAvatar from "../resources/steve.png"; // Ruta a la imagen local

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const userStore = useUserStore();
    const userData = ref({
      username: "",
      bio: "",
      followers: false,
      following: false,
      verified: false,
    });
    

    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      const uuidUser = await userStore.getUUIDUser({ id });

      if (uuidUser.success) {
        const user = await userStore.getUserByUUID({ uuid: uuidUser.uuid });
        userData.value = user.user;
        userData.value.verified = true;
      } else {
        userData.value = {
          username: "",
          bio: "",
          followers: false,
          following: false,
          verified: false,
        };
      }
    });

    return {
      userData,
      
    };
  },
};
</script>

<style scoped>
h2 {
  font-size: 28px;
  color: #2c3e50;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

h3 {
  font-size: 24px;
  color: #3498db;
  text-align: center;
  font-weight: 600;
  padding-bottom: 10px;
}

.achievement-section-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Habilitar el scroll vertical si es necesario */
  overflow-x: hidden; /* Evitar scroll horizontal */
}

.points-bar {
  margin: 20px 0;
  text-align: center;
}

.points-label {
  margin-top: 5px;
  font-size: 14px;
  color: #2c3e50;
}

.achievement-content-scroll {
  max-height: calc(100vh - 300px);
  overflow-y: auto; /* Habilitar scroll vertical para esta sección */
  padding: 20px;
}

.achievements-scroll-container {
  overflow-x: auto;
  white-space: nowrap;
}

.achievement-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.horizontal-list {
  display: inline-flex;
  gap: 20px;
}

.achievement-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Ocupa todo el ancho en pantallas pequeñas */
  display: inline-block;
  text-align: center;
  overflow: hidden; /* Evita que el contenido salga del contenedor */
  margin-bottom: 20px;
}


</style>
