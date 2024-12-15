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
                <!-- Botón para vincular la cuenta de Minecraft, si no está verificada -->
                <q-btn
                  label="Vincular Cuenta Minecraft"
                  color="primary"
                  @click="vincularCuentaMinecraft"
                  v-if="!userData.verified"
                />
                <!-- Badge de cuenta vinculada, si está verificada -->
                <q-badge v-else color="green" label="Cuenta vinculada" />

                <br />

                <!-- Badge para mostrar el rango del usuario -->
                <q-badge
                  v-if="userData.verified"
                  color="blue"
                  :label="'Rango: ' + formattedMinecraftRank"
                />
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
          <h2>Logros</h2>
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
                  <q-img src="../assets/gold-png.png" class="icon-premium-reward" />
                </div>
                <div class="col">
                  <div class="achievement-title">
                    {{ reward.title }}
                    <q-icon
                      name="help_outline"
                      size="sm"
                      color="grey"
                      class="info-icon q-ml-sm"
                      @click="openInfoReward(reward)"
                    >
                    </q-icon>
                  </div>
                  <div class="achievement-description">
                    {{ reward.description }}
                  </div>
                  <div class="reward-label">
                    Puntos: {{ reward.points_required }}
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
          <h3 class="q-mt-md">Pase Premium (No disponible)</h3>
          <div class="achievement-row horizontal-list">
            <div
              v-for="reward in premiumRewards"
              :key="reward.title"
              class="achievement-container"
            >
              <div class="q-gutter-md row items-center">
                <div class="col-auto" style="background-color: transparent;">
                  <q-img src="../assets/diamond-png.png" class="icon-premium-reward" />
                </div>
                <div class="col">
                  <div class="achievement-title">
                    {{ reward.title }}
                    <q-icon
                      name="help_outline"
                      size="sm"
                      color="grey"
                      class="info-icon q-ml-sm"
                      @click="openInfoReward(reward)"
                    >
                    </q-icon>
                  </div>
                  <div class="achievement-description">
                    {{ reward.description }}
                  </div>
                  <div class="reward-label">
                    Puntos: {{ reward.points_required }}
                  </div>
                  <!-- <q-btn
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
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOP DE USUARIOS -->
      <div class="top-users-section">
        <div class="fixed-titles">
          <h2>Top Aventureros</h2>
          <p class="subheader">Los jugadores con más logros en AvC Latin</p>
        </div>

        <div class="top-users-list">
          <q-card
            v-for="user in topUsers"
            :key="user.id"
            class="top-user-card q-pa-md q-mt-md"
            flat
            bordered
            style="cursor: pointer"
            @click="goToProfile(user.id)"
          >
            <q-avatar size="80px" class="top-user-avatar">
              <img
                :src="getMinecraftSkinUrl(user.username)"
                alt="User Avatar"
              />
            </q-avatar>
            <div class="top-user-info q-ml-md">
              <div class="top-user-name">{{ user.username }}</div>
              <div class="top-user-points">
                Logros: {{ user.totalAchievements }}
              </div>
            </div>
            <q-icon name="star" color="yellow" size="30px" />
          </q-card>
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
            Usa el comando <code>/vincular</code> en el servidor de Minecraft
            con el siguiente token:
            <q-input
              v-model="vinculationToken"
              outlined
              label="Token"
              readonly
              class="q-mt-md"
            />
          </div>
          <div v-else>La cuenta ya está vinculada. {{ vinculationStatus }}</div>
          <div class="confirmation-message q-mt-md">
            <p>
              Si ya recibiste el mensaje de confirmación en Minecraft, puedes
              recargar la página para ver tu progreso y logros actualizados.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showLinkDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogReward" :backdrop-filter="backdropFilter">
      <q-card class="reward-dialog-card">
        <!-- Título del diálogo -->
        <q-card-section class="reward-dialog-header">
          <q-icon name="info" size="30px" color="blue" />
          <span class="reward-dialog-title">{{ selectedReward?.title }}</span>
        </q-card-section>

        <!-- Contenido del diálogo -->
        <q-card-section class="reward-dialog-content">
          <p class="reward-dialog-description">
            {{
              selectedReward?.long_description || "Sin descripción disponible."
            }}
          </p>
        </q-card-section>

        <!-- Acciones del diálogo -->
        <q-card-actions align="right" class="reward-dialog-actions">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Reclamar Recompensa"
            color="orange"
            @click="claimReward(selectedReward)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { io } from "socket.io-client";
import AsideLayout from "layouts/AsideLayout.vue";
import { ref, onMounted, watch, computed } from "vue";
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
    const backdropFilter = ref("blur(4px) saturate(150%)");
    const selectedReward = ref(null); // Almacena el premio seleccionado
    const dialogReward = ref(false);
    const vinculationToken = ref("");
    const $q = useQuasar();
    // Datos del top de usuarios
    const topUsers = ref([]);
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

    // Función para mostrar la descripción de un logro
    const openInfoReward = (reward) => {
      selectedReward.value = reward; // Asignar el premio seleccionado
      backdropFilter.value = "blur(4px) saturate(150%)";
      dialogReward.value = true;
    };

    const claimReward = async (reward) => {
      try {
        if(totalPoints.value < reward.points_required) {
          $q.notify({
            type: "negative",
            message: `No tienes suficientes puntos para reclamar la recompensa: ${reward.name}.`,
          });
          dialogReward.value = false;
          return;
        }
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
          return "fas fa-gem"; // Por defecto, si no está asignado
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

    const loadRewards = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        const res = await userStore.getAllRewards(userId);
        rewards.value = res.aventura_rewards;
        premiumRewards.value = res.premium_rewards;
      } catch (error) {
        console.error("Error al cargar las recompensas disponibles:", error);
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

    const formattedMinecraftRank = computed(() => {
      return (
        userData.value.minecraftRank.charAt(0).toUpperCase() +
        userData.value.minecraftRank.slice(1)
      );
    });

    // Cargar logros del jugador y combinar con logros del sistema
    const loadPlayerAchievements = async () => {
      const uuid = userData.value.minecraftUUID;
      if (!uuid) return;

      try {
        const res = await userStore.getAchievements(uuid);
        const allAchievements = res || [];

        // Calcular totalPoints basados en el progreso relativo a los count
        totalPoints.value = allAchievements.reduce((acc, achievement) => {
          // Si el logro está completo, añade el total de count, sino calcula el progreso parcial
          const points = achievement.completed
            ? achievement.count
            : (achievement.progress / achievement.count) * achievement.count;
          return acc + points;
        }, 0);

        // Filtrar logros según el término de búsqueda
        filteredAchievements.value = allAchievements.filter((achievement) => {
          const term = searchTerm.value.toLowerCase();
          const titleMatch = achievement.title.toLowerCase().includes(term);
          const descriptionMatch = achievement.description
            ? achievement.description.toLowerCase().includes(term)
            : false;

          return titleMatch || descriptionMatch;
        });
      } catch (error) {
        console.error("Error al cargar logros del jugador:", error);
      }
    };

    const loadTopUsers = async () => {
      try {
        // Supongamos que tienes una API para obtener el top de usuarios
        const response = await userStore.getTopAchievementsUsers();
        debugger;
        topUsers.value = response;
      } catch (error) {
        console.error("Error al cargar el top de usuarios:", error);
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
        await loadPlayerAchievements();
        await loadRewards();
        await loadTopUsers();
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
      openInfoReward,
      userData,
      checkPremio,
      isLinked,
      vinculationToken,
      showLinkDialog,
      dialogReward,
      getMinecraftIcon,
      achievements,
      availableAchievements,
      filteredAchievements,
      filteredAventuraAchievements,
      filteredPremiumAchievements,
      rewards,
      formattedMinecraftRank,
      premiumRewards,
      searchTerm,
      getMinecraftSkinUrl,
      getAchievementProgress,
      vincularCuentaMinecraft,
      vinculationStatus,
      loading,
      backdropFilter,
      activeTab,
      totalPoints,
      maxPoints,
      selectedReward,
      verified,
      claimReward,
      topUsers,
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

.confirmation-message {
  color: #4caf50; /* Color verde para destacar el mensaje */
  font-size: 14px;
  text-align: center;
}

/* Añadimos estilos específicos para el top de usuarios */
.fixed-titles h2 {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
  font-weight: 700;
}

.subheader {
  text-align: center;
  color: #7f8c8d;
  margin-top: -10px;
  margin-bottom: 20px;
}

.top-users-section {
  margin-top: 30px;
}

.top-users-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.top-user-card {
  display: flex;
  align-items: center;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.top-user-avatar {
  flex-shrink: 0;
}

.top-user-info {
  flex: 1;
}

.top-user-name {
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
}

.top-user-points {
  color: #7f8c8d;
  font-size: 14px;
}

.reward-dialog-card {
  max-width: 500px;
  border-radius: 12px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.reward-dialog-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #e3f2fd;
  padding: 20px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.reward-dialog-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.reward-dialog-content {
  padding: 20px;
  text-align: justify;
}

.reward-dialog-description {
  font-size: 16px;
  color: #34495e;
  line-height: 1.5;
}

.reward-dialog-actions {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.reward-dialog-actions q-btn:first-child {
  margin-right: 10px;
}

.icon-premium-reward{
  width: 50px;
  height: 50px;
  background-color: transparent; /* Asegúrate de que sea transparente */
}
</style>
