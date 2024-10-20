<template>
  <q-page>
    <AsideLayout />
    <div class="achievement-section-container">
      <!-- Sección del perfil con opción de vinculación -->
      <div class="profile-section q-pa-md q-mb-md">
        <div class="q-gutter-md row items-start profile-header">
          <!-- Columna de Avatar y Botón/Botonera -->
          <div class="col-auto">
            <q-avatar
              :size="$q.screen.lt.md ? '100px' : '150px'"
              class="profile-avatar"
            >
              <img
                :src="getMinecraftSkinUrl(userData.username)"
                alt="User Avatar"
              />
            </q-avatar>

            <!-- Botón o badge debajo del avatar -->
            <div class="q-gutter-md row items-center justify-center q-mt-sm">
              <div class="col-auto">
                <q-btn
                  label="Vincular Cuenta Minecraft"
                  color="primary"
                  @click="vincularCuentaMinecraft"
                  v-if="!userData.verified"
                />
                <q-badge v-else color="green" label="Cuenta vinculada" />
              </div>
            </div>
          </div>

          <!-- Columna de Bio y Mensaje -->
          <div class="col profile-info q-ml-md">
            <!-- Si no está verificado -->
            <div v-if="!userData.verified">
              <strong>{{ userData.username }}</strong>
              <div class="profile-message">
                Bienvenido a la Sección de Logros de AvC Latin. Aquí podrás
                rastrear y comparar tus logros del Pase de Aventura y Premium.
                Completa desafíos, acumula puntos y desbloquea recompensas
                exclusivas como equipos y permisos especiales en el servidor.
                <br /><br />
                Para comenzar, vincula tu cuenta de Minecraft:
                <br /><br />
                1. Inicia sesión en la web.
                <br />
                2. Haz clic en "Vincular Cuenta Minecraft".
                <br />
                3. Obtén tu token.
                <br />
                4. Usa el comando <code>/vincular &lt;token&gt;</code> en el
                servidor. <br /><br />
                ¡Listo! Ahora podrás seguir tu progreso y obtener recompensas en
                tiempo real.
              </div>
            </div>

            <!-- Si está verificado -->
            <div v-else>
              <strong>{{ userData.username }}</strong>
              <div class="profile-message">
                ¡Tu cuenta de Minecraft ya está vinculada exitosamente! Ahora
                puedes rastrear y comparar tus logros tanto del Pase de Aventura
                como del Pase Premium. Completa desafíos, acumula puntos y
                desbloquea increíbles recompensas exclusivas.
                <br /><br />
                Revisa tus logros, sigue tu progreso en tiempo real y no olvides
                canjear tus puntos por recompensas especiales dentro del
                servidor. Cada logro que completes te acercará más a obtener
                equipo épico y permisos exclusivos.
                <br /><br />
                ¡Sigue jugando y desbloquea todo lo que AvC Latin tiene para
                ofrecerte!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs para Logros y Recompensas -->
      <q-tabs v-model="activeTab" class="q-mt-md" align="center" dense>
        <q-tab name="logros" label="Logros" />
        <q-tab name="recompensas" label="Recompensas" />
      </q-tabs>

      <!-- Barra de progreso general -->
      <div class="q-mt-md points-bar">
        <q-linear-progress
          :value="totalPoints / maxPoints"
          color="blue"
          size="16px"
        />
        <div class="points-label">
          {{ totalPoints }} / {{ maxPoints }} puntos
        </div>
      </div>

      <!-- Sección de logros o recompensas según la pestaña activa -->
      <div
        v-if="activeTab === 'logros' && userData.verified"
        class="achievement-content-scroll"
      >
        <!-- Título fijo para logros -->
        <div class="fixed-titles">
          <h2>Comparación de Logros</h2>
        </div>

        <!-- Contenedor de logros con scroll horizontal -->
        <div class="achievements-scroll-container">
          <div class="achievement-row horizontal-list">
            <div
              v-for="achievement in filteredAchievements"
              :key="achievement.title"
              class="achievement-container"
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
                  <div class="achievement-title">{{ achievement.title }}</div>
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
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de recompensas -->
      <div
        v-if="activeTab === 'recompensas' && userData.verified"
        class="achievement-content-scroll"
      >
        <!-- Título fijo para recompensas -->
        <div class="fixed-titles">
          <h2>Recompensas Disponibles</h2>
        </div>

        <!-- Contenedor de recompensas con scroll horizontal -->
        <div class="achievements-scroll-container">
          <h3 class="q-mt-md">Pase de Aventura</h3>
          <div class="achievement-row horizontal-list">
            <div
              v-for="reward in rewards"
              :key="reward.title"
              class="achievement-container"
            >
              <div class="q-gutter-md row items-center">
                <div class="col-auto">
                  <!-- Cambiar icono por uno más temático -->
                  <q-icon
                    :name="getMinecraftIcon(reward)"
                    size="md"
                    color="blue"
                    class="achievement-icon"
                  />
                </div>
                <div class="col">
                  <div class="achievement-title">{{ reward.title }}</div>
                  <div class="achievement-description">
                    {{ reward.description }}
                  </div>
                  <div class="reward-label">
                    Puntos necesarios: {{ reward.points_required }}
                  </div>
                  <!-- Botón animado para canjear recompensa si se tienen los puntos suficientes -->
                  <q-btn
                    v-if="checkPremio(reward)"
                    label="Reclamar"
                    color="orange"
                    class="claim-button pulsating"
                    @click="claimReward(reward)"
                  />
                  <!-- Mensaje de recompensa canjeada -->
                  <div
                    v-else-if="reward.claimed"
                    class="reward-claimed-message q-mt-md"
                  >
                    🎉 Recompensa canjeada
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Recompensas del Pase Premium -->
          <h3 class="q-mt-md">Pase Premium</h3>
          <div class="achievement-row horizontal-list">
            <div
              v-for="reward in premiumRewards"
              :key="reward.title"
              class="achievement-container"
            >
              <div class="q-gutter-md row items-center">
                <div class="col-auto">
                  <q-icon
                    :name="getMinecraftIcon(reward)"
                    size="md"
                    color="gold"
                    class="achievement-icon"
                  />
                </div>
                <div class="col">
                  <div class="achievement-title">{{ reward.title }}</div>
                  <div class="achievement-description">
                    {{ reward.description }}
                  </div>
                  <div class="reward-label">
                    Puntos necesarios: {{ reward.points_required }}
                  </div>
                  <q-btn
                    v-if="totalPoints >= reward.points && !reward.claimed"
                    label="Reclamar Recompensa"
                    color="orange"
                    class="claim-button pulsating"
                    @click="claimReward(reward)"
                  />
                  <div
                    v-else-if="reward.claimed"
                    class="reward-claimed-message q-mt-md"
                  >
                    🎉 Recompensa canjeada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    });
    const isLinked = ref(false);
    const vinculationToken = ref("");
    const $q = useQuasar();
    const vinculationStatus = ref(true);
    const showLinkDialog = ref(false);
    const achievements = ref([]); // Logros combinados (disponibles + progreso)
    const availableAchievements = ref({ achievements: {} });
    const filteredAchievements = ref([]); // Logros filtrados para mostrar
    const filteredAventuraAchievements = ref([]); // Logros para pase aventura
    const filteredPremiumAchievements = ref([]); // Logros para pase premium
    // Datos falsos para las recompensas generales
    const rewards = ref([]);

    // Datos falsos para las recompensas del pase premium
    const premiumRewards = ref([]);
    const verified = ref(false);

    const searchTerm = ref(""); // Término de búsqueda
    const loading = ref(false);
    const activeTab = ref("logros"); // Controla el tab activo (logros o recompensas)
    const totalPoints = ref(0); // Puntos acumulados para las recompensas
    const maxPoints = ref(1000000); // Máximo de puntos posibles para la barra general

    const socket = io("https://avc-1dbca99a8369.herokuapp.com");
    socket.on("update_page", (msg) => {
      try {
        loadPlayerAchievements();
      } catch (error) {
        console.error("Error al actualizar los logros:", error);
      }
    });

    const claimReward = async (reward) => {
      try {
        debugger
        // Llamada directa a userStore para reclamar la recompensa
        const response = await userStore.claimReward({
          rewardId: reward._id,
          userId: userData.value._id,
        });

        // Verificar si la respuesta del servidor fue exitosa
        if (response.success) {
          // Actualizar el estado de la recompensa a "reclamada"
          reward.claimed = true;

          // Mostrar una notificación positiva al jugador
          $q.notify({
            type: "positive",
            message: `Has reclamado la recompensa: ${reward.name}. ¡Felicidades!`,
          });
        } else {
          // Mostrar un mensaje de error si la respuesta fue negativa
          $q.notify({
            type: "negative",
            message: `${response.message} : ${reward.name}.`,
          });
        }
      } catch (error) {
        // Manejo de errores en la solicitud de recompensa
        console.error("Error al reclamar la recompensa:", error);
        $q.notify({
          type: "negative",
          message:
            "Hubo un problema al reclamar la recompensa. Por favor, inténtalo más tarde.",
        });
      }
    };

    // Función para vincular la cuenta de Minecraft
    const vincularCuentaMinecraft = async () => {
      showLinkDialog.value = true;
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await userStore.generarToken(user.id);
      vinculationToken.value = response.token;
      if (!response.success) {
        vinculationStatus.value = false;
      }
    };

    const getMinecraftIcon = (reward) => {
      switch (reward.type) {
        case "diamond":
          return "fas fa-gem"; // Ícono de diamante
        case "sword":
          return "fas fa-sword"; // Ícono de espada
        case "chest":
          return "fas fa-box"; // Ícono de cofre
        default:
          return "fas fa-trophy"; // Por defecto, si no está asignado
      }
    };

    // Función para obtener la skin del jugador de Minecraft
    const getMinecraftSkinUrl = (username) => {
      // Si no hay username o es vacío, retorna la imagen local "steve.png"
      return username && username.trim() !== ""
        ? `https://minotar.net/avatar/${username}`
        : defaultAvatar;
    };

    // Función para obtener el progreso de un logro
    const getAchievementProgress = (achievement) => {
      return (achievement.progress / achievement.count) * 100;
    };

    // Cargar logros desde el backend del servidor de Minecraft
    const loadAvailableAchievements = async () => {
      try {
        const res = await userStore.getAllAchievements();
        availableAchievements.value = res; // Guardamos todos los logros del servidor en el estado
      } catch (error) {
        console.error("Error al cargar los logros disponibles:", error);
      }
    };


    const loadRewards = async () => {
      try {
        const res = await userStore.getAllRewards();
        rewards.value = res.aventura_rewards
        premiumRewards.value = res.premium_rewards
      } catch (error) {
        console.error("Error al cargar los logros disponibles:", error);
      }
    };

    const checkPremio = (premio) => {
      if (premio.claimed) {
        return false;
      }
      if (totalPoints.value >= premio.points_required) {
        return true;
      }
      return false;
    };

    // Combinar logros disponibles y logros del jugador
    const combineAchievements = (available, player) => {
      const combined = [];
      totalPoints.value = 0; // Reiniciar los puntos acumulados antes de combinar

      const availableAchievementsArray = Object.keys(
        available.achievements
      ).map((key) => {
        return {
          title: key,
          ...available.achievements[key],
          progress: 0, // Progreso por defecto si el jugador no ha iniciado el logro
          aventuraReward: "500 XP",
          premiumReward: "1000 XP + 1 Diamante",
          passType: Math.random() > 0.5 ? "aventura" : "premium", // Asignar aleatoriamente el tipo de pase
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
          // Sumar puntos al total basado en el progreso del jugador
          totalPoints.value += playerAchievement.progress;
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

      filteredAventuraAchievements.value = achievements.value.filter(
        (achievement) =>
          achievement.passType === "aventura" &&
          (achievement.title.toLowerCase().includes(term) ||
            achievement.description?.toLowerCase().includes(term))
      );

      filteredPremiumAchievements.value = achievements.value.filter(
        (achievement) =>
          achievement.passType === "premium" &&
          (achievement.title.toLowerCase().includes(term) ||
            achievement.description?.toLowerCase().includes(term))
      );

      // Filtrar logros generales para la pestaña de "Logros"
      filteredAchievements.value = achievements.value.filter(
        (achievement) =>
          achievement.title.toLowerCase().includes(term) ||
          achievement.description?.toLowerCase().includes(term)
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
        const res = await userStore.getAchievements(uuid);
        achievements.value = combineAchievements(
          availableAchievements.value,
          res.playerAchievements
        );
        filterAchievements(); // Aplicamos el filtro si es necesario
      } catch (error) {
        console.error("Error al cargar logros del jugador:", error);
      }
    };

    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      const uuidUser = await userStore.getUUIDUser({ id });

      if (uuidUser.success) {
        const user = await userStore.getUserByUUID({ uuid: uuidUser.uuid });

        userData.value = user.user;
        userData.value.verified = true;
        // Cargar logros disponibles y logros del jugador
        await loadAvailableAchievements();
        await loadPlayerAchievements();
        await loadRewards()
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
      loadRewards,
      userData,
      checkPremio,
      isLinked,
      vinculationToken,
      showLinkDialog,
      getMinecraftIcon,
      achievements,
      availableAchievements,
      filteredAchievements,
      filteredAventuraAchievements,
      filteredPremiumAchievements,
      rewards,
      premiumRewards,
      searchTerm,
      getMinecraftSkinUrl,
      getAchievementProgress,
      vincularCuentaMinecraft,
      vinculationStatus,
      loading,
      activeTab,
      totalPoints,
      maxPoints,
      verified,
      claimReward
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

@media (min-width: 600px) {
  .achievement-container {
    width: 250px; /* En pantallas más grandes, ajusta el tamaño */
  }
}

.achievement-container:hover {
  transform: scale(1.05); /* Ampliar ligeramente el contenedor */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* Sombra más profunda */
  background-color: #f0f0f0; /* Cambio suave en el color de fondo */
}

.achievement-title,
.achievement-description {
  overflow: hidden; /* Asegura que el contenido dentro de los elementos de texto no se desborde */
  white-space: normal; /* Permite que el texto se ajuste en varias líneas */
  word-wrap: break-word; /* Rompe las palabras largas si es necesario */
  text-overflow: clip; /* Evita puntos suspensivos y muestra todo el contenido */
}

.reward-label,
.progress-label {
  overflow: hidden; /* Evita el desbordamiento de los textos de recompensa y progreso */
  text-overflow: ellipsis; /* Puntos suspensivos si el texto se corta */
  white-space: nowrap; /* Mantiene el texto en una sola línea */
}

.achievement-description {
  color: #7f8c8d;
  font-size: 14px;
}

.q-linear-progress {
  height: 8px;
  border-radius: 4px;
}

.reward-label {
  font-size: 14px;
  color: #27ae60;
  margin-top: 10px;
}

.claim-button {
  background-color: #f39c12;
  color: white;
  margin-top: 10px;
}

.claim-button:hover {
  background-color: #e67e22;
}

.reward-claimed-message {
  font-size: 14px;
  color: #8e44ad;
}

.q-tab {
  text-transform: uppercase;
}

.fixed-titles {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
  padding: 10px 0;
}

.profile-info {
  text-align: center;
  color: #34495e;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.profile-message {
  text-align: left;
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.5;
  max-width: 100%; /* Ajusta el mensaje al ancho disponible */
  margin: 0 auto;
  word-wrap: break-word; /* Asegura que las palabras largas no se corten */
}

.profile-message code {
  background-color: #ecf0f1;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.profile-section {
  display: flex;
  flex-direction: column; /* Asegura que el contenido se apile verticalmente en pantallas pequeñas */
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .profile-section {
    flex-direction: row; /* En pantallas grandes, el contenido vuelve a estar en filas */
  }
}

.profile-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto; /* Centra el avatar */
}

@media (min-width: 768px) {
  .profile-avatar {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 600px) {
  .points-bar {
    margin: 10px 0;
  }
  .q-linear-progress {
    height: 6px; /* Reducir el tamaño de la barra en móviles */
  }
}

@media (max-width: 600px) {
  h2 {
    font-size: 20px; /* Reducir tamaño del título en pantallas pequeñas */
  }
  .profile-message {
    font-size: 12px; /* Texto más pequeño en móviles */
  }
}

@media (min-width: 600px) {
  .achievement-container {
    width: 250px; /* Retorna al tamaño original en pantallas medianas y grandes */
  }
}

.q-page {
  height: 100vh; /* Asegura que la página ocupe toda la altura */
  overflow-y: auto; /* Habilita el scroll para toda la página */
}

.claim-button {
  background-color: #f39c12;
  color: white;
  margin-top: 10px;
  transition: transform 0.3s ease; /* Añade una transición suave */
}

.claim-button.pulsating {
  animation: pulsate 1.5s infinite; /* Añade una animación de pulsación */
}

.claim-button:hover {
  background-color: #e67e22;
  transform: scale(1.1); /* Efecto hover para hacer más atractivo el botón */
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.achievement-icon {
  font-size: 32px; /* Asegúrate de que los íconos se vean grandes y atractivos */
}

.claim-button {
  justify-content: center;
  align-items: center;
  max-width: 100%; /* Asegura que no exceda el contenedor */
  padding: 10px; /* Ajusta el tamaño del padding */
  font-size: 12px; /* Ajusta el tamaño del texto */
}
</style>
