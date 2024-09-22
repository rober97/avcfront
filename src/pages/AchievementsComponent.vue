<template>
  <q-page>
    <AsideLayout />
    <div class="achievement-section-container">
      <!-- Sección del perfil con opción de vinculación -->
      <div class="profile-section q-pa-md q-mb-md">
        <div class="q-gutter-md row items-center profile-header">
          <div class="col-auto">
            <q-avatar size="150px" class="profile-avatar">
              <img
                :src="getMinecraftSkinUrl(userData.username)"
                alt="User Avatar"
              />
            </q-avatar>
          </div>
          <div class="col">
            <div class="q-gutter-md row items-center justify-start">
              <div class="col-auto">
                <q-btn
                  label="Vincular Cuenta Minecraft"
                  color="primary"
                  @click="vincularCuentaMinecraft"
                  v-if="!isLinked"
                />
                <q-badge v-else color="green" label="Cuenta vinculada" />
              </div>
            </div>
          </div>
        </div>

        <!-- Bio y Username -->
        <div class="profile-info q-mt-md">
          <strong>{{ userData.username }}</strong>
          <div>{{ userData.bio }}</div>
        </div>
      </div>

      <!-- Sección de logros -->
      <div class="achievement-content-scroll">
        <div class="achievement-header q-mb-md">
          <h2>Progreso de Logros</h2>
          <!-- Buscador de logros -->
          <q-input
            v-model="searchTerm"
            outlined
            placeholder="Buscar logros..."
            class="q-mb-md search-achievements"
          />
        </div>

        <q-list class="rounded-borders">
          <!-- Mostrar logros disponibles junto con los logros del jugador -->
          <q-item
            v-for="achievement in filteredAchievements"
            :key="achievement.title"
            class="q-pa-md achievement-container"
          >
            <div class="q-gutter-md row items-center">
              <div class="col-auto">
                <q-icon
                  :name="achievement.icon || 'fas fa-trophy'"
                  size="md"
                  color="blue"
                  class="achievement-icon"
                />
              </div>
              <div class="col">
                <div class="achievement-title">{{ achievement.name }}</div>
                <div class="achievement-description">
                  {{ achievement.description }}
                </div>
                <q-linear-progress
                  :value="getAchievementProgress(achievement)"
                  color="green"
                  size="10px"
                  class="q-mt-sm"
                />
                <div class="progress-label q-mt-xs">
                  {{ getAchievementProgress(achievement).toFixed(2) }}%
                  completado
                </div>
              </div>
            </div>
          </q-item>
        </q-list>

        <q-spinner-dots v-if="loading" class="q-mt-md" />
      </div>
    </div>

    <!-- Diálogo para la vinculación -->
    <q-dialog v-model="showLinkDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Vincular cuenta Minecraft</div>
        </q-card-section>

        <q-card-section>
          <div v-if="vinculationStatus">
            Usa el comando "/vincular" en el servidor de Minecraft con el
            siguiente token:
          </div>

          <div v-else>La cuenta ya está vinculada. {{ vinculationStatus }}</div>
          <q-input
            v-model="vinculationToken"
            outlined
            label="Token"
            v-if="vinculationStatus"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showLinkDialog = false" />
          <q-btn
            label="Vincular"
            color="primary"
            @click="confirmVinculation"
            v-if="vinculationStatus"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AsideLayout from "layouts/AsideLayout.vue";
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/userStore";

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
    });
    const isLinked = ref(false);
    const vinculationToken = ref("");
    const vinculationStatus = ref(true);
    const showLinkDialog = ref(false);
    const achievements = ref([]); // Logros combinados (disponibles + progreso)
    const availableAchievements = ref([]); // Todos los logros disponibles en el servidor
    const filteredAchievements = ref([]); // Logros filtrados
    const searchTerm = ref(""); // Término de búsqueda

    // Función para vincular la cuenta de Minecraft
    const vincularCuentaMinecraft = async () => {
      showLinkDialog.value = true;
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await userStore.generarToken(user.id);
      vinculationToken.value = response.token;
      if (!response.success) {
        debugger;
        vinculationStatus.value = false;
      }
    };

    const confirmVinculation = async () => {
      try {
        const response = await userStore.vincularCuenta(vinculationToken.value);
        debugger;
        if (response.data.success) {
          isLinked.value = true;
          showLinkDialog.value = false;
        } else {
          console.error("Error al vincular cuenta:", response.data.message);
        }
      } catch (error) {
        console.error("Error en la vinculación:", error);
      }
    };

    // Función para obtener la skin del jugador de Minecraft
    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    // Función para obtener el progreso de un logro
    const getAchievementProgress = (achievement) => {
      return (achievement.progress / achievement.count) * 100;
    };

    // Cargar logros desde el backend del servidor de Minecraft
    const loadAvailableAchievements = async () => {
      try {
        const res = await userStore.getAllAchievements(); // Endpoint para traer todos los logros disponibles
        availableAchievements.value = res; // Guardamos todos los logros del servidor en el estado
      } catch (error) {
        console.error("Error al cargar los logros disponibles:", error);
      }
    };

    // Combinar logros disponibles y logros del jugador
    const combineAchievements = (available, player) => {
      const combined = [];

      const availableAchievementsArray = Object.keys(
        available.achievements
      ).map((key) => {
        return {
          title: key,
          ...available.achievements[key],
          progress: 0, // Progreso por defecto si el jugador no ha iniciado el logro
        };
      });

      availableAchievementsArray.forEach((achievement) => {
        const playerAchievement = player.find(
          (pa) => pa.title === achievement.title
        );

        if (playerAchievement) {
          combined.push({
            ...achievement,
            progress: playerAchievement.progress,
          });
        } else {
          combined.push(achievement);
        }
      });

      // Ordenar los logros: aquellos con progreso > 0 primero
      combined.sort((a, b) => b.progress - a.progress);

      return combined;
    };

    // Función para filtrar logros por el término de búsqueda
    const filterAchievements = () => {
      const term = searchTerm.value.toLowerCase();
      filteredAchievements.value = achievements.value.filter(
        (achievement) =>
          achievement.name.toLowerCase().includes(term) ||
          achievement.description.toLowerCase().includes(term)
      );
    };

    // Watch para detectar cambios en el término de búsqueda
    watch(searchTerm, () => {
      filterAchievements();
    });

    // Cargar logros del jugador y combinarlos
    const loadPlayerAchievements = async () => {
      const uuid = userData.value.minecraftUUID; // UUID del jugador
      if (!uuid) return;

      try {
        const res = await userStore.getAchievements(uuid); // Logros específicos del jugador
        achievements.value = combineAchievements(
          availableAchievements.value,
          res.playerAchievements
        ); // Combinamos logros
        filterAchievements(); // Aplicamos el filtro si es necesario
      } catch (error) {
        console.error("Error al cargar logros del jugador:", error);
      }
    };

    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      const uuidUser = await userStore.getUUIDUser({ id });
      if (uuidUser.success) {
        debugger
        const user = await userStore.getUserByUUID({ uuid: uuidUser.uuid });
        userData.value = user.user;
        // Cargar logros disponibles y logros del jugador
        await loadAvailableAchievements();
        await loadPlayerAchievements(); // Cargar los logros del jugador al montar
      } else {
        userData.value = {
          username: "",
          bio: "",
          followers: false,
          following: false,
        };
      }
    });

    return {
      userData,
      isLinked,
      vinculationToken,
      showLinkDialog,
      achievements,
      availableAchievements,
      filteredAchievements,
      searchTerm,
      getMinecraftSkinUrl,
      getAchievementProgress,
      vincularCuentaMinecraft,
      confirmVinculation,
      vinculationStatus
    };
  },
};
</script>

<style scoped>
h2 {
  font-size: 32px;
  color: white; /* Un tono de azul oscuro/gris */
  text-align: center; /* Centra el título */
  margin-top: 30px; /* Espacio adicional en la parte superior */
  margin-bottom: 30px; /* Espacio adicional debajo del título */
  font-weight: 600; /* Hace que el título sea un poco más grueso */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Sutil sombra para mejorar la legibilidad */
}

/* Estilos adicionales para mejorar la separación visual y la jerarquía */
.profile-section-container {
  padding-top: 20px; /* Agrega más espacio en la parte superior dentro del contenedor */
}

/* Mejora de la barra de progreso para hacerla más prominente */
.progress-bar-container {
  background-color: #e0e0e0; /* Color de fondo más suave para la barra de progreso */
  border-radius: 12px; /* Bordes más redondeados */
  height: 12px; /* Aumenta la altura de la barra de progreso */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); /* Sombra interna para dar sensación de profundidad */
}

.progress-bar {
  background-color: #2ecc71; /* Color verde más vivo */
  transition: width 0.4s ease; /* Transición más suave */
}

.achievement-section-container {
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100vh;
  padding-top: 20px;
}

.profile-section {
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.achievement-content-scroll {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-top: 20px;
}

.achievement-container {
  background-color: #ecf0f1;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.achievement-title {
  font-weight: bold;
  color: #2c3e50;
}

.achievement-description {
  color: #7f8c8d;
}

.achievement-icon {
  font-size: 24px;
}

.q-linear-progress {
  height: 10px;
}

.progress-label {
  font-size: 12px;
  color: #7f8c8d;
}

.search-achievements {
  background-color: #ecf0f1;
  border-radius: 10px;
}
</style>
